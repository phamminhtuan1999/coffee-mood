import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  AISummaryCard,
  CafeImageCard,
  CollectionCard,
  EmptyStateCard,
  FilterRow,
  LoadingSkeleton,
  MapPreviewSurface,
  RouteStopCard,
  ScoreBadge,
  SearchBar,
} from "@/components/ui";
import { theme } from "@/constants/theme";
import { findStyleWith } from "@/test/style-utils";

describe("ScoreBadge", () => {
  it("renders label and score", async () => {
    await render(<ScoreBadge label="Coffee" score="9.4" />);

    expect(screen.getByText("Coffee")).toBeOnTheScreen();
    expect(screen.getByText("9.4")).toBeOnTheScreen();
  });

  it.each([
    ["great", theme.colors.score.great],
    ["good", theme.colors.score.good],
    ["crowded", theme.colors.score.crowded],
  ] as const)("uses the %s tone dot color", async (tone, color) => {
    await render(<ScoreBadge label="Busy" score="6.1" tone={tone} />);

    expect(
      findStyleWith(screen.toJSON(), { backgroundColor: color }),
    ).toBeDefined();
  });
});

describe("SearchBar", () => {
  it("renders the default placeholder at the tokenized control height", async () => {
    await render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      "Search cafes, vibes, or neighborhoods",
    );

    expect(input).toHaveStyle({ height: theme.sizing.searchControl });
  });

  it("strengthens the border when focused", async () => {
    await render(<SearchBar focused />);

    expect(
      findStyleWith(screen.toJSON(), {
        borderWidth: 1.5,
        borderColor: theme.colors.text.espresso900,
      }),
    ).toBeDefined();
  });
});

describe("AISummaryCard", () => {
  it("shows the eyebrow and summary text", async () => {
    await render(<AISummaryCard>Quiet mornings, golden light.</AISummaryCard>);

    expect(screen.getByText("Vibe Summary")).toBeOnTheScreen();
    expect(screen.getByText("Quiet mornings, golden light.")).toBeOnTheScreen();
  });

  it("hides the eyebrow in compact mode", async () => {
    await render(<AISummaryCard compact>Quiet mornings.</AISummaryCard>);

    expect(screen.queryByText("Vibe Summary")).toBeNull();
    expect(screen.getByText("Quiet mornings.")).toBeOnTheScreen();
  });
});

describe("CafeImageCard", () => {
  it("renders title, meta, and the image-card radius", async () => {
    await render(<CafeImageCard title="Golden Hour Cafe" meta="0.4 mi away" />);

    expect(screen.getByText("Golden Hour Cafe")).toBeOnTheScreen();
    expect(screen.getByText("0.4 mi away")).toBeOnTheScreen();
    expect(
      findStyleWith(screen.toJSON(), {
        borderRadius: theme.radius.imageCard,
      }),
    ).toBeDefined();
  });

  it("shows the featured pill only when featured", async () => {
    await render(<CafeImageCard title="Golden Hour Cafe" featured />);
    expect(screen.getByText("Featured")).toBeOnTheScreen();

    await render(<CafeImageCard title="Analog Coffee" />);
    expect(screen.queryByText("Featured")).toBeNull();
  });
});

describe("CollectionCard", () => {
  it("renders title and count", async () => {
    await render(<CollectionCard title="Rainy day spots" count="8 cafes" />);

    expect(screen.getByText("Rainy day spots")).toBeOnTheScreen();
    expect(screen.getByText("8 cafes")).toBeOnTheScreen();
  });
});

describe("EmptyStateCard", () => {
  it("renders title, copy, and the CTA button", async () => {
    await render(
      <EmptyStateCard
        title="No saved cafes yet"
        copy="Cafes you save will land here."
        cta="Explore the map"
      />,
    );

    expect(screen.getByText("No saved cafes yet")).toBeOnTheScreen();
    expect(screen.getByText("Cafes you save will land here.")).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Explore the map" }),
    ).toBeOnTheScreen();
  });
});

describe("FilterRow", () => {
  it("renders the label, hint, and options with the selected chip marked", async () => {
    await render(
      <FilterRow
        label="Noise level"
        hint="Pick one"
        options={["Quiet", "Lively"]}
        selected="Quiet"
      />,
    );

    expect(screen.getByText("Noise level")).toBeOnTheScreen();
    expect(screen.getByText("Pick one")).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Quiet", selected: true }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Lively", selected: false }),
    ).toBeOnTheScreen();
  });
});

describe("LoadingSkeleton", () => {
  it("exposes a progressbar with skeleton tones", async () => {
    await render(<LoadingSkeleton title="Finding cafes" hint="Reading the vibe…" />);

    expect(screen.getByRole("progressbar")).toBeOnTheScreen();
    expect(screen.getByText("Finding cafes")).toBeOnTheScreen();
    expect(screen.getByText("Reading the vibe…")).toBeOnTheScreen();
    expect(
      findStyleWith(screen.toJSON(), {
        backgroundColor: theme.colors.surface.skeletonBase,
      }),
    ).toBeDefined();
  });
});

describe("MapPreviewSurface", () => {
  it("renders children on the warm land background", async () => {
    await render(
      <MapPreviewSurface>
        <Text>pin goes here</Text>
      </MapPreviewSurface>,
    );

    expect(screen.getByText("pin goes here")).toBeOnTheScreen();
    expect(
      findStyleWith(screen.toJSON(), {
        backgroundColor: theme.colors.map.land,
      }),
    ).toBeDefined();
  });
});

describe("RouteStopCard", () => {
  it("renders the stop index, name, and tag", async () => {
    await render(<RouteStopCard index={1} name="Mostra Coffee" tag="Cozy start" />);

    expect(screen.getByText("1")).toBeOnTheScreen();
    expect(screen.getByText("Mostra Coffee")).toBeOnTheScreen();
    expect(screen.getByText("Cozy start")).toBeOnTheScreen();
    expect(
      findStyleWith(screen.toJSON(), {
        backgroundColor: theme.colors.brand.terracotta,
      }),
    ).toBeDefined();
  });
});
