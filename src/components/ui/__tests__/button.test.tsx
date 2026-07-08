import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { CafeButton, IconButton } from "@/components/ui/button";
import { theme } from "@/constants/theme";

describe("CafeButton", () => {
  it("renders the primary variant with the design contract styles", async () => {
    await render(<CafeButton label="Get Directions" />);

    const button = screen.getByRole("button", { name: "Get Directions" });

    expect(button).toHaveStyle({
      borderRadius: theme.radius.button,
      backgroundColor: theme.colors.text.espresso900,
      minHeight: 48,
      boxShadow: theme.shadows.button,
    });
  });

  it("renders the secondary variant with border instead of fill", async () => {
    await render(<CafeButton label="View Photos" variant="secondary" />);

    expect(screen.getByRole("button", { name: "View Photos" })).toHaveStyle({
      borderWidth: 1.5,
      backgroundColor: "transparent",
      borderColor: theme.colors.surface.borderStrong,
    });
  });

  it("shows the pressed treatment when the pressed prop is forced", async () => {
    await render(<CafeButton label="Save" pressed />);

    expect(screen.getByRole("button", { name: "Save" })).toHaveStyle({
      backgroundColor: theme.colors.text.espresso700,
    });
  });

  it("fires onPress when enabled", async () => {
    const onPress = jest.fn();
    await render(<CafeButton label="Save" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Save" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("blocks onPress and drops the shadow when disabled", async () => {
    const onPress = jest.fn();
    await render(<CafeButton label="Save" disabled onPress={onPress} />);

    const button = screen.getByRole("button", { name: "Save" });
    await fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toHaveStyle({
      backgroundColor: theme.colors.surface.disabled,
    });
    expect(StyleSheet.flatten(button.props.style).boxShadow).toBeUndefined();
    expect(screen.getByText("Save")).toHaveStyle({
      color: theme.colors.surface.disabledText,
    });
  });
});

describe("IconButton", () => {
  it("meets the minimum touch target and exposes its label", async () => {
    await render(<IconButton symbol="sf:heart" label="Save cafe" />);

    const button = screen.getByRole("button", { name: "Save cafe" });

    expect(button).toHaveStyle({
      width: theme.sizing.minimumTouchTarget,
      height: theme.sizing.minimumTouchTarget,
    });
  });

  it("inverts colors when selected", async () => {
    await render(<IconButton symbol="sf:heart.fill" label="Saved cafe" selected />);

    expect(screen.getByRole("button", { name: "Saved cafe" })).toHaveStyle({
      backgroundColor: theme.colors.text.espresso900,
    });
  });

  it("blocks onPress when disabled", async () => {
    const onPress = jest.fn();
    await render(
      <IconButton symbol="sf:heart" label="Save cafe" disabled onPress={onPress} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Save cafe" }));

    expect(onPress).not.toHaveBeenCalled();
  });
});
