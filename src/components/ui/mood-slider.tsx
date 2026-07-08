import { useState } from "react";
import { View } from "react-native";
import type { GestureResponderEvent } from "react-native";

import { theme } from "@/constants/theme";

type MoodSliderProps = {
  label: string;
  // Fractional position, 0..1.
  value: number;
  onChange: (value: number) => void;
  // Fractional step used by accessibility increment/decrement.
  step?: number;
};

const KNOB_SIZE = 20;

function clampFraction(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function MoodSlider({
  label,
  value,
  onChange,
  step = 0.1,
}: MoodSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const handleTouch = (event: GestureResponderEvent) => {
    if (trackWidth <= 0) {
      return;
    }

    onChange(clampFraction(event.nativeEvent.locationX / trackWidth));
  };

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === "increment") {
          onChange(clampFraction(value + step));
        }

        if (event.nativeEvent.actionName === "decrement") {
          onChange(clampFraction(value - step));
        }
      }}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleTouch}
      onResponderMove={handleTouch}
      style={{ height: 24, justifyContent: "center" }}
    >
      <View
        style={{
          height: 4,
          borderRadius: theme.radius.chip,
          backgroundColor: theme.colors.surface.borderMedium,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 0,
          width: trackWidth * value,
          height: 4,
          borderRadius: theme.radius.chip,
          backgroundColor: theme.colors.brand.terracotta,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: Math.max(0, trackWidth * value - KNOB_SIZE / 2),
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          borderRadius: theme.radius.photoPin,
          borderWidth: 2,
          borderColor: theme.colors.brand.terracotta,
          backgroundColor: theme.colors.background.cream50,
          boxShadow: theme.shadows.button,
        }}
      />
    </View>
  );
}
