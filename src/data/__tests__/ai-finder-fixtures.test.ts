import { aiCafes, runAiFinder } from "@/data/ai-finder-fixtures";
import type { TasteProfile } from "@/utils/taste-profile";

const workProfile: TasteProfile = {
  cafeTypes: ["Work / Study", "Quiet"],
  priorities: ["Outlets", "Parking"],
  distance: "10 min",
  price: "$$",
  skipped: false,
  updatedAt: "2026-07-07T00:00:00.000Z",
};

function expectMatch(result: ReturnType<typeof runAiFinder>, id: string) {
  expect(result.status).toBe("match");
  if (result.status === "match") {
    expect(result.match.id).toBe(id);
  }
}

describe("runAiFinder", () => {
  it("returns the reference best match for an empty prompt", () => {
    expectMatch(runAiFinder(""), "mostra");
  });

  it("ranks the quiet work cafe for a work-and-parking prompt", () => {
    expectMatch(
      runAiFinder("I need a quiet cafe to work for 3 hours with parking"),
      "marigold",
    );
  });

  it("ranks Mostra for photo and latte prompts", () => {
    expectMatch(runAiFinder("aesthetic photos and a good latte"), "mostra");
  });

  it("ranks the patio cafe for date prompts", () => {
    expectMatch(runAiFinder("cute outdoor date spot"), "terrace");
  });

  it("ranks the late-night cafe for open-late prompts", () => {
    expectMatch(runAiFinder("somewhere open late tonight"), "hearth");
  });

  it("resolves every suggestion chip to a deterministic cafe", () => {
    expectMatch(runAiFinder("Quiet work spot"), "marigold");
    expectMatch(runAiFinder("Cute date cafe"), "terrace");
    expectMatch(runAiFinder("Aesthetic photos"), "mostra");
    expectMatch(runAiFinder("Good latte"), "mostra");
    expectMatch(runAiFinder("Open late"), "hearth");
    expectMatch(runAiFinder("Outdoor chill"), "terrace");
  });

  it("boosts cafes matching the taste profile on vague prompts", () => {
    expectMatch(runAiFinder("somewhere nice nearby", workProfile), "marigold");
  });

  it("returns unavailable for the reserved provider-failure prompt", () => {
    expect(runAiFinder("coffee break").status).toBe("unavailable");
  });
});

describe("ai cafe fixtures", () => {
  it("gives every cafe three why-bullets and three alternatives with better-for labels", () => {
    for (const cafe of aiCafes) {
      expect(cafe.whyItMatches).toHaveLength(3);
      expect(cafe.alternatives).toHaveLength(3);

      for (const alternative of cafe.alternatives) {
        expect(alternative.betterFor).toMatch(/^Better for /);
      }
    }
  });

  it("orders fixtures by descending base score so ties resolve to the stronger cafe", () => {
    const scores = aiCafes.map((cafe) => cafe.baseScore);
    const sorted = [...scores].sort((a, b) => b - a);

    expect(scores).toEqual(sorted);
  });
});
