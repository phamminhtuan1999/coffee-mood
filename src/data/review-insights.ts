export type ReviewInsightItem = {
  label: string;
  pct: number;
};

export type ReviewInsight = {
  cafeId: string;
  reviewCount: number;
  updatedNote: string;
  love: ReviewInsightItem[];
  complaints: ReviewInsightItem[];
  bestFor: string[];
  notIdealFor: string[];
  shortVersion: string;
};

const reviewInsights: Record<string, ReviewInsight> = {
  mostra: {
    cafeId: "mostra",
    reviewCount: 480,
    updatedNote: "updated this week",
    love: [
      { label: "Latte quality", pct: 92 },
      { label: "Interior design", pct: 88 },
      { label: "Friendly staff", pct: 81 },
    ],
    complaints: [
      { label: "Parking", pct: 46 },
      { label: "Crowded weekends", pct: 38 },
      { label: "Limited outlets", pct: 24 },
    ],
    bestFor: ["Quick coffee", "Casual meetup", "Photos"],
    notIdealFor: ["Long work sessions", "Large groups"],
    shortVersion:
      "Come for the latte and the light. Weekday mornings are calm; weekends get lively by 10. Park a block east on Ray St.",
  },
  marigold: {
    cafeId: "marigold",
    reviewCount: 214,
    updatedNote: "updated this week",
    love: [
      { label: "Outlet access", pct: 89 },
      { label: "Weekday quiet", pct: 84 },
      { label: "Oat flat white", pct: 78 },
    ],
    complaints: [
      { label: "Limited seating", pct: 41 },
      { label: "Early weekend close", pct: 33 },
      { label: "Small food menu", pct: 22 },
    ],
    bestFor: ["Deep work", "Solo study", "Long stays"],
    notIdealFor: ["Big groups", "Lively catch-ups"],
    shortVersion:
      "A focus room with good coffee. Claim the outlet row before 9 and the morning stays yours; weekends wind down early.",
  },
  terrace: {
    cafeId: "terrace",
    reviewCount: 356,
    updatedNote: "updated this week",
    love: [
      { label: "Garden patio", pct: 90 },
      { label: "Matcha menu", pct: 82 },
      { label: "Golden-hour light", pct: 79 },
    ],
    complaints: [
      { label: "Weekend waits", pct: 44 },
      { label: "Limited indoor seating", pct: 29 },
      { label: "No outlets outside", pct: 21 },
    ],
    bestFor: ["Date nights", "Golden hour", "Group hangs"],
    notIdealFor: ["Laptop work"],
    shortVersion:
      "Sit under the string lights and order the matcha spritz. Weekends fill by late afternoon — come early or pick a weekday.",
  },
  // Hearth is the limited-data cafe: no review summary yet.
};

export function getReviewInsight(cafeId: string): ReviewInsight | undefined {
  return reviewInsights[cafeId];
}
