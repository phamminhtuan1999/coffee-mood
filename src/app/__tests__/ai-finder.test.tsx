import { act, fireEvent, render, screen } from "@testing-library/react-native";

import AiFinderScreen from "@/app/ai-finder";
import { AI_THINKING_MS, aiConfidenceLine } from "@/data/ai-finder-fixtures";

const mockBack = jest.fn();
let mockParams: { prompt?: string } = {};

jest.mock("expo-router", () => ({
  router: { back: (...args: unknown[]) => mockBack(...args) },
  useLocalSearchParams: () => mockParams,
}));

jest.mock("@/utils/taste-profile", () => ({
  loadTasteProfile: () => null,
}));

async function settleThinking() {
  await act(async () => {
    jest.advanceTimersByTime(AI_THINKING_MS + 50);
  });
}

describe("AiFinderScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockBack.mockClear();
    mockParams = {};
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the finder headline, prompt input, and six suggestion chips", async () => {
    await render(<AiFinderScreen />);

    expect(
      screen.getByText("What kind of cafe are you looking for?"),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText("Describe your cafe")).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Quiet work spot" }),
    ).toBeOnTheScreen();
    expect(screen.getAllByRole("button")).toHaveLength(8); // back + submit + 6 chips
  });

  it("shows the thinking state and then the result after submit", async () => {
    await render(<AiFinderScreen />);

    await fireEvent.changeText(
      screen.getByLabelText("Describe your cafe"),
      "aesthetic photos and a good latte",
    );
    await fireEvent.press(screen.getByRole("button", { name: "Find my cafe" }));

    expect(screen.getByText("CafeMood AI is thinking")).toBeOnTheScreen();

    await settleThinking();

    expect(screen.getByText("Best match")).toBeOnTheScreen();
    expect(screen.getByText("Mostra Coffee")).toBeOnTheScreen();
    expect(screen.getByText("Why it matches")).toBeOnTheScreen();
    expect(
      screen.getByText("Latte quality is the most praised note in recent reviews."),
    ).toBeOnTheScreen();
    expect(screen.getByText("Better for work")).toBeOnTheScreen();
    expect(screen.getByText("Communal Coffee")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "View on Map" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Directions" })).toBeOnTheScreen();
    expect(screen.getByText(aiConfidenceLine)).toBeOnTheScreen();
  });

  it("fills the prompt and runs the finder when a chip is pressed", async () => {
    await render(<AiFinderScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Cute date cafe" }));
    await settleThinking();

    expect(screen.getByLabelText("Describe your cafe").props.value).toBe(
      "Cute date cafe",
    );
    expect(screen.getByText("Terrace & Thistle")).toBeOnTheScreen();
  });

  it("toggles the save action on the result card", async () => {
    await render(<AiFinderScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Good latte" }));
    await settleThinking();

    await fireEvent.press(screen.getByRole("button", { name: "Save cafe" }));

    expect(screen.getByRole("button", { name: "Saved cafe" })).toBeOnTheScreen();
  });

  it("returns to the input state via Refine Search, keeping the prompt", async () => {
    await render(<AiFinderScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Open late" }));
    await settleThinking();

    await fireEvent.press(screen.getByRole("button", { name: "Refine Search" }));

    expect(screen.queryByText("Best match")).toBeNull();
    expect(screen.getByLabelText("Describe your cafe").props.value).toBe(
      "Open late",
    );
  });

  it("shows the coffee-break fallback with a Browse Map CTA that returns to the map", async () => {
    await render(<AiFinderScreen />);

    await fireEvent.changeText(
      screen.getByLabelText("Describe your cafe"),
      "coffee break",
    );
    await fireEvent.press(screen.getByRole("button", { name: "Find my cafe" }));
    await settleThinking();

    expect(
      screen.getByText("CafeMood AI is taking a coffee break."),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Browse Map" }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("auto-runs the finder when opened with a prompt deep-link param", async () => {
    mockParams = { prompt: "Good latte" };

    await render(<AiFinderScreen />);
    await settleThinking();

    expect(screen.getByText("Mostra Coffee")).toBeOnTheScreen();
    expect(screen.getByLabelText("Describe your cafe").props.value).toBe(
      "Good latte",
    );
  });

  it("navigates back to the map from the header control", async () => {
    await render(<AiFinderScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Back to map" }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
