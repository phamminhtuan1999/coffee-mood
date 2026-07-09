import { fireEvent, render, screen } from "@testing-library/react-native";

import DatePlanScreen from "@/app/date";

let mockParams: { state?: string } = {};

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockParams,
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = {};
});

describe("date plan inputs", () => {
  it("renders the inputs and mood chips without a plan", async () => {
    await render(<DatePlanScreen />);

    expect(screen.getByText("Plan a coffee date")).toBeTruthy();
    expect(screen.getByText("Low-effort, high-charm.")).toBeTruthy();
    expect(screen.getByLabelText("Area South Park")).toBeTruthy();
    expect(screen.getByLabelText("Time Golden hour")).toBeTruthy();
    expect(screen.getByLabelText("Budget $$")).toBeTruthy();

    for (const mood of ["Cozy", "Aesthetic", "Quiet", "Fun", "Outdoor"]) {
      expect(screen.getByRole("button", { name: mood })).toBeTruthy();
    }

    expect(screen.queryByText("Your plan")).toBeNull();
  });

  it("cycles the input card presets", async () => {
    await render(<DatePlanScreen />);

    await fireEvent.press(screen.getByLabelText("Area South Park"));

    expect(screen.getByLabelText("Area North Park")).toBeTruthy();
  });
});

describe("date plan results", () => {
  it("creates the default patio plan with steps, tip, and actions", async () => {
    await render(<DatePlanScreen />);

    await fireEvent.press(screen.getByLabelText("Create Date Plan"));

    expect(screen.getByText("Your plan")).toBeTruthy();
    expect(screen.getByText("Terrace & Thistle")).toBeTruthy();
    expect(screen.getByText("Patio café · South Park · $$$")).toBeTruthy();
    expect(screen.getByText("Meet at Terrace & Thistle")).toBeTruthy();
    expect(screen.getByText("Split a dessert")).toBeTruthy();
    expect(screen.getByText("Golden-hour walk")).toBeTruthy();
    expect(screen.getByText(/Golden hour hits the patio at 4:40/)).toBeTruthy();

    for (const label of ["Shuffle", "Save this plan", "Share", "Start Navigation"]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
  });

  it("creates the quiet plan when the Quiet mood is chosen", async () => {
    await render(<DatePlanScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Quiet" }));
    await fireEvent.press(screen.getByLabelText("Create Date Plan"));

    expect(screen.getByText("Marigold & Oak")).toBeTruthy();
    expect(screen.getByText("Slow pour-over flight")).toBeTruthy();
  });

  it("shuffles to the next profile and wraps deterministically", async () => {
    await render(<DatePlanScreen />);

    await fireEvent.press(screen.getByLabelText("Create Date Plan"));
    await fireEvent.press(screen.getByLabelText("Shuffle"));

    expect(screen.getByText("Mostra Coffee")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Shuffle"));

    expect(screen.getByText("Marigold & Oak")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Shuffle"));

    expect(screen.getByText("Terrace & Thistle")).toBeTruthy();
  });

  it("resets the rotation when a new plan is created", async () => {
    await render(<DatePlanScreen />);

    await fireEvent.press(screen.getByLabelText("Create Date Plan"));
    await fireEvent.press(screen.getByLabelText("Shuffle"));

    expect(screen.getByText("Mostra Coffee")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Create Date Plan"));

    expect(screen.getByText("Terrace & Thistle")).toBeTruthy();
  });

  it("renders the plan on load under the QA override", async () => {
    mockParams = { state: "plan" };

    await render(<DatePlanScreen />);

    expect(screen.getByText("Your plan")).toBeTruthy();
    expect(screen.getByText("Terrace & Thistle")).toBeTruthy();
  });
});
