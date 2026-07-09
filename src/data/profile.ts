import type { AuthSession } from "@/utils/auth-session";
import type { NotificationPrefId } from "@/utils/notification-prefs";
import type { SavedState } from "@/utils/saved-store";
import type { TasteProfile } from "@/utils/taste-profile";

// Profile, settings, and notification-preferences data (frames G2/G3/G4).
// Identity is the G2 demo persona until a profile-editing data model exists;
// everything countable derives live from the local stores.

export const PROFILE_PERSONA = {
  initial: "J",
  name: "Jamie Rivera",
  meta: "San Diego · exploring since 2025",
} as const;

export type ProfileStat = {
  n: number;
  label: string;
};

// Visited stays 0 until visit history exists (decision 0018 deferral).
export function profileStats(state: SavedState): ProfileStat[] {
  return [
    { n: Object.keys(state.saves).length, label: "Saved" },
    { n: state.collections.length, label: "Collections" },
    { n: 0, label: "Visited" },
  ];
}

export type ProfileRowTone = "latte" | "terracotta" | "olive" | "neutral";

export type ProfileRoute = "/taste" | "/saved" | "/route" | "/settings";

export type ProfileRow = {
  icon: string;
  tone: ProfileRowTone;
  label: string;
  sub: string;
  route: ProfileRoute;
};

export function profileRows(state: SavedState): ProfileRow[] {
  const savedCount = Object.keys(state.saves).length;
  const collectionCount = state.collections.length;

  return [
    {
      icon: "✦",
      tone: "latte",
      label: "Taste profile",
      sub: "Work-friendly · Aesthetic",
      route: "/taste",
    },
    {
      icon: "♥",
      tone: "terracotta",
      label: "Saved cafés",
      sub: `${savedCount} ${savedCount === 1 ? "café" : "cafés"} in ${collectionCount} collections`,
      route: "/saved",
    },
    {
      icon: "➝",
      tone: "olive",
      label: "My routes",
      sub: "Plan a café-hopping route",
      route: "/route",
    },
    {
      icon: "⚙",
      tone: "neutral",
      label: "Settings",
      sub: "Account, privacy, notifications",
      route: "/settings",
    },
  ];
}

export type SettingsRowKind = "value" | "signout" | "notifications" | "danger";

export type SettingsRow = {
  label: string;
  value: string;
  kind: SettingsRowKind;
};

export type SettingsGroup = {
  title: string;
  rows: SettingsRow[];
};

const FALLBACK_EMAIL = "jamie@espresso.club";

// G3 groups. Preference values are display-only until a preferences data
// model exists; Sign out, Notifications, and Delete account are live.
export function settingsGroups(
  session: AuthSession | null,
  profile: TasteProfile | null,
  state: SavedState,
): SettingsGroup[] {
  const email =
    session?.email ??
    (session?.provider === "guest" ? "Guest session" : FALLBACK_EMAIL);
  const anyPublic = state.collections.some(
    (collection) => collection.privacy === "public",
  );

  return [
    {
      title: "Account",
      rows: [
        { label: "Email", value: email, kind: "value" },
        { label: "Sign out", value: "", kind: "signout" },
      ],
    },
    {
      title: "Preferences",
      rows: [
        { label: "Default location", value: "North Park", kind: "value" },
        { label: "Distance unit", value: "Miles", kind: "value" },
        {
          label: "Default vibe",
          value: profile?.cafeTypes[0] ?? "Work / Study",
          kind: "value",
        },
        { label: "Notifications", value: "Calm", kind: "notifications" },
      ],
    },
    {
      title: "Privacy",
      rows: [
        { label: "Location settings", value: "While using", kind: "value" },
        {
          label: "Collections visibility",
          value: anyPublic ? "Mixed" : "Private",
          kind: "value",
        },
        { label: "Delete account", value: "", kind: "danger" },
      ],
    },
  ];
}

export const DELETE_CONFIRM_TITLE = "Delete account?";
export const DELETE_CONFIRM_COPY =
  "This clears everything on this device — saves, collections, taste answers, and preferences. There's no undo.";
export const DELETE_CONFIRM_CTA = "Delete everything";
export const DELETE_CANCEL_CTA = "Keep my account";

export type NotificationRow = {
  id: NotificationPrefId;
  label: string;
  sub: string;
};

// G4 rows with the calm sub-copy.
export const NOTIFICATION_ROWS: NotificationRow[] = [
  {
    id: "new-cafes",
    label: "New cafés near me",
    sub: "When a spot worth a detour opens nearby",
  },
  {
    id: "saved-reminders",
    label: "Saved café reminders",
    sub: "Gentle nudges about places on your list",
  },
  {
    id: "weekend-routes",
    label: "Weekend route ideas",
    sub: "One café-hopping route, Fridays only",
  },
  {
    id: "friend-recs",
    label: "Friend recommendations",
    sub: "When someone shares a café with you",
  },
  {
    id: "vibe-updates",
    label: "Café vibe updates",
    sub: "Crowd and noise shifts at saved cafés",
  },
];

export const NOTIFICATIONS_INTRO =
  "Calm by default — only what helps you find your next café.";
export const NOTIFICATIONS_FOOTER =
  "You can mute everything, anytime. No guilt.";
