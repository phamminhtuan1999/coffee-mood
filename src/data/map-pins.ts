import type { FilterNeed, FilterTreat } from "@/utils/map-filters";
import type { PricePreference } from "@/utils/taste-profile";

export type CafeMapPinTone = "terracotta" | "latte" | "olive";

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapRegion = MapCoordinate & {
  latitudeDelta: number;
  longitudeDelta: number;
};

export type CafeMapPin = {
  id: string;
  name: string;
  meta: string;
  score: string;
  tags: string[];
  scores: { label: string; value: string }[];
  summary: string;
  tone: CafeMapPinTone;
  vibe: string;
  photoCount: number;
  whyItMatches: string[];
  peopleLove: string[];
  watchOutFor: string[];
  walkMinutes: number;
  needs: FilterNeed[];
  moodScores: { aesthetic: number; work: number; noise: number };
  price: PricePreference;
  treats: FilterTreat[];
  saved?: boolean;
  latitude: number;
  longitude: number;
};

export const cafeMapPins: CafeMapPin[] = [
  {
    id: "mostra",
    name: "Mostra Coffee",
    meta: "North Park · 0.3 mi",
    score: "9.1",
    tags: ["Aesthetic", "Specialty Coffee", "Good Latte"],
    scores: [
      { label: "Aesthetic", value: "9.1" },
      { label: "Coffee", value: "8.8" },
      { label: "Work", value: "6.5" },
    ],
    summary:
      "Great coffee and cozy interior. Better for casual hangout or photos than long work sessions.",
    tone: "terracotta",
    vibe: "Cozy corner cafe for slow mornings",
    photoCount: 24,
    whyItMatches: [
      "Aesthetic score is high enough for photo-focused cafe hopping.",
      "Specialty coffee and good latte tags match your taste profile.",
      "North Park distance keeps it easy for a short morning stop.",
    ],
    peopleLove: ["Horchata latte", "Window light", "Cozy interior"],
    watchOutFor: ["Limited outlets", "Busy after 10am"],
    walkMinutes: 6,
    needs: ["Open now"],
    moodScores: { aesthetic: 9.1, work: 6.5, noise: 6 },
    price: "$$",
    treats: ["Specialty coffee", "Dessert"],
    latitude: 32.75,
    longitude: -117.13,
  },
  {
    id: "marigold",
    name: "Marigold & Oak",
    meta: "North Park · 0.5 mi",
    score: "8.9",
    tags: ["Quiet", "Work", "Open Now"],
    scores: [
      { label: "Quiet", value: "8.9" },
      { label: "Coffee", value: "8.4" },
      { label: "Work", value: "8.7" },
    ],
    summary:
      "Soft tables, lower music, and reliable outlets make this a stronger work pick.",
    tone: "latte",
    vibe: "Quiet work cafe with soft tables",
    photoCount: 18,
    whyItMatches: [
      "Quiet and Work tags match focused sessions.",
      "Open Now keeps it available for immediate planning.",
      "Lower crowd energy makes it better for laptop time.",
    ],
    peopleLove: ["Reliable outlets", "Low music", "Long tables"],
    watchOutFor: ["Less photogenic", "Small pastry case"],
    walkMinutes: 10,
    needs: ["Open now", "Wi-Fi", "Outlets"],
    moodScores: { aesthetic: 6.4, work: 8.7, noise: 3 },
    price: "$$",
    treats: [],
    latitude: 32.7504,
    longitude: -117.1355,
  },
  {
    id: "terrace",
    name: "Terrace & Thistle",
    meta: "South Park · 0.7 mi",
    score: "8.4",
    tags: ["Outdoor", "Date", "Open Now"],
    scores: [
      { label: "Outdoor", value: "8.6" },
      { label: "Coffee", value: "8.1" },
      { label: "Date", value: "8.4" },
    ],
    summary:
      "Plant-filled patio seating and a warm afternoon crowd fit outdoor hangs.",
    tone: "olive",
    vibe: "Plant-filled patio for outdoor hangs",
    photoCount: 16,
    whyItMatches: [
      "Outdoor and Date tags fit social cafe plans.",
      "Patio seating gives more breathing room on warm days.",
      "A softer crowd makes it better for slow conversations.",
    ],
    peopleLove: ["Patio plants", "Golden hour", "Date vibe"],
    watchOutFor: ["Weather dependent", "Limited shade"],
    walkMinutes: 14,
    needs: ["Open now", "Outdoor seating", "Good for groups"],
    moodScores: { aesthetic: 8.2, work: 5.5, noise: 5 },
    price: "$$$",
    treats: ["Matcha", "Good for dates"],
    latitude: 32.7494,
    longitude: -117.1245,
  },
  {
    id: "hearth",
    name: "Hearth Supply Co.",
    meta: "University Heights · 0.8 mi",
    score: "7.8",
    tags: ["Work", "Parking"],
    scores: [
      { label: "Parking", value: "8.0" },
      { label: "Coffee", value: "7.9" },
      { label: "Work", value: "7.8" },
    ],
    summary:
      "Easier parking and long tables make this practical for focused mornings.",
    tone: "latte",
    vibe: "Practical work stop with easier parking",
    photoCount: 12,
    whyItMatches: [
      "Parking and Work tags make it useful for task-driven visits.",
      "Long tables support longer focus blocks.",
      "University Heights placement expands the map beyond North Park.",
    ],
    peopleLove: ["Street parking", "Big tables", "Calm mornings"],
    watchOutFor: ["Lower aesthetic score", "Fills up at lunch"],
    walkMinutes: 16,
    needs: ["Parking", "Late night", "Outlets", "Wi-Fi"],
    moodScores: { aesthetic: 5.8, work: 7.8, noise: 4 },
    price: "$",
    treats: [],
    latitude: 32.751,
    longitude: -117.1385,
  },
];

// The "+3 more" cluster pin sits just past Hearth toward University Heights.
export const CLUSTER_PIN_COORDINATE: MapCoordinate = {
  latitude: 32.7514,
  longitude: -117.1235,
};

const REGION_PADDING = 1.5;
const MIN_LATITUDE_DELTA = 0.04;
const MIN_LONGITUDE_DELTA = 0.02;
// The half-height preview sheet covers the lower part of the screen, so the
// camera center is biased south of the pin centroid: pins then render in the
// visible band between the vibe chips and the sheet.
const SHEET_LATITUDE_BIAS = 0.22;

function computeMapHomeRegion(): MapRegion {
  const latitudes = [
    ...cafeMapPins.map((cafe) => cafe.latitude),
    CLUSTER_PIN_COORDINATE.latitude,
  ];
  const longitudes = [
    ...cafeMapPins.map((cafe) => cafe.longitude),
    CLUSTER_PIN_COORDINATE.longitude,
  ];
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  const latitudeDelta = Math.max(
    (maxLatitude - minLatitude) * REGION_PADDING,
    MIN_LATITUDE_DELTA,
  );

  return {
    latitude:
      (minLatitude + maxLatitude) / 2 - latitudeDelta * SHEET_LATITUDE_BIAS,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta,
    longitudeDelta: Math.max(
      (maxLongitude - minLongitude) * REGION_PADDING,
      MIN_LONGITUDE_DELTA,
    ),
  };
}

// Initial camera for the map home; the current-location FAB re-centers here.
export const MAP_HOME_REGION: MapRegion = computeMapHomeRegion();
