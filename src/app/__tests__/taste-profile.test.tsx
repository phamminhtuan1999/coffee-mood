import { fireEvent, render, screen } from "@testing-library/react-native";

import TasteProfileScreen from "@/app/taste";
import { resetSavedStore, saveCafe } from "@/utils/saved-store";
import { clearTasteProfile, saveTasteProfile } from "@/utils/taste-profile";

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockParams: { state?: string } = {};

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: (...args: unknown[]) => mockPush(...args),
    back: (...args: unknown[]) => mockBack(...args),
  }),
  useLocalSearchParams: () => mockParams,
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = {};
  localStorage.clear();
  resetSavedStore();
  clearTasteProfile();
});

describe("taste profile screen (G1)", () => {
  it("renders the stat card, default vibes, and fixture sections", async () => {
    await render(<TasteProfileScreen />);

    expect(screen.getByText("Your café taste")).toBeTruthy();
    expect(
      screen.getByText("Built from your taste answers — save cafés to sharpen it"),
    ).toBeTruthy();

    for (const [pct, label] of [
      ["42%", "Work-friendly"],
      ["28%", "Aesthetic"],
      ["18%", "Specialty Coffee"],
      ["12%", "Outdoor"],
    ]) {
      expect(screen.getByText(pct)).toBeTruthy();
      expect(screen.getByText(label)).toBeTruthy();
    }

    for (const vibe of ["Quiet mornings", "Window light", "Oak tables"]) {
      expect(screen.getByText(vibe)).toBeTruthy();
    }

    expect(
      screen.getByText("Save cafés to see your neighborhoods here."),
    ).toBeTruthy();
    expect(screen.getByText("Mostra Coffee")).toBeTruthy();
    expect(screen.getByText(/Golden Hour Coffee/)).toBeTruthy();
  });

  it("derives live sections from saves and onboarding answers", async () => {
    saveCafe("mostra", { collectionIds: ["want-to-try"], note: "" });
    saveCafe("marigold", { collectionIds: ["work-spots"], note: "" });
    saveTasteProfile({
      cafeTypes: ["Outdoor"],
      priorities: ["Wi-Fi"],
      distance: "10 min",
      price: "$$",
      skipped: false,
      updatedAt: "2026-07-09T00:00:00.000Z",
    });

    await render(<TasteProfileScreen />);

    expect(
      screen.getByText("Built from 2 saves and your taste answers"),
    ).toBeTruthy();
    expect(screen.getByText("Patios")).toBeTruthy();
    expect(screen.getByText("Reliable Wi-Fi")).toBeTruthy();
    expect(screen.queryByText("Oak tables")).toBeNull();
    expect(screen.getByText("North Park")).toBeTruthy();
    expect(screen.getByText("2 cafés saved")).toBeTruthy();
  });

  it("opens a recently visited cafe and navigates back", async () => {
    await render(<TasteProfileScreen />);

    await fireEvent.press(screen.getByLabelText("Open Marigold & Oak"));

    expect(mockPush).toHaveBeenCalledWith("/cafe/marigold");

    await fireEvent.press(screen.getByLabelText("Back"));

    expect(mockBack).toHaveBeenCalled();
  });

  it("renders the demo library through the QA override", async () => {
    mockParams = { state: "demo" };

    await render(<TasteProfileScreen />);

    expect(
      screen.getByText("Built from 4 saves and your taste answers"),
    ).toBeTruthy();
    expect(screen.getByText("North Park")).toBeTruthy();
  });
});
