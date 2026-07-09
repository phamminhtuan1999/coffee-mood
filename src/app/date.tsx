import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { VibeChip } from "@/components/ui";
import { theme } from "@/constants/theme";
import {
  DATE_AREAS,
  DATE_BUDGETS,
  DATE_MOODS,
  DATE_TIMES,
  DEFAULT_DATE_INPUTS,
  createDatePlan,
} from "@/data/date-plan";
import type { DateMood, DatePlan, DatePlanInputs } from "@/data/date-plan";
import type { CafeMapPinTone } from "@/data/map-pins";

const planSwatch: Record<CafeMapPinTone, string> = {
  terracotta: theme.colors.brand.terracotta,
  latte: theme.colors.brand.latteBeige,
  olive: theme.colors.brand.oliveMatcha,
};

function cycle<T>(options: readonly T[], current: T): T {
  const index = options.indexOf(current);

  return options[(index + 1) % options.length];
}

export default function DatePlanScreen() {
  const params = useLocalSearchParams<{ state?: string }>();
  const insets = useSafeAreaInsets();
  const [inputs, setInputs] = useState<DatePlanInputs>({
    ...DEFAULT_DATE_INPUTS,
  });
  const [variant, setVariant] = useState(0);
  // QA override ?state=plan renders the generated plan on load so the
  // simulator smoke can capture the full screen deterministically.
  const [plan, setPlan] = useState<DatePlan | null>(() =>
    params.state === "plan" ? createDatePlan(DEFAULT_DATE_INPUTS) : null,
  );

  const createPlan = () => {
    setVariant(0);
    setPlan(createDatePlan(inputs));
  };

  const shufflePlan = () => {
    const next = variant + 1;

    setVariant(next);
    setPlan(createDatePlan(inputs, next));
  };

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
          Plan a coffee date
        </Text>
        <Text
          style={{
            ...theme.typography.bodySmall,
            marginTop: theme.spacing.xxs + 2,
            color: theme.colors.text.muted,
          }}
        >
          Low-effort, high-charm.
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs + 1,
            marginTop: theme.spacing.md + 2,
          }}
        >
          <InputCard
            label="Area"
            value={inputs.area}
            onPress={() =>
              setInputs((current) => ({
                ...current,
                area: cycle(DATE_AREAS, current.area),
              }))
            }
          />
          <InputCard
            label="Time"
            value={inputs.time}
            onPress={() =>
              setInputs((current) => ({
                ...current,
                time: cycle(DATE_TIMES, current.time),
              }))
            }
          />
          <InputCard
            label="Budget"
            value={inputs.budget}
            onPress={() =>
              setInputs((current) => ({
                ...current,
                budget: cycle(DATE_BUDGETS, current.budget),
              }))
            }
          />
        </View>

        <Text
          style={{
            ...theme.typography.caption,
            fontFamily: theme.fonts.family.sansBold,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginTop: theme.spacing.lg - 2,
            color: theme.colors.text.muted,
          }}
        >
          Mood
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs,
            marginTop: theme.spacing.sm - 2,
          }}
        >
          {DATE_MOODS.map((mood) => (
            <VibeChip
              key={mood}
              label={mood}
              selected={inputs.mood === mood}
              onPress={() =>
                setInputs((current) => ({ ...current, mood: mood as DateMood }))
              }
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create Date Plan"
          onPress={createPlan}
          style={({ pressed }) => ({
            minHeight: theme.sizing.control,
            alignItems: "center",
            justifyContent: "center",
            marginTop: theme.spacing.md + 2,
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
            Create Date Plan
          </Text>
        </Pressable>

        {plan ? <PlanCard plan={plan} onShuffle={shufflePlan} /> : null}
      </ScrollView>
    </View>
  );
}

type InputCardProps = {
  label: string;
  value: string;
  onPress: () => void;
};

function InputCard({ label, value, onPress }: InputCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} ${value}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexBasis: "48%",
        flexGrow: 1,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md - 2,
        borderRadius: theme.radius.button - 2,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderMedium,
        backgroundColor: pressed
          ? theme.colors.surface.pressed
          : theme.colors.surface.cardCream,
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
          marginTop: 3,
          color: theme.colors.text.espresso900,
        }}
      >
        {value}
      </Text>
    </Pressable>
  );
}

