import { fireEvent, render, screen } from "@testing-library/react-native";

import CheckInScreen from "@/app/cafe/[id]/check-in";
import AddVibeClipScreen from "@/app/cafe/[id]/clip";
import {
  CHECK_IN_SUBTITLE,
  CHECK_IN_THANKS_TITLE,
} from "@/data/contribute";

const mockBack = jest.fn();
let mockParams: { id?: string; state?: string } = {};

jest.mock("expo-router", () => ({
  router: {
    back: (...args: unknown[]) => mockBack(...args),
  },
  useLocalSearchParams: () => mockParams,
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = { id: "mostra" };
});

async function answerAllQuestions() {
  for (const option of ["Quiet", "Great", "Good", "Nice", "Comfortable"]) {
    await fireEvent.press(screen.getByRole("button", { name: option }));
  }
}

describe("check-in vibe report", () => {
  it("renders the visited cafe header and all five questions", async () => {
    await render(<CheckInScreen />);

    expect(screen.getByText("You visited")).toBeTruthy();
    expect(screen.getByText("Mostra Coffee")).toBeTruthy();
    expect(screen.getByText("How was the vibe?")).toBeTruthy();
    expect(screen.getByText(CHECK_IN_SUBTITLE)).toBeTruthy();

    for (const label of ["Noise", "Work-friendly", "Wi-Fi", "Photo vibe", "Crowd"]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
    for (const option of ["Quiet", "Loud", "Very aesthetic", "Comfortable"]) {
      expect(screen.getByRole("button", { name: option })).toBeTruthy();
    }
  });

  it("keeps Submit disabled until every question is answered", async () => {
    await render(<CheckInScreen />);

    await fireEvent.press(screen.getByLabelText("Submit Vibe Report"));
    expect(screen.queryByText(CHECK_IN_THANKS_TITLE)).toBeNull();

    await answerAllQuestions();

    expect(
      screen.getByRole("button", { name: "Submit Vibe Report", disabled: false }),
    ).toBeTruthy();
  });

  it("swaps to the thanks state after submitting", async () => {
    await render(<CheckInScreen />);

    await answerAllQuestions();
    await fireEvent.press(screen.getByLabelText("Submit Vibe Report"));

    expect(screen.getByText(CHECK_IN_THANKS_TITLE)).toBeTruthy();
    expect(screen.queryByText("How was the vibe?")).toBeNull();

    await fireEvent.press(screen.getByLabelText("Done"));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("shows the thanks state on load under the QA override", async () => {
    mockParams = { id: "mostra", state: "done" };

    await render(<CheckInScreen />);

    expect(screen.getByText(CHECK_IN_THANKS_TITLE)).toBeTruthy();
    expect(screen.queryByLabelText("Submit Vibe Report")).toBeNull();
  });

  it("falls back gracefully for an unknown cafe", async () => {
    mockParams = { id: "nowhere" };

    await render(<CheckInScreen />);

    expect(screen.getByText("This café")).toBeTruthy();
    expect(screen.getByText("How was the vibe?")).toBeTruthy();
  });
});

describe("add vibe clip", () => {
  it("renders the upload target, tags, note, and Post Clip", async () => {
    await render(<AddVibeClipScreen />);

    expect(screen.getByText("Add a vibe clip")).toBeTruthy();
    expect(screen.getByLabelText("Upload photo or short video")).toBeTruthy();
    expect(
      screen.getByText("Up to 30 seconds · vertical works best"),
    ).toBeTruthy();

    for (const tag of [
      "Cozy",
      "Bright",
      "Quiet",
      "Crowded",
      "Laptop-friendly",
      "Outdoor",
      "Date spot",
    ]) {
      expect(screen.getByRole("button", { name: tag })).toBeTruthy();
    }

    expect(screen.getByLabelText("Clip note")).toBeTruthy();
    expect(screen.getByLabelText("Post Clip")).toBeTruthy();
  });

  it("multi-selects vibe tags", async () => {
    await render(<AddVibeClipScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Cozy" }));
    await fireEvent.press(screen.getByRole("button", { name: "Outdoor" }));

    expect(
      screen.getByRole("button", { name: "Cozy", selected: true }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Outdoor", selected: true }),
    ).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Cozy" }));

    expect(
      screen.getByRole("button", { name: "Cozy", selected: false }),
    ).toBeTruthy();
  });

  it("captures the optional note", async () => {
    await render(<AddVibeClipScreen />);

    await fireEvent.changeText(
      screen.getByLabelText("Clip note"),
      "Golden light on the counter",
    );

    expect(screen.getByDisplayValue("Golden light on the counter")).toBeTruthy();
  });

  it("navigates back from the header", async () => {
    await render(<AddVibeClipScreen />);

    await fireEvent.press(screen.getByLabelText("Back"));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
