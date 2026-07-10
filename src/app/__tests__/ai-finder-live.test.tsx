import { render, screen, waitFor } from "@testing-library/react-native";

import AiFinderScreen from "@/app/ai-finder";
import { aiUnavailableTitle } from "@/data/ai-finder-fixtures";

// Live-mode integration (US-029): the screen renders Gemini-generated
// bullets when the live client resolves, and the designed coffee-break state
// when the provider fails. The unconfigured/deterministic path is covered by
// the existing ai-finder suite.

let mockParams: { prompt?: string } = {};
const mockRunLiveAiFinder = jest.fn();

jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn() },
  useLocalSearchParams: () => mockParams,
}));

jest.mock("@/utils/ai-finder-client", () => ({
  runLiveAiFinder: (...args: unknown[]) => mockRunLiveAiFinder(...args),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = {};
});

describe("ai finder live mode", () => {
  it("renders the live match with generated why-bullets", async () => {
    mockParams = { prompt: "quiet work spot" };
    mockRunLiveAiFinder.mockResolvedValue({
      status: "match",
      match: {
        id: "marigold",
        name: "Marigold & Oak",
        meta: "North Park · 0.5 mi · Quiet after 2pm",
        tone: "latte",
        whyItMatches: [
          "Gemini bullet one.",
          "Gemini bullet two.",
          "Gemini bullet three.",
        ],
        alternatives: [],
        keywords: [],
        baseScore: 8.9,
      },
    });

    await render(<AiFinderScreen />);

    await waitFor(() => {
      expect(screen.getByText("Marigold & Oak")).toBeTruthy();
    });
    expect(screen.getByText("Gemini bullet one.")).toBeTruthy();
    expect(screen.getByText("Gemini bullet three.")).toBeTruthy();
    // No onboarding answers in the test env, so the profile is null.
    expect(mockRunLiveAiFinder).toHaveBeenCalledWith("quiet work spot", null);
  });

  it("shows the designed coffee-break state when the provider fails", async () => {
    mockParams = { prompt: "quiet work spot" };
    mockRunLiveAiFinder.mockResolvedValue({ status: "unavailable" });

    await render(<AiFinderScreen />);

    await waitFor(() => {
      expect(screen.getByText(aiUnavailableTitle)).toBeTruthy();
    });
  });
});
