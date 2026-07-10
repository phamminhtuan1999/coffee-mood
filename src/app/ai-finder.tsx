import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import {
  CafeButton,
  EmptyStateCard,
  IconButton,
  LoadingSkeleton,
} from "@/components/ui";
import {
  AI_THINKING_MS,
  aiChips,
  aiConfidenceLine,
  aiUnavailableTitle,
  runAiFinder,
} from "@/data/ai-finder-fixtures";
import type { AiAlternative, AiCafe, AiTone } from "@/data/ai-finder-fixtures";
import { theme } from "@/constants/theme";
import { runLiveAiFinder } from "@/utils/ai-finder-client";
import { loadTasteProfile } from "@/utils/taste-profile";

type FinderPhase =
  | { name: "idle" }
  | { name: "thinking" }
  | { name: "result"; match: AiCafe }
  | { name: "unavailable" };

const toneColors: Record<AiTone, { base: string; accent: string }> = {
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

const whyDotColors = [
  theme.colors.brand.terracotta,
  theme.colors.score.great,
  theme.colors.brand.latteBeige,
];

export default function AiFinderScreen() {
  const params = useLocalSearchParams<{ prompt?: string }>();
  const initialPrompt =
    typeof params.prompt === "string" ? params.prompt.trim() : "";
  const [prompt, setPrompt] = useState(initialPrompt);
  const [phase, setPhase] = useState<FinderPhase>(
    initialPrompt ? { name: "thinking" } : { name: "idle" },
  );
  const [saved, setSaved] = useState(false);
  const thinkingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootstrapped = useRef(false);

  useEffect(() => {
    return () => {
      if (thinkingTimer.current) {
        clearTimeout(thinkingTimer.current);
      }
    };
  }, []);

  const resolveFinder = useCallback((text: string) => {
    if (thinkingTimer.current) {
      clearTimeout(thinkingTimer.current);
    }

    const applyResult = (result: ReturnType<typeof runAiFinder>) => {
      setPhase(
        result.status === "match"
          ? { name: "result", match: result.match }
          : { name: "unavailable" },
      );
    };

    // Live Gemini call when Supabase env is configured (US-029, decision
    // 0021); null means unconfigured, which keeps the deterministic demo
    // matcher below. Live failures resolve to the unavailable state inside
    // the client, honoring 0013's failure contract.
    void runLiveAiFinder(text, loadTasteProfile()).then((liveResult) => {
      if (liveResult) {
        applyResult(liveResult);
        return;
      }

      thinkingTimer.current = setTimeout(() => {
        applyResult(runAiFinder(text, loadTasteProfile()));
      }, AI_THINKING_MS);
    });
  }, []);

  const submitPrompt = useCallback(
    (text: string) => {
      setSaved(false);
      setPhase({ name: "thinking" });
      resolveFinder(text);
    },
    [resolveFinder],
  );

  useEffect(() => {
    if (bootstrapped.current) {
      return;
    }
    bootstrapped.current = true;

    if (initialPrompt) {
      resolveFinder(initialPrompt);
    }
  }, [initialPrompt, resolveFinder]);

  const fillChip = (chip: string) => {
    setPrompt(chip);
    submitPrompt(chip);
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
        paddingBottom: theme.spacing.xxl,
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
          ...theme.typography.title,
          fontSize: 26,
          lineHeight: 32,
          marginTop: theme.spacing.screen,
          color: theme.colors.text.espresso900,
        }}
      >
        What kind of cafe are you looking for?
      </Text>

      <View
        style={{
          marginTop: theme.spacing.screen,
          padding: theme.spacing.md,
          borderRadius: theme.radius.card,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: theme.colors.surface.borderMedium,
          backgroundColor: theme.colors.surface.cardCream,
          boxShadow: theme.shadows.searchCard,
        }}
      >
        <TextInput
          multiline
          accessibilityLabel="Describe your cafe"
          placeholder="Example: I need a quiet cafe to work for 3 hours with parking and good latte."
          placeholderTextColor={theme.colors.text.muted}
          textAlignVertical="top"
          value={prompt}
          onChangeText={setPrompt}
          style={{
            ...theme.typography.bodySmall,
            minHeight: 84,
            color: theme.colors.text.espresso900,
            padding: 0,
          }}
        />
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Find my cafe"
            onPress={() => submitPrompt(prompt)}
            style={({ pressed }) => ({
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.text.espresso900,
              opacity: pressed ? 0.82 : 1,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            })}
          >
            <Image
              source="sf:arrow.up"
              style={{
                width: 15,
                height: 15,
                tintColor: theme.colors.background.cream50,
              }}
            />
          </Pressable>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: theme.spacing.xs,
          marginTop: theme.spacing.sm,
        }}
      >
        {aiChips.map((chip) => (
          <Pressable
            key={chip}
            accessibilityRole="button"
            onPress={() => fillChip(chip)}
            style={({ pressed }) => ({
              paddingHorizontal: theme.spacing.md,
              paddingVertical: 9,
              borderRadius: theme.radius.chip,
              backgroundColor: theme.colors.surface.latteSoft,
              opacity: pressed ? 0.78 : 1,
            })}
          >
            <Text
              style={{
                ...theme.typography.caption,
                color: theme.colors.text.espresso700,
              }}
            >
              {chip}
            </Text>
          </Pressable>
        ))}
      </View>

      {phase.name === "thinking" ? (
        <View style={{ marginTop: theme.spacing.lg }}>
          <LoadingSkeleton
            title="CafeMood AI is thinking"
            hint="Reading reviews, photos, and hours…"
          />
        </View>
      ) : null}

      {phase.name === "unavailable" ? (
        <View style={{ marginTop: theme.spacing.lg }}>
          <EmptyStateCard
            title={aiUnavailableTitle}
            copy="The map and your saved cafes still work while the beans warm back up."
            cta="Browse Map"
            onCtaPress={() => router.back()}
          />
        </View>
      ) : null}

      {phase.name === "result" ? (
        <AiResultCard
          match={phase.match}
          saved={saved}
          onToggleSave={() => setSaved((current) => !current)}
          onViewOnMap={() => router.back()}
          onRefine={() => setPhase({ name: "idle" })}
        />
      ) : null}
    </ScrollView>
  );
}

