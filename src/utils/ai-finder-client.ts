import { aiCafes } from "@/data/ai-finder-fixtures";
import type { AiCafe, AiFinderResult } from "@/data/ai-finder-fixtures";
import type { CafeMapPin } from "@/data/map-pins";
import { getCachedLiveCafes } from "@/utils/live-cafes";
import type { TasteProfile } from "@/utils/taste-profile";

// Live AI finder client (US-029, decision 0021). Talks to the Supabase Edge
// Function `ai-finder`; the provider key stays server-side. Only the public
// Supabase URL + anon key live in the app env, and when they are absent the
// caller keeps the deterministic fixture matcher (demo mode).
//
// Candidates are the map's real cafes (US-031) when its cache is warm
// (US-033, decision 0026), so Ask AI ranks real nearby cafes; the curated
// fixtures remain the candidate pool on a cold cache.

// Cap sent to the model — nearest-first, tight enough to keep the prompt
// focused.
const MAX_LIVE_CANDIDATES = 12;

type FinderCandidate = {
  id: string;
  name: string;
  meta: string;
  keywords: string[];
  baseScore: number;
};

function fixtureCandidate(cafe: (typeof aiCafes)[number]): FinderCandidate {
  return {
    id: cafe.id,
    name: cafe.name,
    meta: cafe.meta,
    keywords: cafe.keywords,
    baseScore: cafe.baseScore,
  };
}

function liveCandidate(pin: CafeMapPin): FinderCandidate {
  return {
    id: pin.id,
    name: pin.name,
    meta: pin.meta,
    keywords: pin.tags.map((tag) => tag.toLowerCase()),
    baseScore: Number.parseFloat(pin.score) || 0,
  };
}

function bestForLabel(pin: CafeMapPin): string {
  const top = [...pin.scores].sort(
    (a, b) => Number.parseFloat(b.value) - Number.parseFloat(a.value),
  )[0];

  return top ? `Better for ${top.label.toLowerCase()}` : "Nearby pick";
}

// Adapt a real map cafe into the AiCafe the result card renders: real
// name/meta/tone (CafeMapPinTone equals AiTone), the model's why-bullets, and
// alternatives drawn from the other nearby live cafes.
function liveCafeToAiCafe(
  pin: CafeMapPin,
  why: string[],
  others: CafeMapPin[],
): AiCafe {
  return {
    id: pin.id,
    name: pin.name,
    meta: pin.meta,
    tone: pin.tone,
    whyItMatches: why.slice(0, 3),
    alternatives: others.slice(0, 3).map((other) => ({
      name: other.name,
      betterFor: bestForLabel(other),
      tone: other.tone,
    })),
    keywords: pin.tags.map((tag) => tag.toLowerCase()),
    baseScore: Number.parseFloat(pin.score) || 0,
  };
}

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

  // Rank the map's real cafes when its cache is warm (US-033); fall back to
  // the curated fixtures on a cold cache so the demo path is unchanged.
  const liveCafes = getCachedLiveCafes().slice(0, MAX_LIVE_CANDIDATES);
  const useLive = liveCafes.length > 0;
  const candidates = useLive
    ? liveCafes.map(liveCandidate)
    : aiCafes.map(fixtureCandidate);

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
        candidates,
      }),
    });

    if (!response.ok) {
      return { status: "unavailable" };
    }

    const payload = (await response.json()) as {
      bestMatchId?: unknown;
      why?: unknown;
    };
    const why = Array.isArray(payload.why)
      ? payload.why.filter(
          (line): line is string =>
            typeof line === "string" && line.trim().length > 0,
        )
      : [];

    if (why.length === 0) {
      return { status: "unavailable" };
    }

    if (useLive) {
      const pin = liveCafes.find((cafe) => cafe.id === payload.bestMatchId);

      if (!pin) {
        return { status: "unavailable" };
      }

      const others = liveCafes.filter((cafe) => cafe.id !== pin.id);

      return {
        status: "match",
        match: liveCafeToAiCafe(pin, why, others),
      };
    }

    const match = aiCafes.find((cafe) => cafe.id === payload.bestMatchId);

    if (!match) {
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
