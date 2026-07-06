import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import type { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";

import { theme } from "@/constants/theme";

type ButtonVariant = "primary" | "secondary";

type CafeButtonProps = {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  pressed?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};

export function CafeButton({
  label,
  variant = "primary",
  disabled = false,
  pressed = false,
  onPress,
}: CafeButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed: isPressed }) => {
        const active = pressed || isPressed;

        return {
          alignSelf: "flex-start",
          minHeight: 48,
          justifyContent: "center",
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm + theme.spacing.xxs,
          borderRadius: theme.radius.button,
          borderCurve: "continuous",
          borderWidth: isPrimary ? 0 : 1.5,
          borderColor: disabled
            ? theme.colors.surface.borderSoft
            : theme.colors.surface.borderStrong,
          backgroundColor: disabled
            ? theme.colors.surface.disabled
            : isPrimary
              ? active
                ? theme.colors.text.espresso700
                : theme.colors.text.espresso900
              : active
                ? theme.colors.surface.pressed
                : "transparent",
          opacity: active && !disabled ? 0.9 : 1,
          transform: [{ scale: active && !disabled ? 0.98 : 1 }],
          boxShadow: isPrimary && !disabled ? theme.shadows.button : undefined,
        };
      }}
    >
      <Text
        style={{
          ...theme.typography.bodySmall,
          fontFamily: theme.fonts.family.sansSemibold,
          color: disabled
            ? theme.colors.surface.disabledText
            : isPrimary
              ? theme.colors.background.cream50
              : theme.colors.text.espresso900,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type IconButtonProps = {
  symbol: `sf:${string}`;
  label: string;
  disabled?: boolean;
  selected?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  symbol,
  label,
  disabled = false,
  selected = false,
  onPress,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.photoPin,
        backgroundColor: disabled
          ? theme.colors.surface.disabled
          : selected
            ? theme.colors.text.espresso900
            : theme.colors.surface.cardCream,
        borderColor: selected
          ? theme.colors.text.espresso900
          : theme.colors.surface.borderMedium,
        borderWidth: 1,
        opacity: pressed && !disabled ? 0.82 : 1,
        transform: [{ scale: pressed && !disabled ? 0.96 : 1 }],
      })}
    >
      <View style={style}>
        <Image
          source={symbol}
          style={{
            width: 18,
            height: 18,
            tintColor: disabled
              ? theme.colors.surface.disabledText
              : selected
                ? theme.colors.background.cream50
                : theme.colors.text.espresso900,
          }}
        />
      </View>
    </Pressable>
  );
}
