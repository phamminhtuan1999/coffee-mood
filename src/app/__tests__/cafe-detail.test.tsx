import { act, fireEvent, render, screen } from "@testing-library/react-native";

import CafeDetailScreen from "@/app/cafe/[id]";
import {
  CAFE_DETAIL_LOADING_MS,
  cafeDetailErrorTitle,
  cafeDetailLimitedNotice,
} from "@/data/cafe-details";
import { getSavedState, isCafeSaved, resetSavedStore } from "@/utils/saved-store";

const mockBack = jest.fn();
const mockPush = jest.fn();
let mockParams: { id?: string; state?: string } = {};

jest.mock("expo-router", () => ({
  router: {
    back: (...args: unknown[]) => mockBack(...args),
    push: (...args: unknown[]) => mockPush(...args),
  },
  useLocalSearchParams: () => mockParams,
}));

async function settleLoading() {
  await act(async () => {
    jest.advanceTimersByTime(CAFE_DETAIL_LOADING_MS + 50);
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  localStorage.clear();
  resetSavedStore();
  mockParams = { id: "mostra" };
});

afterEach(() => {
  jest.useRealTimers();
});

describe("cafe detail loading state", () => {
  it("shows image, score, and summary skeletons before the content", async () => {
    await render(<CafeDetailScreen />);

    expect(screen.getByText("Cafe detail")).toBeTruthy();
    expect(screen.getByText("Warming up…")).toBeTruthy();
    expect(screen.queryByText("Mostra Coffee")).toBeNull();

    await settleLoading();

    expect(screen.queryByText("Cafe detail")).toBeNull();
    expect(screen.getByText("Mostra Coffee")).toBeTruthy();
  });

  it("holds the loading state under the QA override", async () => {
    mockParams = { id: "mostra", state: "loading" };

    await render(<CafeDetailScreen />);
    await settleLoading();

    expect(screen.getByText("Cafe detail")).toBeTruthy();
    expect(screen.queryByText("Mostra Coffee")).toBeNull();
  });
});

describe("cafe detail content blocks", () => {
  it("renders every block from cafe-detail.md in order for the Mostra reference", async () => {
    await render(<CafeDetailScreen />);
    await settleLoading();

    expect(screen.getByText("Mostra Coffee")).toBeTruthy();
    expect(screen.getByText("Open")).toBeTruthy();
    expect(screen.getByText("North Park · 0.3 mi · Closes 6pm")).toBeTruthy();

    // "Aesthetic" also appears as a score-card label, so allow duplicates.
    for (const tag of ["Aesthetic", "Specialty Coffee", "Good Latte"]) {
      expect(screen.getAllByText(tag).length).toBeGreaterThanOrEqual(1);
    }

    for (const score of ["9.1", "8.8", "6.5", "7.2"]) {
      expect(screen.getByText(score)).toBeTruthy();
    }

    expect(screen.getByText("Vibe summary")).toBeTruthy();
    expect(screen.getByText("Details")).toBeTruthy();
    expect(screen.getByText("3043 University Ave")).toBeTruthy();
    expect(screen.getByText("Why it matches your mood")).toBeTruthy();
    expect(screen.getByText("People love")).toBeTruthy();
    expect(screen.getByText("Watch out for")).toBeTruthy();
    expect(screen.getByText("Best time to visit")).toBeTruthy();
    expect(screen.getByText("Similar cafes nearby")).toBeTruthy();
    expect(screen.getByText("1 / 8")).toBeTruthy();
  });

  it("offers all six actions", async () => {
    await render(<CafeDetailScreen />);
    await settleLoading();

    expect(screen.getAllByLabelText("Save cafe").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Directions")).toBeTruthy();
    expect(screen.getByText("Add to Route")).toBeTruthy();
    expect(screen.getByText("Share")).toBeTruthy();
    expect(screen.getByText("View Photos")).toBeTruthy();
    expect(screen.getByText("Open in Google Maps")).toBeTruthy();
    expect(screen.getByLabelText("Share cafe")).toBeTruthy();
  });

  it("opens the save sheet and persists a save to a chosen collection", async () => {
    await render(<CafeDetailScreen />);
    await settleLoading();

    const [saveButton] = screen.getAllByLabelText("Save cafe");
    await fireEvent.press(saveButton);

    expect(screen.getByText("Save Mostra Coffee")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Work Spots, 0 saved"));
    await fireEvent.changeText(
      screen.getByLabelText("Private note"),
      "Best before 10am",
    );
    await fireEvent.press(screen.getByLabelText("Save cafe to collections"));

    // Sheet closes and the store reflects the save.
    expect(screen.queryByText("Save Mostra Coffee")).toBeNull();
    expect(isCafeSaved(getSavedState(), "mostra")).toBe(true);
    expect(getSavedState().saves.mostra).toEqual({
      collectionIds: ["work-spots"],
      note: "Best before 10am",
    });
    expect(screen.getAllByLabelText("Saved cafe").length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("creates a new collection and returns to the save sheet with it selected", async () => {
    await render(<CafeDetailScreen />);
    await settleLoading();

    await fireEvent.press(screen.getAllByLabelText("Save cafe")[0]);
    await fireEvent.press(screen.getByLabelText("Create new collection"));

    expect(screen.getByText("New collection")).toBeTruthy();

    await fireEvent.press(
      screen.getByLabelText("Use suggested name Matcha Places"),
    );
    await fireEvent.press(screen.getByLabelText("Create Collection"));

    // Back on the save sheet, the new collection is present and selected.
    expect(screen.getByText("Save Mostra Coffee")).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Matcha Places, 0 saved",
        selected: true,
      }),
    ).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Save cafe to collections"));

    expect(getSavedState().saves.mostra?.collectionIds).toEqual([
      "matcha-places",
    ]);
  });

  it("cancels the save sheet without saving", async () => {
    await render(<CafeDetailScreen />);
    await settleLoading();

    await fireEvent.press(screen.getAllByLabelText("Save cafe")[0]);
    await fireEvent.press(screen.getByText("Cancel"));

    expect(screen.queryByText("Save Mostra Coffee")).toBeNull();
    expect(isCafeSaved(getSavedState(), "mostra")).toBe(false);
  });

  it("navigates to a similar cafe's detail", async () => {
    await render(<CafeDetailScreen />);
    await settleLoading();

    await fireEvent.press(screen.getByLabelText("Open Marigold & Oak details"));

    expect(mockPush).toHaveBeenCalledWith("/cafe/marigold");
  });

  it("opens the gallery from View Photos", async () => {
    await render(<CafeDetailScreen />);
    await settleLoading();

    await fireEvent.press(screen.getByText("View Photos"));

    expect(mockPush).toHaveBeenCalledWith("/cafe/mostra/gallery");
  });

  it("opens the review insights from What people say", async () => {
    await render(<CafeDetailScreen />);
    await settleLoading();

    expect(screen.getByText("Summarized from 480 reviews")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("What people say"));

    expect(mockPush).toHaveBeenCalledWith("/cafe/mostra/insights");
  });

  it("opens the share card overlay from the Share action", async () => {
    await render(<CafeDetailScreen />);
    await settleLoading();

    await fireEvent.press(screen.getByText("Share"));

    expect(screen.getByText("Share this cafe")).toBeTruthy();
    expect(screen.getByLabelText("Share card for Mostra Coffee")).toBeTruthy();
    expect(screen.getByText("North Park · San Diego")).toBeTruthy();

    for (const label of ["Copy Link", "Share Image", "Send to Friend"]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }

    await fireEvent.press(screen.getByLabelText("Dismiss share sheet"));

    expect(screen.queryByText("Share this cafe")).toBeNull();
  });
});

describe("cafe detail error state", () => {
  it("shows the retry state for unknown cafes and retries into the same error", async () => {
    mockParams = { id: "nowhere" };

    await render(<CafeDetailScreen />);
    await settleLoading();

    expect(screen.getByText(cafeDetailErrorTitle)).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Try Again" }));

    expect(screen.getByText("Cafe detail")).toBeTruthy();

    await settleLoading();

    expect(screen.getByText(cafeDetailErrorTitle)).toBeTruthy();
  });

  it("forces the error state under the QA override", async () => {
    mockParams = { id: "mostra", state: "error" };

    await render(<CafeDetailScreen />);
    await settleLoading();

    expect(screen.getByText(cafeDetailErrorTitle)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Try Again" })).toBeTruthy();
  });
});

describe("cafe detail limited-data state", () => {
  it("shows the still-learning notice and hides editorial sections organically", async () => {
    mockParams = { id: "hearth" };

    await render(<CafeDetailScreen />);
    await settleLoading();

    expect(screen.getByText("Hearth Supply Co.")).toBeTruthy();
    expect(screen.getByText(cafeDetailLimitedNotice)).toBeTruthy();
    expect(screen.queryByText("Why it matches your mood")).toBeNull();
    expect(screen.queryByText("Best time to visit")).toBeNull();
    expect(screen.queryByText("Similar cafes nearby")).toBeNull();
    expect(screen.queryByLabelText("What people say")).toBeNull();
  });

  it("handles missing images with a placeholder instead of a carousel", async () => {
    mockParams = { id: "hearth" };

    await render(<CafeDetailScreen />);
    await settleLoading();

    expect(screen.getByLabelText("No cafe photos yet")).toBeTruthy();
    expect(screen.queryByText(/ \/ /)).toBeNull();
  });

  it("forces the limited notice on a full cafe under the QA override", async () => {
    mockParams = { id: "mostra", state: "limited" };

    await render(<CafeDetailScreen />);
    await settleLoading();

    expect(screen.getByText("Mostra Coffee")).toBeTruthy();
    expect(screen.getByText(cafeDetailLimitedNotice)).toBeTruthy();
    expect(screen.queryByText("Why it matches your mood")).toBeNull();
  });
});

describe("detail directions actions (US-032)", () => {
  it("opens the maps app from Directions and the web from Open in Google Maps", async () => {
    const { Linking } = jest.requireActual("react-native");
    const openUrl = jest
      .spyOn(Linking, "openURL")
      .mockResolvedValue(undefined);

    await render(<CafeDetailScreen />);
    await settleLoading();

    await fireEvent.press(
      screen.getByRole("button", { name: "Directions" }),
    );
    expect(openUrl.mock.calls[0][0]).toContain("daddr=32.75,-117.13");

    await fireEvent.press(screen.getByText("Open in Google Maps"));
    expect(openUrl.mock.calls[1][0]).toBe(
      "https://www.google.com/maps/search/?api=1&query=32.75,-117.13",
    );

    openUrl.mockRestore();
  });
});
