import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { MapPreviewSurface, PhotoMapPin, VibeChip } from "@/components/ui";
import { theme } from "@/constants/theme";

const suggestedSearches = [
  "quiet cafe with parking",
  "cute matcha place",
  "work cafe open late",
  "date spot near La Jolla",
] as const;

export default function SearchScreen() {
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
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
        <View
          style={{
            flex: 1,
            minHeight: 50,
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
            borderRadius: theme.radius.chip,
            borderWidth: 1,
            borderColor: theme.colors.surface.borderMedium,
            backgroundColor: theme.colors.surface.cardCream,
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <Image
            source="sf:magnifyingglass"
            style={{
              width: 15,
              height: 15,
              tintColor: theme.colors.text.muted,
            }}
          />
          <TextInput
            placeholder="Search cafes, vibes, or neighborhoods"
            placeholderTextColor={theme.colors.text.muted}
            autoCapitalize="sentences"
            style={{
              ...theme.typography.bodySmall,
              flex: 1,
              minHeight: 46,
              color: theme.colors.text.espresso900,
              padding: 0,
            }}
          />
        </View>
      </View>

      <View
        style={{
          height: 220,
          overflow: "hidden",
          marginTop: theme.spacing.lg,
          borderRadius: theme.radius.imageCard,
          borderCurve: "continuous",
          backgroundColor: theme.colors.background.warmPaper,
        }}
      >
        <MapPreviewSurface>
          <View style={{ position: "absolute", top: 48, left: 62 }}>
            <PhotoMapPin label="Mostra Coffee search result" score="9.1" selected />
          </View>
          <View style={{ position: "absolute", top: 116, right: 70 }}>
            <PhotoMapPin label="Quiet cafe result" score="8.9" tone="latte" />
          </View>
        </MapPreviewSurface>
      </View>

      <Text
        style={{
          ...theme.typography.title,
          marginTop: theme.spacing.xl,
          color: theme.colors.text.espresso900,
        }}
      >
        Search by mood
      </Text>
      <Text
        style={{
          ...theme.typography.bodySmall,
          marginTop: theme.spacing.xs,
          color: theme.colors.text.muted,
        }}
      >
        Try a vibe, neighborhood, drink, or practical need.
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: theme.spacing.xs,
          marginTop: theme.spacing.lg,
        }}
      >
        {suggestedSearches.map((search) => (
          <VibeChip key={search} label={search} />
        ))}
      </View>
    </ScrollView>
  );
}
