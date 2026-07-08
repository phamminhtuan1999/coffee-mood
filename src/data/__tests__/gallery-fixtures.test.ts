import {
  galleryTabs,
  getCafeGallery,
  isGalleryTab,
  photoVibeTags,
  photosForTab,
  splitMasonryColumns,
} from "@/data/gallery-fixtures";
import { cafeMapPins } from "@/data/map-pins";

describe("gallery fixtures", () => {
  it("keeps every photo on a valid tab with a valid vibe tag", () => {
    for (const pin of cafeMapPins) {
      const gallery = getCafeGallery(pin.id);

      expect(gallery).toBeTruthy();

      for (const photo of gallery?.photos ?? []) {
        expect(galleryTabs).toContain(photo.tab);
        expect(photoVibeTags).toContain(photo.tag);
        expect(photo.height).toBeGreaterThan(0);
        expect(photo.caption.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps photo ids unique per cafe", () => {
    for (const pin of cafeMapPins) {
      const photos = getCafeGallery(pin.id)?.photos ?? [];
      const ids = new Set(photos.map((photo) => photo.id));

      expect(ids.size).toBe(photos.length);
    }
  });

  it("covers all six vibe tabs for the Mostra reference gallery", () => {
    const gallery = getCafeGallery("mostra");

    expect(gallery).toBeTruthy();

    for (const tab of galleryTabs) {
      expect(photosForTab(gallery!, tab).length).toBeGreaterThan(0);
    }
  });

  it("keeps the limited-data cafe without gallery content", () => {
    const hearth = getCafeGallery("hearth");

    expect(hearth?.photos).toHaveLength(0);
    expect(hearth?.photoCount).toBe(0);
  });

  it("filters photos by tab", () => {
    const gallery = getCafeGallery("mostra")!;
    const outdoor = photosForTab(gallery, "Outdoor");

    expect(outdoor.length).toBeGreaterThan(0);
    expect(outdoor.every((photo) => photo.tab === "Outdoor")).toBe(true);
  });

  it("guards tab parsing", () => {
    expect(isGalleryTab("Outdoor")).toBe(true);
    expect(isGalleryTab("Rooftop")).toBe(false);
    expect(isGalleryTab(undefined)).toBe(false);
  });
});

describe("splitMasonryColumns", () => {
  it("appends each photo to the shorter column", () => {
    const gallery = getCafeGallery("mostra")!;
    const photos = photosForTab(gallery, "Interior");
    const [left, right] = splitMasonryColumns(photos);

    expect(left.length + right.length).toBe(photos.length);

    const leftHeight = left.reduce((sum, photo) => sum + photo.height, 0);
    const rightHeight = right.reduce((sum, photo) => sum + photo.height, 0);
    const tallest = Math.max(...photos.map((photo) => photo.height));

    expect(Math.abs(leftHeight - rightHeight)).toBeLessThanOrEqual(tallest);
  });

  it("handles empty input", () => {
    expect(splitMasonryColumns([])).toEqual([[], []]);
  });
});
