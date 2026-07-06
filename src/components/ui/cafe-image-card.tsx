import { Text, View } from "react-native";

import { theme } from "@/constants/theme";

type CafeImageCardProps = {
  title: string;
  meta?: string;
  accent?: "terracotta" | "olive" | "latte";
  featured?: boolean;
};

const accentColor = {
  terracotta: theme.colors.brand.terracotta,
  olive: theme.colors.brand.oliveMatcha,
  latte: theme.colors.brand.latteBeige,
} as const;

export function CafeImageCard({
  title,
  meta,
  accent = "terracotta",
  featured = false,
}: CafeImageCardProps) {
  return (
    <View
      style={{
        minHeight: 178,
        overflow: "hidden",
        justifyContent: "flex-end",
        padding: theme.spacing.md,
        borderRadius: theme.radius.imageCard,
        borderCurve: "continuous",
        backgroundColor: accentColor[accent],
        boxShadow: theme.shadows.card,
      }}
    >
      <View
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: theme.colors.surface.overlayDark,
        }}
      />
      {featured ? (
        <View
          style={{
            position: "absolute",
            top: theme.spacing.md,
            left: theme.spacing.md,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xxs,
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          <Text
            selectable
            style={{
              ...theme.typography.caption,
              color: theme.colors.brand.roastedBrown,
            }}
          >
            Featured
          </Text>
        </View>
      ) : null}
      <Text
        selectable
        style={{
          ...theme.typography.sectionTitle,
          fontFamily: theme.fonts.family.serifMedium,
          color: theme.colors.background.cream50,
        }}
      >
        {title}
      </Text>
      {meta ? (
        <Text
          selectable
          style={{
            ...theme.typography.caption,
            color: theme.colors.background.cream100,
          }}
        >
          {meta}
        </Text>
      ) : null}
    </View>
  );
}
