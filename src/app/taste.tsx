import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useSyncExternalStore } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import { demoSavedState } from "@/data/saved-library";
import {
  NEIGHBORHOODS_EMPTY_COPY,
  RECENT_VISITS,
  TASTE_RECOMMENDATION,
  TASTE_STATS,
  favoriteNeighborhoods,
  favoriteVibes,
  tasteSubtitle,
} from "@/data/taste-profile-view";
import type { TasteStatTone } from "@/data/taste-profile-view";
import { getSavedState, subscribeSaved } from "@/utils/saved-store";
import { loadTasteProfile } from "@/utils/taste-profile";

const statSwatch: Record<TasteStatTone, string> = {
  roasted: theme.colors.brand.roastedBrown,
  terracotta: theme.colors.brand.terracotta,
  latte: theme.colors.brand.latteBeige,
  olive: theme.colors.brand.oliveMatcha,
};

export default function TasteProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // QA override ?state=demo derives the live sections from the demo library.
  const params = useLocalSearchParams<{ state?: string }>();
  const storeState = useSyncExternalStore(subscribeSaved, getSavedState);
  const state = useMemo(
    () => (params.state === "demo" ? demoSavedState(storeState) : storeState),
    [params.state, storeState],
  );
  const profile = useMemo(() => loadTasteProfile(), []);

  const savedCount = Object.keys(state.saves).length;
  const vibes = favoriteVibes(profile);
  const neighborhoods = favoriteNeighborhoods(state);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.xs,
          paddingBottom:
            Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.xxl,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            backgroundColor: theme.colors.surface.pressed,
          }}
        >
          <Text style={{ fontSize: 20, color: theme.colors.text.espresso900 }}>
            ‹
          </Text>
        </Pressable>

        <Text
          style={{
            fontFamily: theme.fonts.family.serifSemibold,
            fontSize: 27,
            lineHeight: 33,
            marginTop: theme.spacing.md + 2,
            color: theme.colors.text.espresso900,
          }}
        >
          Your café taste
        </Text>
        <Text
          style={{
            ...theme.typography.bodySmall,
            fontSize: 13,
            marginTop: theme.spacing.xxs + 2,
            color: theme.colors.text.muted,
          }}
        >
          {tasteSubtitle(savedCount)}
        </Text>

        {/* Stat card: segmented bar + 2-col legend (G1). */}
        <View
          style={{
            padding: theme.spacing.screen,
            marginTop: theme.spacing.md + 2,
            borderRadius: theme.radius.card,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: theme.colors.surface.borderSoft,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              height: 14,
              borderRadius: theme.radius.chip,
              overflow: "hidden",
            }}
          >
            {TASTE_STATS.map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: stat.pct,
                  backgroundColor: statSwatch[stat.tone],
                }}
              />
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              rowGap: theme.spacing.sm - 2,
              marginTop: theme.spacing.md,
            }}
          >
            {TASTE_STATS.map((stat) => (
              <View
                key={stat.label}
                style={{
                  width: "50%",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: theme.spacing.xs + 1,
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    backgroundColor: statSwatch[stat.tone],
                  }}
                />
                <View>
                  <Text
                    style={{
                      ...theme.typography.bodySmall,
                      fontFamily: theme.fonts.family.sansBold,
                      fontSize: 15,
                      color: theme.colors.text.espresso900,
                    }}
                  >
                    {stat.pct}%
                  </Text>
                  <Text
                    style={{
                      ...theme.typography.caption,
                      fontSize: 10,
                      color: theme.colors.text.muted,
                    }}
                  >
                    {stat.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Eyebrow>Favorite vibes</Eyebrow>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs,
            marginTop: theme.spacing.xs + 2,
          }}
        >
          {vibes.map((vibe) => (
            <View
              key={vibe}
              style={{
                paddingVertical: theme.spacing.xs,
                paddingHorizontal: theme.spacing.md - 1,
                borderRadius: theme.radius.chip,
                backgroundColor: theme.colors.surface.latteSoft,
              }}
            >
              <Text
                style={{
                  ...theme.typography.chipLabel,
                  fontSize: 12,
                  color: theme.colors.text.espresso700,
                }}
              >
                {vibe}
              </Text>
            </View>
          ))}
        </View>

        <Eyebrow>Favorite neighborhoods</Eyebrow>
        <View
          style={{
            paddingHorizontal: theme.spacing.md + 2,
            paddingVertical: neighborhoods.length > 0 ? 3 : theme.spacing.md,
            marginTop: theme.spacing.xs + 2,
            borderRadius: theme.radius.button + 2,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: theme.colors.surface.borderSoft,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          {neighborhoods.length === 0 ? (
            <Text
              style={{
                ...theme.typography.caption,
                textAlign: "center",
                color: theme.colors.text.muted,
              }}
            >
              {NEIGHBORHOODS_EMPTY_COPY}
            </Text>
          ) : (
            neighborhoods.map((neighborhood, index) => (
              <View
                key={neighborhood.name}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: theme.spacing.sm - 1,
                  borderBottomWidth: index < neighborhoods.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.surface.borderSoft,
                }}
              >
                <Text
                  style={{
                    ...theme.typography.chipLabel,
                    fontFamily: theme.fonts.family.sansSemibold,
                    color: theme.colors.text.espresso900,
                  }}
                >
                  {neighborhood.name}
                </Text>
                <Text
                  style={{
                    ...theme.typography.caption,
                    fontSize: 11,
                    color: theme.colors.text.muted,
                  }}
                >
                  {neighborhood.meta}
                </Text>
              </View>
            ))
          )}
        </View>

        <Eyebrow>Recently visited</Eyebrow>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: theme.spacing.sm }}
          contentContainerStyle={{ gap: theme.spacing.xs + 2 }}
        >
          {RECENT_VISITS.map((visit) => (
            <Pressable
              key={visit.cafeId}
              accessibilityRole="button"
              accessibilityLabel={`Open ${visit.name}`}
              onPress={() => router.push(`/cafe/${visit.cafeId}`)}
              style={({ pressed }) => ({
                width: 108,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View
                style={{
                  height: 82,
                  borderRadius: theme.radius.button - 2,
                  borderCurve: "continuous",
                  backgroundColor: statSwatch[visit.tone],
                }}
              />
              <Text
                numberOfLines={1}
                style={{
                  ...theme.typography.caption,
                  fontSize: 11,
                  fontFamily: theme.fonts.family.sansSemibold,
                  marginTop: theme.spacing.xs - 2,
                  color: theme.colors.text.espresso900,
                }}
              >
                {visit.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Static recommendation per decision 0013 (no client-side AI). */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: theme.spacing.xs + 2,
            padding: theme.spacing.md + 2,
            marginTop: theme.spacing.lg,
            borderRadius: theme.radius.button + 2,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: theme.colors.surface.borderSoft,
            backgroundColor: theme.colors.background.cream50,
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
              lineHeight: 19,
              color: theme.colors.text.espresso700,
            }}
          >
            {TASTE_RECOMMENDATION}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

type EyebrowProps = {
  children: string;
};

function Eyebrow({ children }: EyebrowProps) {
  return (
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
      {children}
    </Text>
  );
}
