import { fireEvent, render, screen } from "@testing-library/react-native";

import SavedScreen from "@/app/saved";
import { getSavedState, resetSavedStore, saveCafe } from "@/utils/saved-store";

const mockPush = jest.fn();
let mockParams: { state?: string; view?: string; tab?: string } = {};

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: (...args: unknown[]) => mockPush(...args),
  }),
  useLocalSearchParams: () => mockParams,
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = {};
  localStorage.clear();
  resetSavedStore();
});

describe("saved library empty state", () => {
  it("renders the D2 empty state with the Explore Cafés CTA", async () => {
    await render(<SavedScreen />);

    // "Saved" appears in the header and the tab bar (US-027).
    expect(screen.getAllByText("Saved").length).toBeGreaterThan(0);
    expect(screen.getByText("Your coffee map is empty.")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Explore Cafés" }));

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});

describe("saved library with saves", () => {
  beforeEach(() => {
    saveCafe("mostra", {
      collectionIds: ["want-to-try"],
      note: "Try the horchata latte.",
    });
    saveCafe("marigold", { collectionIds: ["work-spots"], note: "" });
  });

  it("renders collection tabs and filters cards by the active tab", async () => {
    await render(<SavedScreen />);

    for (const tab of [
      "Want to Try",
      "Work Spots",
      "Date Spots",
      "Aesthetic",
      "Visited",
    ]) {
      expect(screen.getByRole("button", { name: tab })).toBeTruthy();
    }

    expect(screen.getByText("Mostra Coffee")).toBeTruthy();
    expect(screen.queryByText("Marigold & Oak")).toBeNull();

    await fireEvent.press(screen.getByRole("button", { name: "Work Spots" }));

    expect(screen.getByText("Marigold & Oak")).toBeTruthy();
    expect(screen.queryByText("Mostra Coffee")).toBeNull();
  });

  it("switches view modes: map pill, grid cards, list rows", async () => {
    await render(<SavedScreen />);

    expect(screen.getByLabelText("Open Mostra Coffee")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Map view" }));

    expect(screen.getByText("1 saved nearby")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "List view" }));

    expect(screen.getByText("North Park · 0.3 mi · Want to Try")).toBeTruthy();
  });

  it("opens the cafe detail from a card", async () => {
    await render(<SavedScreen />);

    await fireEvent.press(screen.getByLabelText("Open Mostra Coffee"));

    expect(mockPush).toHaveBeenCalledWith("/cafe/mostra");
  });

  it("removes a save through the quick action", async () => {
    await render(<SavedScreen />);

    await fireEvent.press(screen.getByLabelText("Remove Mostra Coffee"));

    expect(getSavedState().saves.mostra).toBeUndefined();
    expect(screen.queryByText("Mostra Coffee")).toBeNull();
    expect(screen.getByText("Nothing in this collection yet.")).toBeTruthy();
  });

  it("opens the share sheet from a card and keeps Directions inert", async () => {
    await render(<SavedScreen />);

    expect(screen.getByLabelText("Directions Mostra Coffee")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Share Mostra Coffee"));

    expect(screen.getByText("Share this cafe")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Dismiss share sheet"));

    expect(screen.queryByText("Share this cafe")).toBeNull();
  });

  it("shows the visited placeholder until visit history exists", async () => {
    await render(<SavedScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Visited" }));

    expect(
      screen.getByText(
        "Check in at a café and it lands here. Visit history is on its way.",
      ),
    ).toBeTruthy();
  });
});

describe("saved library QA overrides", () => {
  it("renders the demo library without touching the persisted store", async () => {
    mockParams = { state: "demo", view: "list", tab: "work-spots" };

    await render(<SavedScreen />);

    expect(screen.getByText("Marigold & Oak")).toBeTruthy();
    expect(screen.getByText("Hearth Supply Co.")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Remove Marigold & Oak"));

    expect(screen.getByText("Marigold & Oak")).toBeTruthy();
    expect(getSavedState().saves.marigold).toBeUndefined();
  });
});
