import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { MapPreviewSurface, PhotoMapPin, VibeChip } from "@/components/ui";
import { theme } from "@/constants/theme";
import {
  findSearchResults,
  recentSearches,
  suggestedSearches,
} from "@/data/search-fixtures";
import type { SearchResult } from "@/data/search-fixtures";

const defaultQuery = "quiet cafe with parking";

export function SearchScreenContent() {
  const [query, setQuery] = useState(defaultQuery);
  const trimmedQuery = query.trim();
  const results = findSearchResults(trimmedQuery);
  const hasResults = results.length > 0;

  const selectQuery = (nextQuery: string) => {
    setQuery(nextQuery);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        minHeight: 844,
        paddingHorizontal: theme.spacing.screen,
        paddingTop: 62,
        paddingBottom: 120,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
        <View
          style={{
            flex: 1,
            minHeight: 50,
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
            borderRadius: theme.radius.chip,
            borderWidth: 1.5,
            borderColor: theme.colors.surface.borderStrong,
            backgroundColor: theme.colors.surface.cardCream,
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <Image
            source="sf:magnifyingglass"
            style={{
              width: 15,
              height: 15,
              tintColor: theme.colors.text.espresso900,
            }}
          />
          <TextInput
            accessibilityLabel="Search"
            value={query}
            onChangeText={setQuery}
            placeholder="Search cafes, vibes, or neighborhoods"
            placeholderTextColor={theme.colors.text.muted}
            autoCapitalize="sentences"
            returnKeyType="search"
            style={{
              fontFamily: theme.typography.bodySmall.fontFamily,
              fontSize: theme.typography.bodySmall.fontSize,
              flex: 1,
              height: 50,
              color: theme.colors.text.espresso900,
              includeFontPadding: false,
              paddingHorizontal: 0,
              paddingVertical: 0,
              textAlignVertical: "center",
            }}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            minHeight: 44,
            justifyContent: "center",
            opacity: pressed ? 0.72 : 1,
          })}
        >
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.muted,
            }}
          >
            Cancel
          </Text>
        </Pressable>
      </View>

      <SearchChipSection
        title="Suggested"
        values={suggestedSearches}
        selectedValue={trimmedQuery}
        onSelect={selectQuery}
      />
      <SearchChipSection
        title="Recent"
        values={recentSearches}
        selectedValue={trimmedQuery}
        onSelect={selectQuery}
      />

      <MiniMapPreview results={results} />

      <View style={{ marginTop: theme.spacing.lg }}>
        <Text
          style={{
            ...theme.typography.caption,
            fontFamily: theme.fonts.family.sansBold,
            color: theme.colors.brand.terracotta,
            textTransform: "uppercase",
          }}
        >
          Results
        </Text>
        {hasResults ? (
          <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
            {results.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </View>
        ) : (
          <SearchEmptyState onReset={() => setQuery(defaultQuery)} />
        )}
      </View>
    </ScrollView>
  );
}

function SearchChipSection({
  title,
  values,
  selectedValue,
  onSelect,
}: {
  title: string;
  values: readonly string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={{ marginTop: theme.spacing.md }}>
      <Text
        style={{
          ...theme.typography.caption,
          marginBottom: theme.spacing.xs,
          color: theme.colors.text.muted,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.xs }}>
        {values.map((value) => (
          <VibeChip
            key={`${title}-${value}`}
            label={value}
            selected={selectedValue.toLowerCase() === value.toLowerCase()}
            onPress={() => onSelect(value)}
          />
        ))}
      </View>
    </View>
  );
}

