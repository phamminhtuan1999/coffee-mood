import { getStopAlternatives } from "@/data/route-plan";
import {
  ensureActiveRoute,
  generateActiveRoute,
  getRoutePlanner,
  replaceRouteStop,
  resetRoutePlanner,
  setRouteInputs,
  subscribeRoutePlanner,
} from "@/utils/route-planner-store";

beforeEach(() => {
  resetRoutePlanner();
});

describe("route planner store", () => {
  it("starts with default inputs and no generated route", () => {
    const state = getRoutePlanner();

    expect(state.route).toBeNull();
    expect(state.inputs.moodId).toBe("aesthetic");
    expect(state.inputs.stopCount).toBe(3);
  });

  it("merges and clamps input updates", () => {
    setRouteInputs({ moodId: "work", stopCount: 9 });

    const { inputs } = getRoutePlanner();
    expect(inputs.moodId).toBe("work");
    expect(inputs.stopCount).toBe(4);
    expect(inputs.transportId).toBe("walk");
  });

  it("generates a route from the current inputs and notifies subscribers", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeRoutePlanner(listener);

    setRouteInputs({ stopCount: 2 });
    generateActiveRoute();

    expect(getRoutePlanner().route?.stops).toHaveLength(2);
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });

  it("ensureActiveRoute generates once but does not clobber an existing route", () => {
    ensureActiveRoute();
    const first = getRoutePlanner().route;
    expect(first).not.toBeNull();

    ensureActiveRoute();
    expect(getRoutePlanner().route).toBe(first);
  });

  it("replaces a stop at the given index, preserving its role and leaving others", () => {
    generateActiveRoute();
    const before = getRoutePlanner().route;
    const [alt] = getStopAlternatives();

    replaceRouteStop(1, alt);

    const after = getRoutePlanner().route;
    expect(after?.stops[1].cafeId).toBe(alt.cafeId);
    expect(after?.stops[1].role).toBe(before?.stops[1].role);
    expect(after?.stops[0]).toEqual(before?.stops[0]);
    expect(after?.stops[2]).toEqual(before?.stops[2]);
  });

  it("ignores a replace when no route has been generated", () => {
    const [alt] = getStopAlternatives();

    replaceRouteStop(0, alt);

    expect(getRoutePlanner().route).toBeNull();
  });
});
