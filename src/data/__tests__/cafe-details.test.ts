import { getCafeDetail, scoreTone } from "@/data/cafe-details";
import { cafeMapPins } from "@/data/map-pins";

describe("scoreTone", () => {
  it("maps scores to the design thresholds", () => {
    expect(scoreTone("9.1")).toBe("great");
    expect(scoreTone("8.5")).toBe("great");
    expect(scoreTone("7.2")).toBe("good");
    expect(scoreTone("7.0")).toBe("good");
    expect(scoreTone("6.5")).toBe("crowded");
  });
});

describe("cafe detail fixtures", () => {
  it("renders the Mostra reference scores from the acceptance criteria", () => {
    const mostra = getCafeDetail("mostra");

    expect(mostra?.detailScores).toEqual([
      { label: "Aesthetic", value: "9.1" },
      { label: "Coffee", value: "8.8" },
      { label: "Work", value: "6.5" },
      { label: "Quiet", value: "7.2" },
    ]);
    expect(mostra?.facts).toHaveLength(8);
    expect(mostra?.similar).toHaveLength(3);
    expect(mostra?.bestTimes).toHaveLength(8);
  });

  it("has a detail record for every map pin", () => {
    for (const pin of cafeMapPins) {
      expect(getCafeDetail(pin.id)).toBeTruthy();
    }
  });

  it("marks the limited-data cafe with sparse content and no photos", () => {
    const hearth = getCafeDetail("hearth");

    expect(hearth?.limited).toBe(true);
    expect(hearth?.photoTones).toHaveLength(0);
    expect(hearth?.bestTimes).toHaveLength(0);
    expect(hearth?.similar).toHaveLength(0);
  });

  it("returns undefined for unknown cafes", () => {
    expect(getCafeDetail("unknown-cafe")).toBeUndefined();
  });

  it("keeps similar-cafe links resolvable to real pins", () => {
    for (const pin of cafeMapPins) {
      for (const similar of getCafeDetail(pin.id)?.similar ?? []) {
        expect(cafeMapPins.some((candidate) => candidate.id === similar.id)).toBe(
          true,
        );
      }
    }
  });
});
