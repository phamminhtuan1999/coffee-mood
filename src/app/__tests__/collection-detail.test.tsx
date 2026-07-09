import { fireEvent, render, screen } from "@testing-library/react-native";

import CollectionDetailScreen from "@/app/collection/[id]";
import EditCollectionScreen from "@/app/collection/[id]/edit";
import {
  getSavedState,
  resetSavedStore,
  saveCafe,
  updateCollection,
} from "@/utils/saved-store";

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockParams: { id?: string; state?: string } = {};

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: (...args: unknown[]) => mockPush(...args),
    back: (...args: unknown[]) => mockBack(...args),
  }),
  useLocalSearchParams: () => mockParams,
}));

function workSpots() {
  return getSavedState().collections.find(
    (collection) => collection.id === "work-spots",
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = { id: "work-spots" };
  localStorage.clear();
  resetSavedStore();
  saveCafe("marigold", {
    collectionIds: ["work-spots"],
    note: "Corner table by the window.",
  });
  saveCafe("hearth", { collectionIds: ["work-spots"], note: "" });
});

describe("collection detail (D3)", () => {
  it("renders the curated guide: name, count, cards, notes", async () => {
    await render(<CollectionDetailScreen />);

    expect(screen.getByText("Work Spots")).toBeTruthy();
    expect(screen.getByText("2 cafés · curated by you")).toBeTruthy();
    expect(screen.getByText("Marigold & Oak")).toBeTruthy();
    expect(screen.getByText("Hearth Supply Co.")).toBeTruthy();
    expect(screen.getByText('"Corner table by the window."')).toBeTruthy();
    expect(screen.getByLabelText("Share collection")).toBeTruthy();
    expect(screen.getByLabelText("Share")).toBeTruthy();
  });

  it("toggles privacy live through the store", async () => {
    await render(<CollectionDetailScreen />);

    await fireEvent.press(
      screen.getByRole("button", { name: "Public collection" }),
    );

    expect(workSpots()?.privacy).toBe("public");
  });

  it("hops into the saved map view and cafe detail", async () => {
    await render(<CollectionDetailScreen />);

    await fireEvent.press(screen.getByLabelText("View on map"));

    expect(mockPush).toHaveBeenCalledWith("/saved?view=map&tab=work-spots");

    await fireEvent.press(screen.getByLabelText("Open Marigold & Oak"));

    expect(mockPush).toHaveBeenCalledWith("/cafe/marigold");
  });

  it("routes to the edit screen", async () => {
    await render(<CollectionDetailScreen />);

    await fireEvent.press(screen.getByLabelText("Edit collection"));

    expect(mockPush).toHaveBeenCalledWith("/collection/work-spots/edit");
  });

  it("handles unknown collections gracefully", async () => {
    mockParams = { id: "ghost" };

    await render(<CollectionDetailScreen />);

    expect(
      screen.getByText("This collection doesn't exist anymore."),
    ).toBeTruthy();
  });
});

describe("edit collection (D5)", () => {
  it("commits drafted name, description, privacy, and cover on Save Changes", async () => {
    await render(<EditCollectionScreen />);

    await fireEvent.changeText(
      screen.getByLabelText("Collection name"),
      "Best Work Cafés in San Diego",
    );
    await fireEvent.changeText(
      screen.getByLabelText("Collection description"),
      "Reliable Wi-Fi and seats past 9 AM.",
    );
    await fireEvent.press(screen.getByLabelText("Collection privacy"));
    await fireEvent.press(screen.getByLabelText("Change cover"));

    // Nothing commits until Save Changes.
    expect(workSpots()?.name).toBe("Work Spots");

    await fireEvent.press(screen.getByLabelText("Save Changes"));

    const collection = workSpots();
    expect(collection?.name).toBe("Best Work Cafés in San Diego");
    expect(collection?.description).toBe("Reliable Wi-Fi and seats past 9 AM.");
    expect(collection?.privacy).toBe("public");
    expect(collection?.tone).toBe("latte");
    expect(mockBack).toHaveBeenCalled();
  });

  it("persists reorder through the move controls", async () => {
    await render(<EditCollectionScreen />);

    await fireEvent.press(screen.getByLabelText("Move Hearth Supply Co. up"));
    await fireEvent.press(screen.getByLabelText("Save Changes"));

    expect(workSpots()?.cafeOrder).toEqual(["hearth", "marigold"]);
  });

  it("removes a cafe from the collection only after Save Changes", async () => {
    await render(<EditCollectionScreen />);

    await fireEvent.press(
      screen.getByLabelText("Remove Marigold & Oak from collection"),
    );

    expect(getSavedState().saves.marigold).toBeDefined();

    await fireEvent.press(screen.getByLabelText("Save Changes"));

    expect(getSavedState().saves.marigold).toBeUndefined();
    expect(workSpots()?.cafeOrder).toEqual(["hearth"]);
  });

  it("keeps the demo overlay read-only", async () => {
    mockParams = { id: "want-to-try", state: "demo" };

    await render(<EditCollectionScreen />);

    await fireEvent.changeText(
      screen.getByLabelText("Collection name"),
      "Should not stick",
    );
    await fireEvent.press(screen.getByLabelText("Save Changes"));

    const wantToTry = getSavedState().collections.find(
      (collection) => collection.id === "want-to-try",
    );
    expect(wantToTry?.name).toBe("Want to Try");
    expect(mockBack).toHaveBeenCalled();
  });
});

describe("collection ordering on the detail screen", () => {
  it("respects a persisted cafeOrder", async () => {
    updateCollection("work-spots", { cafeOrder: ["hearth", "marigold"] });

    await render(<CollectionDetailScreen />);

    const cards = screen.getAllByLabelText(/^Open /);
    expect(cards[0].props.accessibilityLabel).toBe("Open Hearth Supply Co.");
    expect(cards[1].props.accessibilityLabel).toBe("Open Marigold & Oak");
  });
});
