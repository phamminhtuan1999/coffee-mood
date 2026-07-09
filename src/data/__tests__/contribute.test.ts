import {
  CLIP_NOTE_PLACEHOLDER,
  CLIP_TAGS,
  VIBE_QUESTIONS,
  isReportComplete,
} from "@/data/contribute";

describe("vibe report questions", () => {
  it("matches the planning.md question set and option wording", () => {
    expect(VIBE_QUESTIONS.map((question) => question.id)).toEqual([
      "noise",
      "work",
      "wifi",
      "photo",
      "crowd",
    ]);

    const byId = Object.fromEntries(
      VIBE_QUESTIONS.map((question) => [question.id, question.options]),
    );

    expect(byId.noise).toEqual(["Quiet", "Medium", "Loud"]);
    expect(byId.work).toEqual(["Bad", "Okay", "Great"]);
    expect(byId.wifi).toEqual(["Unknown", "Good", "Bad"]);
    expect(byId.photo).toEqual(["Not really", "Nice", "Very aesthetic"]);
    expect(byId.crowd).toEqual(["Empty", "Comfortable", "Crowded"]);
  });
});

describe("isReportComplete", () => {
  it("requires an answer to all five questions", () => {
    expect(isReportComplete({})).toBe(false);
    expect(
      isReportComplete({ noise: "Quiet", work: "Great", wifi: "Good" }),
    ).toBe(false);
    expect(
      isReportComplete({
        noise: "Quiet",
        work: "Great",
        wifi: "Good",
        photo: "Nice",
        crowd: "Comfortable",
      }),
    ).toBe(true);
  });
});

describe("vibe clip options", () => {
  it("matches the planning.md tag set and the F2 placeholder copy", () => {
    expect(CLIP_TAGS).toEqual([
      "Cozy",
      "Bright",
      "Quiet",
      "Crowded",
      "Laptop-friendly",
      "Outdoor",
      "Date spot",
    ]);
    expect(CLIP_NOTE_PLACEHOLDER).toBe(
      "Morning light through the front windows…",
    );
  });
});
