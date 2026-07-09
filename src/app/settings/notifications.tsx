import { useRouter } from "expo-router";
import { useSyncExternalStore } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import {
  NOTIFICATIONS_FOOTER,
  NOTIFICATIONS_INTRO,
  NOTIFICATION_ROWS,
} from "@/data/profile";
import {
  getNotificationPrefs,
  subscribeNotificationPrefs,
  toggleNotificationPref,
} from "@/utils/notification-prefs";

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const prefs = useSyncExternalStore(
    subscribeNotificationPrefs,
    getNotificationPrefs,
  );

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
            Notifications
          </Text>
        </View>

        <Text
          style={{
            ...theme.typography.bodySmall,
            fontSize: 13,
            marginTop: theme.spacing.sm,
            color: theme.colors.text.muted,
          }}
        >
          {NOTIFICATIONS_INTRO}
        </Text>

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
          {NOTIFICATION_ROWS.map((row, index) => {
            const enabled = prefs[row.id];

            return (
              <View
                key={row.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: theme.spacing.sm + 1,
                  paddingVertical: theme.spacing.md - 1,
                  borderBottomWidth:
                    index < NOTIFICATION_ROWS.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.surface.borderSoft,
                }}
              >
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
                    style={{
                      ...theme.typography.caption,
                      fontSize: 11,
                      lineHeight: 16,
                      marginTop: 2,
                      color: theme.colors.text.muted,
                    }}
                  >
                    {row.sub}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="switch"
                  accessibilityLabel={row.label}
                  accessibilityState={{ checked: enabled }}
                  onPress={() => toggleNotificationPref(row.id)}
                  style={{
                    width: 46,
                    height: 27,
                    borderRadius: theme.radius.chip,
                    padding: 3,
                    justifyContent: "center",
                    alignItems: enabled ? "flex-end" : "flex-start",
                    backgroundColor: enabled
                      ? theme.colors.text.espresso900
                      : theme.colors.surface.borderMedium,
                  }}
                >
                  <View
                    style={{
                      width: 21,
                      height: 21,
                      borderRadius: theme.radius.photoPin,
                      backgroundColor: theme.colors.background.cream50,
                      boxShadow: theme.shadows.searchCard,
                    }}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>

        <Text
          style={{
            ...theme.typography.caption,
            fontSize: 11,
            textAlign: "center",
            marginTop: theme.spacing.md,
            color: theme.colors.surface.disabledText,
          }}
        >
          {NOTIFICATIONS_FOOTER}
        </Text>
      </ScrollView>
    </View>
  );
}
