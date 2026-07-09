import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useSyncExternalStore } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RouteMapPreview } from "@/components/ui/route-map-preview";
import { theme } from "@/constants/theme";
import type { CafeMapPinTone } from "@/data/map-pins";
import type { RouteStop } from "@/data/route-plan";
import {
  ensureActiveRoute,
  getRoutePlanner,
  subscribeRoutePlanner,
} from "@/utils/route-planner-store";

const stopSwatch: Record<CafeMapPinTone, string> = {
  terracotta: theme.colors.brand.terracotta,
  latte: theme.colors.brand.latteBeige,
  olive: theme.colors.brand.oliveMatcha,
};

export default function RouteDetailScreen() {
  // Guarantee a route exists so a cold deep link to this screen still renders.
  ensureActiveRoute();
  const planner = useSyncExternalStore(subscribeRoutePlanner, getRoutePlanner);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    ensureActiveRoute();
  }, []);

  const route = planner.route;

  if (!route) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }} />;
  }

  const metaChips = [route.distanceLabel, route.durationLabel, route.stopsLabel];

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to planner"
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share route"
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.surface.pressed,
              opacity: pressed ? 0.72 : 1,
            })}
          >
            <Image
              source="sf:square.and.arrow.up"
              style={{ width: 16, height: 16, tintColor: theme.colors.text.espresso900 }}
            />
          </Pressable>
        </View>

        <Text
          style={{
            fontFamily: theme.fonts.family.serifSemibold,
            fontSize: 26,
            lineHeight: 32,
            marginTop: theme.spacing.md,
            color: theme.colors.text.espresso900,
          }}
        >
          {route.title}
        </Text>
        <Text
          style={{
            ...theme.typography.bodySmall,
            marginTop: theme.spacing.xxs + 2,
            color: theme.colors.text.muted,
          }}
        >
          {route.subtitle}
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.xs,
            marginTop: theme.spacing.sm,
          }}
        >
          {metaChips.map((chip) => (
            <View
              key={chip}
              style={{
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xxs + 2,
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
                {chip}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: theme.spacing.md }}>
          <RouteMapPreview stopCount={route.stops.length} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: theme.spacing.xs + 1,
            marginTop: theme.spacing.md - 2,
            paddingVertical: theme.spacing.sm + 1,
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
              width: 22,
              height: 22,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.brand.latteBeige,
            }}
          >
            <Text style={{ ...theme.typography.caption, fontSize: 11 }}>✦</Text>
          </View>
          <Text
            style={{
              ...theme.typography.caption,
              flex: 1,
              lineHeight: 18,
              color: theme.colors.text.espresso700,
            }}
          >
            {route.vibeSummary}
          </Text>
        </View>

        <View style={{ marginTop: theme.spacing.md + 2 }}>
          {route.stops.map((stop, index) => (
            <RouteDetailStop
              key={`${stop.cafeId}-${index}`}
              stop={stop}
              index={index}
              isLast={index === route.stops.length - 1}
              onReplace={() => router.push(`/route/replace?stop=${index}`)}
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
        <RouteAction label="Save Route" variant="secondary" />
        <RouteAction label="Start Navigation" variant="primary" />
      </View>
    </View>
  );
}

type RouteDetailStopProps = {
  stop: RouteStop;
  index: number;
  isLast: boolean;
  onReplace: () => void;
};

function RouteDetailStop({ stop, index, isLast, onReplace }: RouteDetailStopProps) {
  return (
    <View style={{ flexDirection: "row", gap: theme.spacing.sm + 2 }}>
      <View style={{ width: 24, alignItems: "center" }}>
        <View
          style={{
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            backgroundColor:
              index === 0
                ? theme.colors.text.espresso900
                : theme.colors.brand.terracotta,
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
            {index + 1}
          </Text>
        </View>
        {!isLast ? (
          <View
            style={{
              width: 2,
              flex: 1,
              minHeight: theme.spacing.xl,
              backgroundColor: theme.colors.surface.borderMedium,
            }}
          />
        ) : null}
      </View>
      <View
        style={{
          flex: 1,
          marginBottom: isLast ? 0 : theme.spacing.sm,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md - 2,
          borderRadius: theme.radius.button,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: theme.colors.surface.borderSoft,
          backgroundColor: theme.colors.surface.cardCream,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: theme.spacing.sm,
              backgroundColor: stopSwatch[stop.tone],
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
              {stop.name}
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                marginTop: 1,
                color: theme.colors.text.muted,
              }}
            >
              {stop.role}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Replace stop ${index + 1}`}
            onPress={onReplace}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text
              style={{
                ...theme.typography.caption,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.brand.roastedBrown,
              }}
            >
              Replace
            </Text>
          </Pressable>
        </View>
        <Text
          style={{
            ...theme.typography.caption,
            marginTop: theme.spacing.xs + 1,
            paddingTop: theme.spacing.xs + 1,
            borderTopWidth: 1,
            borderTopColor: theme.colors.surface.borderSoft,
            color: theme.colors.text.muted,
          }}
        >
          {stop.note}
        </Text>
      </View>
    </View>
  );
}

type RouteActionProps = {
  label: string;
  variant: "primary" | "secondary";
};

// Save Route / Start Navigation render but stay inert until their providers land
// (route persistence + map navigation), consistent with the other
// provider-deferred actions in the app.
function RouteAction({ label, variant }: RouteActionProps) {
  const primary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flex: primary ? 1.4 : 1,
        minHeight: theme.sizing.control,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.button,
        borderCurve: "continuous",
        borderWidth: primary ? 0 : 1.5,
        borderColor: theme.colors.surface.borderStrong,
        backgroundColor: primary
          ? pressed
            ? theme.colors.text.espresso700
            : theme.colors.text.espresso900
          : pressed
            ? theme.colors.surface.pressed
            : "transparent",
        boxShadow: primary ? theme.shadows.button : undefined,
      })}
    >
      <Text
        style={{
          ...theme.typography.bodySmall,
          fontFamily: theme.fonts.family.sansSemibold,
          color: primary
            ? theme.colors.background.cream50
            : theme.colors.text.espresso900,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
