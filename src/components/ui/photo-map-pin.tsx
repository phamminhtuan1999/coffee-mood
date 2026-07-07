import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import type { GestureResponderEvent } from "react-native";

import { theme } from "@/constants/theme";

type PinTone = "terracotta" | "latte" | "olive";

type PhotoMapPinProps = {
  label: string;
  score?: string;
  selected?: boolean;
  saved?: boolean;
  tone?: PinTone;
  onPress?: (event: GestureResponderEvent) => void;
};

type ClusteredPhotoPinProps = {
  count: number;
  label: string;
  tone?: PinTone;
  onPress?: (event: GestureResponderEvent) => void;
};

const pinTones = {
  terracotta: {
    base: theme.colors.brand.terracotta,
    accent: theme.colors.brand.roastedBrown,
    badge: theme.colors.score.great,
  },
  latte: {
    base: theme.colors.brand.latteBeige,
    accent: theme.colors.brand.roastedBrown,
    badge: theme.colors.score.good,
  },
  olive: {
    base: theme.colors.brand.oliveMatcha,
    accent: theme.colors.text.espresso700,
    badge: theme.colors.score.great,
  },
} as const;

export function PhotoMapPin({
  label,
  score,
  selected = false,
  saved = false,
  tone = "terracotta",
  onPress,
}: PhotoMapPinProps) {
  const colors = pinTones[tone];
  const size = selected ? 64 : 56;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        width: size + 16,
        height: size + 18,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.86 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius.photoPin,
          borderWidth: selected ? 3 : 0,
          borderColor: theme.colors.text.espresso900,
        }}
      >
        <View
          style={{
            width: size - (selected ? 8 : 0),
            height: size - (selected ? 8 : 0),
            overflow: "hidden",
            borderRadius: theme.radius.photoPin,
            borderWidth: 3,
            borderColor: theme.colors.background.cream50,
            backgroundColor: colors.base,
            boxShadow: theme.shadows.pin,
          }}
        >
          <View
            style={{
              position: "absolute",
              right: -8,
              bottom: -12,
              width: size * 0.72,
              height: size * 0.72,
              borderRadius: theme.radius.photoPin,
              backgroundColor: colors.accent,
            }}
          />
          <View
            style={{
              position: "absolute",
              left: size * 0.12,
              top: size * 0.12,
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.surface.glassCream,
            }}
          />
        </View>
      </View>

      {score ? (
        <View
          style={{
            position: "absolute",
            right: selected ? 2 : 4,
            bottom: 2,
            paddingHorizontal: theme.spacing.xs,
            paddingVertical: 3,
            borderRadius: theme.spacing.xs,
            borderWidth: 2,
            borderColor: theme.colors.background.cream50,
            backgroundColor: colors.badge,
          }}
        >
          <Text
            style={{
              ...theme.typography.caption,
              fontFamily: theme.fonts.family.sansBold,
              fontSize: 10,
              lineHeight: 12,
              color: theme.colors.background.cream50,
            }}
          >
            {score}
          </Text>
        </View>
      ) : null}

      {saved ? (
        <View
          style={{
            position: "absolute",
            top: 1,
            right: 3,
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            borderWidth: 2,
            borderColor: theme.colors.background.cream50,
            backgroundColor: theme.colors.brand.terracotta,
          }}
        >
          <Image
            source="sf:bookmark.fill"
            style={{
              width: 11,
              height: 11,
              tintColor: theme.colors.background.cream50,
            }}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

export function ClusteredPhotoPin({
  count,
  label,
  tone = "latte",
  onPress,
}: ClusteredPhotoPinProps) {
  const colors = pinTones[tone];

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        width: 62,
        height: 62,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.86 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <View
        style={{
          width: 48,
          height: 48,
          overflow: "hidden",
          borderRadius: theme.radius.photoPin,
          borderWidth: 3,
          borderColor: theme.colors.background.cream50,
          backgroundColor: colors.base,
          boxShadow: theme.shadows.pin,
          opacity: 0.92,
        }}
      >
        <View
          style={{
            position: "absolute",
            right: -6,
            bottom: -10,
            width: 34,
            height: 34,
            borderRadius: theme.radius.photoPin,
            backgroundColor: colors.accent,
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          right: 2,
          bottom: 2,
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: 3,
          borderRadius: theme.spacing.xs,
          borderWidth: 2,
          borderColor: theme.colors.background.cream50,
          backgroundColor: theme.colors.text.espresso900,
        }}
      >
        <Text
          style={{
            ...theme.typography.caption,
            fontFamily: theme.fonts.family.sansBold,
            fontSize: 10,
            lineHeight: 12,
            color: theme.colors.background.cream50,
          }}
        >
          +{count}
        </Text>
      </View>
    </Pressable>
  );
}
