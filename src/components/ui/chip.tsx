import { Pressable, Text } from "react-native";
import type { GestureResponderEvent } from "react-native";

import { theme } from "@/constants/theme";

type ChipProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};

export function VibeChip({
  label,
  selected = false,
  disabled = false,
  onPress,
}: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs + theme.spacing.xxs / 2,
        borderRadius: theme.radius.chip,
        borderWidth: 1,
        borderColor: selected
          ? theme.colors.text.espresso900
          : theme.colors.surface.borderMedium,
        backgroundColor: disabled
          ? theme.colors.surface.disabled
          : selected
            ? theme.colors.text.espresso900
            : theme.colors.surface.cardCream,
        opacity: pressed && !disabled ? 0.82 : 1,
      })}
    >
      <Text
        style={{
          ...theme.typography.chipLabel,
          color: disabled
            ? theme.colors.surface.disabledText
            : selected
              ? theme.colors.background.cream50
              : theme.colors.text.espresso700,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function PreferenceChip({
  label,
  selected = false,
  disabled = false,
  onPress,
}: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radius.chip,
        borderWidth: 1,
        borderColor: selected
          ? theme.colors.brand.terracotta
          : theme.colors.surface.borderSoft,
        backgroundColor: disabled
          ? theme.colors.surface.disabled
          : selected
            ? theme.colors.background.cream100
            : theme.colors.surface.cardCream,
        opacity: pressed && !disabled ? 0.84 : 1,
      })}
    >
      <Text
        style={{
          ...theme.typography.chipLabel,
          color: disabled
            ? theme.colors.surface.disabledText
            : selected
              ? theme.colors.brand.roastedBrown
              : theme.colors.text.espresso700,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
