import { Text, View } from "react-native";

import { theme } from "@/constants/theme";

type RouteStopCardProps = {
  index: number;
  name: string;
  tag: string;
  isLast?: boolean;
};

export function RouteStopCard({
  index,
  name,
  tag,
  isLast = false,
}: RouteStopCardProps) {
  return (
    <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
      <View
        style={{
          width: theme.spacing.screen,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: theme.spacing.screen,
            height: theme.spacing.screen,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            backgroundColor:
              index === 1
                ? theme.colors.brand.terracotta
                : theme.colors.brand.oliveMatcha,
          }}
        >
          <Text
            style={{
              ...theme.typography.caption,
              color: theme.colors.background.cream50,
            }}
          >
            {index}
          </Text>
        </View>
        {!isLast ? (
          <View
            style={{
              flex: 1,
              width: 2,
              minHeight: theme.spacing.xl,
              backgroundColor: theme.colors.surface.borderMedium,
            }}
          />
        ) : null}
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
          padding: theme.spacing.md,
          marginBottom: isLast ? 0 : theme.spacing.sm,
          borderRadius: theme.radius.button,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: theme.colors.surface.borderSoft,
          backgroundColor: theme.colors.surface.cardCream,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: theme.spacing.sm,
            backgroundColor: theme.colors.brand.latteBeige,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              color: theme.colors.text.muted,
            }}
          >
            {tag}
          </Text>
        </View>
      </View>
    </View>
  );
}
