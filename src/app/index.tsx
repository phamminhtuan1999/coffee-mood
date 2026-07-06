import { ScrollView, Text, View } from "react-native";

import { theme } from "@/constants/theme";

const colorSwatches = [
  theme.colors.background.cream50,
  theme.colors.background.cream100,
  theme.colors.background.warmPaper,
  theme.colors.brand.roastedBrown,
  theme.colors.brand.latteBeige,
  theme.colors.brand.oliveMatcha,
  theme.colors.brand.terracotta,
  theme.colors.score.great,
  theme.colors.score.good,
  theme.colors.score.crowded,
] as const;

export default function Index() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        flexGrow: 1,
        gap: theme.spacing.lg,
        padding: theme.spacing.screen,
        paddingTop: theme.spacing.xxxl,
      }}
    >
      <View style={{ gap: theme.spacing.sm }}>
        <Text
          selectable
          style={{
            ...theme.typography.caption,
            color: theme.colors.brand.terracotta,
            textTransform: "uppercase",
          }}
        >
          Ambient Editorial Map
        </Text>
        <Text
          selectable
          style={{
            ...theme.typography.display,
            color: theme.colors.text.espresso900,
          }}
        >
          CafeMood Map
        </Text>
        <Text
          selectable
          style={{
            ...theme.typography.body,
            color: theme.colors.text.muted,
          }}
        >
          Find cafes by vibe, not just rating.
        </Text>
      </View>

      <View
        style={{
          gap: theme.spacing.md,
          padding: theme.spacing.screen,
          borderRadius: theme.radius.card,
          borderCurve: "continuous",
          borderColor: theme.colors.surface.borderSoft,
          borderWidth: 1,
          backgroundColor: theme.colors.surface.cardCream,
          boxShadow: theme.shadows.card,
        }}
      >
        <Text
          selectable
          style={{
            ...theme.typography.sectionTitle,
            color: theme.colors.text.espresso900,
          }}
        >
          Token foundation
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs,
          }}
        >
          {colorSwatches.map((color) => (
            <View
              key={color}
              style={{
                width: theme.spacing.xl,
                height: theme.spacing.xl,
                borderRadius: theme.radius.photoPin,
                borderColor: theme.colors.background.cream50,
                borderWidth: 2,
                backgroundColor: color,
                boxShadow: theme.shadows.pin,
              }}
            />
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs,
          }}
        >
          {["Work", "Date", "Quiet", "Aesthetic"].map((label) => (
            <View
              key={label}
              style={{
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.radius.chip,
                backgroundColor: theme.colors.background.cream100,
                borderColor: theme.colors.surface.borderSoft,
                borderWidth: 1,
              }}
            >
              <Text
                selectable
                style={{
                  ...theme.typography.chipLabel,
                  color: theme.colors.text.espresso700,
                }}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          alignSelf: "flex-start",
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: theme.radius.button,
          borderCurve: "continuous",
          backgroundColor: theme.colors.text.espresso900,
          boxShadow: theme.shadows.button,
        }}
      >
        <Text
          selectable
          style={{
            ...theme.typography.chipLabel,
            color: theme.colors.background.cream50,
          }}
        >
          Start with the map
        </Text>
      </View>
    </ScrollView>
  );
}
