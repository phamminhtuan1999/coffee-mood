import {
  DEFAULT_NOTIFICATION_PREFS,
  getNotificationPrefs,
  resetNotificationPrefs,
  toggleNotificationPref,
} from "@/utils/notification-prefs";

beforeEach(() => {
  localStorage.clear();
  resetNotificationPrefs();
});

describe("notification prefs store", () => {
  it("defaults to the calm G4 set: discovery on, social noise off", () => {
    expect(getNotificationPrefs()).toEqual({
      "new-cafes": true,
      "saved-reminders": true,
      "weekend-routes": true,
      "friend-recs": false,
      "vibe-updates": false,
    });
  });

  it("toggles and persists a preference across a reload", () => {
    toggleNotificationPref("friend-recs");
    toggleNotificationPref("new-cafes");

    expect(getNotificationPrefs()["friend-recs"]).toBe(true);
    expect(getNotificationPrefs()["new-cafes"]).toBe(false);

    // Simulate a relaunch: keep persisted data, drop the cache.
    const persisted = localStorage.getItem("cafemood.notification-prefs.v1");
    resetNotificationPrefs();
    localStorage.setItem("cafemood.notification-prefs.v1", persisted ?? "");

    expect(getNotificationPrefs()["friend-recs"]).toBe(true);
    expect(getNotificationPrefs()["vibe-updates"]).toBe(false);
  });

  it("recovers from corrupt stored data with the defaults", () => {
    localStorage.setItem("cafemood.notification-prefs.v1", "{nope");
    resetNotificationPrefs();
    localStorage.setItem("cafemood.notification-prefs.v1", "{nope");

    expect(getNotificationPrefs()).toEqual(DEFAULT_NOTIFICATION_PREFS);
  });
});
