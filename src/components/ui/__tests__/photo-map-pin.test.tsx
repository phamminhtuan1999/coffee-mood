import { fireEvent, render, screen } from "@testing-library/react-native";

import { ClusteredPhotoPin, PhotoMapPin } from "@/components/ui/photo-map-pin";
import { theme } from "@/constants/theme";
import { findStyleWith } from "@/test/style-utils";

describe("PhotoMapPin", () => {
  it("renders the default state with the pin shadow token", async () => {
    await render(<PhotoMapPin label="Mostra Coffee" />);

    const pin = screen.getByRole("button", { name: "Mostra Coffee" });

    expect(pin).toBeOnTheScreen();
    expect(pin.props.accessibilityState.selected).toBe(false);
    expect(
      findStyleWith(screen.toJSON(), { boxShadow: theme.shadows.pin }),
    ).toBeDefined();
    expect(
      findStyleWith(screen.toJSON(), { width: 56, height: 56 }),
    ).toBeDefined();
  });

  it("grows and gains the espresso ring when selected", async () => {
    await render(<PhotoMapPin label="Mostra Coffee" selected />);

    screen.getByRole("button", { name: "Mostra Coffee", selected: true });

    expect(
      findStyleWith(screen.toJSON(), {
        width: 64,
        height: 64,
        borderWidth: 3,
        borderColor: theme.colors.text.espresso900,
      }),
    ).toBeDefined();
  });

  it("shows the score badge only when a score is provided", async () => {
    await render(<PhotoMapPin label="Mostra Coffee" score="9.2" />);
    expect(screen.getByText("9.2")).toBeOnTheScreen();

    await render(<PhotoMapPin label="Analog Coffee" />);
    expect(screen.queryByText(/\d\.\d/)).toBeNull();
  });

  it("shows the bookmark badge when saved", async () => {
    await render(<PhotoMapPin label="Mostra Coffee" saved />);
    expect(JSON.stringify(screen.toJSON())).toContain("bookmark.fill");
  });

  it("omits the bookmark badge when not saved", async () => {
    await render(<PhotoMapPin label="Mostra Coffee" />);
    expect(JSON.stringify(screen.toJSON())).not.toContain("bookmark.fill");
  });

  it("fires onPress", async () => {
    const onPress = jest.fn();
    await render(<PhotoMapPin label="Mostra Coffee" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Mostra Coffee" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("ClusteredPhotoPin", () => {
  it("renders the grouped count with the pin shadow token", async () => {
    await render(<ClusteredPhotoPin count={4} label="4 cafes nearby" />);

    expect(screen.getByText("+4")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "4 cafes nearby" })).toBeOnTheScreen();
    expect(
      findStyleWith(screen.toJSON(), { boxShadow: theme.shadows.pin }),
    ).toBeDefined();
  });

  it("fires onPress", async () => {
    const onPress = jest.fn();
    await render(
      <ClusteredPhotoPin count={4} label="4 cafes nearby" onPress={onPress} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "4 cafes nearby" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
