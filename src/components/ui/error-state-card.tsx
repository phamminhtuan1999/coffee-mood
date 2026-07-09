import { Pressable, Text, View } from "react-native";

import { theme } from "@/constants/theme";

// Section H error card: gentle ! badge, serif title, helpful copy, outline
// CTA. Errors are helpful, not scary (library-profile.md).

type ErrorStateCardProps = {
  title: string;
  copy: string;
  cta: string;
  onCtaPress?: () => void;
};

export function ErrorStateCard({
  title,
  copy,
  cta,
  onCtaPress,
}: ErrorStateCardProps) {
  return (
    <View
      style={{
        alignItems: "center",
        padding: theme.spacing.lg,
        borderRadius: theme.radius.card,
        borderCurve: "continuous",
        backgroundColor: theme.colors.background.cream50,
      }}
    >
      <View
        style={{
          width: 46,
          height: 46,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius.photoPin,
          backgroundColor: theme.colors.surface.cautionSoft,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: theme.fonts.family.sansBold,
            color: theme.colors.score.crowded,
          }}
        >
          !
        </Text>
      </View>
      <Text
        style={{
          fontFamily: theme.fonts.family.serifSemibold,
          fontSize: 16,
          lineHeight: 21,
          textAlign: "center",
          marginTop: theme.spacing.sm + 2,
          color: theme.colors.text.espresso900,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          ...theme.typography.caption,
          lineHeight: 19,
          textAlign: "center",
          marginTop: theme.spacing.xs - 1,
          color: theme.colors.text.muted,
        }}
      >
        {copy}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={cta}
        onPress={onCtaPress}
        style={({ pressed }) => ({
          paddingVertical: theme.spacing.xs + 2,
          paddingHorizontal: theme.spacing.screen,
          marginTop: theme.spacing.md,
          borderRadius: theme.radius.button - 5,
          borderCurve: "continuous",
          borderWidth: 1.5,
          borderColor: theme.colors.surface.borderStrong,
          backgroundColor: pressed
            ? theme.colors.surface.pressed
            : "transparent",
        })}
      >
        <Text
          style={{
            ...theme.typography.caption,
            fontFamily: theme.fonts.family.sansSemibold,
            color: theme.colors.text.espresso900,
          }}
        >
          {cta}
        </Text>
      </Pressable>
    </View>
  );
}
