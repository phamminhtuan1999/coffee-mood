// App-wide system-state catalog (Section H of the design handoff). Six empty
// states, five loading patterns, five error states. Copy is the designed
// contract; surfaces compose these per screen (several landed with earlier
// stories - discovery states in US-013, detail states in US-014, the saved
// empty state's product-doc copy in US-023).

export type EmptyStateTone = "coffee" | "route" | "saved";

export type SystemEmptyState = {
  id: string;
  title: string;
  copy: string;
  cta: string;
  tone: EmptyStateTone;
};

export const SYSTEM_EMPTY_STATES: SystemEmptyState[] = [
  {
    id: "no-cafes-nearby",
    title: "No cafés nearby",
    copy: "Nothing in this pocket of the map yet. Try widening your radius.",
    cta: "Expand search",
    tone: "coffee",
  },
  {
    id: "no-saved-cafes",
    title: "No saved cafés",
    copy: "Your coffee map starts with one save. Tap ♡ on any café.",
    cta: "Explore the map",
    tone: "saved",
  },
  {
    id: "no-results",
    title: "No results",
    copy: "No matches for that vibe. Loosen a filter or two and retry.",
    cta: "Clear filters",
    tone: "coffee",
  },
  {
    id: "location-off",
    title: "Location is off",
    copy: "Turn on location, or pick a neighborhood manually — both work.",
    cta: "Choose manually",
    tone: "coffee",
  },
  {
    id: "no-route",
    title: "No route found",
    copy: "Couldn't fit that mood in the time you have. Try fewer stops.",
    cta: "Adjust plan",
    tone: "route",
  },
  {
    id: "offline",
    title: "You're offline",
    copy: "Saved cafés and notes still work. The map will catch up.",
    cta: "View saved",
    tone: "saved",
  },
];

// The offline card is also wired on the map home (?discovery=offline), so it
// gets a named export.
export const OFFLINE_STATE = SYSTEM_EMPTY_STATES.find(
  (state) => state.id === "offline",
) as SystemEmptyState;

export type SystemLoadingState = {
  id: string;
  title: string;
  hint: string;
};

// Four designed skeletons plus the saved-library pattern the product doc's
// five-pattern contract calls for.
export const SYSTEM_LOADING_STATES: SystemLoadingState[] = [
  { id: "map", title: "Loading map cafés", hint: "Pouring the map…" },
  { id: "ai", title: "AI recommendation", hint: "Reading the room…" },
  { id: "detail", title: "Café detail", hint: "Warming up…" },
  { id: "route", title: "Generating route", hint: "Connecting the dots…" },
  { id: "saved", title: "Saved cafés", hint: "Warming your library…" },
];

export type SystemErrorState = {
  id: string;
  title: string;
  copy: string;
  cta: string;
};

// Four designed error cards plus the save-failed case from the product doc's
// five-error contract.
export const SYSTEM_ERROR_STATES: SystemErrorState[] = [
  {
    id: "api-failed",
    title: "Something spilled",
    copy: "We couldn't reach the server. Your saves are safe.",
    cta: "Try again",
  },
  {
    id: "location-unavailable",
    title: "Location unavailable",
    copy: "We can't pin you down right now. Pick a spot manually.",
    cta: "Choose manually",
  },
  {
    id: "ai-unavailable",
    title: "AI is resting",
    copy: "Recommendations are unavailable. Browse the map meanwhile.",
    cta: "Open map",
  },
  {
    id: "image-failed",
    title: "Image didn't load",
    copy: "This photo is being shy. Pull to refresh the gallery.",
    cta: "Refresh",
  },
  {
    id: "save-failed",
    title: "Save didn't stick",
    copy: "That tap didn't land. Try saving the café again.",
    cta: "Retry save",
  },
];
