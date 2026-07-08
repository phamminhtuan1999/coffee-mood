import { fireEvent, render, screen } from "@testing-library/react-native";

import ReviewInsightsScreen from "@/app/cafe/[id]/insights";

const mockBack = jest.fn();
let mockParams: { id?: string } = {};

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

describe("review insights screen", () => {
  it("renders the header with the review count and freshness note", async () => {
    await render(<ReviewInsightsScreen />);

    expect(screen.getByText("What people say")).toBeTruthy();
    expect(
      screen.getByText("Summarized from 480 reviews · updated this week"),
    ).toBeTruthy();
  });

  it("renders all five insight sections from cafe-detail.md", async () => {
    await render(<ReviewInsightsScreen />);

    expect(screen.getByText("People love")).toBeTruthy();
    expect(screen.getByText("People complain about")).toBeTruthy();
    expect(screen.getByText("Best for")).toBeTruthy();
    expect(screen.getByText("Not ideal for")).toBeTruthy();
    expect(screen.getByText("The short version")).toBeTruthy();
  });

  it("shows love and complaint items with percentage bars", async () => {
    await render(<ReviewInsightsScreen />);

    expect(screen.getByText("Latte quality")).toBeTruthy();
    expect(screen.getByText("92%")).toBeTruthy();
    expect(screen.getByText("Parking")).toBeTruthy();
    expect(screen.getByText("46%")).toBeTruthy();

    const bars = screen.getAllByRole("progressbar");

    expect(bars).toHaveLength(6);
    expect(
      screen.getByLabelText("Latte quality, 92 percent"),
    ).toBeTruthy();
    expect(screen.getByLabelText("Parking, 46 percent")).toBeTruthy();
  });

  it("lists the best-for and not-ideal-for chips", async () => {
    await render(<ReviewInsightsScreen />);

    for (const chip of [
      "Quick coffee",
      "Casual meetup",
      "Photos",
      "Long work sessions",
      "Large groups",
    ]) {
      expect(screen.getByText(chip)).toBeTruthy();
    }
  });

  it("renders the short version through the AI summary card", async () => {
    await render(<ReviewInsightsScreen />);

    expect(
      screen.getByText(
        "Come for the latte and the light. Weekday mornings are calm; weekends get lively by 10. Park a block east on Ray St.",
      ),
    ).toBeTruthy();
  });

  it("returns to the cafe detail from the back button", async () => {
    await render(<ReviewInsightsScreen />);

    await fireEvent.press(screen.getByLabelText("Back to cafe"));

    expect(mockBack).toHaveBeenCalled();
  });

  it("shows the still-learning state for the limited-data cafe", async () => {
    mockParams = { id: "hearth" };

    await render(<ReviewInsightsScreen />);

    expect(
      screen.getByText("Hearth Supply Co. · no review summary yet"),
    ).toBeTruthy();
    expect(
      screen.getByText("We're still learning what people say about this spot."),
    ).toBeTruthy();
    expect(screen.queryByText("People love")).toBeNull();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("shows the still-learning state for unknown cafes", async () => {
    mockParams = { id: "nowhere" };

    await render(<ReviewInsightsScreen />);

    expect(screen.getByText("No review summary yet")).toBeTruthy();
    expect(
      screen.getByText("We're still learning what people say about this spot."),
    ).toBeTruthy();
  });
});
