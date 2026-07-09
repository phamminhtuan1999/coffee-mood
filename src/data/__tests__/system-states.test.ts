import {
  OFFLINE_STATE,
  SYSTEM_EMPTY_STATES,
  SYSTEM_ERROR_STATES,
  SYSTEM_LOADING_STATES,
} from "@/data/system-states";

describe("system-state catalog counts", () => {
  it("carries six empty, five loading, and five error states", () => {
    expect(SYSTEM_EMPTY_STATES).toHaveLength(6);
    expect(SYSTEM_LOADING_STATES).toHaveLength(5);
    expect(SYSTEM_ERROR_STATES).toHaveLength(5);
  });

  it("keeps ids unique across the catalog", () => {
    const ids = [
      ...SYSTEM_EMPTY_STATES,
      ...SYSTEM_LOADING_STATES,
      ...SYSTEM_ERROR_STATES,
    ].map((state) => state.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("designed copy contract (Section H)", () => {
  it("keeps the empty-state copy", () => {
    expect(
      SYSTEM_EMPTY_STATES.map((state) => [state.title, state.cta]),
    ).toEqual([
      ["No cafés nearby", "Expand search"],
      ["No saved cafés", "Explore the map"],
      ["No results", "Clear filters"],
      ["Location is off", "Choose manually"],
      ["No route found", "Adjust plan"],
      ["You're offline", "View saved"],
    ]);
    expect(OFFLINE_STATE.copy).toBe(
      "Saved cafés and notes still work. The map will catch up.",
    );
  });

  it("keeps the loading hints", () => {
    expect(SYSTEM_LOADING_STATES.map((state) => state.hint)).toEqual([
      "Pouring the map…",
      "Reading the room…",
      "Warming up…",
      "Connecting the dots…",
      "Warming your library…",
    ]);
  });

  it("keeps the error copy including the save-failed case", () => {
    expect(
      SYSTEM_ERROR_STATES.map((state) => [state.title, state.cta]),
    ).toEqual([
      ["Something spilled", "Try again"],
      ["Location unavailable", "Choose manually"],
      ["AI is resting", "Open map"],
      ["Image didn't load", "Refresh"],
      ["Save didn't stick", "Retry save"],
    ]);
  });
});
