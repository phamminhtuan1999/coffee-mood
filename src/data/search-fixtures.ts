export type SearchResult = {
  id: string;
  name: string;
  meta: string;
  distance: string;
  score: string;
  tags: string[];
  reason: string;
  tone: "terracotta" | "latte" | "olive";
  mapPosition: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  keywords: string[];
};

export const recentSearches = [
  "quiet cafe with parking",
  "North Park work cafe",
  "aesthetic latte",
] as const;

export const suggestedSearches = [
  "quiet cafe with parking",
  "cute matcha place",
  "work cafe open late",
  "date spot near La Jolla",
] as const;

export const searchResults: SearchResult[] = [
  {
    id: "marigold",
    name: "Marigold & Oak",
    meta: "0.5 mi · North Park · Open until 6pm",
    distance: "0.5 mi",
    score: "8.9",
    tags: ["Quiet", "Work", "Parking"],
    reason: "Quiet after 2pm, easy street parking on 30th, and tables near outlets.",
    tone: "latte",
    mapPosition: { top: 26, left: 80 },
    keywords: [
      "quiet",
      "work",
      "parking",
      "north park",
      "cafe",
      "outlets",
      "late",
    ],
  },
  {
    id: "hearth",
    name: "Hearth Supply Co.",
    meta: "0.8 mi · University Heights · Open late",
    distance: "0.8 mi",
    score: "7.8",
    tags: ["Work", "Parking", "Outlets"],
    reason: "Dedicated parking, corner tables, and a calmer room for longer sessions.",
    tone: "latte",
    mapPosition: { top: 50, right: 86 },
    keywords: [
      "work",
      "parking",
      "outlets",
      "open late",
      "late",
      "quiet",
      "study",
    ],
  },
  {
    id: "mostra",
    name: "Mostra Coffee",
    meta: "0.3 mi · North Park · Specialty coffee",
    distance: "0.3 mi",
    score: "9.1",
    tags: ["Aesthetic", "Specialty Coffee", "Good Latte"],
    reason: "Cozy interior, warm light, and latte quality make it a strong photo stop.",
    tone: "terracotta",
    mapPosition: { top: 30, left: 164 },
    keywords: [
      "cute",
      "aesthetic",
      "latte",
      "coffee",
      "photos",
      "photo",
      "specialty",
      "north park",
    ],
  },
  {
    id: "terrace",
    name: "Terrace & Thistle",
    meta: "0.7 mi · South Park · Patio seating",
    distance: "0.7 mi",
    score: "8.4",
    tags: ["Outdoor", "Date", "Aesthetic"],
    reason: "Plant-filled patio seating and softer crowd energy fit casual dates.",
    tone: "olive",
    mapPosition: { bottom: 18, right: 132 },
    keywords: [
      "date",
      "outdoor",
      "patio",
      "aesthetic",
      "cute",
      "la jolla",
      "photos",
    ],
  },
];

export function findSearchResults(query: string): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return searchResults.slice(0, 2);
  }

  const tokens = normalizedQuery
    .split(/\s+/)
    .map((token) => token.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

  return searchResults.filter((result) => {
    const searchable = [
      result.name,
      result.meta,
      result.reason,
      result.tags.join(" "),
      result.keywords.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return tokens.some((token) => searchable.includes(token));
  });
}
