import { fireEvent, render, screen } from "@testing-library/react-native";

import { MoodSlider } from "@/components/ui/mood-slider";

async function layoutSlider(width = 200) {
  const slider = screen.getByLabelText("Test slider");

  await fireEvent(slider, "layout", {
    nativeEvent: { layout: { x: 0, y: 0, width, height: 24 } },
  });

  return slider;
}

describe("MoodSlider", () => {
  it("maps touch position on the track to a fraction", async () => {
    const onChange = jest.fn();

    await render(
      <MoodSlider label="Test slider" value={0.5} onChange={onChange} />,
    );

    const slider = await layoutSlider();

    await fireEvent(slider, "responderGrant", {
      nativeEvent: { locationX: 150 },
    });

    expect(onChange).toHaveBeenCalledWith(0.75);
  });

  it("clamps touches beyond the track edges", async () => {
    const onChange = jest.fn();

    await render(
      <MoodSlider label="Test slider" value={0.5} onChange={onChange} />,
    );

    const slider = await layoutSlider();

    await fireEvent(slider, "responderMove", {
      nativeEvent: { locationX: 400 },
    });

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("ignores touches before the track is measured", async () => {
    const onChange = jest.fn();

    await render(
      <MoodSlider label="Test slider" value={0.5} onChange={onChange} />,
    );

    await fireEvent(screen.getByLabelText("Test slider"), "responderGrant", {
      nativeEvent: { locationX: 100 },
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("steps and clamps through accessibility actions", async () => {
    const onChange = jest.fn();

    await render(
      <MoodSlider label="Test slider" value={0.95} onChange={onChange} />,
    );

    const slider = screen.getByLabelText("Test slider");

    await fireEvent(slider, "accessibilityAction", {
      nativeEvent: { actionName: "increment" },
    });
    expect(onChange).toHaveBeenLastCalledWith(1);

    await fireEvent(slider, "accessibilityAction", {
      nativeEvent: { actionName: "decrement" },
    });
    expect(onChange).toHaveBeenLastCalledWith(0.85);
  });
});
