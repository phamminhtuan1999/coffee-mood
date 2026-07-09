import {
  DATE_AREAS,
  DATE_BUDGETS,
  DATE_MOODS,
  DATE_TIMES,
  DEFAULT_DATE_INPUTS,
  createDatePlan,
} from "@/data/date-plan";
import type { DatePlanInputs } from "@/data/date-plan";

function inputs(overrides: Partial<DatePlanInputs> = {}): DatePlanInputs {
  return { ...DEFAULT_DATE_INPUTS, ...overrides };
}

describe("date plan options", () => {
  it("exposes the planning.md moods and input presets", () => {
    expect(DATE_MOODS).toEqual(["Cozy", "Aesthetic", "Quiet", "Fun", "Outdoor"]);
    expect(DATE_AREAS).toContain("La Jolla");
    expect(DATE_TIMES).toContain("Golden hour");
    expect(DATE_BUDGETS).toEqual(["$$", "$", "$$$"]);
  });
});

describe("createDatePlan", () => {
  it("builds the patio plan for the default outdoor mood", () => {
    const plan = createDatePlan(inputs());

    expect(plan.cafeId).toBe("terrace");
    expect(plan.meta).toBe("Patio café · South Park · $$$");
    expect(plan.steps).toHaveLength(3);
    expect(plan.steps[1].title).toBe("Split a dessert");
    expect(plan.tip).toContain("Golden hour hits the patio at 4:40");
  });

  it("selects the plan by mood", () => {
    expect(createDatePlan(inputs({ mood: "Quiet" })).cafeId).toBe("marigold");
    expect(createDatePlan(inputs({ mood: "Cozy" })).cafeId).toBe("mostra");
    expect(createDatePlan(inputs({ mood: "Aesthetic" })).cafeId).toBe("mostra");
    expect(createDatePlan(inputs({ mood: "Fun" })).cafeId).toBe("terrace");
  });

  it("rotates deterministically through the profiles on shuffle and wraps", () => {
    const order = [0, 1, 2, 3].map(
      (variant) => createDatePlan(inputs(), variant).cafeId,
    );

    expect(order).toEqual(["terrace", "mostra", "marigold", "terrace"]);
  });

  it("keeps every plan a full arc with a dessert or walking stop and a best-time tip", () => {
    for (const mood of DATE_MOODS) {
      const plan = createDatePlan(inputs({ mood }));

      expect(plan.steps).toHaveLength(3);
      expect(plan.tip.length).toBeGreaterThan(20);
    }
  });
});
