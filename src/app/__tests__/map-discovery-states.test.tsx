import { act, fireEvent, render, screen } from "@testing-library/react-native";

import Index, { MAP_LOADING_MS } from "@/app/index";
import { aiUnavailableTitle } from "@/data/ai-finder-fixtures";
import { defaultMapFilters } from "@/utils/map-filters";
import type { MapFilters } from "@/utils/map-filters";
import { resetSavedStore } from "@/utils/saved-store";

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockParams: { discovery?: string } = {};

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useLocalSearchParams: () => mockParams,
}));

const mockGetPermissions = jest.fn();
const mockRequestPermissions = jest.fn();

jest.mock("expo-location", () => ({
  getForegroundPermissionsAsync: (...args: unknown[]) =>
    mockGetPermissions(...args),
  requestForegroundPermissionsAsync: (...args: unknown[]) =>
    mockRequestPermissions(...args),
}));

jest.mock("@/utils/taste-profile", () => ({
  loadTasteProfile: () => ({
    cafeTypes: ["Work / Study"],
    priorities: ["Wi-Fi"],
    distance: "10 min",
    price: "$$",
    skipped: false,
    updatedAt: "2026-07-07T00:00:00.000Z",
  }),
  saveTasteProfile: jest.fn(),
}));

jest.mock("@/utils/auth-session", () => ({
  loadAuthSession: () => null,
  saveAuthSession: jest.fn(),
}));

const mockGetMapFilters = jest.fn();
const mockResetMapFilters = jest.fn();

jest.mock("@/utils/map-filters-store", () => ({
  getMapFilters: () => mockGetMapFilters(),
  resetMapFilters: () => mockResetMapFilters(),
  subscribeMapFilters: () => () => {},
}));

function useStoredFilters(filters: MapFilters) {
  mockGetMapFilters.mockReturnValue(filters);
}

async function settleMapLoading() {
  await act(async () => {
    jest.advanceTimersByTime(MAP_LOADING_MS + 50);
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  localStorage.clear();
  resetSavedStore();
  mockParams = {};
  useStoredFilters(defaultMapFilters());
  mockGetPermissions.mockResolvedValue({ status: "granted", canAskAgain: true });
  mockRequestPermissions.mockResolvedValue({
    status: "granted",
    canAskAgain: true,
  });
  mockResetMapFilters.mockImplementation(() =>
    useStoredFilters(defaultMapFilters()),
  );
});

afterEach(() => {
  jest.useRealTimers();
});

describe("map discovery loading state", () => {
  it("shows skeleton pins and a soft loading card, then the loaded map", async () => {
    await render(<Index />);

    expect(screen.getByText("Loading map cafes")).toBeTruthy();
    expect(screen.getByText("Pouring the map…")).toBeTruthy();
    expect(screen.getByLabelText("Loading cafes on the map")).toBeTruthy();
    expect(screen.queryByLabelText("Mostra Coffee")).toBeNull();

    await settleMapLoading();

    expect(screen.queryByText("Loading map cafes")).toBeNull();
    expect(screen.getByLabelText("Mostra Coffee")).toBeTruthy();
  });

  it("holds the loading state under the QA override", async () => {
    mockParams = { discovery: "loading" };

    await render(<Index />);
    await settleMapLoading();

    expect(screen.getByText("Loading map cafes")).toBeTruthy();
    expect(screen.queryByLabelText("Mostra Coffee")).toBeNull();
  });
});

describe("map discovery empty state", () => {
  it("shows the designed empty state when filters exclude every cafe and recovers via Expand Search", async () => {
    useStoredFilters({
      ...defaultMapFilters(),
      needs: ["Outdoor seating"],
      price: "$",
    });

    await render(<Index />);
    await settleMapLoading();

    expect(screen.getByText("No cafe vibes found nearby.")).toBeTruthy();
    expect(
      screen.getByText(
        "Try expanding your distance or choosing another neighborhood.",
      ),
    ).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Expand Search" }));

    expect(mockResetMapFilters).toHaveBeenCalled();
    expect(screen.queryByText("No cafe vibes found nearby.")).toBeNull();
    expect(screen.getByLabelText("Mostra Coffee")).toBeTruthy();
  });
});

describe("map discovery location-denied state", () => {
  it("offers both recovery paths and routes Choose Location to manual search", async () => {
    mockParams = { discovery: "denied" };

    await render(<Index />);
    await settleMapLoading();

    expect(screen.getByText("Location is off.")).toBeTruthy();
    expect(
      screen.getByText(
        "Turn on location, or pick a neighborhood manually — both work.",
      ),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Enable Location" })).toBeTruthy();

    await fireEvent.press(
      screen.getByRole("button", { name: "Choose Location" }),
    );

    expect(screen.getByPlaceholderText("Search city or neighborhood")).toBeTruthy();
  });

  it("dismisses the card when Enable Location is granted", async () => {
    mockParams = { discovery: "denied" };

    await render(<Index />);
    await settleMapLoading();

    await fireEvent.press(
      screen.getByRole("button", { name: "Enable Location" }),
    );
    await act(async () => {});

    expect(mockRequestPermissions).toHaveBeenCalled();
    expect(screen.queryByText("Location is off.")).toBeNull();
  });

  it("detects an already-denied permission without the QA override", async () => {
    mockGetPermissions.mockResolvedValue({ status: "denied", canAskAgain: false });

    await render(<Index />);
    await act(async () => {});
    await settleMapLoading();

    expect(screen.getByText("Location is off.")).toBeTruthy();
    expect(screen.queryByText("No cafe vibes found nearby.")).toBeNull();
  });
});

describe("applied filters stay visibly active on the map", () => {
  it("shows the active filter badge and filters the pins", async () => {
    useStoredFilters({ ...defaultMapFilters(), needs: ["Wi-Fi"] });

    await render(<Index />);
    await settleMapLoading();

    expect(
      screen.getByLabelText("Tune your map filters, 1 active"),
    ).toBeTruthy();

    // Default Aesthetic chip + Wi-Fi filter excludes everything.
    expect(screen.getByText("No cafe vibes found nearby.")).toBeTruthy();

    await fireEvent.press(screen.getByText("Aesthetic"));

    expect(screen.getByLabelText("Marigold & Oak")).toBeTruthy();
    expect(screen.getByLabelText("Hearth Supply Co.")).toBeTruthy();
    expect(screen.queryByLabelText("Mostra Coffee")).toBeNull();

    await fireEvent.press(
      screen.getByLabelText("Tune your map filters, 1 active"),
    );

    expect(mockPush).toHaveBeenCalledWith("/filters");
  });
});

describe("map sheet to cafe detail wiring", () => {
  it("opens the selected cafe's detail from the sheet name", async () => {
    await render(<Index />);
    await settleMapLoading();

    await fireEvent.press(screen.getByLabelText("Open Mostra Coffee details"));

    expect(mockPush).toHaveBeenCalledWith("/cafe/mostra");
  });
});

describe("AI unavailable state contract", () => {
  it("keeps the coffee-break copy from discovery.md", () => {
    expect(aiUnavailableTitle).toBe("CafeMood AI is taking a coffee break.");
  });
});
