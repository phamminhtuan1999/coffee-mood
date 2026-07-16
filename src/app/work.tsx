import { router, useLocalSearchParams } from "expo-router";
import { useState, useSyncExternalStore } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { VibeChip } from "@/components/ui";
import { theme } from "@/constants/theme";
import {
  DEFAULT_WORK_INPUTS,
  WORK_END_TIMES,
  WORK_NEEDS,
  WORK_START_TIMES,
  sessionSentence,
} from "@/data/work-planner";
import type {
  WorkNeed,
  WorkSessionInputs,
  WorkSpotResult,
  WorkSpotsPlan,
} from "@/data/work-planner";
import type { CafeMapPinTone } from "@/data/map-pins";
import { planWorkSpots } from "@/utils/planner-cafes";
import {
  getSavedState,
  isCafeSaved,
  quickToggleSave,
  subscribeSaved,
} from "@/utils/saved-store";

const photoSwatch: Record<CafeMapPinTone, string> = {
  terracotta: theme.colors.brand.terracotta,
  latte: theme.colors.brand.latteBeige,
  olive: theme.colors.brand.oliveMatcha,
};

const statInk = {
  positive: theme.colors.score.greatInk,
  caution: theme.colors.score.crowdedInk,
} as const;

function cycle<T>(options: readonly T[], current: T): T {
  const index = options.indexOf(current);

  return options[(index + 1) % options.length];
}

export default function WorkPlannerScreen() {
  const params = useLocalSearchParams<{ state?: string }>();
  const insets = useSafeAreaInsets();
  const [inputs, setInputs] = useState<WorkSessionInputs>({
    ...DEFAULT_WORK_INPUTS,
  });
  // QA override ?state=results renders the ranked results on load so the
  // simulator smoke can capture the full screen deterministically.
  const [plan, setPlan] = useState<WorkSpotsPlan | null>(() =>
    params.state === "results" ? planWorkSpots(DEFAULT_WORK_INPUTS) : null,
  );
  const savedState = useSyncExternalStore(subscribeSaved, getSavedState);

  const toggleNeed = (need: WorkNeed) =>
    setInputs((current) => ({
      ...current,
      needs: current.needs.includes(need)
        ? current.needs.filter((item) => item !== need)
        : [...current.needs, need],
    }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.xl,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.xxl,
        }}
      >
        <Text
          style={{
            fontFamily: theme.fonts.family.serifSemibold,
            fontSize: 26,
            lineHeight: 32,
            color: theme.colors.text.espresso900,
          }}
        >
          Where should I work today?
        </Text>

        <View
          style={{
            marginTop: theme.spacing.md + 2,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.md + 2,
            borderRadius: theme.spacing.screen,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: theme.colors.surface.borderMedium,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontStyle: "italic",
              color: theme.colors.text.espresso700,
            }}
          >
            {sessionSentence(inputs)}
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.xs + 1,
              marginTop: theme.spacing.sm + 2,
            }}
          >
            <TimeField
              label="Start"
              value={inputs.start}
              onPress={() =>
                setInputs((current) => ({
                  ...current,
                  start: cycle(WORK_START_TIMES, current.start),
                }))
              }
            />
            <TimeField
              label="End"
              value={inputs.end}
              onPress={() =>
                setInputs((current) => ({
                  ...current,
                  end: cycle(WORK_END_TIMES, current.end),
                }))
              }
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: theme.spacing.xs,
              marginTop: theme.spacing.sm,
            }}
          >
            {WORK_NEEDS.map((need) => (
              <VibeChip
                key={need}
                label={need}
                selected={inputs.needs.includes(need)}
                onPress={() => toggleNeed(need)}
              />
            ))}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Find Work Spots"
          onPress={() => setPlan(planWorkSpots(inputs))}
          style={({ pressed }) => ({
            minHeight: theme.sizing.control,
            alignItems: "center",
            justifyContent: "center",
            marginTop: theme.spacing.md,
            borderRadius: theme.radius.button,
            borderCurve: "continuous",
            backgroundColor: pressed
              ? theme.colors.text.espresso700
              : theme.colors.text.espresso900,
            boxShadow: theme.shadows.button,
          })}
        >
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.background.cream50,
            }}
          >
            Find Work Spots
          </Text>
        </Pressable>

        {plan ? (
          <>
            <Text
              style={{
                ...theme.typography.caption,
                fontFamily: theme.fonts.family.sansBold,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginTop: theme.spacing.lg,
                color: theme.colors.text.muted,
              }}
            >
              Best for your session
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: theme.spacing.xs + 1,
                marginTop: theme.spacing.sm,
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md - 1,
                borderRadius: theme.radius.button,
                borderCurve: "continuous",
                borderWidth: 1,
                borderColor: theme.colors.surface.borderSoft,
                backgroundColor: theme.colors.surface.glassCream,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: theme.radius.photoPin,
                  backgroundColor: theme.colors.brand.latteBeige,
                }}
              >
                <Text style={{ ...theme.typography.caption, fontSize: 10 }}>✦</Text>
              </View>
              <Text
                style={{
                  ...theme.typography.caption,
                  flex: 1,
                  lineHeight: 18,
                  color: theme.colors.text.espresso700,
                }}
              >
                {plan.bestReason}
              </Text>
            </View>

            {plan.results.map((result) => (
              <WorkSpotCard
                key={result.cafeId}
                result={result}
                saved={isCafeSaved(savedState, result.cafeId)}
                onViewDetail={() => router.push(`/cafe/${result.cafeId}`)}
                onToggleSave={() => quickToggleSave(result.cafeId)}
              />
            ))}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

