import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ShareCafeCard } from "@/components/ui/share-cafe-card";
import { theme } from "@/constants/theme";
import { SHARE_HEADING, shareActions } from "@/data/share-card";
import type { ShareAction, ShareCardContent } from "@/data/share-card";

type ShareCafeSheetProps = {
  content: ShareCardContent;
  onAction: (action: ShareAction) => void;
  onClose: () => void;
};

export function ShareCafeSheet({
  content,
  onAction,
  onClose,
}: ShareCafeSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <View accessibilityViewIsModal style={{ position: "absolute", inset: 0 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss share sheet"
        onPress={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: theme.colors.surface.overlayDark,
        }}
      />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: Math.max(insets.top + theme.spacing.lg, 64),
        }}
        pointerEvents="box-none"
      >
        <Text
          style={{
            ...theme.typography.caption,
            fontSize: 14,
            fontFamily: theme.fonts.family.sansSemibold,
            color: theme.colors.background.cream50,
          }}
        >
          {SHARE_HEADING}
        </Text>
        <View style={{ marginTop: theme.spacing.lg }} pointerEvents="none">
          <ShareCafeCard content={content} />
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopLeftRadius: theme.radius.bottomSheetTop,
          borderTopRightRadius: theme.radius.bottomSheetTop,
          borderCurve: "continuous",
          backgroundColor: theme.colors.background.cream50,
          paddingHorizontal: theme.spacing.lg - 2,
          paddingTop: theme.spacing.sm + 2,
          paddingBottom: Math.max(insets.bottom, theme.spacing.md) + theme.spacing.lg,
          boxShadow: theme.shadows.card,
        }}
      >
        <View
          style={{
            width: 36,
            height: 4,
            alignSelf: "center",
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.surface.borderStrong,
            marginBottom: theme.spacing.sm + 2,
          }}
        />
        <View style={{ flexDirection: "row", gap: theme.spacing.xs + 1 }}>
          {shareActions.map((action) => (
            <Pressable
              key={action.id}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={() => onAction(action)}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: "center",
                gap: theme.spacing.xs - 2,
                paddingVertical: theme.spacing.md - 2,
                paddingHorizontal: theme.spacing.xs,
                borderRadius: theme.radius.button - 2,
                borderCurve: "continuous",
                borderWidth: 1,
                borderColor: theme.colors.surface.borderMedium,
                backgroundColor: pressed
                  ? theme.colors.surface.pressed
                  : theme.colors.surface.cardCream,
              })}
            >
              <Image
                source={action.symbol}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: theme.colors.text.espresso900,
                }}
              />
              <Text
                style={{
                  ...theme.typography.caption,
                  fontSize: 11,
                  fontFamily: theme.fonts.family.sansSemibold,
                  color: theme.colors.text.espresso900,
                }}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
