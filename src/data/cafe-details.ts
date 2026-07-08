import type { CafeMapPinTone } from "@/data/map-pins";

export type CafeDetailScore = { label: string; value: string };

export type CafeDetailFact = { label: string; value: string };

export type CafeBestTime = { label: string; height: number; highlight?: boolean };

export type CafeSimilar = {
  id: string;
  name: string;
  meta: string;
  tone: CafeMapPinTone;
};

export type CafeDetail = {
  id: string;
  status: "Open" | "Closed";
  statusMeta: string;
  photoTones: CafeMapPinTone[];
  photoTotal: number;
  detailScores: CafeDetailScore[];
  facts: CafeDetailFact[];
  bestTimes: CafeBestTime[];
  similar: CafeSimilar[];
  limited?: boolean;
};

export const CAFE_DETAIL_LOADING_MS = 700;

export const cafeDetailErrorTitle = "Couldn't load this cafe.";
export const cafeDetailErrorCopy =
  "We couldn't reach this cafe right now. Your saves are safe.";
export const cafeDetailLimitedNotice =
  "Limited vibe data — we're still learning about this spot.";

export type ScoreTone = "great" | "good" | "crowded";

export function scoreTone(value: string): ScoreTone {
  const score = Number.parseFloat(value);

  if (score >= 8.5) {
    return "great";
  }

  return score >= 7 ? "good" : "crowded";
}

const cafeDetails: Record<string, CafeDetail> = {
  mostra: {
    id: "mostra",
    status: "Open",
    statusMeta: "Closes 6pm",
    photoTones: ["terracotta", "latte", "olive"],
    photoTotal: 8,
    detailScores: [
      { label: "Aesthetic", value: "9.1" },
      { label: "Coffee", value: "8.8" },
      { label: "Work", value: "6.5" },
      { label: "Quiet", value: "7.2" },
    ],
    facts: [
      { label: "Address", value: "3043 University Ave" },
      { label: "Hours", value: "7:00 AM – 6:00 PM" },
      { label: "Price", value: "$$" },
      { label: "Parking", value: "Street · easier on Ray St" },
      { label: "Wi-Fi", value: "Yes · solid" },
      { label: "Outdoor seating", value: "Small patio" },
      { label: "Best time", value: "Weekdays before 10 AM" },
      { label: "Crowd now", value: "Comfortable" },
    ],
    bestTimes: [
      { label: "7a", height: 18 },
      { label: "8a", height: 26 },
      { label: "9a", height: 34, highlight: true },
      { label: "10a", height: 46 },
      { label: "11a", height: 44 },
      { label: "12p", height: 38 },
      { label: "2p", height: 30 },
      { label: "4p", height: 22, highlight: true },
    ],
    similar: [
      { id: "marigold", name: "Marigold & Oak", meta: "Quiet · 0.5 mi", tone: "latte" },
      { id: "terrace", name: "Terrace & Thistle", meta: "Outdoor · 0.7 mi", tone: "olive" },
      { id: "hearth", name: "Hearth Supply Co.", meta: "Work · 0.8 mi", tone: "latte" },
    ],
  },
  marigold: {
    id: "marigold",
    status: "Open",
    statusMeta: "Quiet after 2pm",
    photoTones: ["latte", "olive", "terracotta"],
    photoTotal: 6,
    detailScores: [
      { label: "Quiet", value: "8.9" },
      { label: "Coffee", value: "8.4" },
      { label: "Work", value: "8.7" },
      { label: "Aesthetic", value: "6.4" },
    ],
    facts: [
      { label: "Address", value: "2811 30th St" },
      { label: "Hours", value: "7:00 AM – 5:00 PM" },
      { label: "Price", value: "$$" },
      { label: "Parking", value: "Street · easy on 30th" },
      { label: "Wi-Fi", value: "Yes · steady" },
      { label: "Outdoor seating", value: "None" },
      { label: "Best time", value: "Weekday afternoons" },
      { label: "Crowd now", value: "Calm" },
    ],
    bestTimes: [
      { label: "7a", height: 24 },
      { label: "8a", height: 34 },
      { label: "9a", height: 40 },
      { label: "10a", height: 36 },
      { label: "11a", height: 30 },
      { label: "12p", height: 26 },
      { label: "2p", height: 20, highlight: true },
      { label: "4p", height: 24, highlight: true },
    ],
    similar: [
      { id: "mostra", name: "Mostra Coffee", meta: "Latte · 0.3 mi", tone: "terracotta" },
      { id: "hearth", name: "Hearth Supply Co.", meta: "Work · 0.8 mi", tone: "latte" },
      { id: "terrace", name: "Terrace & Thistle", meta: "Outdoor · 0.7 mi", tone: "olive" },
    ],
  },
  terrace: {
    id: "terrace",
    status: "Open",
    statusMeta: "Patio open",
    photoTones: ["olive", "terracotta", "latte"],
    photoTotal: 5,
    detailScores: [
      { label: "Outdoor", value: "8.6" },
      { label: "Coffee", value: "8.1" },
      { label: "Date", value: "8.4" },
      { label: "Quiet", value: "7.4" },
    ],
    facts: [
      { label: "Address", value: "1947 Fern St" },
      { label: "Hours", value: "8:00 AM – 7:00 PM" },
      { label: "Price", value: "$$$" },
      { label: "Parking", value: "Lot · shared with market" },
      { label: "Wi-Fi", value: "Yes · patio is spotty" },
      { label: "Outdoor seating", value: "Garden patio" },
      { label: "Best time", value: "Golden hour" },
      { label: "Crowd now", value: "Lively" },
    ],
    bestTimes: [
      { label: "8a", height: 20 },
      { label: "10a", height: 28 },
      { label: "12p", height: 36 },
      { label: "2p", height: 32 },
      { label: "4p", height: 40, highlight: true },
      { label: "5p", height: 46, highlight: true },
      { label: "6p", height: 38 },
      { label: "7p", height: 26 },
    ],
    similar: [
      { id: "mostra", name: "Mostra Coffee", meta: "Photos · 0.3 mi", tone: "terracotta" },
      { id: "marigold", name: "Marigold & Oak", meta: "Quiet · 0.5 mi", tone: "latte" },
      { id: "hearth", name: "Hearth Supply Co.", meta: "Late · 0.8 mi", tone: "latte" },
    ],
  },
  hearth: {
    // Limited-data reference cafe: sparse facts, no editorial sections,
    // no photos yet - exercises the "still learning" notice organically.
    id: "hearth",
    status: "Open",
    statusMeta: "Open late",
    photoTones: [],
    photoTotal: 0,
    detailScores: [
      { label: "Parking", value: "8.0" },
      { label: "Coffee", value: "7.9" },
      { label: "Work", value: "7.8" },
    ],
    facts: [
      { label: "Address", value: "4696 Park Blvd" },
      { label: "Hours", value: "7:00 AM – 10:00 PM" },
      { label: "Price", value: "$" },
      { label: "Parking", value: "Dedicated lot behind building" },
    ],
    bestTimes: [],
    similar: [],
    limited: true,
  },
};

export function getCafeDetail(id: string): CafeDetail | undefined {
  return cafeDetails[id];
}
