import { Image } from "expo-image";
import { Text, View } from "react-native";

import { CafeButton, IconButton } from "@/components/ui/button";
import { PreferenceChip } from "@/components/ui/chip";
import { AISummaryCard } from "@/components/ui/ai-summary-card";
import { theme } from "@/constants/theme";

type SnapPoint = "collapsed" | "half" | "expanded";

type CafeSheetScore = {
  label: string;
  value: string;
};

type CafeBottomSheetShellProps = {
  snapPoint?: SnapPoint;
  name: string;
  meta: string;
  score: string;
  tags: string[];
  scores: CafeSheetScore[];
  summary: string;
  saved?: boolean;
};

const snapHeight = {
  collapsed: 126,
  half: 448,
  expanded: 620,
} as const;

export function CafeBottomSheetShell({
  snapPoint = "half",
  name,
  meta,
  score,
  tags,
  scores,
  summary,
  saved = false,
}: CafeBottomSheetShellProps) {
  const showHalf = snapPoint === "half" || snapPoint === "expanded";
  const showExpanded = snapPoint === "expanded";

  return (
    <View
      style={{
        height: snapHeight[snapPoint],
        overflow: "hidden",
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.lg,
        borderTopLeftRadius: theme.radius.bottomSheetTop,
        borderTopRightRadius: theme.radius.bottomSheetTop,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.background.cream50,
        boxShadow: theme.shadows.card,
      }}
    >
      <View
        style={{
          width: 36,
          height: 4,
          alignSelf: "center",
          marginBottom: theme.spacing.sm,
          borderRadius: theme.radius.chip,
          backgroundColor: theme.colors.surface.borderStrong,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        <View
          style={{
            width: 54,
            height: 54,
            overflow: "hidden",
            borderRadius: theme.spacing.md,
            backgroundColor: theme.colors.brand.terracotta,
          }}
        >
          <View
            style={{
              position: "absolute",
              right: -8,
              bottom: -12,
              width: 44,
              height: 44,
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.brand.roastedBrown,
            }}
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.sectionTitle,
              fontFamily: theme.fonts.family.serifSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            {name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.caption,
              color: theme.colors.text.muted,
            }}
          >
            {meta}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xxs,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.spacing.sm,
            backgroundColor: theme.colors.surface.pressed,
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.score.great,
            }}
          />
          <Text
            style={{
              ...theme.typography.chipLabel,
              fontFamily: theme.fonts.family.sansBold,
              color: theme.colors.text.espresso900,
            }}
          >
            {score}
          </Text>
        </View>
      </View>

      {showHalf ? (
        <>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: theme.spacing.xs,
              marginTop: theme.spacing.sm,
            }}
          >
            {tags.map((tag) => (
              <PreferenceChip key={tag} label={tag} selected />
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.xs,
              marginTop: theme.spacing.sm,
            }}
          >
            {scores.map((item) => (
              <View
                key={item.label}
                style={{
                  flex: 1,
                  alignItems: "center",
                  padding: theme.spacing.xs,
                  borderRadius: theme.spacing.sm,
                  borderWidth: 1,
                  borderColor: theme.colors.surface.borderSoft,
                  backgroundColor: theme.colors.surface.cardCream,
                }}
              >
                <Text
                  style={{
                    ...theme.typography.bodySmall,
                    fontFamily: theme.fonts.family.sansBold,
                    color: theme.colors.text.espresso900,
                  }}
                >
                  {item.value}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    ...theme.typography.caption,
                    fontSize: 10,
                    color: theme.colors.text.muted,
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: theme.spacing.sm }}>
            <AISummaryCard compact>{summary}</AISummaryCard>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
              marginTop: theme.spacing.sm,
            }}
          >
            <IconButton
              symbol={saved ? "sf:heart.fill" : "sf:heart"}
              label={saved ? "Saved cafe" : "Save cafe"}
              selected={saved}
            />
            <CafeButton label="Directions" />
            <CafeButton label="View Photos" variant="secondary" />
          </View>
        </>
      ) : null}

      {showExpanded ? (
        <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.xs,
            }}
          >
            {[theme.colors.brand.latteBeige, theme.colors.brand.oliveMatcha, theme.colors.brand.terracotta].map(
              (color, index) => (
                <View
                  key={`${color}-${index}`}
                  style={{
                    flex: 1,
                    height: 62,
                    overflow: "hidden",
                    borderRadius: theme.spacing.md,
                    backgroundColor: color,
                  }}
                />
              ),
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
            }}
          >
            <Image
              source="sf:sparkles"
              style={{
                width: 14,
                height: 14,
                tintColor: theme.colors.brand.terracotta,
              }}
            />
            <Text
              style={{
                ...theme.typography.bodySmall,
                flex: 1,
                color: theme.colors.text.espresso700,
              }}
            >
              Matches aesthetic photos, specialty coffee, and quick café-hop
              stops.
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
