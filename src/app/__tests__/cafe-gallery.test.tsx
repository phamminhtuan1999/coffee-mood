import { fireEvent, render, screen } from "@testing-library/react-native";

import CafeGalleryScreen from "@/app/cafe/[id]/gallery";

const mockBack = jest.fn();
let mockParams: { id?: string; tab?: string; photo?: string } = {};

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

describe("cafe gallery", () => {
  it("renders the header, counts, and all six vibe tabs", async () => {
    await render(<CafeGalleryScreen />);

    expect(screen.getByText("Mostra Coffee")).toBeTruthy();
    expect(screen.getByText("128 photos · 14 clips")).toBeTruthy();

    for (const tab of [
      "Interior",
      "Drinks",
      "Seating",
      "Outdoor",
      "Work Setup",
      "Date Vibe",
    ]) {
      expect(screen.getByText(tab)).toBeTruthy();
    }

    expect(
      screen.getByRole("button", { name: "Interior", selected: true }),
    ).toBeTruthy();
  });

  it("shows the active tab's photos with their vibe tags and filters on switch", async () => {
    await render(<CafeGalleryScreen />);

    expect(
      screen.getByLabelText("Warm wood counter at golden hour"),
    ).toBeTruthy();
    expect(screen.getAllByText("Cozy").length).toBeGreaterThanOrEqual(1);

    await fireEvent.press(screen.getByText("Outdoor"));

    expect(
      screen.getByLabelText("Sidewalk tables on University Ave"),
    ).toBeTruthy();
    expect(
      screen.queryByLabelText("Warm wood counter at golden hour"),
    ).toBeNull();
  });

  it("opens the photo detail state on tap and closes it again", async () => {
    await render(<CafeGalleryScreen />);

    await fireEvent.press(
      screen.getByLabelText("Warm wood counter at golden hour"),
    );

    expect(screen.getByText("Warm wood counter at golden hour")).toBeTruthy();
    expect(screen.getByLabelText("Close photo")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Close photo"));

    expect(screen.queryByText("Warm wood counter at golden hour")).toBeNull();
  });

  it("closes an open photo when switching tabs", async () => {
    await render(<CafeGalleryScreen />);

    await fireEvent.press(
      screen.getByLabelText("Warm wood counter at golden hour"),
    );
    await fireEvent.press(screen.getByText("Drinks"));

    expect(screen.queryByLabelText("Close photo")).toBeNull();
    expect(
      screen.getByLabelText("Horchata latte with cinnamon dust"),
    ).toBeTruthy();
  });

  it("honors the tab and photo deep-link params", async () => {
    mockParams = { id: "mostra", tab: "Work Setup", photo: "mostra-work-1" };

    await render(<CafeGalleryScreen />);

    expect(
      screen.getByRole("button", { name: "Work Setup", selected: true }),
    ).toBeTruthy();
    expect(screen.getByText("Corner desk with a wall outlet")).toBeTruthy();
    expect(screen.getByLabelText("Close photo")).toBeTruthy();
  });

  it("shows the empty state for cafes without photos", async () => {
    mockParams = { id: "hearth" };

    await render(<CafeGalleryScreen />);

    expect(screen.getByText("0 photos · 0 clips")).toBeTruthy();
    expect(screen.getByText("No photos in this vibe yet.")).toBeTruthy();
  });

  it("returns to the cafe detail from the back button", async () => {
    await render(<CafeGalleryScreen />);

    await fireEvent.press(screen.getByLabelText("Back to cafe"));

    expect(mockBack).toHaveBeenCalled();
  });
});
