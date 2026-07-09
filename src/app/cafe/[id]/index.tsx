import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AISummaryCard,
  CreateCollectionSheet,
  LoadingSkeleton,
  SaveCollectionSheet,
  ShareCafeSheet,
} from "@/components/ui";
import type { SaveCollectionOption } from "@/components/ui";
import { theme } from "@/constants/theme";
import {
  CAFE_DETAIL_LOADING_MS,
  cafeDetailErrorCopy,
  cafeDetailErrorTitle,
  cafeDetailLimitedNotice,
  getCafeDetail,
  scoreTone,
} from "@/data/cafe-details";
import type { CafeBestTime, CafeDetail, CafeSimilar } from "@/data/cafe-details";
import { cafeMapPins } from "@/data/map-pins";
import type { CafeMapPin, CafeMapPinTone } from "@/data/map-pins";
import { getReviewInsight } from "@/data/review-insights";
import { getShareCardContent } from "@/data/share-card";
import type { ShareAction } from "@/data/share-card";
import {
  collectionSaveCount,
  createCollection,
  getCafeSave,
  getSavedState,
  isCafeSaved,
  saveCafe,
  subscribeSaved,
} from "@/utils/saved-store";
import type { CollectionPrivacy } from "@/utils/saved-store";

// QA override for deterministic simulator smoke of the detail states
// (same deep-link pattern as ?discovery= on the map route).
type DetailStateOverride = "loading" | "error" | "limited";

// QA override to open a save/create/share sheet on load for simulator smoke.
type DetailSheetOverride = "save" | "create" | "share";

type DetailPhase = "loading" | "ready" | "error";

const HERO_HEIGHT = 300;

const toneColors: Record<CafeMapPinTone, { base: string; accent: string }> = {
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
};

const scoreToneColors = {
  great: theme.colors.score.great,
  good: theme.colors.score.good,
  crowded: theme.colors.score.crowded,
} as const;

function parseDetailOverride(
  value: string | string[] | undefined,
): DetailStateOverride | undefined {
  return value === "loading" || value === "error" || value === "limited"
    ? value
    : undefined;
}

function parseSheetOverride(
  value: string | string[] | undefined,
): DetailSheetOverride | undefined {
  return value === "save" || value === "create" || value === "share"
    ? value
    : undefined;
}

export default function CafeDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    state?: string;
    sheet?: string;
  }>();
  const cafeId = typeof params.id === "string" ? params.id : "";
  const stateOverride = parseDetailOverride(params.state);
  const sheetOverride = parseSheetOverride(params.sheet);
  const pin = cafeMapPins.find((cafe) => cafe.id === cafeId);
  const detail = getCafeDetail(cafeId);
  const [phase, setPhase] = useState<DetailPhase>("loading");
  const [retryAttempt, setRetryAttempt] = useState(0);
  const savedState = useSyncExternalStore(subscribeSaved, getSavedState);

  useEffect(() => {
    if (stateOverride === "loading") {
      return;
    }

    const failed = stateOverride === "error" || !pin || !detail;
    const timer = setTimeout(
      () => setPhase(failed ? "error" : "ready"),
      CAFE_DETAIL_LOADING_MS,
    );

    return () => clearTimeout(timer);
  }, [detail, pin, retryAttempt, stateOverride]);

  const retry = () => {
    setPhase("loading");
    setRetryAttempt((attempt) => attempt + 1);
  };

  if (phase !== "ready" || !pin || !detail) {
    return (
      <DetailStateScreen
        phase={phase === "ready" ? "error" : phase}
        onRetry={retry}
      />
    );
  }

  return (
    <LoadedCafeDetail
      pin={pin}
      detail={detail}
      limited={detail.limited === true || stateOverride === "limited"}
      savedState={savedState}
      sheetOverride={sheetOverride}
    />
  );
}

