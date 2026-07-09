import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useSyncExternalStore } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import { PROFILE_PERSONA, profileRows, profileStats } from "@/data/profile";
import type { ProfileRowTone } from "@/data/profile";
import { demoSavedState } from "@/data/saved-library";
import { getSavedState, subscribeSaved } from "@/utils/saved-store";

const rowIconBackground: Record<ProfileRowTone, string> = {
  latte: theme.colors.surface.latteSoft,
  terracotta: theme.colors.surface.cautionSoft,
  olive: theme.colors.surface.positiveSoft,
  neutral: theme.colors.surface.pressed,
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // QA override ?state=demo renders the counts from the demo library.
  const params = useLocalSearchParams<{ state?: string }>();
  const storeState = useSyncExternalStore(subscribeSaved, getSavedState);
  const state = useMemo(
    () => (params.state === "demo" ? demoSavedState(storeState) : storeState),
    [params.state, storeState],
  );

  const stats = profileStats(state);
  const rows = profileRows(state);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.lg,
          paddingBottom:
            Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.xxl,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.md,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.photoPin,
              borderWidth: 3,
              borderColor: theme.colors.background.cream50,
              backgroundColor: theme.colors.brand.latteBeige,
              boxShadow: theme.shadows.pin,
            }}
          >
            <Text
              style={{
                fontFamily: theme.fonts.family.serifSemibold,
                fontSize: 28,
                color: theme.colors.background.cream50,
              }}
            >
              {PROFILE_PERSONA.initial}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={{
                fontFamily: theme.fonts.family.serifSemibold,
                fontSize: 24,
                lineHeight: 29,
                color: theme.colors.text.espresso900,
              }}
            >
              {PROFILE_PERSONA.name}
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                marginTop: 3,
                color: theme.colors.text.muted,
              }}
            >
              {PROFILE_PERSONA.meta}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.xs + 1,
            marginTop: theme.spacing.lg - 2,
          }}
        >
          {stats.map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: theme.spacing.md - 2,
                paddingHorizontal: theme.spacing.xs,
                borderRadius: theme.radius.button,
                borderCurve: "continuous",
                borderWidth: 1,
                borderColor: theme.colors.surface.borderSoft,
                backgroundColor: theme.colors.surface.cardCream,
              }}
            >
              <Text
                style={{
                  ...theme.typography.sectionTitle,
                  fontFamily: theme.fonts.family.sansBold,
                  color: theme.colors.text.espresso900,
                }}
              >
                {stat.n}
              </Text>
              <Text
                style={{
                  ...theme.typography.caption,
                  fontSize: 10,
                  fontFamily: theme.fonts.family.sansSemibold,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  marginTop: 3,
                  color: theme.colors.text.muted,
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            paddingHorizontal: theme.spacing.md + 2,
            marginTop: theme.spacing.md + 2,
            borderRadius: theme.radius.card - 2,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: theme.colors.surface.borderSoft,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          {rows.map((row, index) => (
            <Pressable
              key={row.label}
              accessibilityRole="button"
              accessibilityLabel={row.label}
              onPress={() => router.push(row.route)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.sm + 1,
                paddingVertical: theme.spacing.md - 2,
                borderBottomWidth: index < rows.length - 1 ? 1 : 0,
                borderBottomColor: theme.colors.surface.borderSoft,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: theme.radius.button - 7,
                  borderCurve: "continuous",
                  backgroundColor: rowIconBackground[row.tone],
                }}
              >
                <Text style={{ fontSize: 14, color: theme.colors.text.espresso700 }}>
                  {row.icon}
                </Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={{
                    ...theme.typography.bodySmall,
                    fontFamily: theme.fonts.family.sansSemibold,
                    color: theme.colors.text.espresso900,
                  }}
                >
                  {row.label}
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
                  {row.sub}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.surface.borderStrong,
                }}
              >
                ›
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.xs + 2,
            marginTop: theme.spacing.md + 2,
          }}
        >
          {/* Edit profile stays inert until a profile-editing data model
              exists (decision 0020). */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
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
              Edit profile
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Preferences"
            onPress={() => router.push("/settings")}
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
              Preferences
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
