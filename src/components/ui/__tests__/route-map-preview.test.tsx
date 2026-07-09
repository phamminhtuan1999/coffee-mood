import { render, screen } from "@testing-library/react-native";

import { RouteMapPreview } from "@/components/ui/route-map-preview";

describe("RouteMapPreview", () => {
  it("labels the map and renders a numbered pin per stop", async () => {
    await render(<RouteMapPreview stopCount={3} />);

    expect(screen.getByLabelText("Route map with 3 stops")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.queryByText("4")).toBeNull();
  });

  it("clamps to the available pin coordinates", async () => {
    await render(<RouteMapPreview stopCount={9} />);

    expect(screen.getByLabelText("Route map with 4 stops")).toBeTruthy();
  });
});
