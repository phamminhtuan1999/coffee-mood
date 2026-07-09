import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyStateCard, ErrorStateCard, LoadingSkeleton } from "@/components/ui";
import { theme } from "@/constants/theme";
import {
  SYSTEM_EMPTY_STATES,
  SYSTEM_ERROR_STATES,
  SYSTEM_LOADING_STATES,
} from "@/data/system-states";

// QA gallery for the Section H system-state catalog (US-027). Deep-link only
// (/system-states): lets the US-028 walkthrough and simulator smokes verify
// every designed empty/loading/error card in one place.

export default function SystemStatesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.warmPaper }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.xs,
          paddingBottom:
            Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.xxl,
        }}
      >
        <Text
          style={{
            fontFamily: theme.fonts.family.serifSemibold,
            fontSize: 24,
            lineHeight: 29,
            color: theme.colors.text.espresso900,
          }}
        >
          System states
        </Text>
        <Text
          style={{
            ...theme.typography.caption,
            marginTop: theme.spacing.xxs,
            color: theme.colors.text.muted,
          }}
        >
          The Section H catalog: 6 empty · 5 loading · 5 error.
        </Text>

        <GallerySection title="Empty states">
          {SYSTEM_EMPTY_STATES.map((state) => (
            <View key={state.id} style={{ marginTop: theme.spacing.sm }}>
              <EmptyStateCard
                title={state.title}
                copy={state.copy}
                cta={state.cta}
                tone={state.tone}
              />
            </View>
          ))}
        </GallerySection>

        <GallerySection title="Loading states">
          {SYSTEM_LOADING_STATES.map((state) => (
            <View key={state.id} style={{ marginTop: theme.spacing.sm }}>
              <LoadingSkeleton title={state.title} hint={state.hint} />
            </View>
          ))}
        </GallerySection>

        <GallerySection title="Error states">
          {SYSTEM_ERROR_STATES.map((state) => (
            <View key={state.id} style={{ marginTop: theme.spacing.sm }}>
              <ErrorStateCard
                title={state.title}
                copy={state.copy}
                cta={state.cta}
              />
            </View>
          ))}
        </GallerySection>
      </ScrollView>
    </View>
  );
}

type GallerySectionProps = {
  title: string;
  children: React.ReactNode;
};

function GallerySection({ title, children }: GallerySectionProps) {
  return (
    <View style={{ marginTop: theme.spacing.lg }}>
      <Text
        style={{
          ...theme.typography.caption,
          fontFamily: theme.fonts.family.sansBold,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          color: theme.colors.text.muted,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}
