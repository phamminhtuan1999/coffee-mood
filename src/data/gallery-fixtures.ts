import type { CafeMapPinTone } from "@/data/map-pins";

export const galleryTabs = [
  "Interior",
  "Drinks",
  "Seating",
  "Outdoor",
  "Work Setup",
  "Date Vibe",
] as const;

export type GalleryTab = (typeof galleryTabs)[number];

export const photoVibeTags = [
  "Cozy",
  "Bright",
  "Crowded",
  "Laptop-friendly",
  "Aesthetic",
  "Outdoor",
] as const;

export type PhotoVibeTag = (typeof photoVibeTags)[number];

export type GalleryPhoto = {
  id: string;
  tab: GalleryTab;
  tag: PhotoVibeTag;
  tone: CafeMapPinTone;
  height: number;
  caption: string;
};

export type CafeGallery = {
  cafeId: string;
  photoCount: number;
  clipCount: number;
  photos: GalleryPhoto[];
};

export function isGalleryTab(value: unknown): value is GalleryTab {
  return galleryTabs.includes(value as GalleryTab);
}

const mostraPhotos: GalleryPhoto[] = [
  { id: "mostra-int-1", tab: "Interior", tag: "Cozy", tone: "terracotta", height: 180, caption: "Warm wood counter at golden hour" },
  { id: "mostra-int-2", tab: "Interior", tag: "Bright", tone: "latte", height: 130, caption: "Window light over the espresso bar" },
  { id: "mostra-int-3", tab: "Interior", tag: "Aesthetic", tone: "olive", height: 210, caption: "Plant corner by the record shelf" },
  { id: "mostra-int-4", tab: "Interior", tag: "Crowded", tone: "terracotta", height: 150, caption: "Saturday mid-morning rush" },
  { id: "mostra-int-5", tab: "Interior", tag: "Cozy", tone: "latte", height: 120, caption: "Reading nook by the back wall" },
  { id: "mostra-drink-1", tab: "Drinks", tag: "Aesthetic", tone: "terracotta", height: 190, caption: "Horchata latte with cinnamon dust" },
  { id: "mostra-drink-2", tab: "Drinks", tag: "Bright", tone: "latte", height: 140, caption: "Pour-over flight on the tasting bar" },
  { id: "mostra-drink-3", tab: "Drinks", tag: "Cozy", tone: "olive", height: 170, caption: "Matcha and a pastry for two" },
  { id: "mostra-seat-1", tab: "Seating", tag: "Laptop-friendly", tone: "latte", height: 160, caption: "Long communal table with outlets" },
  { id: "mostra-seat-2", tab: "Seating", tag: "Cozy", tone: "terracotta", height: 200, caption: "Leather bench under the mural" },
  { id: "mostra-seat-3", tab: "Seating", tag: "Crowded", tone: "olive", height: 130, caption: "Bar seating during peak hours" },
  { id: "mostra-out-1", tab: "Outdoor", tag: "Outdoor", tone: "olive", height: 180, caption: "Sidewalk tables on University Ave" },
  { id: "mostra-out-2", tab: "Outdoor", tag: "Bright", tone: "latte", height: 140, caption: "Morning sun on the patio rail" },
  { id: "mostra-work-1", tab: "Work Setup", tag: "Laptop-friendly", tone: "latte", height: 190, caption: "Corner desk with a wall outlet" },
  { id: "mostra-work-2", tab: "Work Setup", tag: "Bright", tone: "terracotta", height: 150, caption: "Quiet weekday laptop row" },
  { id: "mostra-date-1", tab: "Date Vibe", tag: "Cozy", tone: "terracotta", height: 210, caption: "Two-top by the candle shelf" },
  { id: "mostra-date-2", tab: "Date Vibe", tag: "Aesthetic", tone: "olive", height: 160, caption: "Golden-hour corner for two" },
];

const marigoldPhotos: GalleryPhoto[] = [
  { id: "marigold-int-1", tab: "Interior", tag: "Cozy", tone: "latte", height: 170, caption: "Soft tables and low music" },
  { id: "marigold-seat-1", tab: "Seating", tag: "Laptop-friendly", tone: "latte", height: 190, caption: "Outlet row along the north wall" },
  { id: "marigold-work-1", tab: "Work Setup", tag: "Laptop-friendly", tone: "olive", height: 150, caption: "Afternoon focus corner" },
  { id: "marigold-drink-1", tab: "Drinks", tag: "Bright", tone: "terracotta", height: 140, caption: "Cortado on the pickup counter" },
];

const terracePhotos: GalleryPhoto[] = [
  { id: "terrace-out-1", tab: "Outdoor", tag: "Outdoor", tone: "olive", height: 200, caption: "Garden patio under string lights" },
  { id: "terrace-out-2", tab: "Outdoor", tag: "Aesthetic", tone: "terracotta", height: 150, caption: "Golden hour between the planters" },
  { id: "terrace-date-1", tab: "Date Vibe", tag: "Cozy", tone: "olive", height: 180, caption: "Corner table for slow evenings" },
  { id: "terrace-drink-1", tab: "Drinks", tag: "Bright", tone: "latte", height: 130, caption: "Matcha spritz on the garden bar" },
];

const cafeGalleries: Record<string, CafeGallery> = {
  mostra: {
    cafeId: "mostra",
    photoCount: 128,
    clipCount: 14,
    photos: mostraPhotos,
  },
  marigold: {
    cafeId: "marigold",
    photoCount: 42,
    clipCount: 5,
    photos: marigoldPhotos,
  },
  terrace: {
    cafeId: "terrace",
    photoCount: 36,
    clipCount: 8,
    photos: terracePhotos,
  },
  // Hearth is the limited-data cafe: no gallery content yet.
  hearth: {
    cafeId: "hearth",
    photoCount: 0,
    clipCount: 0,
    photos: [],
  },
};

export function getCafeGallery(cafeId: string): CafeGallery | undefined {
  return cafeGalleries[cafeId];
}

export function photosForTab(
  gallery: CafeGallery,
  tab: GalleryTab,
): GalleryPhoto[] {
  return gallery.photos.filter((photo) => photo.tab === tab);
}

// Distributes photos across two masonry columns, always appending to the
// currently shorter column so the layout stays balanced.
export function splitMasonryColumns(
  photos: GalleryPhoto[],
): [GalleryPhoto[], GalleryPhoto[]] {
  const columns: [GalleryPhoto[], GalleryPhoto[]] = [[], []];
  const heights = [0, 0];

  for (const photo of photos) {
    const target = heights[0] <= heights[1] ? 0 : 1;

    columns[target].push(photo);
    heights[target] += photo.height;
  }

  return columns;
}
