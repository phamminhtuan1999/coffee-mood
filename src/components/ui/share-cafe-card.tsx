import { Text, View } from "react-native";

import { theme } from "@/constants/theme";
import { SHARE_BRAND } from "@/data/share-card";
import type { ShareCardContent } from "@/data/share-card";
import type { CafeMapPinTone } from "@/data/map-pins";

const heroTone: Record<CafeMapPinTone, { base: string; accent: string }> = {
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

type ShareCafeCardProps = {
  content: ShareCardContent;
};

// The story-format card that renders inside the share overlay. It is a
// standalone view so a future view-shot capture can rasterize it (decision
// 0015) without pulling in the surrounding sheet chrome.
export function ShareCafeCard({ content }: ShareCafeCardProps) {
  const tone = heroTone[content.tone];

  return (
    <View
      accessibilityLabel={`Share card for ${content.name}`}
      style={{
        width: 276,
        borderRadius: theme.radius.imageCard,
        borderCurve: "continuous",
        overflow: "hidden",
        backgroundColor: theme.colors.background.cream50,
        boxShadow: theme.shadows.card,
      }}
    >
      <View
        style={{
          height: 240,
          overflow: "hidden",
          backgroundColor: tone.base,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 150,
            height: 150,
            right: -30,
            bottom: -30,
            borderRadius: theme.radius.photoPin,
            backgroundColor: tone.accent,
            opacity: 0.55,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            paddingHorizontal: theme.spacing.sm + 1,
            paddingVertical: theme.spacing.xxs + 2,
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.surface.cardCream,
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
            {content.vibeTag}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xxs + 1,
            paddingHorizontal: theme.spacing.sm - 1,
            paddingVertical: theme.spacing.xxs + 2,
            borderRadius: theme.spacing.sm,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.score.great,
            }}
          />
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 13,
              fontFamily: theme.fonts.family.sansBold,
              color: theme.colors.text.espresso900,
            }}
          >
            {content.score}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: theme.spacing.screen, paddingTop: 18, paddingBottom: theme.spacing.md }}>
        <Text
          style={{
            fontFamily: theme.fonts.family.serifSemibold,
            fontSize: 24,
            lineHeight: 30,
            color: theme.colors.text.espresso900,
          }}
        >
          {content.name}
        </Text>
        <Text
          style={{
            ...theme.typography.caption,
            marginTop: 3,
            color: theme.colors.text.muted,
          }}
        >
          {content.location}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: theme.spacing.xs + 1,
            marginTop: theme.spacing.sm,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.brand.latteBeige,
            }}
          >
            <Text style={{ ...theme.typography.caption, fontSize: 10 }}>*</Text>
          </View>
          <Text
            style={{
              ...theme.typography.caption,
              flex: 1,
              lineHeight: 18,
              color: theme.colors.text.espresso700,
            }}
          >
            {content.tagline}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xs - 1,
            marginTop: theme.spacing.sm + 2,
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.surface.borderSoft,
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.photoPin,
              borderWidth: 1.5,
              borderColor: theme.colors.brand.terracotta,
            }}
          >
            <Text
              style={{
                fontFamily: theme.fonts.family.serifSemibold,
                fontSize: 10,
                color: theme.colors.text.espresso900,
              }}
            >
              C
            </Text>
          </View>
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 10,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.muted,
            }}
          >
            {SHARE_BRAND}
          </Text>
        </View>
      </View>
    </View>
  );
}
