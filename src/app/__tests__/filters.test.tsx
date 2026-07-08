import { fireEvent, render, screen } from "@testing-library/react-native";

import FiltersScreen from "@/app/filters";
import { defaultMapFilters, filterNeeds, filterTreats } from "@/utils/map-filters";

const mockBack = jest.fn();
const mockGetMapFilters = jest.fn();
const mockSetMapFilters = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    back: (...args: unknown[]) => mockBack(...args),
  },
}));

jest.mock("@/utils/map-filters-store", () => ({
  getMapFilters: () => mockGetMapFilters(),
  setMapFilters: (...args: unknown[]) => mockSetMapFilters(...args),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockGetMapFilters.mockReturnValue(defaultMapFilters());
});

describe("FiltersScreen", () => {
  it("renders every facet from the discovery contract", async () => {
    await render(<FiltersScreen />);

    expect(screen.getByText("Tune your map")).toBeTruthy();
    expect(screen.getByText("Distance")).toBeTruthy();
    expect(screen.getByText("Anywhere")).toBeTruthy();
    expect(screen.getByText("walk")).toBeTruthy();
    expect(screen.getByText("Needs")).toBeTruthy();

    for (const need of filterNeeds) {
      expect(screen.getByText(need)).toBeTruthy();
    }

    expect(screen.getByText("Mood levels")).toBeTruthy();
    expect(screen.getByText("Aesthetic score")).toBeTruthy();
    expect(screen.getByText("Work score")).toBeTruthy();
    expect(screen.getByText("Noise level")).toBeTruthy();
    expect(screen.getByText("Price")).toBeTruthy();
    expect(screen.getByText("$")).toBeTruthy();
    expect(screen.getByText("$$")).toBeTruthy();
    expect(screen.getByText("$$$")).toBeTruthy();
    expect(screen.getByText("Treats & occasions")).toBeTruthy();

    for (const treat of filterTreats) {
      expect(screen.getByText(treat)).toBeTruthy();
    }

    expect(screen.getByText("Apply Filters")).toBeTruthy();
    expect(screen.getAllByText("Reset").length).toBeGreaterThanOrEqual(2);
  });

  it("applies tuned filters and returns to the map", async () => {
    await render(<FiltersScreen />);

    await fireEvent.press(screen.getByText("Wi-Fi"));
    await fireEvent.press(screen.getByText("$$"));
    await fireEvent.press(screen.getByText("Matcha"));
    await fireEvent.press(screen.getByText("Apply Filters"));

    expect(mockSetMapFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        needs: ["Wi-Fi"],
        price: "$$",
        treats: ["Matcha"],
      }),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it("toggles a selected price back off", async () => {
    await render(<FiltersScreen />);

    await fireEvent.press(screen.getByText("$$$"));
    await fireEvent.press(screen.getByText("$$$"));
    await fireEvent.press(screen.getByText("Apply Filters"));

    expect(mockSetMapFilters).toHaveBeenCalledWith(
      expect.objectContaining({ price: null }),
    );
  });

  it("adjusts mood sliders through accessibility actions", async () => {
    await render(<FiltersScreen />);

    await fireEvent(screen.getByLabelText("Aesthetic score"), "accessibilityAction", {
      nativeEvent: { actionName: "increment" },
    });

    expect(screen.getByText("1.0+")).toBeTruthy();

    await fireEvent(screen.getByLabelText("Noise level"), "accessibilityAction", {
      nativeEvent: { actionName: "decrement" },
    });

    expect(screen.getByText("moderate")).toBeTruthy();
  });

  it("resets to defaults from the header", async () => {
    await render(<FiltersScreen />);

    await fireEvent.press(screen.getByText("Parking"));
    await fireEvent.press(screen.getByText("$"));
    await fireEvent.press(screen.getByLabelText("Reset filters"));
    await fireEvent.press(screen.getByText("Apply Filters"));

    expect(mockSetMapFilters).toHaveBeenCalledWith(defaultMapFilters());
  });

  it("starts from the stored filters", async () => {
    mockGetMapFilters.mockReturnValue({
      ...defaultMapFilters(),
      distance: 12,
      needs: ["Outlets"],
    });

    await render(<FiltersScreen />);

    expect(screen.getByText("Within 12 min")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Outlets", selected: true }),
    ).toBeTruthy();
  });
});
