// Contribute data layer (Section F): the check-in vibe report questions and
// the add-vibe-clip options. Submissions are ephemeral client state - the
// pipeline that feeds vibe scores and confidence, plus media capture/upload/
// storage/moderation, is deferred per decision 0018.

export type VibeQuestionId = "noise" | "work" | "wifi" | "photo" | "crowd";

export type VibeQuestion = {
  id: VibeQuestionId;
  label: string;
  options: [string, string, string];
};

// Question set and option wording per docs/product/planning.md.
export const VIBE_QUESTIONS: VibeQuestion[] = [
  { id: "noise", label: "Noise", options: ["Quiet", "Medium", "Loud"] },
  { id: "work", label: "Work-friendly", options: ["Bad", "Okay", "Great"] },
  { id: "wifi", label: "Wi-Fi", options: ["Unknown", "Good", "Bad"] },
  {
    id: "photo",
    label: "Photo vibe",
    options: ["Not really", "Nice", "Very aesthetic"],
  },
  {
    id: "crowd",
    label: "Crowd",
    options: ["Empty", "Comfortable", "Crowded"],
  },
];

export type VibeAnswers = Partial<Record<VibeQuestionId, string>>;

export function isReportComplete(answers: VibeAnswers): boolean {
  return VIBE_QUESTIONS.every((question) => Boolean(answers[question.id]));
}

export const CHECK_IN_SUBTITLE = "30 seconds — helps everyone find their spot.";
export const CHECK_IN_THANKS_TITLE = "Vibe logged — thank you";
export const CHECK_IN_THANKS_BODY =
  "Reports like yours tune this cafe's vibe scores and confidence for everyone.";

// Add vibe clip (frame F2).
export const CLIP_TAGS = [
  "Cozy",
  "Bright",
  "Quiet",
  "Crowded",
  "Laptop-friendly",
  "Outdoor",
  "Date spot",
] as const;

export const CLIP_UPLOAD_TITLE = "Upload photo or short video";
export const CLIP_UPLOAD_HINT = "Up to 30 seconds · vertical works best";
export const CLIP_NOTE_PLACEHOLDER = "Morning light through the front windows…";
