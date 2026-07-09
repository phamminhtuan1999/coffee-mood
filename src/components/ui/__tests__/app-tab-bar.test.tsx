import { fireEvent, render, screen } from "@testing-library/react-native";

import { AppTabBar } from "@/components/ui/app-tab-bar";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: (...args: unknown[]) => mockPush(...args),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AppTabBar", () => {
  it("renders the five contract tabs with a clear selected state", async () => {
    await render(<AppTabBar active="Saved" />);

    for (const tab of ["Map", "Search", "Saved", "Routes", "Profile"]) {
      expect(screen.getByRole("button", { name: `${tab} tab` })).toBeTruthy();
    }

    expect(
      screen.getByRole("button", { name: "Saved tab", selected: true }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Map tab", selected: false }),
    ).toBeTruthy();
  });

  it("pushes tab routes and ignores taps on the active tab", async () => {
    await render(<AppTabBar active="Map" />);

    await fireEvent.press(screen.getByRole("button", { name: "Profile tab" }));
    expect(mockPush).toHaveBeenCalledWith("/profile");

    await fireEvent.press(screen.getByRole("button", { name: "Routes tab" }));
    expect(mockPush).toHaveBeenCalledWith("/route");

    await fireEvent.press(screen.getByRole("button", { name: "Search tab" }));
    expect(mockPush).toHaveBeenCalledWith("/search");

    await fireEvent.press(screen.getByRole("button", { name: "Saved tab" }));
    expect(mockPush).toHaveBeenCalledWith("/saved");

    mockPush.mockClear();
    await fireEvent.press(screen.getByRole("button", { name: "Map tab" }));
    expect(mockPush).not.toHaveBeenCalled();
  });
});
