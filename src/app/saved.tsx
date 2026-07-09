import { useRouter, useLocalSearchParams } from "expo-router";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyStateCard, ShareCafeSheet } from "@/components/ui";
import { theme } from "@/constants/theme";
import type { CafeMapPinTone } from "@/data/map-pins";
import {
  SAVED_EMPTY_COPY,
  SAVED_EMPTY_CTA,
  SAVED_EMPTY_TITLE,
  SAVED_MAP_PIN_SPOTS,
  SAVED_TAB_EMPTY_COPY,
  SAVED_VIEW_MODES,
  VISITED_EMPTY_COPY,
  VISITED_TAB_ID,
  demoSavedState,
  libraryEntries,
  libraryTabs,
  totalSavedCount,
} from "@/data/saved-library";
import type { LibraryEntry, SavedViewMode } from "@/data/saved-library";
import { getShareCardContent } from "@/data/share-card";
import type { ShareCardContent } from "@/data/share-card";
import {
  getSavedState,
  removeCafeSave,
  subscribeSaved,
} from "@/utils/saved-store";

const cardSwatch: Record<CafeMapPinTone, string> = {
  terracotta: theme.colors.brand.terracotta,
  latte: theme.colors.brand.latteBeige,
  olive: theme.colors.brand.oliveMatcha,
};

