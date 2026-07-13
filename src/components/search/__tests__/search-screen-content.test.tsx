import { fireEvent, render, screen } from "@testing-library/react-native";

import { SearchScreenContent } from "@/components/search/search-screen-content";
import { fetchLiveCafes, resetLiveCafesForTests } from "@/utils/live-cafes";

jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  resetLiveCafesForTests();
});

async function warmLiveCache() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      elements: [
        {
          type: "node",
          id: 701,
          lat: 32.7492,
          lon: -117.1299,
          tags: {
            amenity: "cafe",
            name: "Caffè Calabria",
            cuisine: "coffee_shop",
            internet_access: "wlan",
            outdoor_seating: "yes",
            "addr:street": "30th Street",
          },
        },
        {
          type: "node",
          id: 702,
          lat: 32.751,
          lon: -117.132,
          tags: { amenity: "cafe", name: "Santos Coffee" },
        },
      ],
    }),
  }) as unknown as typeof fetch;

  await fetchLiveCafes({ latitude: 32.7466, longitude: -117.1297 });
}

describe("SearchScreenContent", () => {
  it("opens on the nearest curated cafes when the live cache is cold", async () => {
    await render(<SearchScreenContent />);

    // Empty default query -> first two fixtures.
    expect(screen.getByText("Marigold & Oak")).toBeOnTheScreen();
    expect(screen.getByText("Hearth Supply Co.")).toBeOnTheScreen();
  });

  it("shows the real nearby OSM cafes when the map cache is warm", async () => {
    await warmLiveCache();

    await render(<SearchScreenContent />);

    expect(screen.getByText("Caffè Calabria")).toBeOnTheScreen();
    expect(screen.getByText("Santos Coffee")).toBeOnTheScreen();
    // Fixtures no longer appear when real cafes are available.
    expect(screen.queryByText("Marigold & Oak")).toBeNull();
  });

  it("filters the results as the query changes", async () => {
    await render(<SearchScreenContent />);

    await fireEvent.changeText(
      screen.getByLabelText("Search"),
      "aesthetic",
    );

    expect(screen.getByText("Mostra Coffee")).toBeOnTheScreen();
    expect(screen.getByText("Terrace & Thistle")).toBeOnTheScreen();
    expect(screen.queryByText("Hearth Supply Co.")).toBeNull();
  });

  it("shows the empty state for a query that matches nothing", async () => {
    await render(<SearchScreenContent />);

    await fireEvent.changeText(
      screen.getByLabelText("Search"),
      "zzzznotacafe",
    );

    expect(screen.getByText("No match for that vibe.")).toBeOnTheScreen();
  });
});
