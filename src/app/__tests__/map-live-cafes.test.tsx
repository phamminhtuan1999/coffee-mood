import { act, render, screen } from "@testing-library/react-native";

import Index, { MAP_LOADING_MS } from "@/app/index";
import type { CafeMapPin } from "@/data/map-pins";
import { defaultMapFilters } from "@/utils/map-filters";
import { resetSavedStore } from "@/utils/saved-store";

const mockPush = jest.fn();
let mockParams: { discovery?: string } = {};

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
  useLocalSearchParams: () => mockParams,
}));

const mockGetPermissions = jest.fn();
const mockGetPosition = jest.fn();

jest.mock("expo-location", () => ({
  getForegroundPermissionsAsync: (...args: unknown[]) =>
    mockGetPermissions(...args),
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: (...args: unknown[]) => mockGetPosition(...args),
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
  loadAuthSession: () => ({
    provider: "guest",
    createdAt: "2026-07-07T00:00:00.000Z",
  }),
  saveAuthSession: jest.fn(),
}));

jest.mock("@/utils/map-filters-store", () => {
  const { defaultMapFilters: defaults } = jest.requireActual(
    "@/utils/map-filters",
  );
  // Stable snapshot: useSyncExternalStore loops on a fresh object per call.
  const filters = defaults();

  return {
    getMapFilters: () => filters,
    resetMapFilters: jest.fn(),
    subscribeMapFilters: () => () => {},
  };
});

const mockFetchLiveCafes = jest.fn();

jest.mock("@/utils/live-cafes", () => ({
  fetchLiveCafes: (...args: unknown[]) => mockFetchLiveCafes(...args),
  getLiveCafePin: jest.fn(),
  getLiveCafeDetail: jest.fn(),
  isLiveCafeId: (id: string) => id.startsWith("osm-"),
}));

function livePin(overrides: Partial<CafeMapPin>): CafeMapPin {
  return {
    id: "osm-node-1",
    name: "Live Cafe",
    meta: "30th Street · 0.2 mi",
    score: "8.4",
    // Includes "Aesthetic" because the map home's default chip is Aesthetic.
    tags: ["Aesthetic", "Wi-Fi", "Work"],
    scores: [
      { label: "Aesthetic", value: "8.4" },
      { label: "Coffee", value: "8.1" },
      { label: "Work", value: "7.9" },
    ],
    summary: "Live cafe from the map.",
    tone: "latte",
    vibe: "Local spot from the live map",
    photoCount: 0,
    whyItMatches: ["Real cafe nearby."],
    peopleLove: [],
    watchOutFor: [],
    walkMinutes: 4,
    needs: ["Wi-Fi"],
    moodScores: { aesthetic: 8.4, work: 7.9, noise: 4 },
    price: "$$",
    treats: [],
    latitude: 32.7492,
    longitude: -117.1299,
    ...overrides,
  };
}

async function settleMap() {
  await act(async () => {
    jest.advanceTimersByTime(MAP_LOADING_MS + 50);
  });
  // Flush the location + live-cafes promise chain.
  await act(async () => {});
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  localStorage.clear();
  resetSavedStore();
  mockParams = {};
  mockGetPermissions.mockResolvedValue({ status: "granted", canAskAgain: true });
  mockGetPosition.mockResolvedValue({
    coords: { latitude: 32.7466, longitude: -117.1297 },
  });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("map home live cafes (US-031)", () => {
  it("renders live pins instead of fixtures when the fetch succeeds", async () => {
    mockFetchLiveCafes.mockResolvedValue([
      livePin({ id: "osm-node-1", name: "Caffè Calabria" }),
      livePin({ id: "osm-node-2", name: "Santos Coffee", tone: "olive" }),
    ]);

    await render(<Index />);
    await settleMap();

    expect(mockFetchLiveCafes).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: 32.7466, longitude: -117.1297 }),
    );
    expect(screen.getByLabelText("Caffè Calabria")).toBeTruthy();
    expect(screen.getByLabelText("Santos Coffee")).toBeTruthy();
    expect(screen.queryByLabelText("Mostra Coffee")).toBeNull();
    // Curated "+3" cluster pin is fixture-mode only.
    expect(
      screen.queryByLabelText("Cluster of cafes near University Heights"),
    ).toBeNull();
    // First live cafe is selected into the preview sheet (name renders as
    // sheet text; markers expose it via accessibility label only).
    expect(screen.getByText("Caffè Calabria")).toBeTruthy();
    expect(screen.queryByText("Santos Coffee")).toBeNull();
  });

  it("falls back to fixture pins when the live fetch fails", async () => {
    mockFetchLiveCafes.mockResolvedValue(null);

    await render(<Index />);
    await settleMap();

    expect(screen.getByLabelText("Mostra Coffee")).toBeTruthy();
    expect(
      screen.getByLabelText("Cluster of cafes near University Heights"),
    ).toBeTruthy();
  });

  it("uses the fixture center when location permission is not granted", async () => {
    mockGetPermissions.mockResolvedValue({
      status: "undetermined",
      canAskAgain: true,
    });
    mockFetchLiveCafes.mockResolvedValue(null);

    await render(<Index />);
    await settleMap();

    expect(mockGetPosition).not.toHaveBeenCalled();
    expect(mockFetchLiveCafes).toHaveBeenCalledWith(
      expect.objectContaining({
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      }),
    );
  });

  it("skips the live fetch entirely under QA state overrides", async () => {
    mockParams = { discovery: "offline" };
    mockFetchLiveCafes.mockResolvedValue([livePin({})]);

    await render(<Index />);
    await settleMap();

    expect(mockFetchLiveCafes).not.toHaveBeenCalled();
  });
});
