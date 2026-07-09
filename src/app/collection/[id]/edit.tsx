import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import {
  EDIT_REORDER_EYEBROW,
  getCollectionDetail,
} from "@/data/collection-detail";
import type { CollectionCafe } from "@/data/collection-detail";
import type { CollectionTone } from "@/data/collections";
import type { CafeMapPinTone } from "@/data/map-pins";
import { demoSavedState } from "@/data/saved-library";
import {
  getSavedState,
  removeCafeFromCollection,
  updateCollection,
} from "@/utils/saved-store";

const toneSwatch: Record<CafeMapPinTone, string> = {
  terracotta: theme.colors.brand.terracotta,
  latte: theme.colors.brand.latteBeige,
  olive: theme.colors.brand.oliveMatcha,
};

const coverSwatch: Record<CollectionTone, string> = {
  terracotta: theme.colors.brand.terracotta,
  olive: theme.colors.brand.oliveMatcha,
  latte: theme.colors.brand.latteBeige,
  roasted: theme.colors.brand.roastedBrown,
};

const COVER_TONES: CollectionTone[] = [
  "terracotta",
  "olive",
  "latte",
  "roasted",
];

// Draft state for the D5 edit screen: everything is edited locally and only
// committed to the saved store by Save Changes, so backing out is safe.
type EditDraft = {
  name: string;
  description: string;
  privacy: "private" | "public";
  tone: CollectionTone;
  cafes: CollectionCafe[];
};

