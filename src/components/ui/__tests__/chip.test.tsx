import { fireEvent, render, screen } from "@testing-library/react-native";

import { PreferenceChip, VibeChip } from "@/components/ui/chip";
import { theme } from "@/constants/theme";

describe("VibeChip", () => {
  it("renders as a fully rounded chip with the 13px label", async () => {
    await render(<VibeChip label="Cozy" />);

    expect(screen.getByRole("button", { name: "Cozy" })).toHaveStyle({
      borderRadius: theme.radius.chip,
      backgroundColor: theme.colors.surface.cardCream,
    });
    expect(screen.getByText("Cozy")).toHaveStyle({
      fontSize: theme.typography.chipLabel.fontSize,
    });
  });

  it("inverts to espresso when selected and exposes the selected state", async () => {
    await render(<VibeChip label="Cozy" selected />);

    const chip = screen.getByRole("button", { name: "Cozy", selected: true });

    expect(chip).toHaveStyle({
      backgroundColor: theme.colors.text.espresso900,
      borderColor: theme.colors.text.espresso900,
    });
    expect(screen.getByText("Cozy")).toHaveStyle({
      color: theme.colors.background.cream50,
    });
  });

  it("fires onPress when enabled and blocks it when disabled", async () => {
    const onPress = jest.fn();
    await render(<VibeChip label="Cozy" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Cozy" }));
    expect(onPress).toHaveBeenCalledTimes(1);

    const onDisabledPress = jest.fn();
    await render(<VibeChip label="Quiet" disabled onPress={onDisabledPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Quiet" }));
    expect(onDisabledPress).not.toHaveBeenCalled();
  });
});

describe("PreferenceChip", () => {
  it("uses the soft cream treatment when selected", async () => {
    await render(<PreferenceChip label="Oat milk" selected />);

    const chip = screen.getByRole("button", {
      name: "Oat milk",
      selected: true,
    });

    expect(chip).toHaveStyle({
      borderColor: theme.colors.brand.terracotta,
      backgroundColor: theme.colors.background.cream100,
    });
    expect(screen.getByText("Oat milk")).toHaveStyle({
      color: theme.colors.brand.roastedBrown,
    });
  });

  it("stays neutral when not selected", async () => {
    await render(<PreferenceChip label="Oat milk" />);

    expect(screen.getByRole("button", { name: "Oat milk" })).toHaveStyle({
      borderColor: theme.colors.surface.borderSoft,
      backgroundColor: theme.colors.surface.cardCream,
    });
  });
});
