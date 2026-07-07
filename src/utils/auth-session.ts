import "expo-sqlite/localStorage/install";

const AUTH_SESSION_KEY = "cafemood.auth-session.v1";

export type AuthSessionProvider = "guest" | "apple" | "google" | "email";

export type AuthSession = {
  provider: AuthSessionProvider;
  email?: string;
  createdAt: string;
};

export function loadAuthSession(): AuthSession | null {
  const stored = localStorage.getItem(AUTH_SESSION_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<AuthSession>;

    if (!isAuthSessionProvider(parsed.provider) || !parsed.createdAt) {
      clearAuthSession();
      return null;
    }

    return {
      provider: parsed.provider,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
      createdAt: parsed.createdAt,
    };
  } catch {
    clearAuthSession();
    return null;
  }
}

export function saveAuthSession(session: AuthSession): void {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

function isAuthSessionProvider(
  provider: Partial<AuthSession>["provider"],
): provider is AuthSessionProvider {
  return (
    provider === "guest" ||
    provider === "apple" ||
    provider === "google" ||
    provider === "email"
  );
}
