import { cafeMapPins } from "@/data/map-pins";
import type { CafeMapPinTone } from "@/data/map-pins";

export const SHARE_BRAND = "CafeMood Map";
export const SHARE_HEADING = "Share this cafe";

export type ShareAction = {
  id: "copy" | "image" | "friend";
  label: string;
  symbol: string;
};

// Copy Link / Share Image / Send to Friend. Handlers are deferred to a
// clipboard / view-shot / share provider (decision 0015).
export const shareActions: ShareAction[] = [
  { id: "copy", label: "Copy Link", symbol: "sf:link" },
  { id: "image", label: "Share Image", symbol: "sf:square.and.arrow.up" },
  { id: "friend", label: "Send to Friend", symbol: "sf:paperplane" },
];

export type ShareCardContent = {
  cafeId: string;
  name: string;
  location: string;
  vibeTag: string;
  score: string;
  tagline: string;
  tone: CafeMapPinTone;
};

// Share-specific one-liners (punchier than the detail summary). Cafes without a
// dedicated line fall back to their pin vibe, so any cafe stays shareable.
const shareTaglines: Record<string, string> = {
  mostra: "Warm light, strong lattes — made for slow photo mornings.",
  marigold: "Soft tables and quiet corners — a calm place to get work done.",
  terrace: "Plant-filled patio and golden light — built for slow outdoor hangs.",
};

export function getShareCardContent(cafeId: string): ShareCardContent | undefined {
  const pin = cafeMapPins.find((cafe) => cafe.id === cafeId);

  if (!pin) {
    return undefined;
  }

  const neighborhood = pin.meta.split(" · ")[0];

  return {
    cafeId: pin.id,
    name: pin.name,
    location: `${neighborhood} · San Diego`,
    vibeTag: pin.tags[0] ?? pin.vibe,
    score: pin.score,
    tagline: shareTaglines[pin.id] ?? pin.vibe,
    tone: pin.tone,
  };
}
