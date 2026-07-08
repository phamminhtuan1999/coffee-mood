import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MoodSlider, VibeChip } from "@/components/ui";
import { theme } from "@/constants/theme";
import {
  DISTANCE_MAX,
  DISTANCE_MIN,
  defaultMapFilters,
  distanceLabel,
  filterNeeds,
  filterTreats,
  noiseHint,
  scoreHint,
} from "@/utils/map-filters";
import type { FilterNeed, FilterTreat, MapFilters } from "@/utils/map-filters";
import { getMapFilters, setMapFilters } from "@/utils/map-filters-store";
import type { PricePreference } from "@/utils/taste-profile";

const priceOptions: PricePreference[] = ["$", "$$", "$$$"];

const SCORE_STEP = 0.5;

function toggleValue<T>(current: T[], value: T): T[] {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }

  return [...current, value];
}

function fractionToScore(fraction: number): number {
  return Math.round((fraction * 10) / SCORE_STEP) * SCORE_STEP;
}

function fractionToDistance(fraction: number): number {
  return Math.round(DISTANCE_MIN + fraction * (DISTANCE_MAX - DISTANCE_MIN));
}

export default function FiltersScreen() {
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState<MapFilters>(() => ({
    ...getMapFilters(),
  }));

  const resetFilters = () => setFilters(defaultMapFilters());
  const applyFilters = () => {
    setMapFilters(filters);
    router.back();
  };

  const toggleNeed = (need: FilterNeed) =>
    setFilters((current) => ({
      ...current,
      needs: toggleValue(current.needs, need),
    }));
  const toggleTreat = (treat: FilterTreat) =>
    setFilters((current) => ({
      ...current,
      treats: toggleValue(current.treats, treat),
    }));
  const selectPrice = (price: PricePreference) =>
    setFilters((current) => ({
      ...current,
      price: current.price === price ? null : price,
    }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: 62,
          paddingBottom: 150,
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
            accessibilityLabel="Back to map"
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
              style={{
                width: 15,
                height: 15,
                tintColor: theme.colors.text.espresso900,
              }}
            />
          </Pressable>
          <Text
            style={{
              fontFamily: theme.fonts.family.serifSemibold,
              fontSize: 20,
              lineHeight: 26,
              color: theme.colors.text.espresso900,
            }}
          >
            Tune your map
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset filters"
            onPress={resetFilters}
            style={({ pressed }) => ({
              minWidth: 44,
              minHeight: 44,
              justifyContent: "center",
              alignItems: "flex-end",
              opacity: pressed ? 0.72 : 1,
            })}
          >
            <Text
              style={{
                ...theme.typography.caption,
                fontFamily: theme.fonts.family.sansBold,
                fontSize: 13,
                color: theme.colors.brand.terracotta,
              }}
            >
              Reset
            </Text>
          </Pressable>
        </View>

        <FilterEyebrow style={{ marginTop: 28 }}>Distance</FilterEyebrow>
        <FilterCard>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                ...theme.typography.bodySmall,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.text.espresso900,
              }}
            >
              {distanceLabel(filters.distance)}
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                color: theme.colors.text.muted,
              }}
            >
              walk
            </Text>
          </View>
          <View style={{ marginTop: theme.spacing.xs }}>
            <MoodSlider
              label="Distance"
              value={
                (filters.distance - DISTANCE_MIN) / (DISTANCE_MAX - DISTANCE_MIN)
              }
              onChange={(fraction) =>
                setFilters((current) => ({
                  ...current,
                  distance: fractionToDistance(fraction),
                }))
              }
            />
          </View>
        </FilterCard>

        <FilterEyebrow>Needs</FilterEyebrow>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs + 2,
            marginTop: theme.spacing.sm,
          }}
        >
          {filterNeeds.map((need) => (
            <VibeChip
              key={need}
              label={need}
              selected={filters.needs.includes(need)}
              onPress={() => toggleNeed(need)}
            />
          ))}
        </View>

        <FilterEyebrow>Mood levels</FilterEyebrow>
        <FilterCard vertical={false}>
          <MoodLevelRow
            label="Aesthetic score"
            hint={scoreHint(filters.aesthetic)}
            value={filters.aesthetic / 10}
            onChange={(fraction) =>
              setFilters((current) => ({
                ...current,
                aesthetic: fractionToScore(fraction),
              }))
            }
          />
          <MoodLevelRow
            label="Work score"
            hint={scoreHint(filters.work)}
            value={filters.work / 10}
            onChange={(fraction) =>
              setFilters((current) => ({
                ...current,
                work: fractionToScore(fraction),
              }))
            }
          />
          <MoodLevelRow
            label="Noise level"
            hint={noiseHint(filters.noise)}
            value={filters.noise / 10}
            onChange={(fraction) =>
              setFilters((current) => ({
                ...current,
                noise: fractionToScore(fraction),
              }))
            }
            last
          />
        </FilterCard>

        <FilterEyebrow>Price</FilterEyebrow>
        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.xs + 2,
            marginTop: theme.spacing.sm,
          }}
        >
          {priceOptions.map((price) => {
            const selected = filters.price === price;

            return (
              <Pressable
                key={price}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => selectPrice(price)}
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
                    ...theme.typography.bodySmall,
                    fontFamily: theme.fonts.family.sansSemibold,
                    color: selected
                      ? theme.colors.background.cream50
                      : theme.colors.text.espresso700,
                  }}
                >
                  {price}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FilterEyebrow>Treats &amp; occasions</FilterEyebrow>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs + 2,
            marginTop: theme.spacing.sm,
          }}
        >
          {filterTreats.map((treat) => (
            <VibeChip
              key={treat}
              label={treat}
              selected={filters.treats.includes(treat)}
              onPress={() => toggleTreat(treat)}
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
          gap: theme.spacing.xs + 2,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.screen,
          borderTopWidth: 1,
          borderTopColor: theme.colors.surface.borderSoft,
          backgroundColor: theme.colors.background.cream50,
        }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={resetFilters}
          style={({ pressed }) => ({
            flex: 1,
            minHeight: theme.sizing.control,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.button,
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
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            Reset
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={applyFilters}
          style={({ pressed }) => ({
            flex: 2,
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
            Apply Filters
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type FilterEyebrowProps = {
  children: ReactNode;
  style?: { marginTop?: number };
};

function FilterEyebrow({ children, style }: FilterEyebrowProps) {
  return (
    <Text
      style={{
        ...theme.typography.caption,
        fontFamily: theme.fonts.family.sansBold,
        color: theme.colors.text.muted,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginTop: style?.marginTop ?? 26,
      }}
    >
      {children}
    </Text>
  );
}

type FilterCardProps = {
  children: ReactNode;
  vertical?: boolean;
};

function FilterCard({ children, vertical = true }: FilterCardProps) {
  return (
    <View
      style={{
        marginTop: theme.spacing.sm,
        paddingHorizontal: theme.spacing.screen,
        paddingVertical: vertical ? theme.spacing.md + 2 : theme.spacing.xxs + 2,
        borderRadius: theme.spacing.screen,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.surface.cardCream,
      }}
    >
      {children}
    </View>
  );
}

type MoodLevelRowProps = {
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
  last?: boolean;
};

function MoodLevelRow({ label, hint, value, onChange, last }: MoodLevelRowProps) {
  return (
    <View
      style={{
        paddingVertical: theme.spacing.md - 2,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.colors.surface.borderSoft,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            ...theme.typography.chipLabel,
            fontFamily: theme.fonts.family.sansSemibold,
            color: theme.colors.text.espresso900,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            ...theme.typography.caption,
            color: theme.colors.text.muted,
          }}
        >
          {hint}
        </Text>
      </View>
      <View style={{ marginTop: theme.spacing.xs - 2 }}>
        <MoodSlider label={label} value={value} onChange={onChange} />
      </View>
    </View>
  );
}
