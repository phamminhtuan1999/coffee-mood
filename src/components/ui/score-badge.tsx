import { Text, View } from "react-native";

import { theme } from "@/constants/theme";

type ScoreTone = "great" | "good" | "crowded";

type ScoreBadgeProps = {
  label: string;
  score: string;
  tone?: ScoreTone;
};

const toneColor = {
  great: theme.colors.score.great,
  good: theme.colors.score.good,
  crowded: theme.colors.score.crowded,
} as const;

export function ScoreBadge({ label, score, tone = "great" }: ScoreBadgeProps) {
  return (
    <View
      style={{
        minHeight: 34,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.spacing.sm,
        backgroundColor: theme.colors.surface.cardCream,
        borderColor: theme.colors.surface.borderSoft,
        borderWidth: 1,
      }}
    >
      <View
        style={{
          width: theme.spacing.xs,
          height: theme.spacing.xs,
          borderRadius: theme.radius.photoPin,
          backgroundColor: toneColor[tone],
        }}
      />
      <Text
        selectable
        style={{
          ...theme.typography.chipLabel,
          color: theme.colors.text.espresso700,
        }}
      >
        {label}
      </Text>
      <Text
        selectable
        style={{
          ...theme.typography.chipLabel,
          fontFamily: theme.fonts.family.sansBold,
          color: theme.colors.text.espresso900,
        }}
      >
        {score}
      </Text>
    </View>
  );
}
