import { fireEvent, render, screen } from "@testing-library/react-native";

import WorkPlannerScreen from "@/app/work";
import { getSavedState, isCafeSaved, resetSavedStore } from "@/utils/saved-store";

const mockPush = jest.fn();
let mockParams: { state?: string } = {};

jest.mock("expo-router", () => ({
  router: {
    push: (...args: unknown[]) => mockPush(...args),
  },
  useLocalSearchParams: () => mockParams,
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  resetSavedStore();
  mockParams = {};
});

describe("work session planner inputs", () => {
  it("renders the session sentence, time fields, and needs without results", async () => {
    await render(<WorkPlannerScreen />);

    expect(screen.getByText("Where should I work today?")).toBeTruthy();
    expect(
      screen.getByText('"I need to work from 9 AM to 12 PM."'),
    ).toBeTruthy();
    expect(screen.getByLabelText("Start time 9:00 AM")).toBeTruthy();
    expect(screen.getByLabelText("End time 12:00 PM")).toBeTruthy();

    for (const need of ["Wi-Fi", "Outlets", "Very quiet", "Parking"]) {
      expect(screen.getByRole("button", { name: need })).toBeTruthy();
    }

    expect(screen.queryByText("Best for your session")).toBeNull();
  });

  it("cycles the time presets and updates the session sentence", async () => {
    await render(<WorkPlannerScreen />);

    await fireEvent.press(screen.getByLabelText("Start time 9:00 AM"));

    expect(screen.getByLabelText("Start time 10:00 AM")).toBeTruthy();
    expect(
      screen.getByText('"I need to work from 10 AM to 12 PM."'),
    ).toBeTruthy();
  });
});

describe("work session results", () => {
  it("finds ranked work spots with confidence stats and a best-overall reason", async () => {
    await render(<WorkPlannerScreen />);

    await fireEvent.press(screen.getByLabelText("Find Work Spots"));

    expect(screen.getByText("Best for your session")).toBeTruthy();
    expect(
      screen.getByText(
        "Best overall: Hearth Supply Co. — easiest parking, big tables, steady Wi-Fi.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Marigold & Oak")).toBeTruthy();
    expect(screen.getByText("8.7")).toBeTruthy();
    expect(screen.getAllByText("Wi-Fi").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Reliable")).toBeTruthy();
    expect(
      screen.getByText(
        "Arrive before 10 AM for a long table · street parking two blocks over.",
      ),
    ).toBeTruthy();
  });

  it("re-ranks when the needs change", async () => {
    await render(<WorkPlannerScreen />);

    // Drop Parking: the quiet work cafe should take best overall.
    await fireEvent.press(screen.getByRole("button", { name: "Parking" }));
    await fireEvent.press(screen.getByLabelText("Find Work Spots"));

    expect(screen.getByText(/Best overall: Marigold & Oak/)).toBeTruthy();
  });

  it("navigates to the cafe detail from View Detail", async () => {
    await render(<WorkPlannerScreen />);

    await fireEvent.press(screen.getByLabelText("Find Work Spots"));
    await fireEvent.press(screen.getByLabelText("View Detail Marigold & Oak"));

    expect(mockPush).toHaveBeenCalledWith("/cafe/marigold");
  });

  it("saves a work spot through the shared saved store", async () => {
    await render(<WorkPlannerScreen />);

    await fireEvent.press(screen.getByLabelText("Find Work Spots"));
    await fireEvent.press(screen.getByLabelText("Save Hearth Supply Co."));

    expect(isCafeSaved(getSavedState(), "hearth")).toBe(true);
    expect(screen.getByLabelText("Saved Hearth Supply Co.")).toBeTruthy();
  });

  it("renders results on load under the QA override", async () => {
    mockParams = { state: "results" };

    await render(<WorkPlannerScreen />);

    expect(screen.getByText("Best for your session")).toBeTruthy();
    expect(screen.getByText(/Best overall: Hearth Supply Co./)).toBeTruthy();
  });
});
