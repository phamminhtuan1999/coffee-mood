import { Text, View } from "react-native";

import { theme } from "@/constants/theme";

type LoadingSkeletonProps = {
  title: string;
  hint: string;
};

export function LoadingSkeleton({ title, hint }: LoadingSkeletonProps) {
  return (
    <View
      accessibilityLabel={title}
      accessibilityRole="progressbar"
      style={{
        gap: theme.spacing.xs,
        padding: theme.spacing.screen,
        borderRadius: theme.radius.card,
        borderCurve: "continuous",
        backgroundColor: theme.colors.background.cream50,
      }}
    >
      <Text
        selectable
        style={{
          ...theme.typography.caption,
          color: theme.colors.text.muted,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
      <View
        style={{
          height: 76,
          borderRadius: theme.spacing.md,
          backgroundColor: theme.colors.surface.skeletonBase,
        }}
      />
      <View
        style={{
          width: "72%",
          height: theme.spacing.sm,
          borderRadius: theme.spacing.xs,
          backgroundColor: theme.colors.surface.skeletonHighlight,
        }}
      />
      <View
        style={{
          width: "48%",
          height: theme.spacing.sm,
          borderRadius: theme.spacing.xs,
          backgroundColor: theme.colors.surface.skeletonBase,
        }}
      />
      <Text
        selectable
        style={{
          ...theme.typography.caption,
          color: theme.colors.text.muted,
          fontStyle: "italic",
        }}
      >
        {hint}
      </Text>
    </View>
  );
}
