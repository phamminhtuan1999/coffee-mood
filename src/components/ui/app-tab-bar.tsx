import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";

// The app-wide 5-tab bottom bar (US-027). Rendered per tab-root screen with
// an explicit active tab; expo-router keeps screens as a stack, so tab taps
// push the target route.

export type AppTab = "Map" | "Search" | "Saved" | "Routes" | "Profile";

const TABS: { label: AppTab; icon: string; route: string }[] = [
  { label: "Map", icon: "sf:map.fill", route: "/" },
  { label: "Search", icon: "sf:magnifyingglass", route: "/search" },
  { label: "Saved", icon: "sf:heart", route: "/saved" },
  {
    label: "Routes",
    icon: "sf:point.topleft.down.curvedto.point.bottomright.up",
    route: "/route",
  },
  { label: "Profile", icon: "sf:person.crop.circle", route: "/profile" },
];

// Content clearance for screens that scroll under the absolute-positioned bar.
export const TAB_BAR_CLEARANCE = 96;

type AppTabBarProps = {
  active: AppTab;
};

export function AppTabBar({ active }: AppTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: 74 + insets.bottom,
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: theme.spacing.xs,
        paddingTop: theme.spacing.xs,
        paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
        borderTopWidth: 1,
        borderTopColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.background.cream50,
      }}
    >
      {TABS.map((tab) => {
        const selected = tab.label === active;

        return (
          <Pressable
            key={tab.label}
            accessibilityRole="button"
            accessibilityLabel={`${tab.label} tab`}
            accessibilityState={{ selected }}
            onPress={
              selected
                ? undefined
                : () =>
                    router.push(tab.route as Parameters<typeof router.push>[0])
            }
            style={({ pressed }) => ({
              flex: 1,
              alignItems: "center",
              gap: theme.spacing.xxs,
              paddingVertical: theme.spacing.xs,
              opacity: pressed ? 0.72 : 1,
            })}
          >
            <Image
              source={tab.icon}
              style={{
                width: 21,
                height: 21,
                tintColor: selected
                  ? theme.colors.text.espresso900
                  : theme.colors.text.muted,
              }}
            />
            <Text
              numberOfLines={1}
              style={{
                ...theme.typography.caption,
                fontSize: 10,
                fontFamily: selected
                  ? theme.fonts.family.sansBold
                  : theme.fonts.family.sansMedium,
                color: selected
                  ? theme.colors.text.espresso900
                  : theme.colors.text.muted,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
