import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useSyncExternalStore } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import {
  COLLECTION_EMPTY_COPY,
  getCollectionDetail,
} from "@/data/collection-detail";
import type { CollectionCafe } from "@/data/collection-detail";
import type { CafeMapPinTone } from "@/data/map-pins";
import { SAVED_MAP_PIN_SPOTS, demoSavedState } from "@/data/saved-library";
import {
  getSavedState,
  subscribeSaved,
  updateCollection,
} from "@/utils/saved-store";
import type { CollectionPrivacy } from "@/utils/saved-store";

const toneSwatch: Record<CafeMapPinTone, string> = {
  terracotta: theme.colors.brand.terracotta,
  latte: theme.colors.brand.latteBeige,
  olive: theme.colors.brand.oliveMatcha,
};

export default function CollectionDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // QA override ?state=demo composes the detail from the demo library without
  // touching the persisted store (privacy toggle disabled there).
  const params = useLocalSearchParams<{ id?: string; state?: string }>();
  const collectionId = typeof params.id === "string" ? params.id : "";
  const usesDemoState = params.state === "demo";
  const storeState = useSyncExternalStore(subscribeSaved, getSavedState);
  const state = useMemo(
    () => (usesDemoState ? demoSavedState(storeState) : storeState),
    [usesDemoState, storeState],
  );
  const detail = getCollectionDetail(state, collectionId);

  if (!detail) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background.cream50,
        }}
      >
        <Text
          style={{
            ...theme.typography.bodySmall,
            textAlign: "center",
            color: theme.colors.text.muted,
          }}
        >
          {"This collection doesn't exist anymore."}
        </Text>
      </View>
    );
  }

  const { collection, cafes, count, countLabel, coverTones } = detail;

  const setPrivacy = (privacy: CollectionPrivacy) => {
    if (!usesDemoState && collection.privacy !== privacy) {
      updateCollection(collection.id, { privacy });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom:
            Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.xxl,
        }}
      >
        {/* D3 cover collage: one tall tile + two stacked tiles. */}
        <View style={{ height: 220, flexDirection: "row", gap: 3 }}>
          <View
            style={{ flex: 1.4, backgroundColor: toneSwatch[coverTones[0]] }}
          />
          <View style={{ flex: 1, gap: 3 }}>
            <View
              style={{ flex: 1, backgroundColor: toneSwatch[coverTones[1]] }}
            />
            <View
              style={{ flex: 1, backgroundColor: toneSwatch[coverTones[2]] }}
            />
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: Math.max(insets.top, theme.spacing.lg) + theme.spacing.xs,
            left: theme.spacing.screen,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            backgroundColor: theme.colors.surface.glassCream,
          }}
        >
          <Text style={{ fontSize: 20, color: theme.colors.text.espresso900 }}>
            ‹
          </Text>
        </Pressable>
        {/* Share stays inert until the share provider lands (decisions 0015/0019). */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share collection"
          style={{
            position: "absolute",
            top: Math.max(insets.top, theme.spacing.lg) + theme.spacing.xs,
            right: theme.spacing.screen,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            backgroundColor: theme.colors.surface.glassCream,
          }}
        >
          <Text style={{ fontSize: 15, color: theme.colors.text.espresso900 }}>
            ↗
          </Text>
        </Pressable>

        <View
          style={{
            paddingHorizontal: theme.spacing.screen + 2,
            paddingTop: theme.spacing.md,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.family.serifSemibold,
              fontSize: 24,
              lineHeight: 29,
              color: theme.colors.text.espresso900,
            }}
          >
            {collection.name}
          </Text>
          {collection.description ? (
            <Text
              style={{
                ...theme.typography.caption,
                marginTop: theme.spacing.xxs,
                color: theme.colors.text.muted,
              }}
            >
              {collection.description}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: theme.spacing.xs,
            }}
          >
            <Text
              style={{
                ...theme.typography.caption,
                color: theme.colors.text.muted,
              }}
            >
              {countLabel}
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 3,
                padding: 3,
                borderRadius: theme.radius.button - 8,
                backgroundColor: theme.colors.surface.pressed,
              }}
            >
              {(["private", "public"] as const).map((option) => {
                const selected = collection.privacy === option;
                const label = option === "private" ? "Private" : "Public";

                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${label} collection`}
                    onPress={() => setPrivacy(option)}
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: theme.spacing.sm - 1,
                      borderRadius: theme.radius.button - 10,
                      backgroundColor: selected
                        ? theme.colors.background.cream50
                        : "transparent",
                      boxShadow: selected
                        ? theme.shadows.searchCard
                        : undefined,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.typography.caption,
                        fontSize: 10,
                        fontFamily: theme.fonts.family.sansSemibold,
                        color: selected
                          ? theme.colors.text.espresso900
                          : theme.colors.text.muted,
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Map preview with a live View-on-map hop into the saved library. */}
          <View
            style={{
              height: 100,
              borderRadius: theme.radius.button,
              borderCurve: "continuous",
              overflow: "hidden",
              marginTop: theme.spacing.md,
              backgroundColor: theme.colors.background.warmPaper,
            }}
          >
            {[0, 1].map((row) => (
              <View
                key={`h-${row}`}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 34 * (row + 1),
                  height: 1,
                  backgroundColor: theme.colors.surface.borderSoft,
                }}
              />
            ))}
            {[0, 1, 2, 3, 4, 5, 6].map((col) => (
              <View
                key={`v-${col}`}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 46 * (col + 1),
                  width: 1,
                  backgroundColor: theme.colors.surface.borderSoft,
                }}
              />
            ))}
            {cafes.slice(0, 4).map((cafe, index) => {
              const spot =
                SAVED_MAP_PIN_SPOTS[index % SAVED_MAP_PIN_SPOTS.length];

              return (
                <View
                  key={cafe.cafeId}
                  style={{
                    position: "absolute",
                    top: 14 + (spot.top % 52),
                    left: 40 + ((spot.left * 83) % 260),
                    width: 30,
                    height: 30,
                    borderRadius: theme.radius.photoPin,
                    borderWidth: 2.5,
                    borderColor: theme.colors.background.cream50,
                    backgroundColor: toneSwatch[cafe.tone],
                    boxShadow: theme.shadows.pin,
                  }}
                />
              );
            })}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View on map"
              onPress={() => router.push(`/saved?view=map&tab=${collection.id}`)}
              style={({ pressed }) => ({
                position: "absolute",
                right: theme.spacing.xs + 2,
                bottom: theme.spacing.xs,
                paddingVertical: theme.spacing.xxs,
                paddingHorizontal: theme.spacing.xs + 2,
                borderRadius: theme.radius.chip,
                backgroundColor: theme.colors.surface.glassCream,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  ...theme.typography.caption,
                  fontSize: 10,
                  fontFamily: theme.fonts.family.sansSemibold,
                  color: theme.colors.text.espresso700,
                }}
              >
                View on map
              </Text>
            </Pressable>
          </View>

          {count === 0 ? (
            <Text
              style={{
                ...theme.typography.bodySmall,
                marginTop: theme.spacing.lg,
                textAlign: "center",
                color: theme.colors.text.muted,
              }}
            >
              {COLLECTION_EMPTY_COPY}
            </Text>
          ) : (
            cafes.map((cafe) => (
              <CollectionCafeCard
                key={cafe.cafeId}
                cafe={cafe}
                onOpen={() => router.push(`/cafe/${cafe.cafeId}`)}
              />
            ))
          )}

          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.xs + 2,
              marginTop: theme.spacing.lg - 4,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit collection"
              onPress={() => router.push(`/collection/${collection.id}/edit`)}
              style={({ pressed }) => ({
                flex: 1,
                minHeight: theme.sizing.compactControl,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: theme.radius.button - 2,
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
                Edit collection
              </Text>
            </Pressable>
            {/* Share stays inert until the share provider lands (0015/0019). */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Share"
              style={({ pressed }) => ({
                flex: 1,
                minHeight: theme.sizing.compactControl,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: theme.radius.button - 2,
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
                Share
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

type CollectionCafeCardProps = {
  cafe: CollectionCafe;
  onOpen: () => void;
};

function CollectionCafeCard({ cafe, onOpen }: CollectionCafeCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${cafe.name}`}
      onPress={onOpen}
      style={({ pressed }) => ({
        flexDirection: "row",
        gap: theme.spacing.sm + 1,
        padding: theme.spacing.sm - 1,
        marginTop: theme.spacing.sm,
        borderRadius: theme.radius.button + 2,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: pressed
          ? theme.colors.surface.pressed
          : theme.colors.surface.cardCream,
      })}
    >
      <View
        style={{
          width: 74,
          height: 74,
          borderRadius: theme.radius.button - 4,
          borderCurve: "continuous",
          backgroundColor: toneSwatch[cafe.tone],
        }}
      />
      <View style={{ flex: 1, minWidth: 0, paddingVertical: 3 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            {cafe.name}
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              fontFamily: theme.fonts.family.sansBold,
              color: theme.colors.score.great,
            }}
          >
            {cafe.score}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          style={{
            ...theme.typography.caption,
            fontSize: 11,
            marginTop: 2,
            color: theme.colors.text.muted,
          }}
        >
          {cafe.meta}
        </Text>
        {cafe.note ? (
          <Text
            numberOfLines={2}
            style={{
              ...theme.typography.caption,
              fontSize: 11,
              fontStyle: "italic",
              marginTop: theme.spacing.xs - 2,
              color: theme.colors.brand.roastedBrown,
            }}
          >
            {`"${cafe.note}"`}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
