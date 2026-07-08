import { fireEvent, render, screen } from "@testing-library/react-native";

import { CafeBottomSheetShell } from "@/components/ui/cafe-bottom-sheet-shell";
import { theme } from "@/constants/theme";
import { findStyleWith } from "@/test/style-utils";

const baseProps = {
  name: "Mostra Coffee",
  meta: "0.3 mi · Opens 7am",
  score: "9.2",
  vibe: "Cozy, plant-filled corners",
  tags: ["Cozy", "Laptop-friendly"],
  scores: [
    { label: "Coffee", value: "9.4" },
    { label: "Wifi", value: "8.8" },
  ],
  summary: "Warm light, steady wifi, and quiet weekday mornings.",
};

describe("CafeBottomSheetShell", () => {
  it("renders with the 32px top radius and a drag handle", async () => {
    await render(<CafeBottomSheetShell {...baseProps} />);

    expect(
      findStyleWith(screen.toJSON(), {
        borderTopLeftRadius: theme.radius.bottomSheetTop,
        borderTopRightRadius: theme.radius.bottomSheetTop,
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /Cafe sheet half/ }),
    ).toBeOnTheScreen();
  });

  it("shows only the header strip when collapsed", async () => {
    await render(<CafeBottomSheetShell {...baseProps} snapPoint="collapsed" />);

    expect(screen.getByText(baseProps.name)).toBeOnTheScreen();
    expect(screen.getByText(baseProps.vibe)).toBeOnTheScreen();
    expect(screen.queryByText(baseProps.summary)).toBeNull();
    expect(screen.queryByText("Cozy")).toBeNull();
  });

  it("shows tags, scores, summary, and actions at half", async () => {
    await render(<CafeBottomSheetShell {...baseProps} snapPoint="half" />);

    expect(screen.getByText(baseProps.meta)).toBeOnTheScreen();
    expect(screen.getByText("Cozy")).toBeOnTheScreen();
    expect(screen.getByText("9.4")).toBeOnTheScreen();
    expect(screen.getByText(baseProps.summary)).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Directions" }),
    ).toBeOnTheScreen();
    expect(screen.queryByText("Why it matches")).toBeNull();
  });

  it("shows insight sections and route action when expanded", async () => {
    await render(
      <CafeBottomSheetShell
        {...baseProps}
        snapPoint="expanded"
        whyItMatches={["Matches your cozy preference"]}
        peopleLove={["Latte art"]}
        watchOutFor={["Weekend crowds"]}
      />,
    );

    expect(screen.getByText("Why it matches")).toBeOnTheScreen();
    expect(screen.getByText("Matches your cozy preference")).toBeOnTheScreen();
    expect(screen.getByText("Latte art")).toBeOnTheScreen();
    expect(screen.getByText("Weekend crowds")).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Add to Route" }),
    ).toBeOnTheScreen();
  });

  it.each([
    ["collapsed", "half"],
    ["half", "expanded"],
    ["expanded", "collapsed"],
  ] as const)(
    "cycles the snap point from %s to %s when the handle is tapped",
    async (current, next) => {
      const onSnapPointChange = jest.fn();
      await render(
        <CafeBottomSheetShell
          {...baseProps}
          snapPoint={current}
          onSnapPointChange={onSnapPointChange}
        />,
      );

      await fireEvent.press(
        screen.getByRole("button", { name: `Cafe sheet ${current}; tap to change size` }),
      );

      expect(onSnapPointChange).toHaveBeenCalledWith(next);
    },
  );

  it("fires onSave from the save action and reflects the saved state", async () => {
    const onSave = jest.fn();
    await render(<CafeBottomSheetShell {...baseProps} onSave={onSave} />);

    await fireEvent.press(screen.getByRole("button", { name: "Save cafe" }));
    expect(onSave).toHaveBeenCalledTimes(1);

    await render(<CafeBottomSheetShell {...baseProps} saved />);
    expect(
      screen.getByRole("button", { name: "Saved cafe" }),
    ).toBeOnTheScreen();
  });
});