type AiResultCardProps = {
  match: AiCafe;
  saved: boolean;
  onToggleSave: () => void;
  onViewOnMap: () => void;
  onRefine: () => void;
};

function AiResultCard({
  match,
  saved,
  onToggleSave,
  onViewOnMap,
  onRefine,
}: AiResultCardProps) {
  const colors = toneColors[match.tone];

  return (
    <View
      style={{
        marginTop: theme.spacing.lg,
        padding: theme.spacing.screen,
        borderRadius: theme.radius.imageCard,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderMedium,
        backgroundColor: theme.colors.surface.glassCream,
        boxShadow: theme.shadows.card,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.xs,
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            backgroundColor: theme.colors.brand.latteBeige,
          }}
        >
          <Text
            style={{
              ...theme.typography.caption,
              color: theme.colors.text.espresso900,
            }}
          >
            ✦
          </Text>
        </View>
        <SectionEyebrow text="Best match" />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
          marginTop: theme.spacing.sm,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            overflow: "hidden",
            borderRadius: theme.radius.button,
            borderCurve: "continuous",
            backgroundColor: colors.base,
          }}
        >
          <View
            style={{
              position: "absolute",
              right: -10,
              bottom: -14,
              width: 52,
              height: 52,
              borderRadius: theme.radius.photoPin,
              backgroundColor: colors.accent,
            }}
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.sectionTitle,
              fontFamily: theme.fonts.family.serifSemibold,
              color: theme.colors.text.espresso900,
            }}
          >
            {match.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              ...theme.typography.caption,
              marginTop: 3,
              color: theme.colors.text.muted,
            }}
          >
            {match.meta}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: theme.spacing.md }}>
        <SectionEyebrow text="Why it matches" />
        {match.whyItMatches.map((line, index) => (
          <View
            key={line}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: theme.spacing.xs,
              marginTop: theme.spacing.xs,
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                marginTop: 6,
                borderRadius: theme.radius.photoPin,
                backgroundColor: whyDotColors[index % whyDotColors.length],
              }}
            />
            <Text
              style={{
                ...theme.typography.chipLabel,
                flex: 1,
                color: theme.colors.text.espresso700,
              }}
            >
              {line}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: theme.spacing.md }}>
        <SectionEyebrow text="Alternatives" />
        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.xs,
            marginTop: theme.spacing.xs,
          }}
        >
          {match.alternatives.map((alternative) => (
            <AlternativeCard key={alternative.name} alternative={alternative} />
          ))}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.xs,
          marginTop: theme.spacing.md,
        }}
      >
        <CafeButton label="View on Map" onPress={onViewOnMap} />
        <IconButton
          symbol={saved ? "sf:heart.fill" : "sf:heart"}
          label={saved ? "Saved cafe" : "Save cafe"}
          selected={saved}
          onPress={onToggleSave}
        />
        <CafeButton label="Directions" variant="secondary" />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Refine Search"
        onPress={onRefine}
        style={({ pressed }) => ({
          alignSelf: "flex-start",
          marginTop: theme.spacing.sm,
          paddingVertical: theme.spacing.xxs,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text
          style={{
            ...theme.typography.chipLabel,
            color: theme.colors.brand.roastedBrown,
            textDecorationLine: "underline",
          }}
        >
          Refine Search
        </Text>
      </Pressable>

      <Text
        style={{
          ...theme.typography.caption,
          marginTop: theme.spacing.sm,
          color: theme.colors.text.muted,
        }}
      >
        {aiConfidenceLine}
      </Text>
    </View>
  );
}

function SectionEyebrow({ text }: { text: string }) {
  return (
    <Text
      style={{
        ...theme.typography.caption,
        fontFamily: theme.fonts.family.sansBold,
        color: theme.colors.brand.terracotta,
        textTransform: "uppercase",
      }}
    >
      {text}
    </Text>
  );
}

function AlternativeCard({ alternative }: { alternative: AiAlternative }) {
  const colors = toneColors[alternative.tone];

  return (
    <View
      style={{
        flex: 1,
        padding: theme.spacing.xs + 2,
        borderRadius: theme.spacing.md,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.surface.cardCream,
      }}
    >
      <View
        style={{
          height: 44,
          overflow: "hidden",
          borderRadius: theme.spacing.sm,
          backgroundColor: colors.base,
        }}
      >
        <View
          style={{
            position: "absolute",
            right: -8,
            bottom: -12,
            width: 36,
            height: 36,
            borderRadius: theme.radius.photoPin,
            backgroundColor: colors.accent,
          }}
        />
      </View>
      <Text
        numberOfLines={1}
        style={{
          ...theme.typography.caption,
          fontSize: 11,
          fontFamily: theme.fonts.family.sansSemibold,
          marginTop: 7,
          color: theme.colors.text.espresso900,
        }}
      >
        {alternative.name}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          ...theme.typography.caption,
          fontSize: 10,
          fontFamily: theme.fonts.family.sansSemibold,
          marginTop: 2,
          color: theme.colors.brand.terracotta,
        }}
      >
        {alternative.betterFor}
      </Text>
    </View>
  );
}
