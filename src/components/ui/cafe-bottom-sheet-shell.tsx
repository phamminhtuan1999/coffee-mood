import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { CafeButton, IconButton } from "@/components/ui/button";
import { PreferenceChip } from "@/components/ui/chip";
import { AISummaryCard } from "@/components/ui/ai-summary-card";
import { theme } from "@/constants/theme";

export type CafeBottomSheetSnapPoint = "collapsed" | "half" | "expanded";
type CafeSheetTone = "terracotta" | "latte" | "olive";

type CafeSheetScore = {
  label: string;
  value: string;
};

type CafeBottomSheetShellProps = {
  snapPoint?: CafeBottomSheetSnapPoint;
  onSnapPointChange?: (snapPoint: CafeBottomSheetSnapPoint) => void;
  name: string;
  meta: string;
  score: string;
  vibe: string;
  tags: string[];
  scores: CafeSheetScore[];
  summary: string;
  tone?: CafeSheetTone;
  photoCount?: number;
  whyItMatches?: string[];
  peopleLove?: string[];
  watchOutFor?: string[];
  floating?: boolean;
  saved?: boolean;
  onSave?: () => void;
  onOpenDetail?: () => void;
};

const snapHeight = {
  collapsed: 132,
  half: 500,
  expanded: 728,
} as const;

const snapOrder: CafeBottomSheetSnapPoint[] = ["collapsed", "half", "expanded"];

const toneColors = {
  terracotta: {
    base: theme.colors.brand.terracotta,
    accent: theme.colors.brand.roastedBrown,
  },
  latte: {
    base: theme.colors.brand.latteBeige,
    accent: theme.colors.brand.roastedBrown,
  },
  olive: {
    base: theme.colors.brand.oliveMatcha,
    accent: theme.colors.text.espresso700,
  },
} as const;

