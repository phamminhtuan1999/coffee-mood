import {
  NOTIFICATION_ROWS,
  PROFILE_PERSONA,
  profileRows,
  profileStats,
  settingsGroups,
} from "@/data/profile";
import {
  getSavedState,
  resetSavedStore,
  saveCafe,
  updateCollection,
} from "@/utils/saved-store";

beforeEach(() => {
  localStorage.clear();
  resetSavedStore();
});

describe("profile hub data (G2)", () => {
  it("derives live counts for stats and row subtitles", () => {
    saveCafe("mostra", { collectionIds: ["want-to-try"], note: "" });
    saveCafe("marigold", { collectionIds: ["work-spots"], note: "" });

    const state = getSavedState();

    expect(PROFILE_PERSONA.name).toBe("Jamie Rivera");
    expect(profileStats(state)).toEqual([
      { n: 2, label: "Saved" },
      { n: 6, label: "Collections" },
      { n: 0, label: "Visited" },
    ]);

    const rows = profileRows(state);
    expect(rows.map((row) => [row.label, row.route])).toEqual([
      ["Taste profile", "/taste"],
      ["Saved cafés", "/saved"],
      ["My routes", "/route"],
      ["Settings", "/settings"],
    ]);
    expect(rows[1].sub).toBe("2 cafés in 6 collections");
  });
});

describe("settings groups (G3)", () => {
  it("uses the session email and derives collections visibility", () => {
    const groups = settingsGroups(
      {
        provider: "email",
        email: "matthew@espresso.club",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
      null,
      getSavedState(),
    );

    expect(groups.map((group) => group.title)).toEqual([
      "Account",
      "Preferences",
      "Privacy",
    ]);
    expect(groups[0].rows[0]).toEqual({
      label: "Email",
      value: "matthew@espresso.club",
      kind: "value",
    });
    expect(groups[0].rows[1].kind).toBe("signout");
    expect(groups[2].rows[1].value).toBe("Private");
    expect(groups[2].rows[2].kind).toBe("danger");
  });

  it("labels guest sessions and mixed visibility", () => {
    updateCollection("date-spots", { privacy: "public" });

    const groups = settingsGroups(
      { provider: "guest", createdAt: "2026-07-09T00:00:00.000Z" },
      {
        cafeTypes: ["Outdoor"],
        priorities: [],
        distance: "10 min",
        price: "$$",
        skipped: false,
        updatedAt: "2026-07-09T00:00:00.000Z",
      },
      getSavedState(),
    );

    expect(groups[0].rows[0].value).toBe("Guest session");
    expect(groups[1].rows[2].value).toBe("Outdoor");
    expect(groups[2].rows[1].value).toBe("Mixed");
  });
});

describe("notification rows (G4)", () => {
  it("keeps the five contract toggles with calm sub-copy", () => {
    expect(NOTIFICATION_ROWS.map((row) => row.label)).toEqual([
      "New cafés near me",
      "Saved café reminders",
      "Weekend route ideas",
      "Friend recommendations",
      "Café vibe updates",
    ]);
    expect(NOTIFICATION_ROWS[2].sub).toBe(
      "One café-hopping route, Fridays only",
    );
  });
});