function parseViewMode(value: string | undefined): SavedViewMode {
  const match = SAVED_VIEW_MODES.find(
    (mode) => mode.toLowerCase() === value?.toLowerCase(),
  );

  return match ?? "Grid";
}

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // QA overrides for deterministic simulator smoke: ?state=demo renders a
  // populated in-memory library without touching the persisted store;
  // ?view= and ?tab= preselect the surface.
  const params = useLocalSearchParams<{
    state?: string;
    view?: string;
    tab?: string;
  }>();
  const storeState = useSyncExternalStore(subscribeSaved, getSavedState);
  const state = useMemo(
    () => (params.state === "demo" ? demoSavedState(storeState) : storeState),
    [params.state, storeState],
  );

  const tabs = libraryTabs(state);
  const [viewMode, setViewMode] = useState<SavedViewMode>(() =>
    parseViewMode(params.view),
  );
  const [activeTab, setActiveTab] = useState<string>(() =>
    tabs.some((tab) => tab.id === params.tab) ? (params.tab as string) : tabs[0].id,
  );
  const [shareContent, setShareContent] = useState<ShareCardContent | null>(
    null,
  );

  const entries = libraryEntries(state, activeTab);
  const savedCount = totalSavedCount(state);
  const usesDemoState = params.state === "demo";

  const removeEntry = (cafeId: string) => {
    // The demo overlay is read-only; never mutate the real store from it.
    if (!usesDemoState) {
      removeCafeSave(cafeId);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: theme.spacing.screen,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.md,
        }}
      >
        <Text
          style={{
            fontFamily: theme.fonts.family.serifSemibold,
            fontSize: 28,
            lineHeight: 34,
            color: theme.colors.text.espresso900,
          }}
        >
          Saved
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.xxs,
            padding: 3,
            borderRadius: theme.radius.button - 6,
            backgroundColor: theme.colors.surface.pressed,
          }}
        >
          {SAVED_VIEW_MODES.map((mode) => {
            const selected = viewMode === mode;

            return (
              <Pressable
                key={mode}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${mode} view`}
                onPress={() => setViewMode(mode)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: theme.spacing.sm,
                  borderRadius: theme.radius.button - 8,
                  backgroundColor: selected
                    ? theme.colors.background.cream50
                    : "transparent",
                  boxShadow: selected ? theme.shadows.searchCard : undefined,
                }}
              >
                <Text
                  style={{
                    ...theme.typography.caption,
                    fontSize: 11,
                    fontFamily: theme.fonts.family.sansSemibold,
                    color: selected
                      ? theme.colors.text.espresso900
                      : theme.colors.text.muted,
                  }}
                >
                  {mode}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{
          gap: theme.spacing.xs,
          paddingHorizontal: theme.spacing.screen,
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
        }}
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setActiveTab(tab.id)}
              style={{
                paddingVertical: theme.spacing.xs,
                paddingHorizontal: theme.spacing.md - 2,
                borderRadius: theme.radius.chip,
                borderWidth: 1,
                borderColor: selected
                  ? theme.colors.text.espresso900
                  : theme.colors.surface.borderMedium,
                backgroundColor: selected
                  ? theme.colors.text.espresso900
                  : theme.colors.surface.cardCream,
              }}
            >
              <Text
                style={{
                  ...theme.typography.chipLabel,
                  fontSize: 12,
                  color: selected
                    ? theme.colors.background.cream50
                    : theme.colors.text.espresso700,
                }}
              >
                {tab.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: theme.spacing.xxs,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.xxl,
        }}
      >
        {savedCount === 0 ? (
          <View style={{ marginTop: theme.spacing.xl }}>
            <EmptyStateCard
              title={SAVED_EMPTY_TITLE}
              copy={SAVED_EMPTY_COPY}
              cta={SAVED_EMPTY_CTA}
              tone="saved"
              onCtaPress={() => router.push("/")}
            />
          </View>
        ) : viewMode === "Map" ? (
          <SavedMapView count={entries.length} entries={entries} />
        ) : entries.length === 0 ? (
          <Text
            style={{
              ...theme.typography.bodySmall,
              marginTop: theme.spacing.lg,
              textAlign: "center",
              color: theme.colors.text.muted,
            }}
          >
            {activeTab === VISITED_TAB_ID
              ? VISITED_EMPTY_COPY
              : SAVED_TAB_EMPTY_COPY}
          </Text>
        ) : viewMode === "Grid" ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              rowGap: theme.spacing.md,
            }}
          >
            {entries.map((entry) => (
              <GridCard
                key={entry.cafeId}
                entry={entry}
                onOpen={() => router.push(`/cafe/${entry.cafeId}`)}
                onOpenCollection={() =>
                  router.push(`/collection/${entry.collectionId}`)
                }
                onRemove={() => removeEntry(entry.cafeId)}
                onShare={() =>
                  setShareContent(getShareCardContent(entry.cafeId) ?? null)
                }
              />
            ))}
          </View>
        ) : (
          <View>
            {entries.map((entry) => (
              <ListRow
                key={entry.cafeId}
                entry={entry}
                onOpen={() => router.push(`/cafe/${entry.cafeId}`)}
                onRemove={() => removeEntry(entry.cafeId)}
                onShare={() =>
                  setShareContent(getShareCardContent(entry.cafeId) ?? null)
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      {shareContent ? (
        <ShareCafeSheet
          content={shareContent}
          // Copy/image/send handlers stay presentational until the share
          // provider lands (decision 0015) — same wiring as cafe detail.
          onAction={() => {}}
          onClose={() => setShareContent(null)}
        />
      ) : null}
    </View>
  );
}

type SavedMapViewProps = {
  count: number;
  entries: LibraryEntry[];
};

function SavedMapView({ count, entries }: SavedMapViewProps) {
  return (
    <View
      accessibilityLabel={`Saved map with ${count} cafés`}
      style={{
        height: 420,
        borderRadius: theme.radius.card,
        borderCurve: "continuous",
        overflow: "hidden",
        backgroundColor: theme.colors.background.warmPaper,
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((row) => (
        <View
          key={`h-${row}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 60 * (row + 1),
            height: 1,
            backgroundColor: theme.colors.surface.borderSoft,
          }}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((col) => (
        <View
          key={`v-${col}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 56 * (col + 1),
            width: 1,
            backgroundColor: theme.colors.surface.borderSoft,
          }}
        />
      ))}
      {entries.map((entry, index) => {
        const spot = SAVED_MAP_PIN_SPOTS[index % SAVED_MAP_PIN_SPOTS.length];

        return (
          <View
            key={entry.cafeId}
            style={{
              position: "absolute",
              top: spot.top,
              left: spot.left,
              width: 48,
              height: 48,
              borderRadius: theme.radius.photoPin,
              borderWidth: 3,
              borderColor: theme.colors.background.cream50,
              backgroundColor: cardSwatch[entry.tone],
              boxShadow: theme.shadows.pin,
            }}
          />
        );
      })}
      <View
        style={{
          position: "absolute",
          left: theme.spacing.md - 2,
          bottom: theme.spacing.md - 2,
          paddingVertical: 6,
          paddingHorizontal: theme.spacing.sm,
          borderRadius: theme.radius.chip,
          backgroundColor: theme.colors.surface.glassCream,
        }}
      >
        <Text
          style={{
            ...theme.typography.caption,
            fontSize: 11,
            fontFamily: theme.fonts.family.sansSemibold,
            color: theme.colors.text.espresso700,
          }}
        >
          {count} saved nearby
        </Text>
      </View>
    </View>
  );
}

type EntryActionsProps = {
  entry: LibraryEntry;
  onRemove: () => void;
  onShare: () => void;
};

// The D2 quick actions: Directions stays inert until the map provider lands
// (decision 0010); Remove and Share are live.
function EntryActions({ entry, onRemove, onShare }: EntryActionsProps) {
  const actions = [
    { label: "Directions", onPress: undefined },
    { label: "Remove", onPress: onRemove },
    { label: "Share", onPress: onShare },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        gap: theme.spacing.sm,
        marginTop: theme.spacing.xs - 2,
      }}
    >
      {actions.map((action) => (
        <Pressable
          key={action.label}
          accessibilityRole="button"
          accessibilityLabel={`${action.label} ${entry.name}`}
          onPress={action.onPress}
          hitSlop={6}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 11,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.brand.roastedBrown,
            }}
          >
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

type EntryCardProps = {
  entry: LibraryEntry;
  onOpen: () => void;
  onRemove: () => void;
  onShare: () => void;
};

type GridCardProps = EntryCardProps & {
  onOpenCollection: () => void;
};

function GridCard({
  entry,
  onOpen,
  onOpenCollection,
  onRemove,
  onShare,
}: GridCardProps) {
  return (
    <View style={{ width: "48%" }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${entry.name}`}
        onPress={onOpen}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <View
          style={{
            height: 130,
            borderRadius: theme.radius.button + 2,
            borderCurve: "continuous",
            overflow: "hidden",
            backgroundColor: cardSwatch[entry.tone],
          }}
        >
          <View
            style={{
              position: "absolute",
              top: theme.spacing.xs + 1,
              right: theme.spacing.xs + 1,
              width: 26,
              height: 26,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.surface.glassCream,
            }}
          >
            <Text style={{ fontSize: 12, color: theme.colors.brand.terracotta }}>
              ♥
            </Text>
          </View>
          {/* The collection pill doubles as the entry into collection detail. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open collection ${entry.collectionLabel}`}
            onPress={onOpenCollection}
            style={({ pressed }) => ({
              position: "absolute",
              left: theme.spacing.xs + 1,
              bottom: theme.spacing.xs + 1,
              paddingVertical: theme.spacing.xxs,
              paddingHorizontal: theme.spacing.xs + 2,
              borderRadius: theme.radius.chip,
              backgroundColor: theme.colors.surface.overlayDark,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                ...theme.typography.caption,
                fontSize: 9,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.background.cream50,
              }}
            >
              {entry.collectionLabel}
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: theme.spacing.xs,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.chipLabel,
              flex: 1,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            {entry.name}
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 11,
              fontFamily: theme.fonts.family.sansBold,
              color: theme.colors.score.great,
            }}
          >
            {entry.score}
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
          {entry.meta}
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
          {entry.tags.join(" · ")}
        </Text>
      </Pressable>
      <EntryActions entry={entry} onRemove={onRemove} onShare={onShare} />
    </View>
  );
}

function ListRow({ entry, onOpen, onRemove, onShare }: EntryCardProps) {
  return (
    <View
      style={{
        paddingVertical: theme.spacing.sm - 1,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surface.borderSoft,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${entry.name}`}
        onPress={onOpen}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: theme.radius.button - 4,
            borderCurve: "continuous",
            backgroundColor: cardSwatch[entry.tone],
          }}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            {entry.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.caption,
              fontSize: 11,
              marginTop: 2,
              color: theme.colors.text.muted,
            }}
          >
            {entry.meta} · {entry.collectionLabel}
          </Text>
        </View>
        <Text
          style={{
            ...theme.typography.caption,
            fontFamily: theme.fonts.family.sansBold,
            color: theme.colors.score.great,
          }}
        >
          {entry.score}
        </Text>
      </Pressable>
      <View style={{ marginLeft: 52 + theme.spacing.sm }}>
        <EntryActions entry={entry} onRemove={onRemove} onShare={onShare} />
      </View>
    </View>
  );
}
