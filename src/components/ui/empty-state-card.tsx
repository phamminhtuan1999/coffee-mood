import { Text, View } from "react-native";

import { CafeButton } from "@/components/ui/button";
import { theme } from "@/constants/theme";

type EmptyStateCardProps = {
  title: string;
  copy: string;
  cta: string;
  tone?: "coffee" | "route" | "saved";
};

const motifColor = {
  coffee: theme.colors.brand.roastedBrown,
  route: theme.colors.brand.oliveMatcha,
  saved: theme.colors.brand.terracotta,
} as const;

export function EmptyStateCard({
  title,
  copy,
  cta,
  tone = "coffee",
}: EmptyStateCardProps) {
  return (
    <View
      style={{
        alignItems: "center",
        gap: theme.spacing.sm,
        padding: theme.spacing.lg,
        borderRadius: theme.radius.card,
        borderCurve: "continuous",
        backgroundColor: theme.colors.background.cream50,
      }}
    >
      <View
        style={{
          width: 84,
          height: 84,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius.photoPin,
          backgroundColor: theme.colors.background.warmPaper,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: theme.radius.photoPin,
            borderWidth: 3,
            borderColor: theme.colors.background.cream50,
            backgroundColor: motifColor[tone],
          }}
        />
      </View>
      <Text
        style={{
          ...theme.typography.sectionTitle,
          fontFamily: theme.fonts.family.serifMedium,
          color: theme.colors.text.espresso900,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          ...theme.typography.caption,
          color: theme.colors.text.muted,
          textAlign: "center",
        }}
      >
        {copy}
      </Text>
      <CafeButton label={cta} />
    </View>
  );
}