function MiniMapPreview({ results }: { results: SearchResult[] }) {
  const visibleResults = results.slice(0, 3);

  return (
    <View
      style={{
        height: 132,
        overflow: "hidden",
        marginTop: theme.spacing.lg,
        borderRadius: theme.spacing.screen,
        borderCurve: "continuous",
        backgroundColor: theme.colors.background.warmPaper,
      }}
    >
      <MapPreviewSurface>
        {visibleResults.map((result) => (
          <View
            key={`map-${result.id}`}
            style={{
              position: "absolute",
              top: result.mapPosition.top,
              left: result.mapPosition.left,
              right: result.mapPosition.right,
              bottom: result.mapPosition.bottom,
              transform: [{ scale: 0.74 }],
            }}
          >
            <PhotoMapPin
              label={`${result.name} map result`}
              score={result.score}
              selected={result.id === visibleResults[0]?.id}
              tone={result.tone}
            />
          </View>
        ))}
        <View
          style={{
            position: "absolute",
            right: theme.spacing.sm,
            bottom: theme.spacing.sm,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: 5,
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          <Text
            style={{
              ...theme.typography.caption,
              fontFamily: theme.fonts.family.sansBold,
              color: theme.colors.text.espresso700,
            }}
          >
            {results.length} {results.length === 1 ? "match" : "matches"} nearby
          </Text>
        </View>
      </MapPreviewSurface>
    </View>
  );
}

function SearchResultCard({ result }: { result: SearchResult }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${result.name} on map`}
      onPress={() => router.back()}
      style={({ pressed }) => ({
        flexDirection: "row",
        gap: theme.spacing.sm,
        borderRadius: 22,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.surface.cardCream,
        padding: theme.spacing.sm,
        boxShadow: theme.shadows.searchCard,
        opacity: pressed ? 0.82 : 1,
      })}
    >
      <ResultPhoto tone={result.tone} />
      <View style={{ flex: 1, minWidth: 0, gap: theme.spacing.xs }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.xs }}>
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.bodySmall,
              flex: 1,
              fontFamily: theme.fonts.family.serifSemibold,
              fontSize: 17,
              color: theme.colors.text.espresso900,
            }}
          >
            {result.name}
          </Text>
          <ScorePill score={result.score} />
        </View>
        <Text
          numberOfLines={1}
          style={{
            ...theme.typography.caption,
            color: theme.colors.text.muted,
          }}
        >
          {result.meta}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
          {result.tags.map((tag) => (
            <View
              key={`${result.id}-${tag}`}
              style={{
                paddingHorizontal: theme.spacing.xs,
                paddingVertical: 4,
                borderRadius: theme.radius.chip,
                backgroundColor: theme.colors.background.warmPaper,
              }}
            >
              <Text
                style={{
                  ...theme.typography.caption,
                  fontSize: 10,
                  color: theme.colors.text.espresso700,
                }}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 7 }}>
          <Image
            source="sf:sparkles"
            style={{
              width: 11,
              height: 11,
              marginTop: 2,
              tintColor: theme.colors.brand.terracotta,
            }}
          />
          <Text
            style={{
              ...theme.typography.caption,
              flex: 1,
              fontStyle: "italic",
              color: theme.colors.text.muted,
            }}
          >
            {result.reason}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function ResultPhoto({ tone }: { tone: SearchResult["tone"] }) {
  const base =
    tone === "olive"
      ? theme.colors.brand.oliveMatcha
      : tone === "latte"
        ? theme.colors.brand.latteBeige
        : theme.colors.brand.terracotta;
  const accent =
    tone === "olive"
      ? theme.colors.text.espresso700
      : theme.colors.brand.roastedBrown;

  return (
    <View
      style={{
        width: 96,
        minHeight: 138,
        overflow: "hidden",
        borderRadius: theme.spacing.md,
        backgroundColor: base,
      }}
    >
      <View
        style={{
          position: "absolute",
          right: -16,
          bottom: -10,
          width: 72,
          height: 72,
          borderRadius: theme.radius.photoPin,
          backgroundColor: accent,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: theme.spacing.md,
          left: theme.spacing.md,
          width: 28,
          height: 28,
          borderRadius: theme.radius.photoPin,
          backgroundColor: theme.colors.surface.glassCream,
        }}
      />
    </View>
  );
}

function ScorePill({ score }: { score: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xxs,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: 5,
        borderRadius: theme.spacing.sm,
        backgroundColor: theme.colors.surface.matchScore,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: theme.radius.photoPin,
          backgroundColor: theme.colors.score.great,
        }}
      />
      <Text
        style={{
          ...theme.typography.caption,
          fontFamily: theme.fonts.family.sansBold,
          color: theme.colors.text.espresso900,
        }}
      >
        {score}
      </Text>
    </View>
  );
}

function SearchEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <View
      style={{
        alignItems: "center",
        gap: theme.spacing.sm,
        marginTop: theme.spacing.sm,
        borderRadius: theme.radius.card,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.surface.cardCream,
        padding: theme.spacing.lg,
      }}
    >
      <Text
        style={{
          ...theme.typography.sectionTitle,
          color: theme.colors.text.espresso900,
          textAlign: "center",
        }}
      >
        No match for that vibe.
      </Text>
      <Text
        style={{
          ...theme.typography.bodySmall,
          color: theme.colors.text.muted,
          textAlign: "center",
        }}
      >
        Try a broader mood, neighborhood, or practical need like parking.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onReset}
        style={({ pressed }) => ({
          minHeight: 46,
          justifyContent: "center",
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.radius.button,
          backgroundColor: pressed
            ? theme.colors.text.espresso700
            : theme.colors.text.espresso900,
        })}
      >
        <Text
          style={{
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.family.sansSemibold,
            color: theme.colors.background.cream50,
          }}
        >
          Reset Filters
        </Text>
      </Pressable>
    </View>
  );
}