type PlanCardProps = {
  plan: DatePlan;
  onShuffle: () => void;
};

function PlanCard({ plan, onShuffle }: PlanCardProps) {
  return (
    <View
      style={{
        marginTop: theme.spacing.lg - 2,
        padding: theme.spacing.screen,
        borderRadius: theme.radius.card + 2,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderMedium,
        backgroundColor: theme.colors.surface.glassCream,
        boxShadow: theme.shadows.card,
      }}
    >
      <Text
        style={{
          ...theme.typography.caption,
          fontFamily: theme.fonts.family.sansBold,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          color: theme.colors.text.muted,
        }}
      >
        Your plan
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm + 1,
          marginTop: theme.spacing.sm + 2,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: theme.radius.button - 2,
            backgroundColor: planSwatch[plan.tone],
          }}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontFamily: theme.fonts.family.serifSemibold,
              fontSize: 19,
              lineHeight: 24,
              color: theme.colors.text.espresso900,
            }}
          >
            {plan.name}
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              marginTop: 2,
              color: theme.colors.text.muted,
            }}
          >
            {plan.meta}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: theme.spacing.md }}>
        {plan.steps.map((step, index) => (
          <View key={step.title} style={{ flexDirection: "row", gap: theme.spacing.sm }}>
            <View style={{ width: 14, alignItems: "center" }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  marginTop: 5,
                  borderRadius: theme.radius.photoPin,
                  backgroundColor: theme.colors.brand.terracotta,
                }}
              />
              {index < plan.steps.length - 1 ? (
                <View
                  style={{
                    width: 1.5,
                    flex: 1,
                    minHeight: 18,
                    backgroundColor: theme.colors.surface.borderMedium,
                  }}
                />
              ) : null}
            </View>
            <View style={{ flex: 1, paddingBottom: theme.spacing.sm }}>
              <Text
                style={{
                  ...theme.typography.caption,
                  fontSize: 13,
                  fontFamily: theme.fonts.family.sansSemibold,
                  color: theme.colors.text.espresso900,
                }}
              >
                {step.title}
              </Text>
              <Text
                style={{
                  ...theme.typography.caption,
                  fontSize: 11,
                  marginTop: 2,
                  color: theme.colors.text.muted,
                }}
              >
                {step.detail}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: theme.spacing.xs + 1,
          borderRadius: theme.radius.button - 4,
          padding: theme.spacing.sm + 2,
          backgroundColor: theme.colors.surface.latteSoft,
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
          {plan.tip}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: theme.spacing.xs + 1, marginTop: theme.spacing.md }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Shuffle"
          onPress={onShuffle}
          style={({ pressed }) => ({
            flex: 1,
            minHeight: theme.sizing.compactControl,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.button - 3,
            borderCurve: "continuous",
            borderWidth: 1.5,
            borderColor: theme.colors.surface.borderStrong,
            backgroundColor: pressed
              ? theme.colors.surface.pressed
              : "transparent",
          })}
        >
          <Text
            style={{
              ...theme.typography.chipLabel,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            Shuffle
          </Text>
        </Pressable>
        {/* Save this plan stays inert until plan persistence lands (decision 0017). */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save this plan"
          style={({ pressed }) => ({
            flex: 1.6,
            minHeight: theme.sizing.compactControl,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.button - 3,
            borderCurve: "continuous",
            backgroundColor: pressed
              ? theme.colors.text.espresso700
              : theme.colors.text.espresso900,
          })}
        >
          <Text
            style={{
              ...theme.typography.chipLabel,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.background.cream50,
            }}
          >
            Save this plan
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: theme.spacing.lg,
          marginTop: theme.spacing.sm + 2,
        }}
      >
        {/* Share and Start Navigation stay inert until their providers land
            (decisions 0015 and 0010, recorded for this story in 0017). */}
        {["Share", "Start Navigation"].map((label) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            accessibilityLabel={label}
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
        ))}
      </View>
    </View>
  );
}