type LoadedCafeDetailProps = {
  pin: CafeMapPin;
  detail: CafeDetail;
  limited: boolean;
  savedState: ReturnType<typeof getSavedState>;
  sheetOverride?: DetailSheetOverride;
};

type DetailSheet = "none" | "save" | "create" | "share";

function LoadedCafeDetail({
  pin,
  detail,
  limited,
  savedState,
  sheetOverride,
}: LoadedCafeDetailProps) {
  const insets = useSafeAreaInsets();
  const showEditorial = !limited;
  const insight = getReviewInsight(pin.id);
  const saved = isCafeSaved(savedState, pin.id);

  const initialSave = getCafeSave(savedState, pin.id);
  const [sheet, setSheet] = useState<DetailSheet>(sheetOverride ?? "none");
  const [draftIds, setDraftIds] = useState<string[]>(
    initialSave?.collectionIds ?? [],
  );
  const [note, setNote] = useState(initialSave?.note ?? "");
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createPrivacy, setCreatePrivacy] = useState<CollectionPrivacy>(
    "private",
  );

  const collectionOptions: SaveCollectionOption[] = savedState.collections.map(
    (collection) => ({
      id: collection.id,
      name: collection.name,
      tone: collection.tone,
      count: collectionSaveCount(savedState, collection.id),
    }),
  );

  const shareContent = getShareCardContent(pin.id);

  const openShareSheet = () => setSheet("share");

  // Copy Link / Share Image / Send to Friend stay inert until a clipboard /
  // view-shot / share provider lands (decision 0015), matching the other
  // provider-deferred actions (Directions, Add to Route, Open in Google Maps).
  const handleShareAction = (_action: ShareAction) => {};

  const openSaveSheet = () => {
    const existing = getCafeSave(savedState, pin.id);
    setDraftIds(existing?.collectionIds ?? []);
    setNote(existing?.note ?? "");
    setSheet("save");
  };

  const toggleDraftCollection = (id: string) => {
    setDraftIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  const commitSave = () => {
    saveCafe(pin.id, { collectionIds: draftIds, note });
    setSheet("none");
  };

  const openCreateSheet = () => {
    setCreateName("");
    setCreateDescription("");
    setCreatePrivacy("private");
    setSheet("create");
  };

  const commitCreate = () => {
    if (createName.trim().length === 0) {
      return;
    }

    const created = createCollection({
      name: createName,
      description: createDescription,
      privacy: createPrivacy,
    });

    setDraftIds((current) => [...current, created.id]);
    setSheet("save");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        <HeroCarousel
          tones={detail.photoTones}
          photoTotal={detail.photoTotal}
          saved={saved}
          onToggleSave={openSaveSheet}
          onOpenShare={openShareSheet}
        />

        <View
          style={{
            paddingHorizontal: theme.spacing.screen,
            paddingTop: theme.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: theme.spacing.sm,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                ...theme.typography.title,
                fontSize: 27,
                lineHeight: 33,
                flex: 1,
                color: theme.colors.text.espresso900,
              }}
            >
              {pin.name}
            </Text>
            <View
              style={{
                marginTop: theme.spacing.xs - 2,
                paddingHorizontal: theme.spacing.sm - 1,
                paddingVertical: theme.spacing.xxs + 1,
                borderRadius: theme.radius.chip,
                backgroundColor: theme.colors.surface.positiveSoft,
              }}
            >
              <Text
                style={{
                  ...theme.typography.caption,
                  fontSize: 11,
                  fontFamily: theme.fonts.family.sansBold,
                  color: theme.colors.score.great,
                }}
              >
                {detail.status}
              </Text>
            </View>
          </View>
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontSize: 13,
              marginTop: theme.spacing.xxs,
              color: theme.colors.text.muted,
            }}
          >
            {pin.meta} · {detail.statusMeta}
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: theme.spacing.xs - 1,
              marginTop: theme.spacing.sm,
            }}
          >
            {pin.tags.map((tag) => (
              <View
                key={tag}
                style={{
                  paddingHorizontal: theme.spacing.sm + 1,
                  paddingVertical: theme.spacing.xs - 2,
                  borderRadius: theme.radius.chip,
                  backgroundColor: theme.colors.surface.latteSoft,
                }}
              >
                <Text
                  style={{
                    ...theme.typography.caption,
                    fontSize: 11,
                    fontFamily: theme.fonts.family.sansMedium,
                    color: theme.colors.text.espresso700,
                  }}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          {limited ? (
            <View
              style={{
                marginTop: theme.spacing.md,
                padding: theme.spacing.md,
                borderRadius: theme.radius.button,
                borderCurve: "continuous",
                backgroundColor: theme.colors.background.warmPaper,
              }}
            >
              <Text
                style={{
                  ...theme.typography.caption,
                  color: theme.colors.text.muted,
                }}
              >
                {cafeDetailLimitedNotice}
              </Text>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.xs,
              marginTop: theme.spacing.md + 2,
            }}
          >
            {detail.detailScores.map((score) => (
              <View
                key={score.label}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: theme.spacing.sm,
                  paddingHorizontal: theme.spacing.xxs,
                  borderRadius: theme.spacing.md,
                  borderCurve: "continuous",
                  borderWidth: 1,
                  borderColor: theme.colors.surface.borderSoft,
                  backgroundColor: theme.colors.surface.cardCream,
                }}
              >
                <Text
                  style={{
                    ...theme.typography.sectionTitle,
                    fontSize: 19,
                    lineHeight: 24,
                    fontFamily: theme.fonts.family.sansBold,
                    color: scoreToneColors[scoreTone(score.value)],
                  }}
                >
                  {score.value}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    ...theme.typography.caption,
                    fontSize: 9,
                    marginTop: theme.spacing.xxs - 1,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    color: theme.colors.text.muted,
                  }}
                >
                  {score.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: theme.spacing.md }}>
            <AISummaryCard eyebrow="Vibe summary">{pin.summary}</AISummaryCard>
          </View>

          <DetailEyebrow>Details</DetailEyebrow>
          <View
            style={{
              marginTop: theme.spacing.xs + 2,
              paddingHorizontal: theme.spacing.screen,
              paddingVertical: theme.spacing.xxs,
              borderRadius: theme.spacing.screen,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: theme.colors.surface.borderSoft,
              backgroundColor: theme.colors.surface.cardCream,
            }}
          >
            {detail.facts.map((fact, index) => (
              <View
                key={fact.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: theme.spacing.sm,
                  paddingVertical: theme.spacing.sm - 1,
                  borderBottomWidth: index === detail.facts.length - 1 ? 0 : 1,
                  borderBottomColor: theme.colors.surface.borderSoft,
                }}
              >
                <Text
                  style={{
                    ...theme.typography.caption,
                    fontFamily: theme.fonts.family.sansSemibold,
                    color: theme.colors.text.muted,
                  }}
                >
                  {fact.label}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    ...theme.typography.caption,
                    fontSize: 13,
                    flexShrink: 1,
                    fontFamily: theme.fonts.family.sansMedium,
                    color: theme.colors.text.espresso900,
                    textAlign: "right",
                  }}
                >
                  {fact.value}
                </Text>
              </View>
            ))}
          </View>

          {showEditorial ? (
            <>
              <DetailEyebrow>Why it matches your mood</DetailEyebrow>
              <View style={{ gap: theme.spacing.xs + 2, marginTop: theme.spacing.xs + 2 }}>
                {pin.whyItMatches.map((reason) => (
                  <View
                    key={reason}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: theme.spacing.xs + 2,
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        marginTop: 6,
                        borderRadius: theme.radius.photoPin,
                        backgroundColor: theme.colors.score.great,
                      }}
                    />
                    <Text
                      style={{
                        ...theme.typography.caption,
                        fontSize: 13,
                        lineHeight: 19,
                        flex: 1,
                        color: theme.colors.text.espresso700,
                      }}
                    >
                      {reason}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: theme.spacing.sm,
                  marginTop: theme.spacing.lg,
                }}
              >
                <EditorialChipColumn
                  title="People love"
                  items={pin.peopleLove}
                  tone="positive"
                />
                <EditorialChipColumn
                  title="Watch out for"
                  items={pin.watchOutFor}
                  tone="caution"
                />
              </View>

              {insight ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="What people say"
                  onPress={() => router.push(`/cafe/${pin.id}/insights`)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: theme.spacing.sm,
                    marginTop: theme.spacing.lg,
                    paddingHorizontal: theme.spacing.md + 2,
                    paddingVertical: theme.spacing.md - 2,
                    borderRadius: theme.spacing.screen,
                    borderCurve: "continuous",
                    borderWidth: 1,
                    borderColor: theme.colors.surface.borderSoft,
                    backgroundColor: pressed
                      ? theme.colors.surface.pressed
                      : theme.colors.surface.cardCream,
                  })}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        ...theme.typography.chipLabel,
                        fontFamily: theme.fonts.family.sansSemibold,
                        color: theme.colors.text.espresso900,
                      }}
                    >
                      What people say
                    </Text>
                    <Text
                      style={{
                        ...theme.typography.caption,
                        marginTop: 2,
                        color: theme.colors.text.muted,
                      }}
                    >
                      Summarized from {insight.reviewCount} reviews
                    </Text>
                  </View>
                  <Image
                    source="sf:chevron.right"
                    style={{
                      width: 13,
                      height: 13,
                      tintColor: theme.colors.text.muted,
                    }}
                  />
                </Pressable>
              ) : null}

              {detail.bestTimes.length > 0 ? (
                <>
                  <DetailEyebrow>Best time to visit</DetailEyebrow>
                  <BestTimeChart bestTimes={detail.bestTimes} />
                </>
              ) : null}

              {detail.similar.length > 0 ? (
                <>
                  <DetailEyebrow>Similar cafes nearby</DetailEyebrow>
                  <SimilarCafesRow similar={detail.similar} />
                </>
              ) : null}
            </>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: theme.spacing.md + 2,
              marginTop: theme.spacing.lg - 2,
            }}
          >
            <TextAction label="Share" onPress={openShareSheet} />
            <TextActionDivider />
            <TextAction
              label="View Photos"
              onPress={() => router.push(`/cafe/${pin.id}/gallery`)}
            />
            <TextActionDivider />
            <TextAction label="Open in Google Maps" />
          </View>
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
          paddingTop: theme.spacing.md - 2,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.surface.borderSoft,
          backgroundColor: theme.colors.background.cream50,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saved ? "Saved cafe" : "Save cafe"}
          accessibilityState={{ selected: saved }}
          onPress={openSaveSheet}
          style={({ pressed }) => ({
            width: 48,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.button - 2,
            borderCurve: "continuous",
            borderWidth: saved ? 0 : 1.5,
            borderColor: theme.colors.surface.borderStrong,
            backgroundColor: saved
              ? theme.colors.brand.terracotta
              : pressed
                ? theme.colors.surface.pressed
                : "transparent",
          })}
        >
          <Image
            source={saved ? "sf:heart.fill" : "sf:heart"}
            style={{
              width: 17,
              height: 17,
              tintColor: saved
                ? theme.colors.background.cream50
                : theme.colors.brand.terracotta,
            }}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={undefined}
          style={({ pressed }) => ({
            flex: 1.2,
            minHeight: theme.sizing.compactControl,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.button - 2,
            borderCurve: "continuous",
            backgroundColor: pressed
              ? theme.colors.text.espresso700
              : theme.colors.text.espresso900,
            boxShadow: theme.shadows.button,
          })}
        >
          <Text
            style={{
              ...theme.typography.chipLabel,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.background.cream50,
            }}
          >
            Directions
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={undefined}
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
            Add to Route
          </Text>
        </Pressable>
      </View>

      {sheet === "save" ? (
        <SaveCollectionSheet
          cafeName={pin.name}
          collections={collectionOptions}
          selectedIds={draftIds}
          note={note}
          onToggleCollection={toggleDraftCollection}
          onChangeNote={setNote}
          onCreateNew={openCreateSheet}
          onCancel={() => setSheet("none")}
          onSave={commitSave}
        />
      ) : null}

      {sheet === "create" ? (
        <CreateCollectionSheet
          name={createName}
          description={createDescription}
          privacy={createPrivacy}
          onChangeName={setCreateName}
          onChangeDescription={setCreateDescription}
          onPickSuggested={setCreateName}
          onTogglePrivacy={() =>
            setCreatePrivacy((current) =>
              current === "private" ? "public" : "private",
            )
          }
          onCancel={() => setSheet("save")}
          onCreate={commitCreate}
        />
      ) : null}

      {sheet === "share" && shareContent ? (
        <ShareCafeSheet
          content={shareContent}
          onAction={handleShareAction}
          onClose={() => setSheet("none")}
        />
      ) : null}
    </View>
  );
}

