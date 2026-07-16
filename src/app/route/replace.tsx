import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import type { CafeMapPinTone } from "@/data/map-pins";
import type { RouteAlternative } from "@/data/route-plan";
import { planStopAlternatives } from "@/utils/planner-cafes";
import {
  ensureActiveRoute,
  getRoutePlanner,
  replaceRouteStop,
} from "@/utils/route-planner-store";

const altSwatch: Record<CafeMapPinTone, string> = {
  terracotta: theme.colors.brand.terracotta,
  latte: theme.colors.brand.latteBeige,
  olive: theme.colors.brand.oliveMatcha,
};

function parseStopIndex(raw: string | undefined, stopCount: number): number {
  const parsed = Number.parseInt(raw ?? "", 10);

  if (Number.isNaN(parsed) || parsed < 0 || parsed >= stopCount) {
    return Math.min(1, stopCount - 1);
  }

  return parsed;
}

export default function ReplaceStopScreen() {
  ensureActiveRoute();
  const params = useLocalSearchParams<{ stop?: string }>();
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const route = getRoutePlanner().route;

  if (!route) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }} />;
  }

  const stopIndex = parseStopIndex(params.stop, route.stops.length);
  const currentStop = route.stops[stopIndex];
  // Offer real nearby cafes that are not already on the route (US-036), with
  // reasons and detours measured against the stop being replaced; the curated
  // pool stands in on a cold cache.
  const alternatives = planStopAlternatives(
    route.stops.map((stop) => stop.cafeId),
    currentStop.cafeId,
  );

  const commitReplace = () => {
    const chosen = alternatives.find((alt) => alt.cafeId === selectedId);

    if (!chosen) {
      return;
    }

    replaceRouteStop(stopIndex, chosen);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen + 2,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.lg,
          paddingBottom: 140,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to route"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            backgroundColor: theme.colors.surface.cardCream,
            opacity: pressed ? 0.72 : 1,
          })}
        >
          <Image
            source="sf:chevron.left"
            style={{ width: 15, height: 15, tintColor: theme.colors.text.espresso900 }}
          />
        </Pressable>

        <Text
          style={{
            fontFamily: theme.fonts.family.serifSemibold,
            fontSize: 26,
            lineHeight: 32,
            marginTop: theme.spacing.md,
            color: theme.colors.text.espresso900,
          }}
        >
          Replace stop {stopIndex + 1}
        </Text>
        <Text
          style={{
            ...theme.typography.bodySmall,
            marginTop: theme.spacing.xxs + 2,
            color: theme.colors.text.muted,
          }}
        >
          {currentStop.role} · keep the route flowing
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
            marginTop: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.sm + 2,
            borderRadius: theme.radius.button,
            borderCurve: "continuous",
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: theme.colors.surface.borderStrong,
            backgroundColor: theme.colors.surface.pressed,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.photoPin,
              borderWidth: 3,
              borderColor: theme.colors.background.cream50,
              backgroundColor: theme.colors.brand.terracotta,
            }}
          >
            <Text
              style={{
                ...theme.typography.caption,
                fontSize: 11,
                fontFamily: theme.fonts.family.sansBold,
                color: theme.colors.background.cream50,
              }}
            >
              {stopIndex + 1}
            </Text>
          </View>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: theme.spacing.sm,
              backgroundColor: altSwatch[currentStop.tone],
            }}
          />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={{
                ...theme.typography.bodySmall,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.text.espresso900,
              }}
            >
              {currentStop.name}
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                marginTop: 1,
                color: theme.colors.text.muted,
              }}
            >
              Currently in route · {currentStop.role.toLowerCase()}
            </Text>
          </View>
        </View>

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
          Alternatives nearby
        </Text>

        <View style={{ marginTop: theme.spacing.sm }}>
          {alternatives.map((alt) => (
            <AlternativeCard
              key={alt.cafeId}
              alt={alt}
              selected={selectedId === alt.cafeId}
              onPress={() => setSelectedId(alt.cafeId)}
            />
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: "row",
          gap: theme.spacing.xs + 1,
          paddingHorizontal: theme.spacing.screen,
          paddingTop: theme.spacing.sm + 2,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.surface.borderSoft,
          backgroundColor: theme.colors.background.cream50,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Keep current"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            flex: 1,
            minHeight: theme.sizing.control,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.button,
            borderCurve: "continuous",
            borderWidth: 1.5,
            borderColor: theme.colors.surface.borderStrong,
            backgroundColor: pressed ? theme.colors.surface.pressed : "transparent",
          })}
        >
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            Keep current
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Replace Stop"
          accessibilityState={{ disabled: selectedId === null }}
          disabled={selectedId === null}
          onPress={commitReplace}
          style={({ pressed }) => ({
            flex: 1.4,
            minHeight: theme.sizing.control,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.button,
            borderCurve: "continuous",
            backgroundColor:
              selectedId === null
                ? theme.colors.surface.disabled
                : pressed
                  ? theme.colors.text.espresso700
                  : theme.colors.text.espresso900,
            boxShadow: selectedId === null ? undefined : theme.shadows.button,
          })}
        >
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color:
                selectedId === null
                  ? theme.colors.surface.disabledText
                  : theme.colors.background.cream50,
            }}
          >
            Replace Stop
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type AlternativeCardProps = {
  alt: RouteAlternative;
  selected: boolean;
  onPress: () => void;
};

function AlternativeCard({ alt, selected, onPress }: AlternativeCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${alt.name}, ${alt.reason}`}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        marginBottom: theme.spacing.sm,
        paddingVertical: theme.spacing.sm + 1,
        paddingHorizontal: theme.spacing.md - 2,
        borderRadius: theme.radius.button,
        borderCurve: "continuous",
        borderWidth: selected ? 1.5 : 1,
        borderColor: selected
          ? theme.colors.brand.terracotta
          : theme.colors.surface.borderSoft,
        backgroundColor: selected
          ? theme.colors.background.cream100
          : pressed
            ? theme.colors.surface.pressed
            : theme.colors.surface.cardCream,
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: theme.radius.button - 4,
            backgroundColor: altSwatch[alt.tone],
          }}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            {alt.name}
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              marginTop: 2,
              color: theme.colors.text.muted,
            }}
          >
            {alt.meta}
          </Text>
        </View>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: theme.radius.photoPin,
            borderWidth: selected ? 7 : 1.5,
            borderColor: selected
              ? theme.colors.brand.terracotta
              : theme.colors.surface.borderStrong,
            backgroundColor: theme.colors.background.cream50,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", gap: theme.spacing.xxs + 2, marginTop: theme.spacing.xs + 2 }}>
        <View
          style={{
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xxs + 1,
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.surface.cautionSoft,
          }}
        >
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 11,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.brand.roastedBrown,
            }}
          >
            {alt.reason}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xxs + 1,
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.surface.latteSoft,
          }}
        >
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 11,
              color: theme.colors.text.espresso700,
            }}
          >
            {alt.detour}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