export default function EditCollectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; state?: string }>();
  const collectionId = typeof params.id === "string" ? params.id : "";
  const usesDemoState = params.state === "demo";
  // Snapshot on mount: the edit screen owns its draft; live store updates
  // while editing would fight the user's in-progress changes.
  const initial = useMemo(() => {
    const state = usesDemoState
      ? demoSavedState(getSavedState())
      : getSavedState();

    return getCollectionDetail(state, collectionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [draft, setDraft] = useState<EditDraft | null>(() =>
    initial
      ? {
          name: initial.collection.name,
          description: initial.collection.description,
          privacy: initial.collection.privacy,
          tone: initial.collection.tone,
          cafes: initial.cafes,
        }
      : null,
  );

  if (!initial || !draft) {
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

  const isPrivate = draft.privacy === "private";

  const moveCafe = (cafeId: string, delta: -1 | 1) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      const index = current.cafes.findIndex((cafe) => cafe.cafeId === cafeId);
      const target = index + delta;

      if (index < 0 || target < 0 || target >= current.cafes.length) {
        return current;
      }

      const cafes = [...current.cafes];
      [cafes[index], cafes[target]] = [cafes[target], cafes[index]];

      return { ...current, cafes };
    });
  };

  const removeCafe = (cafeId: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            cafes: current.cafes.filter((cafe) => cafe.cafeId !== cafeId),
          }
        : current,
    );
  };

  const saveChanges = () => {
    if (!usesDemoState) {
      const keptIds = draft.cafes.map((cafe) => cafe.cafeId);

      for (const cafe of initial.cafes) {
        if (!keptIds.includes(cafe.cafeId)) {
          removeCafeFromCollection(collectionId, cafe.cafeId);
        }
      }

      updateCollection(collectionId, {
        name: draft.name,
        description: draft.description,
        privacy: draft.privacy,
        tone: draft.tone,
        cafeOrder: keptIds,
      });
    }

    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen + 2,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.md,
          paddingBottom: 140,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
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
              fontSize: 22,
              lineHeight: 27,
              color: theme.colors.text.espresso900,
            }}
          >
            Edit collection
          </Text>
        </View>

        {/* Cover: tone swatch until a media provider lands (decision 0019). */}
        <View
          style={{
            height: 120,
            borderRadius: theme.radius.card - 2,
            borderCurve: "continuous",
            overflow: "hidden",
            marginTop: theme.spacing.md + 2,
            backgroundColor: coverSwatch[draft.tone],
          }}
        >
          <View
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.5,
              backgroundColor: theme.colors.surface.overlayDark,
            }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change cover"
            onPress={() =>
              setDraft((current) =>
                current
                  ? {
                      ...current,
                      tone: COVER_TONES[
                        (COVER_TONES.indexOf(current.tone) + 1) %
                          COVER_TONES.length
                      ],
                    }
                  : current,
              )
            }
            style={({ pressed }) => ({
              position: "absolute",
              left: theme.spacing.md - 2,
              bottom: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.md - 2,
              borderRadius: theme.radius.chip,
              backgroundColor: theme.colors.surface.glassCream,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                ...theme.typography.caption,
                fontSize: 11,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.text.espresso900,
              }}
            >
              Change cover
            </Text>
          </Pressable>
        </View>

        <FieldCard label="Name">
          <TextInput
            accessibilityLabel="Collection name"
            value={draft.name}
            onChangeText={(name) =>
              setDraft((current) => (current ? { ...current, name } : current))
            }
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              marginTop: theme.spacing.xxs,
              padding: 0,
              color: theme.colors.text.espresso900,
            }}
          />
        </FieldCard>
        <FieldCard label="Description">
          <TextInput
            accessibilityLabel="Collection description"
            value={draft.description}
            onChangeText={(description) =>
              setDraft((current) =>
                current ? { ...current, description } : current,
              )
            }
            placeholder="Reliable Wi-Fi, outlets you can actually find…"
            placeholderTextColor={theme.colors.text.muted}
            multiline
            style={{
              ...theme.typography.caption,
              fontSize: 13,
              lineHeight: 19,
              marginTop: theme.spacing.xxs,
              padding: 0,
              color: theme.colors.text.espresso700,
            }}
          />
        </FieldCard>

        <Pressable
          accessibilityRole="switch"
          accessibilityLabel="Collection privacy"
          accessibilityState={{ checked: isPrivate }}
          onPress={() =>
            setDraft((current) =>
              current
                ? {
                    ...current,
                    privacy: current.privacy === "private" ? "public" : "private",
                  }
                : current,
            )
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: theme.spacing.xs + 2,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radius.button - 2,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: theme.colors.surface.borderMedium,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={{
                ...theme.typography.chipLabel,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.text.espresso900,
              }}
            >
              {isPrivate ? "Private collection" : "Public collection"}
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                marginTop: 2,
                color: theme.colors.text.muted,
              }}
            >
              {isPrivate
                ? "Only you can see this"
                : "Anyone with the link can view"}
            </Text>
          </View>
          <View
            style={{
              width: 46,
              height: 28,
              borderRadius: theme.radius.chip,
              padding: 3,
              justifyContent: "center",
              alignItems: isPrivate ? "flex-start" : "flex-end",
              backgroundColor: isPrivate
                ? theme.colors.surface.borderStrong
                : theme.colors.brand.oliveMatcha,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: theme.radius.photoPin,
                backgroundColor: theme.colors.background.cream50,
              }}
            />
          </View>
        </Pressable>

        <Text
          style={{
            ...theme.typography.caption,
            fontFamily: theme.fonts.family.sansBold,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginTop: theme.spacing.lg - 4,
            color: theme.colors.text.muted,
          }}
        >
          {EDIT_REORDER_EYEBROW}
        </Text>
        {draft.cafes.map((cafe, index) => (
          <View
            key={cafe.cafeId}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.sm - 2,
              marginTop: theme.spacing.xs + 1,
              paddingVertical: theme.spacing.xs + 3,
              paddingHorizontal: theme.spacing.sm + 2,
              borderRadius: theme.radius.button,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: theme.colors.surface.borderSoft,
              backgroundColor: theme.colors.surface.cardCream,
            }}
          >
            {/* Reorder: explicit move buttons stand in for drag (decision 0019). */}
            <View style={{ gap: 2 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Move ${cafe.name} up`}
                disabled={index === 0}
                onPress={() => moveCafe(cafe.cafeId, -1)}
                hitSlop={4}
                style={({ pressed }) => ({
                  opacity: index === 0 ? 0.25 : pressed ? 0.6 : 1,
                })}
              >
                <Text style={{ fontSize: 11, color: theme.colors.text.espresso700 }}>
                  ▲
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Move ${cafe.name} down`}
                disabled={index === draft.cafes.length - 1}
                onPress={() => moveCafe(cafe.cafeId, 1)}
                hitSlop={4}
                style={({ pressed }) => ({
                  opacity:
                    index === draft.cafes.length - 1
                      ? 0.25
                      : pressed
                        ? 0.6
                        : 1,
                })}
              >
                <Text style={{ fontSize: 11, color: theme.colors.text.espresso700 }}>
                  ▼
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: theme.radius.button - 6,
                borderCurve: "continuous",
                backgroundColor: toneSwatch[cafe.tone],
              }}
            />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                numberOfLines={1}
                style={{
                  ...theme.typography.chipLabel,
                  fontFamily: theme.fonts.family.sansSemibold,
                  color: theme.colors.text.espresso900,
                }}
              >
                {cafe.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  ...theme.typography.caption,
                  fontSize: 11,
                  marginTop: 1,
                  color: theme.colors.text.muted,
                }}
              >
                {cafe.meta}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${cafe.name} from collection`}
              onPress={() => removeCafe(cafe.cafeId)}
              hitSlop={6}
              style={({ pressed }) => ({
                width: 26,
                height: 26,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: theme.radius.photoPin,
                backgroundColor: theme.colors.surface.cautionSoft,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: theme.fonts.family.sansBold,
                  color: theme.colors.score.crowded,
                }}
              >
                –
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: theme.spacing.screen,
          paddingTop: theme.spacing.sm + 2,
          paddingBottom: Math.max(insets.bottom, theme.spacing.md) + theme.spacing.xs,
          borderTopWidth: 1,
          borderTopColor: theme.colors.surface.borderSoft,
          backgroundColor: theme.colors.background.cream50,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save Changes"
          onPress={saveChanges}
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
            Save Changes
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type FieldCardProps = {
  label: string;
  children: React.ReactNode;
};

function FieldCard({ label, children }: FieldCardProps) {
  return (
    <View
      style={{
        marginTop: theme.spacing.xs + 2,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm - 1,
        borderRadius: theme.radius.button - 2,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderMedium,
        backgroundColor: theme.colors.surface.cardCream,
      }}
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
      {children}
    </View>
  );
}
