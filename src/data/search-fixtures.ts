export type SearchResult = {
  id: string;
  name: string;
  meta: string;
  score: string;
  tags: string[];
  reason: string;
  tone: "terracotta" | "latte" | "olive";
  // Real coordinates so the search mini-map renders live markers (US-035),
  // the same geography the map home and directions use.
  latitude: number;
  longitude: number;
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

// Cold-cache / demo fallback: the curated San Diego cafes (ids and coordinates
// match `cafeMapPins`). When the map's live OSM cache is warm, `searchCafes`
// (utils/cafe-search) ranks the real nearby cafes instead — see US-035.
export const searchResults: SearchResult[] = [
  {
    id: "marigold",
    name: "Marigold & Oak",
    meta: "0.5 mi · North Park · Open until 6pm",
    score: "8.9",
    tags: ["Quiet", "Work", "Parking"],
    reason: "Quiet after 2pm, easy street parking on 30th, and tables near outlets.",
    tone: "latte",
    latitude: 32.7504,
    longitude: -117.1355,
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
    score: "7.8",
    tags: ["Work", "Parking", "Outlets"],
    reason: "Dedicated parking, corner tables, and a calmer room for longer sessions.",
    tone: "latte",
    latitude: 32.751,
    longitude: -117.1385,
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
    score: "9.1",
    tags: ["Aesthetic", "Specialty Coffee", "Good Latte"],
    reason: "Cozy interior, warm light, and latte quality make it a strong photo stop.",
    tone: "terracotta",
    latitude: 32.75,
    longitude: -117.13,
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
    score: "8.4",
    tags: ["Outdoor", "Date", "Aesthetic"],
    reason: "Plant-filled patio seating and softer crowd energy fit casual dates.",
    tone: "olive",
    latitude: 32.7494,
    longitude: -117.1245,
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

function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .map((token) => token.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);
}

// Token match over a result set. Shared by the fixture matcher and the live
// search (utils/cafe-search) so both rank identically. An empty query returns
// the first two results (the "nearby" default the search screen opens on).
export function filterSearchResults(
  results: SearchResult[],
  query: string,
): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return results.slice(0, 2);
  }

  const tokens = tokenize(normalizedQuery);

  return results.filter((result) => {
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

export function findSearchResults(query: string): SearchResult[] {
  return filterSearchResults(searchResults, query);
}
