import {
  DEFAULT_WORK_INPUTS,
  WORK_NEEDS,
  findWorkSpots,
  sessionSentence,
} from "@/data/work-planner";
import type { WorkSessionInputs } from "@/data/work-planner";

function inputs(overrides: Partial<WorkSessionInputs> = {}): WorkSessionInputs {
  return { ...DEFAULT_WORK_INPUTS, ...overrides };
}

describe("work planner options", () => {
  it("exposes the planning.md constraint set", () => {
    expect(WORK_NEEDS).toEqual(["Wi-Fi", "Outlets", "Very quiet", "Parking"]);
  });
});

describe("sessionSentence", () => {
  it("speaks the work window without minutes", () => {
    expect(sessionSentence(inputs())).toBe(
      '"I need to work from 9 AM to 12 PM."',
    );
    expect(sessionSentence(inputs({ start: "10:00 AM", end: "3:00 PM" }))).toBe(
      '"I need to work from 10 AM to 3 PM."',
    );
  });
});

describe("findWorkSpots", () => {
  it("ranks the parking-friendly spot first under the default needs", () => {
    const plan = findWorkSpots(inputs());

    expect(plan.results).toHaveLength(3);
    expect(plan.results[0].cafeId).toBe("hearth");
    expect(plan.bestReason).toBe(
      "Best overall: Hearth Supply Co. — easiest parking, big tables, steady Wi-Fi.",
    );
  });

  it("promotes the quiet work cafe when parking is dropped", () => {
    const plan = findWorkSpots(inputs({ needs: ["Wi-Fi", "Outlets"] }));

    expect(plan.results[0].cafeId).toBe("marigold");
    expect(plan.bestReason).toContain("Marigold & Oak");
  });

  it("ranks by quietness when very quiet is the only need", () => {
    const plan = findWorkSpots(inputs({ needs: ["Very quiet"] }));

    expect(plan.results.map((result) => result.cafeId)).toEqual([
      "marigold",
      "hearth",
      "mostra",
    ]);
  });

  it("carries confidence stats, work score, and an arrival/parking tip per card", () => {
    const plan = findWorkSpots(inputs());
    const marigold = plan.results.find((result) => result.cafeId === "marigold");

    expect(marigold?.workScore).toBe("8.7");
    expect(marigold?.stats.map((stat) => stat.label)).toEqual([
      "Wi-Fi",
      "Outlets",
      "Noise",
    ]);
    expect(marigold?.tip).toContain("Arrive before 10 AM");

    const mostra = plan.results.find((result) => result.cafeId === "mostra");
    expect(mostra?.stats.some((stat) => stat.level === "caution")).toBe(true);
  });
});
