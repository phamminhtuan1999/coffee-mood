import { aiCafes } from "@/data/ai-finder-fixtures";
import type { AiFinderResult } from "@/data/ai-finder-fixtures";
import type { TasteProfile } from "@/utils/taste-profile";

// Live AI finder client (US-029, decision 0021). Talks to the Supabase Edge
// Function `ai-finder`; the Gemini key stays server-side. Only the public
// Supabase URL + anon key live in the app env, and when they are absent the
// caller keeps the deterministic fixture matcher (demo mode).

// Headroom for the Edge Function's server-side retry on transient provider
// 503s (see supabase/functions/ai-finder).
const LIVE_TIMEOUT_MS = 15000;

type LiveFinderConfig = {
  url: string;
  anonKey: string;
};

// Read at call time so tests can toggle the env per case.
export function liveFinderConfig(): LiveFinderConfig | null {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url: url.replace(/\/+$/, ""), anonKey };
}

export function isLiveFinderConfigured(): boolean {
  return liveFinderConfig() !== null;
}

// null = not configured (caller falls back to the deterministic matcher).
// Any live failure maps to the designed AI-unavailable state per 0013.
export async function runLiveAiFinder(
  prompt: string,
  profile: TasteProfile | null,
): Promise<AiFinderResult | null> {
  const config = liveFinderConfig();

  if (!config) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LIVE_TIMEOUT_MS);

  try {
    const response = await fetch(`${config.url}/functions/v1/ai-finder`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.anonKey}`,
        apikey: config.anonKey,
      },
      body: JSON.stringify({
        prompt,
        profile: profile
          ? {
              cafeTypes: profile.cafeTypes,
              priorities: profile.priorities,
              distance: profile.distance,
              price: profile.price,
            }
          : null,
        candidates: aiCafes.map((cafe) => ({
          id: cafe.id,
          name: cafe.name,
          meta: cafe.meta,
          keywords: cafe.keywords,
          baseScore: cafe.baseScore,
        })),
      }),
    });

    if (!response.ok) {
      return { status: "unavailable" };
    }

    const payload = (await response.json()) as {
      bestMatchId?: unknown;
      why?: unknown;
    };
    const match = aiCafes.find((cafe) => cafe.id === payload.bestMatchId);
    const why = Array.isArray(payload.why)
      ? payload.why.filter(
          (line): line is string =>
            typeof line === "string" && line.trim().length > 0,
        )
      : [];

    if (!match || why.length === 0) {
      return { status: "unavailable" };
    }

    return {
      status: "match",
      match: { ...match, whyItMatches: why.slice(0, 3) },
    };
  } catch {
    return { status: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
