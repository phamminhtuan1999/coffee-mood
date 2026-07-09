import { fireEvent, render, screen } from "@testing-library/react-native";

import ProfileScreen from "@/app/profile";
import SettingsScreen from "@/app/settings";
import NotificationPreferencesScreen from "@/app/settings/notifications";
import { loadAuthSession, saveAuthSession } from "@/utils/auth-session";
import {
  getNotificationPrefs,
  resetNotificationPrefs,
  toggleNotificationPref,
} from "@/utils/notification-prefs";
import { getSavedState, resetSavedStore, saveCafe } from "@/utils/saved-store";
import { clearTasteProfile, loadTasteProfile, saveTasteProfile } from "@/utils/taste-profile";

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();
let mockParams: { state?: string } = {};

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: (...args: unknown[]) => mockPush(...args),
    back: (...args: unknown[]) => mockBack(...args),
    replace: (...args: unknown[]) => mockReplace(...args),
  }),
  useLocalSearchParams: () => mockParams,
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = {};
  localStorage.clear();
  resetSavedStore();
  resetNotificationPrefs();
  clearTasteProfile();
});

describe("profile hub (G2)", () => {
  it("renders persona, live counts, and shortcut rows", async () => {
    saveCafe("mostra", { collectionIds: ["want-to-try"], note: "" });

    await render(<ProfileScreen />);

    expect(screen.getByText("Jamie Rivera")).toBeTruthy();
    expect(screen.getByText("San Diego · exploring since 2025")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("6")).toBeTruthy();
    expect(screen.getByText("1 café in 6 collections")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Taste profile"));
    expect(mockPush).toHaveBeenCalledWith("/taste");

    await fireEvent.press(screen.getByLabelText("Saved cafés"));
    expect(mockPush).toHaveBeenCalledWith("/saved");

    await fireEvent.press(screen.getByLabelText("Preferences"));
    expect(mockPush).toHaveBeenCalledWith("/settings");
  });
});

describe("settings (G3)", () => {
  it("renders the three groups with live account values", async () => {
    saveAuthSession({
      provider: "email",
      email: "matthew@espresso.club",
      createdAt: "2026-07-09T00:00:00.000Z",
    });

    await render(<SettingsScreen />);

    expect(screen.getByText("matthew@espresso.club")).toBeTruthy();
    expect(screen.getByText("Default location")).toBeTruthy();
    expect(screen.getByText("North Park")).toBeTruthy();
    expect(screen.getByText("Delete account")).toBeTruthy();
  });

  it("signs out: clears the session and returns to the root", async () => {
    saveAuthSession({
      provider: "guest",
      createdAt: "2026-07-09T00:00:00.000Z",
    });

    await render(<SettingsScreen />);

    await fireEvent.press(screen.getByLabelText("Sign out"));

    expect(loadAuthSession()).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("routes to notification preferences", async () => {
    await render(<SettingsScreen />);

    await fireEvent.press(screen.getByLabelText("Notifications"));

    expect(mockPush).toHaveBeenCalledWith("/settings/notifications");
  });

  it("guards delete account behind an explicit confirm step", async () => {
    saveAuthSession({
      provider: "guest",
      createdAt: "2026-07-09T00:00:00.000Z",
    });
    saveTasteProfile({
      cafeTypes: ["Quiet"],
      priorities: [],
      distance: "10 min",
      price: "$$",
      skipped: false,
      updatedAt: "2026-07-09T00:00:00.000Z",
    });
    saveCafe("mostra", { collectionIds: ["want-to-try"], note: "" });
    toggleNotificationPref("friend-recs");

    await render(<SettingsScreen />);

    await fireEvent.press(screen.getByLabelText("Delete account"));

    expect(screen.getByText("Delete account?")).toBeTruthy();

    // Backing out changes nothing.
    await fireEvent.press(screen.getByLabelText("Keep my account"));

    expect(screen.queryByText("Delete account?")).toBeNull();
    expect(loadAuthSession()).not.toBeNull();

    // Confirming clears every local store and leaves settings.
    await fireEvent.press(screen.getByLabelText("Delete account"));
    await fireEvent.press(screen.getByLabelText("Delete everything"));

    expect(loadAuthSession()).toBeNull();
    expect(loadTasteProfile()).toBeNull();
    expect(Object.keys(getSavedState().saves)).toHaveLength(0);
    expect(getNotificationPrefs()["friend-recs"]).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});

describe("notification preferences (G4)", () => {
  it("renders five calm toggles with the intro and footer copy", async () => {
    await render(<NotificationPreferencesScreen />);

    expect(
      screen.getByText(
        "Calm by default — only what helps you find your next café.",
      ),
    ).toBeTruthy();
    expect(
      screen.getByText("You can mute everything, anytime. No guilt."),
    ).toBeTruthy();

    expect(
      screen.getByRole("switch", { name: "New cafés near me", checked: true }),
    ).toBeTruthy();
    expect(
      screen.getByRole("switch", {
        name: "Friend recommendations",
        checked: false,
      }),
    ).toBeTruthy();
  });

  it("flips and persists a toggle", async () => {
    await render(<NotificationPreferencesScreen />);

    await fireEvent.press(
      screen.getByRole("switch", { name: "Café vibe updates" }),
    );

    expect(
      screen.getByRole("switch", { name: "Café vibe updates", checked: true }),
    ).toBeTruthy();
    expect(getNotificationPrefs()["vibe-updates"]).toBe(true);
  });
});