type TimeFieldProps = {
  label: string;
  value: string;
  onPress: () => void;
};

function TimeField({ label, value, onPress }: TimeFieldProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} time ${value}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        paddingVertical: theme.spacing.xs + 3,
        paddingHorizontal: theme.spacing.sm + 1,
        borderRadius: theme.radius.button - 4,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderMedium,
        backgroundColor: pressed
          ? theme.colors.surface.pressed
          : theme.colors.background.cream50,
      })}
    >
      <Text
        style={{
          ...theme.typography.caption,
          fontSize: 10,
          fontFamily: theme.fonts.family.sansSemibold,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: theme.colors.text.muted,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          ...theme.typography.bodySmall,
          fontFamily: theme.fonts.family.sansSemibold,
          marginTop: 2,
          color: theme.colors.text.espresso900,
        }}
      >
        {value}
      </Text>
    </Pressable>
  );
}

type WorkSpotCardProps = {
  result: WorkSpotResult;
  saved: boolean;
  onViewDetail: () => void;
  onToggleSave: () => void;
};

function WorkSpotCard({
  result,
  saved,
  onViewDetail,
  onToggleSave,
}: WorkSpotCardProps) {
  return (
    <View
      style={{
        marginTop: theme.spacing.sm,
        padding: theme.spacing.md - 2,
        borderRadius: theme.radius.card - 2,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.surface.cardCream,
        boxShadow: theme.shadows.searchCard,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: theme.radius.button - 4,
            backgroundColor: photoSwatch[result.tone],
          }}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontSize: 15,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            {result.name}
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 11,
              marginTop: 2,
              color: theme.colors.text.muted,
            }}
          >
            {result.meta}
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            paddingVertical: theme.spacing.xs - 1,
            paddingHorizontal: theme.spacing.sm - 1,
            borderRadius: theme.spacing.sm,
            backgroundColor: theme.colors.surface.matchScore,
          }}
        >
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontSize: 15,
              fontFamily: theme.fonts.family.sansBold,
              color: theme.colors.text.espresso900,
            }}
          >
            {result.workScore}
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 8,
              fontFamily: theme.fonts.family.sansSemibold,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              color: theme.colors.text.muted,
            }}
          >
            Work
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: theme.spacing.xs - 1, marginTop: theme.spacing.sm }}>
        {result.stats.map((stat) => (
          <View
            key={stat.label}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.spacing.sm,
              backgroundColor: theme.colors.surface.pressed,
            }}
          >
            <Text
              style={{
                ...theme.typography.caption,
                fontSize: 11,
                fontFamily: theme.fonts.family.sansBold,
                color: statInk[stat.level],
              }}
            >
              {stat.value}
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                fontSize: 8,
                fontFamily: theme.fonts.family.sansSemibold,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                marginTop: 2,
                color: theme.colors.text.muted,
              }}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      <Text
        style={{
          ...theme.typography.caption,
          fontSize: 11,
          marginTop: theme.spacing.xs + 2,
          color: theme.colors.text.muted,
        }}
      >
        {result.tip}
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.md,
          marginTop: theme.spacing.xs + 2,
          paddingTop: theme.spacing.xs + 2,
          borderTopWidth: 1,
          borderTopColor: theme.colors.surface.borderSoft,
        }}
      >
        <CardAction label="View Detail" onPress={onViewDetail} name={result.name} />
        <CardAction
          label={saved ? "Saved" : "Save"}
          onPress={onToggleSave}
          name={result.name}
        />
        {/* Directions stays inert until the map provider lands (decision 0010). */}
        <CardAction label="Directions" name={result.name} />
      </View>
    </View>
  );
}

type CardActionProps = {
  label: string;
  name: string;
  onPress?: () => void;
};

function CardAction({ label, name, onPress }: CardActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} ${name}`}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
      <Text
        style={{
          ...theme.typography.caption,
          fontFamily: theme.fonts.family.sansSemibold,
          color: theme.colors.brand.roastedBrown,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
