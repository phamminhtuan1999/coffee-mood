import { useRouter } from "expo-router";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import {
  DELETE_CANCEL_CTA,
  DELETE_CONFIRM_COPY,
  DELETE_CONFIRM_CTA,
  DELETE_CONFIRM_TITLE,
  settingsGroups,
} from "@/data/profile";
import type { SettingsRow } from "@/data/profile";
import { clearAuthSession, loadAuthSession } from "@/utils/auth-session";
import { resetNotificationPrefs } from "@/utils/notification-prefs";
import { getSavedState, resetSavedStore, subscribeSaved } from "@/utils/saved-store";
import { clearTasteProfile, loadTasteProfile } from "@/utils/taste-profile";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const state = useSyncExternalStore(subscribeSaved, getSavedState);
  const session = useMemo(() => loadAuthSession(), []);
  const profile = useMemo(() => loadTasteProfile(), []);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const groups = settingsGroups(session, profile, state);

  // Sign out ends the local demo session (decision 0020); the first-run flow
  // takes over on the next visit to the map root.
  const signOut = () => {
    clearAuthSession();
    router.replace("/");
  };

  // Delete account clears every local store behind the explicit confirm step
  // (decision 0020). No backend exists, so device data is the whole account.
  const deleteAccount = () => {
    clearAuthSession();
    clearTasteProfile();
    resetSavedStore();
    resetNotificationPrefs();
    setConfirmingDelete(false);
    router.replace("/");
  };

  const rowPress = (row: SettingsRow): (() => void) | undefined => {
    if (row.kind === "signout") {
      return signOut;
    }

    if (row.kind === "notifications") {
      return () => router.push("/settings/notifications");
    }

    if (row.kind === "danger") {
      return () => setConfirmingDelete(true);
    }

    // Preference values are display-only until a preferences model exists.
    return undefined;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.xs,
          paddingBottom:
            Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.xxl,
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
            Settings
          </Text>
        </View>

        {groups.map((group) => (
          <View key={group.title}>
            <Text
              style={{
                ...theme.typography.caption,
                fontFamily: theme.fonts.family.sansBold,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginTop: theme.spacing.lg,
                color: theme.colors.text.muted,
              }}
            >
              {group.title}
            </Text>
            <View
              style={{
                paddingHorizontal: theme.spacing.md + 2,
                marginTop: theme.spacing.xs + 2,
                borderRadius: theme.radius.button + 2,
                borderCurve: "continuous",
                borderWidth: 1,
                borderColor: theme.colors.surface.borderSoft,
                backgroundColor: theme.colors.surface.cardCream,
              }}
            >
              {group.rows.map((row, index) => {
                const onPress = rowPress(row);

                return (
                  <Pressable
                    key={row.label}
                    accessibilityRole="button"
                    accessibilityLabel={row.label}
                    onPress={onPress}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: theme.spacing.sm,
                      paddingVertical: theme.spacing.sm + 1,
                      borderBottomWidth: index < group.rows.length - 1 ? 1 : 0,
                      borderBottomColor: theme.colors.surface.borderSoft,
                      opacity: pressed && onPress ? 0.7 : 1,
                    })}
                  >
                    <Text
                      style={{
                        ...theme.typography.chipLabel,
                        color:
                          row.kind === "danger"
                            ? theme.colors.score.crowded
                            : theme.colors.text.espresso900,
                      }}
                    >
                      {row.label}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: theme.spacing.xs - 2,
                        flexShrink: 1,
                      }}
                    >
                      {row.value ? (
                        <Text
                          numberOfLines={1}
                          style={{
                            ...theme.typography.caption,
                            color: theme.colors.text.muted,
                          }}
                        >
                          {row.value}
                        </Text>
                      ) : null}
                      <Text
                        style={{
                          fontSize: 14,
                          color: theme.colors.surface.borderStrong,
                        }}
                      >
                        ›
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {confirmingDelete ? (
        <View
          accessibilityViewIsModal
          style={{ position: "absolute", inset: 0 }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss delete confirmation"
            onPress={() => setConfirmingDelete(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: theme.colors.surface.overlayDark,
            }}
          />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingHorizontal: theme.spacing.lg,
            }}
            pointerEvents="box-none"
          >
            <View
              style={{
                padding: theme.spacing.lg,
                borderRadius: theme.radius.card,
                borderCurve: "continuous",
                backgroundColor: theme.colors.background.cream50,
                boxShadow: theme.shadows.card,
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fonts.family.serifSemibold,
                  fontSize: 20,
                  lineHeight: 25,
                  color: theme.colors.text.espresso900,
                }}
              >
                {DELETE_CONFIRM_TITLE}
              </Text>
              <Text
                style={{
                  ...theme.typography.bodySmall,
                  fontSize: 13,
                  lineHeight: 20,
                  marginTop: theme.spacing.xs + 2,
                  color: theme.colors.text.muted,
                }}
              >
                {DELETE_CONFIRM_COPY}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={DELETE_CONFIRM_CTA}
                onPress={deleteAccount}
                style={({ pressed }) => ({
                  minHeight: theme.sizing.compactControl,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: theme.spacing.md + 2,
                  borderRadius: theme.radius.button - 2,
                  borderCurve: "continuous",
                  backgroundColor: pressed
                    ? theme.colors.score.crowdedInk
                    : theme.colors.score.crowded,
                })}
              >
                <Text
                  style={{
                    ...theme.typography.chipLabel,
                    fontFamily: theme.fonts.family.sansSemibold,
                    color: theme.colors.background.cream50,
                  }}
                >
                  {DELETE_CONFIRM_CTA}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={DELETE_CANCEL_CTA}
                onPress={() => setConfirmingDelete(false)}
                style={({ pressed }) => ({
                  minHeight: theme.sizing.compactControl,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: theme.spacing.xs,
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
                  {DELETE_CANCEL_CTA}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}
