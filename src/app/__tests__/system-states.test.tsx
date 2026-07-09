import { render, screen } from "@testing-library/react-native";

import SystemStatesScreen from "@/app/system-states";

describe("system-states QA gallery", () => {
  it("renders every catalog card with the designed copy", async () => {
    await render(<SystemStatesScreen />);

    expect(
      screen.getByText("The Section H catalog: 6 empty · 5 loading · 5 error."),
    ).toBeTruthy();

    // Empty states.
    for (const title of [
      "No cafés nearby",
      "No saved cafés",
      "No results",
      "Location is off",
      "No route found",
      "You're offline",
    ]) {
      expect(screen.getByText(title)).toBeTruthy();
    }

    // Loading hints.
    for (const hint of [
      "Pouring the map…",
      "Reading the room…",
      "Warming up…",
      "Connecting the dots…",
      "Warming your library…",
    ]) {
      expect(screen.getByText(hint)).toBeTruthy();
    }

    // Error states.
    for (const title of [
      "Something spilled",
      "Location unavailable",
      "AI is resting",
      "Image didn't load",
      "Save didn't stick",
    ]) {
      expect(screen.getByText(title)).toBeTruthy();
    }
  });
});
