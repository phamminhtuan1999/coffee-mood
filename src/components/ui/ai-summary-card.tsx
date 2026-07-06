import { Text, View } from "react-native";

import { theme } from "@/constants/theme";

type AISummaryCardProps = {
  eyebrow?: string;
  children: string;
  compact?: boolean;
};

export function AISummaryCard({
  eyebrow = "Vibe Summary",
  children,
  compact = false,
}: AISummaryCardProps) {
  return (
    <View
      style={{
        flexDirection: compact ? "row" : "column",
        gap: theme.spacing.sm,
        paddingHorizontal: compact ? theme.spacing.screen : theme.spacing.lg,
        paddingVertical: compact ? theme.spacing.md : theme.spacing.screen,
        borderRadius: theme.spacing.screen,
        borderCurve: "continuous",
        borderColor: theme.colors.surface.borderSoft,
        borderWidth: 1,
        backgroundColor: theme.colors.surface.glassCream,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.xs,
        }}
      >
        <View
          style={{
            width: 26,
            height: 26,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            backgroundColor: theme.colors.brand.latteBeige,
          }}
        >
          <Text
            selectable
            style={{
              ...theme.typography.caption,
              color: theme.colors.text.espresso900,
            }}
          >
            *
          </Text>
        </View>
        {!compact ? (
          <Text
            selectable
            style={{
              ...theme.typography.caption,
              color: theme.colors.text.muted,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </Text>
        ) : null}
      </View>
      <Text
        selectable
        style={{
          ...(compact ? theme.typography.caption : theme.typography.bodySmall),
          flex: compact ? 1 : undefined,
          color: theme.colors.text.espresso700,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
