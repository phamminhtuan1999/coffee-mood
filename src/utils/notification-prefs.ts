import "expo-sqlite/localStorage/install";

// Notification preference toggles (frame G4). Local persistence only: actual
// push delivery needs Expo Notifications + provider setup, which stays
// deferred external-systems work (decision 0020).

const NOTIFICATION_PREFS_KEY = "cafemood.notification-prefs.v1";

export type NotificationPrefId =
  | "new-cafes"
  | "saved-reminders"
  | "weekend-routes"
  | "friend-recs"
  | "vibe-updates";

export type NotificationPrefs = Record<NotificationPrefId, boolean>;

// Calm defaults per the G4 prototype: discovery on, social noise off.
export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  "new-cafes": true,
  "saved-reminders": true,
  "weekend-routes": true,
  "friend-recs": false,
  "vibe-updates": false,
};

let cached: NotificationPrefs | null = null;
const listeners = new Set<() => void>();

export function getNotificationPrefs(): NotificationPrefs {
  if (!cached) {
    cached = loadPrefs();
  }

  return cached;
}

export function subscribeNotificationPrefs(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function toggleNotificationPref(id: NotificationPrefId): void {
  const current = getNotificationPrefs();
  const next = { ...current, [id]: !current[id] };

  cached = next;
  localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

// Clears persisted prefs (used by delete account and test resets).
export function resetNotificationPrefs(): void {
  cached = null;
  localStorage.removeItem(NOTIFICATION_PREFS_KEY);
}

function loadPrefs(): NotificationPrefs {
  const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY);

  if (!stored) {
    return { ...DEFAULT_NOTIFICATION_PREFS };
  }

  try {
    const parsed = JSON.parse(stored) as Partial<Record<string, unknown>>;
    const prefs = { ...DEFAULT_NOTIFICATION_PREFS };

    for (const id of Object.keys(prefs) as NotificationPrefId[]) {
      if (typeof parsed[id] === "boolean") {
        prefs[id] = parsed[id] as boolean;
      }
    }

    return prefs;
  } catch {
    localStorage.removeItem(NOTIFICATION_PREFS_KEY);
    return { ...DEFAULT_NOTIFICATION_PREFS };
  }
}
