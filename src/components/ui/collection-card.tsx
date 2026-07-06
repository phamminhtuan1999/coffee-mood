import { Text, View } from "react-native";

import { theme } from "@/constants/theme";

type CollectionCardProps = {
  title: string;
  count: string;
  accent?: "olive" | "terracotta" | "latte";
};

const accentColor = {
  olive: theme.colors.brand.oliveMatcha,
  terracotta: theme.colors.brand.terracotta,
  latte: theme.colors.brand.latteBeige,
} as const;

export function CollectionCard({
  title,
  count,
  accent = "olive",
}: CollectionCardProps) {
  return (
    <View
      style={{
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: theme.radius.card,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.surface.cardCream,
        boxShadow: theme.shadows.card,
      }}
    >
      <View style={{ height: 92 }}>
        <View
          style={{
            position: "absolute",
            inset: theme.spacing.md,
            borderRadius: theme.spacing.md,
            backgroundColor: theme.colors.background.warmPaper,
            transform: [{ rotate: "-4deg" }],
          }}
        />
        <View
          style={{
            position: "absolute",
            inset: theme.spacing.xs,
            borderRadius: theme.spacing.md,
            backgroundColor: accentColor[accent],
            transform: [{ rotate: "3deg" }],
          }}
        />
      </View>
      <View>
        <Text
          selectable
          style={{
            ...theme.typography.sectionTitle,
            color: theme.colors.text.espresso900,
          }}
        >
          {title}
        </Text>
        <Text
          selectable
          style={{
            ...theme.typography.caption,
            color: theme.colors.text.muted,
          }}
        >
          {count}
        </Text>
      </View>
    </View>
  );
}
