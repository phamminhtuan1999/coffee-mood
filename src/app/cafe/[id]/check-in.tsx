import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { VibeChip } from "@/components/ui";
import { theme } from "@/constants/theme";
import {
  CHECK_IN_SUBTITLE,
  CHECK_IN_THANKS_BODY,
  CHECK_IN_THANKS_TITLE,
  VIBE_QUESTIONS,
  isReportComplete,
} from "@/data/contribute";
import type { VibeAnswers, VibeQuestionId } from "@/data/contribute";
import { cafeMapPins } from "@/data/map-pins";
import type { CafeMapPinTone } from "@/data/map-pins";

const headerSwatch: Record<CafeMapPinTone, string> = {
  terracotta: theme.colors.brand.terracotta,
  latte: theme.colors.brand.latteBeige,
  olive: theme.colors.brand.oliveMatcha,
};

// QA override ?state=done shows the submitted thanks state on load so the
// simulator smoke can capture it deterministically.
function initialSubmitted(state: string | undefined): boolean {
  return state === "done";
}

export default function CheckInScreen() {
  const params = useLocalSearchParams<{ id?: string; state?: string }>();
  const insets = useSafeAreaInsets();
  const pin = cafeMapPins.find((candidate) => candidate.id === params.id);
  const cafeName = pin?.name ?? "This café";
  const tone = pin?.tone ?? "latte";

  const [answers, setAnswers] = useState<VibeAnswers>({});
  const [submitted, setSubmitted] = useState(() =>
    initialSubmitted(params.state),
  );

  const complete = isReportComplete(answers);

  const selectAnswer = (questionId: VibeQuestionId, option: string) =>
    setAnswers((current) => ({ ...current, [questionId]: option }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.xl,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.xxl,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: theme.spacing.sm + 1,
              backgroundColor: headerSwatch[tone],
            }}
          />
          <View>
            <Text
              style={{
                ...theme.typography.caption,
                color: theme.colors.text.muted,
              }}
            >
              You visited
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.family.serifSemibold,
                fontSize: 19,
                lineHeight: 24,
                color: theme.colors.text.espresso900,
              }}
            >
              {cafeName}
            </Text>
          </View>
        </View>

        {submitted ? (
          <View
            style={{
              alignItems: "center",
              marginTop: theme.spacing.xxl,
              paddingVertical: theme.spacing.xl,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: theme.radius.card,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: theme.colors.surface.borderSoft,
              backgroundColor: theme.colors.surface.cardCream,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: theme.radius.photoPin,
                backgroundColor: theme.colors.surface.positiveSoft,
              }}
            >
              <Text style={{ fontSize: 18 }}>✦</Text>
            </View>
            <Text
              style={{
                fontFamily: theme.fonts.family.serifSemibold,
                fontSize: 21,
                lineHeight: 27,
                marginTop: theme.spacing.md,
                textAlign: "center",
                color: theme.colors.text.espresso900,
              }}
            >
              {CHECK_IN_THANKS_TITLE}
            </Text>
            <Text
              style={{
                ...theme.typography.bodySmall,
                marginTop: theme.spacing.xs,
                textAlign: "center",
                color: theme.colors.text.muted,
              }}
            >
              {CHECK_IN_THANKS_BODY}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Done"
              onPress={() => router.back()}
              style={({ pressed }) => ({
                minHeight: theme.sizing.compactControl,
                alignSelf: "stretch",
                alignItems: "center",
                justifyContent: "center",
                marginTop: theme.spacing.lg,
                borderRadius: theme.radius.button - 3,
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
                Done
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text
              style={{
                fontFamily: theme.fonts.family.serifSemibold,
                fontSize: 25,
                lineHeight: 31,
                marginTop: theme.spacing.lg - 2,
                color: theme.colors.text.espresso900,
              }}
            >
              How was the vibe?
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                marginTop: theme.spacing.xxs + 1,
                color: theme.colors.text.muted,
              }}
            >
              {CHECK_IN_SUBTITLE}
            </Text>

            {VIBE_QUESTIONS.map((question) => (
              <View key={question.id} style={{ marginTop: theme.spacing.screen }}>
                <Text
                  style={{
                    ...theme.typography.caption,
                    fontSize: 13,
                    fontFamily: theme.fonts.family.sansSemibold,
                    color: theme.colors.text.espresso900,
                  }}
                >
                  {question.label}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: theme.spacing.xs,
                    marginTop: theme.spacing.xs + 1,
                  }}
                >
                  {question.options.map((option) => (
                    <VibeChip
                      key={option}
                      label={option}
                      selected={answers[question.id] === option}
                      onPress={() => selectAnswer(question.id, option)}
                    />
                  ))}
                </View>
              </View>
            ))}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Submit Vibe Report"
              accessibilityState={{ disabled: !complete }}
              disabled={!complete}
              onPress={() => setSubmitted(true)}
              style={({ pressed }) => ({
                minHeight: theme.sizing.control,
                alignItems: "center",
                justifyContent: "center",
                marginTop: theme.spacing.xl,
                borderRadius: theme.radius.button,
                borderCurve: "continuous",
                backgroundColor: !complete
                  ? theme.colors.surface.disabled
                  : pressed
                    ? theme.colors.text.espresso700
                    : theme.colors.text.espresso900,
                boxShadow: complete ? theme.shadows.button : undefined,
              })}
            >
              <Text
                style={{
                  ...theme.typography.bodySmall,
                  fontFamily: theme.fonts.family.sansSemibold,
                  color: !complete
                    ? theme.colors.surface.disabledText
                    : theme.colors.background.cream50,
                }}
              >
                Submit Vibe Report
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}