type HeroCarouselProps = {
  tones: CafeMapPinTone[];
  photoTotal: number;
  saved: boolean;
  onToggleSave: () => void;
  onOpenShare: () => void;
};

function HeroCarousel({
  tones,
  photoTotal,
  saved,
  onToggleSave,
  onOpenShare,
}: HeroCarouselProps) {
  const insets = useSafeAreaInsets();
  const [heroWidth, setHeroWidth] = useState(0);
  const [slide, setSlide] = useState(0);
  const hasPhotos = tones.length > 0;

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (heroWidth <= 0) {
      return;
    }

    setSlide(
      Math.max(
        0,
        Math.min(
          tones.length - 1,
          Math.round(event.nativeEvent.contentOffset.x / heroWidth),
        ),
      ),
    );
  };

  return (
    <View
      onLayout={(event) => setHeroWidth(event.nativeEvent.layout.width)}
      style={{
        height: HERO_HEIGHT,
        backgroundColor: theme.colors.background.warmPaper,
      }}
    >
      {hasPhotos && heroWidth > 0 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumEnd}
        >
          {tones.map((tone, index) => (
            <View
              key={`${tone}-${index}`}
              accessibilityLabel={`Cafe photo ${index + 1} of ${tones.length}`}
              style={{
                width: heroWidth,
                height: HERO_HEIGHT,
                overflow: "hidden",
                backgroundColor: toneColors[tone].base,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  right: -40,
                  bottom: -60,
                  width: 220,
                  height: 220,
                  borderRadius: theme.radius.photoPin,
                  backgroundColor: toneColors[tone].accent,
                }}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View
          accessibilityLabel="No cafe photos yet"
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: theme.radius.photoPin,
              borderWidth: 3,
              borderColor: theme.colors.background.cream50,
              backgroundColor: theme.colors.brand.latteBeige,
            }}
          />
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.back()}
        style={({ pressed }) => ({
          position: "absolute",
          top: Math.max(insets.top + theme.spacing.xs, 58),
          left: theme.spacing.screen,
          width: 40,
          height: 40,
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
            width: 14,
            height: 14,
            tintColor: theme.colors.text.espresso900,
          }}
        />
      </Pressable>

      <View
        style={{
          position: "absolute",
          top: Math.max(insets.top + theme.spacing.xs, 58),
          right: theme.spacing.screen,
          flexDirection: "row",
          gap: theme.spacing.xs,
        }}
      >
        <HeroGlassButton
          symbol="sf:arrow.up.right"
          label="Share cafe"
          onPress={onOpenShare}
        />
        <HeroGlassButton
          symbol={saved ? "sf:heart.fill" : "sf:heart"}
          label={saved ? "Saved cafe" : "Save cafe"}
          tint={theme.colors.brand.terracotta}
          onPress={onToggleSave}
        />
      </View>

      {hasPhotos ? (
        <>
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: theme.spacing.md,
              flexDirection: "row",
              justifyContent: "center",
              gap: theme.spacing.xxs + 2,
            }}
          >
            {tones.map((tone, index) => (
              <View
                key={`dot-${tone}-${index}`}
                style={{
                  width: index === slide ? 16 : 5,
                  height: 5,
                  borderRadius: theme.radius.chip,
                  backgroundColor: theme.colors.background.cream50,
                  opacity: index === slide ? 1 : 0.55,
                }}
              />
            ))}
          </View>
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              right: theme.spacing.md,
              bottom: theme.spacing.sm,
              paddingHorizontal: theme.spacing.xs + 2,
              paddingVertical: theme.spacing.xxs,
              borderRadius: theme.radius.chip,
              backgroundColor: theme.colors.surface.overlayDark,
            }}
          >
            <Text
              style={{
                ...theme.typography.caption,
                fontSize: 10,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.background.cream50,
              }}
            >
              {slide + 1} / {photoTotal}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

