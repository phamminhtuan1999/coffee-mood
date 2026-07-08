import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AISummaryCard } from "@/components/ui";
import { theme } from "@/constants/theme";
import { cafeMapPins } from "@/data/map-pins";
import { getReviewInsight } from "@/data/review-insights";
import type { ReviewInsightItem } from "@/data/review-insights";

export default function ReviewInsightsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const cafeId = typeof params.id === "string" ? params.id : "";
  const pin = cafeMapPins.find((cafe) => cafe.id === cafeId);
  const insight = getReviewInsight(cafeId);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top + theme.spacing.xs, 62),
          paddingHorizontal: theme.spacing.screen,
          paddingBottom: Math.max(insets.bottom, theme.spacing.md) + theme.spacing.xxl,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to cafe"
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
            fontSize: 25,
            lineHeight: 31,
            marginTop: theme.spacing.screen,
            color: theme.colors.text.espresso900,
          }}
        >
          What people say
        </Text>
        <Text
          style={{
            ...theme.typography.caption,
            fontSize: 13,
            lineHeight: 18,
            marginTop: theme.spacing.xxs + 2,
            color: theme.colors.text.muted,
          }}
        >
          {insight
            ? `Summarized from ${insight.reviewCount} reviews · ${insight.updatedNote}`
            : pin
              ? `${pin.name} · no review summary yet`
              : "No review summary yet"}
        </Text>

        {insight ? (
          <>
            <InsightEyebrow>People love</InsightEyebrow>
            <InsightBarCard items={insight.love} color={theme.colors.score.great} />

            <InsightEyebrow>People complain about</InsightEyebrow>
            <InsightBarCard
              items={insight.complaints}
              color={theme.colors.score.crowded}
            />

            <View
              style={{
                flexDirection: "row",
                gap: theme.spacing.sm,
                marginTop: theme.spacing.lg,
              }}
            >
              <InsightChipColumn
                title="Best for"
                items={insight.bestFor}
                tone="positive"
              />
              <InsightChipColumn
                title="Not ideal for"
                items={insight.notIdealFor}
                tone="caution"
              />
            </View>

            <View style={{ marginTop: theme.spacing.lg }}>
              <AISummaryCard eyebrow="The short version">
                {insight.shortVersion}
              </AISummaryCard>
            </View>
          </>
        ) : (
          <View
            style={{
              alignItems: "center",
              marginTop: theme.spacing.xl,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.xl,
              borderRadius: theme.radius.card,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: theme.colors.surface.borderSoft,
              backgroundColor: theme.colors.surface.cardCream,
            }}
          >
            <Text
              style={{
                fontFamily: theme.fonts.family.serifSemibold,
                fontSize: 18,
                lineHeight: 24,
                textAlign: "center",
                color: theme.colors.text.espresso900,
              }}
            >
              We&apos;re still learning what people say about this spot.
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                marginTop: theme.spacing.xs,
                textAlign: "center",
                color: theme.colors.text.muted,
              }}
            >
              Check back soon — insights appear once reviews come in.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

type InsightEyebrowProps = {
  children: string;
};

function InsightEyebrow({ children }: InsightEyebrowProps) {
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

type InsightBarCardProps = {
  items: ReviewInsightItem[];
  color: string;
};

function InsightBarCard({ items, color }: InsightBarCardProps) {
  return (
    <View
      style={{
        marginTop: theme.spacing.xs + 2,
        paddingHorizontal: theme.spacing.screen,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.spacing.screen,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.surface.cardCream,
      }}
    >
      {items.map((item) => (
        <View
          key={item.label}
          style={{
            paddingVertical: theme.spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.surface.borderSoft,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Text
              style={{
                ...theme.typography.chipLabel,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.text.espresso900,
              }}
            >
              {item.label}
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                fontSize: 11,
                lineHeight: 14,
                fontFamily: theme.fonts.family.sansSemibold,
                color,
              }}
            >
              {item.pct}%
            </Text>
          </View>
          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={`${item.label}, ${item.pct} percent`}
            accessibilityValue={{ min: 0, max: 100, now: item.pct }}
            style={{
              height: 5,
              marginTop: theme.spacing.xs,
              borderRadius: theme.radius.chip,
              backgroundColor: theme.colors.surface.borderSoft,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${item.pct}%`,
                height: "100%",
                borderRadius: theme.radius.chip,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

type InsightChipColumnProps = {
  title: string;
  items: string[];
  tone: "positive" | "caution";
};

function InsightChipColumn({ title, items, tone }: InsightChipColumnProps) {
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
      <View style={{ gap: theme.spacing.xxs + 2, marginTop: theme.spacing.xs + 2 }}>
        {items.map((item) => (
          <View
            key={item}
            style={{
              paddingHorizontal: theme.spacing.sm + 1,
              paddingVertical: theme.spacing.xs + 1,
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
                color:
                  tone === "positive"
                    ? theme.colors.score.greatInk
                    : theme.colors.score.crowdedInk,
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