export function CafeBottomSheetShell({
  snapPoint = "half",
  onSnapPointChange,
  name,
  meta,
  score,
  vibe,
  tags,
  scores,
  summary,
  tone = "terracotta",
  photoCount = 24,
  whyItMatches = [],
  peopleLove = [],
  watchOutFor = [],
  floating = false,
  saved = false,
  onSave,
  onOpenDetail,
}: CafeBottomSheetShellProps) {
  const height = useDerivedValue(
    () => withTiming(snapHeight[snapPoint], { duration: 220 }),
    [snapPoint],
  );
  const showHalf = snapPoint === "half" || snapPoint === "expanded";
  const showExpanded = snapPoint === "expanded";
  const colors = toneColors[tone];

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const requestSnap = (nextSnapPoint: CafeBottomSheetSnapPoint) => {
    onSnapPointChange?.(nextSnapPoint);
  };

  const snapByDirection = (direction: "up" | "down") => {
    const currentIndex = snapOrder.indexOf(snapPoint);
    const nextIndex =
      direction === "up"
        ? Math.min(currentIndex + 1, snapOrder.length - 1)
        : Math.max(currentIndex - 1, 0);

    requestSnap(snapOrder[nextIndex]);
  };

  const cycleSnapPoint = () => {
    const currentIndex = snapOrder.indexOf(snapPoint);
    requestSnap(snapOrder[(currentIndex + 1) % snapOrder.length]);
  };

  const panGesture = Gesture.Pan().onEnd((event) => {
    const shouldExpand = event.translationY < -38 || event.velocityY < -360;
    const shouldCollapse = event.translationY > 38 || event.velocityY > 360;

    if (shouldExpand) {
      runOnJS(snapByDirection)("up");
      return;
    }

    if (shouldCollapse) {
      runOnJS(snapByDirection)("down");
    }
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Reanimated.View
        style={[{
        overflow: "hidden",
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
        paddingBottom: showExpanded ? 34 : theme.spacing.lg,
        borderTopLeftRadius: theme.radius.bottomSheetTop,
        borderTopRightRadius: theme.radius.bottomSheetTop,
        borderBottomLeftRadius: floating && !showExpanded ? theme.radius.imageCard : 0,
        borderBottomRightRadius: floating && !showExpanded ? theme.radius.imageCard : 0,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.background.cream50,
        boxShadow: theme.shadows.card,
      }, animatedStyle]}
      >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Cafe sheet ${snapPoint}; tap to change size`}
        onPress={cycleSnapPoint}
        style={{
          alignSelf: "center",
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.xxs,
          paddingBottom: theme.spacing.sm,
        }}
      >
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.surface.borderStrong,
          }}
        />
      </Pressable>

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
            backgroundColor: colors.base,
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
              backgroundColor: colors.accent,
            }}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${name} details`}
          disabled={!onOpenDetail}
          onPress={onOpenDetail}
          style={({ pressed }) => ({
            flex: 1,
            minWidth: 0,
            opacity: pressed && onOpenDetail ? 0.72 : 1,
          })}
        >
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
            {showHalf ? meta : vibe}
          </Text>
        </Pressable>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            paddingBottom: showExpanded ? theme.spacing.lg : 0,
          }}
        >
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
              onPress={onSave}
            />
            <CafeButton label="Directions" />
            <CafeButton label="View Photos" variant="secondary" />
          </View>

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
                    height: 92,
                    overflow: "hidden",
                    borderRadius: theme.spacing.md,
                    backgroundColor: color,
                  }}
                >
                  {index === 2 ? (
                    <View
                      style={{
                        position: "absolute",
                        inset: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.colors.surface.overlayDark,
                      }}
                    >
                      <Text
                        style={{
                          ...theme.typography.chipLabel,
                          fontFamily: theme.fonts.family.sansBold,
                          color: theme.colors.background.cream50,
                        }}
                      >
                        +{photoCount}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ),
            )}
          </View>

          <SheetSection title="Why it matches">
            {whyItMatches.map((item, index) => (
              <InsightRow
                key={item}
                text={item}
                color={
                  index === 0
                    ? theme.colors.brand.terracotta
                    : index === 1
                      ? theme.colors.score.great
                      : theme.colors.brand.latteBeige
                }
              />
            ))}
          </SheetSection>

          <SheetSection title="People love">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.xs }}>
              {peopleLove.map((item) => (
                <SheetPill key={item} label={item} tone="positive" />
              ))}
            </View>
          </SheetSection>

          <SheetSection title="Watch out for">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.xs }}>
              {watchOutFor.map((item) => (
                <SheetPill key={item} label={item} tone="caution" />
              ))}
            </View>
          </SheetSection>

          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.xs,
              marginTop: theme.spacing.sm,
            }}
          >
            <CafeButton label="Add to Route" />
            <CafeButton label="Directions" variant="secondary" />
          </View>
        </View>
      ) : null}
        </ScrollView>
      ) : null}
      </Reanimated.View>
    </GestureDetector>
  );
}

type SheetSectionProps = {
  title: string;
  children: ReactNode;
};

function SheetSection({ title, children }: SheetSectionProps) {
  return (
    <View style={{ gap: theme.spacing.xs, marginTop: theme.spacing.sm }}>
      <Text
        style={{
          ...theme.typography.caption,
          fontFamily: theme.fonts.family.sansBold,
          color: theme.colors.brand.terracotta,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function InsightRow({ text, color }: { text: string; color: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: theme.spacing.xs,
      }}
    >
      <View
        style={{
          width: 7,
          height: 7,
          marginTop: 7,
          borderRadius: theme.radius.photoPin,
          backgroundColor: color,
        }}
      />
      <Text
        style={{
          ...theme.typography.caption,
          flex: 1,
          lineHeight: 18,
          color: theme.colors.text.espresso700,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

function SheetPill({
  label,
  tone,
}: {
  label: string;
  tone: "positive" | "caution";
}) {
  return (
    <View
      style={{
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 6,
        borderRadius: theme.radius.chip,
        backgroundColor:
          tone === "positive"
            ? theme.colors.surface.positiveSoft
            : theme.colors.surface.cautionSoft,
      }}
    >
      <Text
        style={{
          ...theme.typography.caption,
          color: theme.colors.text.espresso700,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