type HeroGlassButtonProps = {
  symbol: `sf:${string}`;
  label: string;
  tint?: string;
  onPress?: () => void;
};

function HeroGlassButton({ symbol, label, tint, onPress }: HeroGlassButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.photoPin,
        backgroundColor: theme.colors.surface.cardCream,
        opacity: pressed ? 0.72 : 1,
      })}
    >
      <Image
        source={symbol}
        style={{
          width: 15,
          height: 15,
          tintColor: tint ?? theme.colors.text.espresso900,
        }}
      />
    </Pressable>
  );
}

type DetailEyebrowProps = {
  children: ReactNode;
};

function DetailEyebrow({ children }: DetailEyebrowProps) {
  return (
    <Text
      style={{
        ...theme.typography.caption,
        fontFamily: theme.fonts.family.sansBold,
        color: theme.colors.text.muted,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginTop: theme.spacing.lg,
      }}
    >
      {children}
    </Text>
  );
}

type EditorialChipColumnProps = {
  title: string;
  items: string[];
  tone: "positive" | "caution";
};

function EditorialChipColumn({ title, items, tone }: EditorialChipColumnProps) {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          ...theme.typography.caption,
          fontFamily: theme.fonts.family.sansBold,
          color: theme.colors.text.muted,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {title}
      </Text>
      <View style={{ gap: theme.spacing.xs - 2, marginTop: theme.spacing.xs + 2 }}>
        {items.map((item) => (
          <View
            key={item}
            style={{
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.spacing.sm,
              borderCurve: "continuous",
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
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

type BestTimeChartProps = {
  bestTimes: CafeBestTime[];
};

function BestTimeChart({ bestTimes }: BestTimeChartProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: theme.spacing.xxs + 2,
        height: 64,
        marginTop: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xxs,
      }}
    >
      {bestTimes.map((time) => (
        <View
          key={time.label}
          style={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: theme.spacing.xxs + 1,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 18,
              height: time.height,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              backgroundColor: time.highlight
                ? theme.colors.brand.terracotta
                : theme.colors.surface.roastedSoft,
            }}
          />
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 9,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.muted,
            }}
          >
            {time.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

type SimilarCafesRowProps = {
  similar: CafeSimilar[];
};

function SimilarCafesRow({ similar }: SimilarCafesRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: theme.spacing.sm }}
      contentContainerStyle={{ gap: theme.spacing.xs + 2 }}
    >
      {similar.map((cafe) => (
        <Pressable
          key={cafe.id}
          accessibilityRole="button"
          accessibilityLabel={`Open ${cafe.name} details`}
          onPress={() => router.push(`/cafe/${cafe.id}`)}
          style={({ pressed }) => ({
            width: 128,
            opacity: pressed ? 0.78 : 1,
          })}
        >
          <View
            style={{
              height: 96,
              overflow: "hidden",
              borderRadius: theme.spacing.md,
              borderCurve: "continuous",
              backgroundColor: toneColors[cafe.tone].base,
            }}
          >
            <View
              style={{
                position: "absolute",
                right: -18,
                bottom: -24,
                width: 88,
                height: 88,
                borderRadius: theme.radius.photoPin,
                backgroundColor: toneColors[cafe.tone].accent,
              }}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.caption,
              fontFamily: theme.fonts.family.sansSemibold,
              marginTop: theme.spacing.xs - 1,
              color: theme.colors.text.espresso900,
            }}
          >
            {cafe.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.caption,
              fontSize: 10,
              marginTop: 2,
              color: theme.colors.text.muted,
            }}
          >
            {cafe.meta}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

type TextActionProps = {
  label: string;
  onPress?: () => void;
};

function TextAction({ label, onPress }: TextActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: theme.sizing.minimumTouchTarget,
        justifyContent: "center",
        opacity: pressed ? 0.72 : 1,
      })}
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

function TextActionDivider() {
  return (
    <Text
      style={{
        ...theme.typography.caption,
        color: theme.colors.surface.borderStrong,
      }}
    >
      ·
    </Text>
  );
}

type DetailStateScreenProps = {
  phase: "loading" | "error";
  onRetry: () => void;
};

function DetailStateScreen({ phase, onRetry }: DetailStateScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      {phase === "loading" ? (
        <>
          <View
            style={{
              height: HERO_HEIGHT,
              backgroundColor: theme.colors.surface.skeletonBase,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.xs,
              paddingHorizontal: theme.spacing.screen,
              marginTop: theme.spacing.md,
            }}
          >
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  height: 58,
                  borderRadius: theme.spacing.md,
                  backgroundColor:
                    index % 2 === 0
                      ? theme.colors.surface.skeletonBase
                      : theme.colors.surface.skeletonHighlight,
                }}
              />
            ))}
          </View>
          <View
            style={{
              paddingHorizontal: theme.spacing.screen,
              marginTop: theme.spacing.md,
            }}
          >
            <LoadingSkeleton title="Cafe detail" hint="Warming up…" />
          </View>
        </>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: theme.spacing.xl,
          }}
        >
          <View
            style={{
              width: 46,
              height: 46,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.surface.cautionSoft,
            }}
          >
            <Text
              style={{
                ...theme.typography.sectionTitle,
                fontFamily: theme.fonts.family.sansBold,
                color: theme.colors.score.crowded,
              }}
            >
              !
            </Text>
          </View>
          <Text
            style={{
              ...theme.typography.sectionTitle,
              fontFamily: theme.fonts.family.serifMedium,
              marginTop: theme.spacing.md,
              color: theme.colors.text.espresso900,
              textAlign: "center",
            }}
          >
            {cafeDetailErrorTitle}
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              marginTop: theme.spacing.xs,
              color: theme.colors.text.muted,
              textAlign: "center",
            }}
          >
            {cafeDetailErrorCopy}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onRetry}
            style={({ pressed }) => ({
              minHeight: theme.sizing.minimumTouchTarget,
              justifyContent: "center",
              marginTop: theme.spacing.md,
              paddingHorizontal: theme.spacing.screen,
              borderRadius: theme.radius.button - 4,
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
                ...theme.typography.caption,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.text.espresso900,
              }}
            >
              Try Again
            </Text>
          </Pressable>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.back()}
        style={({ pressed }) => ({
          position: "absolute",
          top: Math.max(insets.top + theme.spacing.xs, 58),
          left: theme.spacing.screen,
          width: 40,
          height: 40,
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
            width: 14,
            height: 14,
            tintColor: theme.colors.text.espresso900,
          }}
        />
      </Pressable>
    </View>
  );
}
