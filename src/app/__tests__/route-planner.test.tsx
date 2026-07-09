import { fireEvent, render, screen } from "@testing-library/react-native";

import RoutePlannerScreen from "@/app/route/index";
import RouteDetailScreen from "@/app/route/detail";
import ReplaceStopScreen from "@/app/route/replace";
import {
  generateActiveRoute,
  getRoutePlanner,
  resetRoutePlanner,
} from "@/utils/route-planner-store";

const mockBack = jest.fn();
const mockPush = jest.fn();
let mockParams: { stop?: string } = {};

jest.mock("expo-router", () => ({
  router: {
    back: (...args: unknown[]) => mockBack(...args),
    push: (...args: unknown[]) => mockPush(...args),
  },
  useLocalSearchParams: () => mockParams,
}));

beforeEach(() => {
  jest.clearAllMocks();
  resetRoutePlanner();
  mockParams = {};
});

describe("route planner screen", () => {
  it("renders the mood inputs and generates a route from the selections", async () => {
    await render(<RoutePlannerScreen />);

    expect(screen.getByText("Plan a café route")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Work" }));
    await fireEvent.press(screen.getByRole("button", { name: "1 hour" }));
    await fireEvent.press(screen.getByRole("button", { name: "Add a stop" }));

    await fireEvent.press(screen.getByLabelText("Generate Route"));

    expect(mockPush).toHaveBeenCalledWith("/route/detail");

    const state = getRoutePlanner();
    expect(state.inputs.moodId).toBe("work");
    expect(state.inputs.durationId).toBe("1h");
    expect(state.inputs.stopCount).toBe(4);
    expect(state.route?.stops).toHaveLength(4);
  });

  it("clamps the stepper at the minimum", async () => {
    await render(<RoutePlannerScreen />);

    // Default is 3; two presses hit the floor of 2, a third is a no-op.
    await fireEvent.press(screen.getByLabelText("Remove a stop"));
    await fireEvent.press(screen.getByLabelText("Remove a stop"));
    await fireEvent.press(screen.getByLabelText("Remove a stop"));

    expect(screen.getByLabelText("2 stops")).toBeTruthy();
  });
});

describe("route detail screen", () => {
  it("renders the generated route with stops, meta, and vibe summary", async () => {
    generateActiveRoute();

    await render(<RouteDetailScreen />);

    expect(screen.getByText("Saturday Café Route")).toBeTruthy();
    expect(
      screen.getByText("2-hour aesthetic café hopping route near you"),
    ).toBeTruthy();
    expect(screen.getByText("1.2 mi walk")).toBeTruthy();
    expect(screen.getByText("~2 hrs")).toBeTruthy();
    expect(screen.getByText("3 stops")).toBeTruthy();

    expect(screen.getByText("Mostra Coffee")).toBeTruthy();
    expect(screen.getByText("Morning latte")).toBeTruthy();
    expect(screen.getByText("Terrace & Thistle")).toBeTruthy();
    expect(screen.getByText(/Slow morning arc/)).toBeTruthy();

    expect(screen.getByLabelText("Save Route")).toBeTruthy();
    expect(screen.getByLabelText("Start Navigation")).toBeTruthy();
  });

  it("generates a default route when deep-linked cold", async () => {
    expect(getRoutePlanner().route).toBeNull();

    await render(<RouteDetailScreen />);

    expect(screen.getByText("Saturday Café Route")).toBeTruthy();
    expect(getRoutePlanner().route).not.toBeNull();
  });

  it("opens the replace flow for a chosen stop", async () => {
    generateActiveRoute();

    await render(<RouteDetailScreen />);

    await fireEvent.press(screen.getByLabelText("Replace stop 2"));

    expect(mockPush).toHaveBeenCalledWith("/route/replace?stop=1");
  });
});

describe("replace stop screen", () => {
  it("shows the current stop and reasoned alternatives and swaps on Replace", async () => {
    generateActiveRoute();
    mockParams = { stop: "1" };

    await render(<ReplaceStopScreen />);

    expect(screen.getByText("Replace stop 2")).toBeTruthy();
    expect(screen.getByText("Fernway Bakes")).toBeTruthy();
    expect(screen.getByText("Bluevine Bakehouse")).toBeTruthy();
    expect(screen.getByText("Better parking")).toBeTruthy();

    // Disabled until an alternative is chosen: pressing is a no-op.
    await fireEvent.press(screen.getByLabelText("Replace Stop"));
    expect(mockBack).not.toHaveBeenCalled();
    expect(getRoutePlanner().route?.stops[1].cafeId).toBe("fernway");

    await fireEvent.press(
      screen.getByRole("button", { name: "Petal & Crumb, More aesthetic" }),
    );
    await fireEvent.press(screen.getByLabelText("Replace Stop"));

    expect(mockBack).toHaveBeenCalledTimes(1);
    const swapped = getRoutePlanner().route?.stops[1];
    expect(swapped?.cafeId).toBe("petal");
    expect(swapped?.role).toBe("Dessert café");
  });

  it("keeps the current stop and leaves the route untouched", async () => {
    generateActiveRoute();
    mockParams = { stop: "1" };

    await render(<ReplaceStopScreen />);

    await fireEvent.press(screen.getByLabelText("Keep current"));

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(getRoutePlanner().route?.stops[1].cafeId).toBe("fernway");
  });

  it("falls back to a sensible stop index when the param is missing", async () => {
    generateActiveRoute();
    mockParams = {};

    await render(<ReplaceStopScreen />);

    expect(screen.getByText("Replace stop 2")).toBeTruthy();
  });
});
