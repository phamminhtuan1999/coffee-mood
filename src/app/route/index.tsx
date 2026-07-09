import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { VibeChip } from "@/components/ui";
import { theme } from "@/constants/theme";
import {
  ROUTE_DURATIONS,
  ROUTE_MOODS,
  ROUTE_STOP_MAX,
  ROUTE_STOP_MIN,
  ROUTE_TRANSPORTS,
} from "@/data/route-plan";
import type {
  RouteDurationId,
  RouteMoodId,
  RouteTransportId,
} from "@/data/route-plan";
import {
  generateActiveRoute,
  getRoutePlanner,
  setRouteInputs,
} from "@/utils/route-planner-store";

export default function RoutePlannerScreen() {
  const insets = useSafeAreaInsets();
  const [inputs, setInputs] = useState(() => ({ ...getRoutePlanner().inputs }));

  const selectMood = (moodId: RouteMoodId) =>
    setInputs((current) => ({ ...current, moodId }));
  const selectDuration = (durationId: RouteDurationId) =>
    setInputs((current) => ({ ...current, durationId }));
  const selectTransport = (transportId: RouteTransportId) =>
    setInputs((current) => ({ ...current, transportId }));
  const adjustStops = (delta: number) =>
    setInputs((current) => ({
      ...current,
      stopCount: Math.min(
        ROUTE_STOP_MAX,
        Math.max(ROUTE_STOP_MIN, current.stopCount + delta),
      ),
    }));

  const generateRoutePlan = () => {
    setRouteInputs(inputs);
    generateActiveRoute();
    router.push("/route/detail");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.xl,
          paddingBottom: 150,
        }}
      >
        <Text
          style={{
            fontFamily: theme.fonts.family.serifSemibold,
            fontSize: 27,
            lineHeight: 33,
            color: theme.colors.text.espresso900,
          }}
        >
          Plan a café route
        </Text>
        <Text
          style={{
            ...theme.typography.bodySmall,
            marginTop: theme.spacing.xxs + 2,
            color: theme.colors.text.muted,
          }}
        >
          A little café hopping, tuned to your mood.
        </Text>

        <PlannerEyebrow style={{ marginTop: theme.spacing.lg }}>
          Starting area
        </PlannerEyebrow>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xs + 2,
            marginTop: theme.spacing.sm - 2,
            paddingVertical: theme.spacing.sm + 1,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.radius.button,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: theme.colors.surface.borderMedium,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          <View
            style={{
              width: 9,
              height: 9,
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.text.espresso900,
              borderWidth: 2,
              borderColor: theme.colors.brand.latteBeige,
            }}
          />
          <Text
            style={{
              ...theme.typography.bodySmall,
              flex: 1,
              fontFamily: theme.fonts.family.sansMedium,
              color: theme.colors.text.espresso900,
            }}
          >
            {inputs.area}
          </Text>
          <Text
            accessibilityRole="button"
            accessibilityLabel="Change starting area"
            style={{
              ...theme.typography.caption,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.brand.roastedBrown,
            }}
          >
            Change
          </Text>
        </View>

        <PlannerEyebrow>Mood</PlannerEyebrow>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs + 1,
            marginTop: theme.spacing.sm - 2,
          }}
        >
          {ROUTE_MOODS.map((mood) => (
            <VibeChip
              key={mood.id}
              label={mood.label}
              selected={inputs.moodId === mood.id}
              onPress={() => selectMood(mood.id)}
            />
          ))}
        </View>

        <PlannerEyebrow>Duration</PlannerEyebrow>
        <SegmentedRow>
          {ROUTE_DURATIONS.map((duration) => (
            <SegmentedOption
              key={duration.id}
              label={duration.label}
              selected={inputs.durationId === duration.id}
              onPress={() => selectDuration(duration.id)}
            />
          ))}
        </SegmentedRow>

        <PlannerEyebrow>Transport</PlannerEyebrow>
        <SegmentedRow>
          {ROUTE_TRANSPORTS.map((transport) => (
            <SegmentedOption
              key={transport.id}
              label={transport.label}
              selected={inputs.transportId === transport.id}
              onPress={() => selectTransport(transport.id)}
            />
          ))}
        </SegmentedRow>

        <PlannerEyebrow>Stops</PlannerEyebrow>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.md + 2,
            marginTop: theme.spacing.sm - 2,
          }}
        >
          <StepperButton
            label="Remove a stop"
            glyph="−"
            disabled={inputs.stopCount <= ROUTE_STOP_MIN}
            onPress={() => adjustStops(-1)}
          />
          <Text
            accessibilityLabel={`${inputs.stopCount} stops`}
            style={{
              fontFamily: theme.fonts.family.sansBold,
              fontSize: 22,
              minWidth: 24,
              textAlign: "center",
              color: theme.colors.text.espresso900,
            }}
          >
            {inputs.stopCount}
          </Text>
          <StepperButton
            label="Add a stop"
            glyph="+"
            disabled={inputs.stopCount >= ROUTE_STOP_MAX}
            onPress={() => adjustStops(1)}
          />
          <Text style={{ ...theme.typography.caption, color: theme.colors.text.muted }}>
            cafés on the route
          </Text>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.screen,
          backgroundColor: theme.colors.background.cream50,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Generate Route"
          onPress={generateRoutePlan}
          style={({ pressed }) => ({
            minHeight: theme.sizing.control,
            alignItems: "center",
            justifyContent: "center",
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
            Generate Route
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type PlannerEyebrowProps = {
  children: ReactNode;
  style?: { marginTop?: number };
};

function PlannerEyebrow({ children, style }: PlannerEyebrowProps) {
  return (
    <Text
      style={{
        ...theme.typography.caption,
        fontFamily: theme.fonts.family.sansBold,
        color: theme.colors.text.muted,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginTop: style?.marginTop ?? theme.spacing.lg - 2,
      }}
    >
      {children}
    </Text>
  );
}

function SegmentedRow({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: theme.spacing.xs + 1,
        marginTop: theme.spacing.sm - 2,
      }}
    >
      {children}
    </View>
  );
}

type SegmentedOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function SegmentedOption({ label, selected, onPress }: SegmentedOptionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: theme.sizing.minimumTouchTarget,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.button,
        borderCurve: "continuous",
        borderWidth: selected ? 0 : 1,
        borderColor: theme.colors.surface.borderMedium,
        backgroundColor: selected
          ? theme.colors.text.espresso900
          : pressed
            ? theme.colors.surface.pressed
            : theme.colors.surface.cardCream,
      })}
    >
      <Text
        style={{
          ...theme.typography.chipLabel,
          fontFamily: theme.fonts.family.sansSemibold,
          color: selected
            ? theme.colors.background.cream50
            : theme.colors.text.espresso700,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type StepperButtonProps = {
  label: string;
  glyph: string;
  disabled: boolean;
  onPress: () => void;
};

function StepperButton({ label, glyph, disabled, onPress }: StepperButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.photoPin,
        borderWidth: 1.5,
        borderColor: theme.colors.surface.borderStrong,
        opacity: disabled ? 0.4 : pressed ? 0.72 : 1,
      })}
    >
      <Text style={{ fontSize: 18, color: theme.colors.text.espresso900 }}>
        {glyph}
      </Text>
    </Pressable>
  );
}
