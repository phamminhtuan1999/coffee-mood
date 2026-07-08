import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { VibeChip } from "@/components/ui";
import { theme } from "@/constants/theme";

const aiChips = [
  "Quiet work spot",
  "Cute date cafe",
  "Aesthetic photos",
  "Good latte",
  "Open late",
  "Outdoor chill",
] as const;

export default function AiFinderScreen() {
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
          marginTop: theme.spacing.lg,
          padding: theme.spacing.screen,
          borderRadius: theme.radius.card,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: theme.colors.surface.borderSoft,
          backgroundColor: theme.colors.surface.cardCream,
        }}
      >
        <View
          style={{
            width: 42,
            height: 42,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            backgroundColor: theme.colors.text.espresso900,
          }}
        >
          <Image
            source="sf:sparkles"
            style={{
              width: 18,
              height: 18,
              tintColor: theme.colors.brand.latteBeige,
            }}
          />
        </View>
        <Text
          style={{
            ...theme.typography.title,
            marginTop: theme.spacing.lg,
            color: theme.colors.text.espresso900,
          }}
        >
          What kind of cafe are you looking for?
        </Text>
        <View
          style={{
            minHeight: 132,
            marginTop: theme.spacing.lg,
            borderRadius: theme.radius.button,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: theme.colors.surface.borderMedium,
            backgroundColor: theme.colors.background.cream50,
            padding: theme.spacing.md,
          }}
        >
          <TextInput
            multiline
            placeholder="Example: I need a quiet cafe to work for 3 hours with parking and good latte."
            placeholderTextColor={theme.colors.text.muted}
            textAlignVertical="top"
            style={{
              ...theme.typography.bodySmall,
              minHeight: 100,
              color: theme.colors.text.espresso900,
              padding: 0,
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: theme.spacing.xs,
          marginTop: theme.spacing.lg,
        }}
      >
        {aiChips.map((chip) => (
          <VibeChip key={chip} label={chip} />
        ))}
      </View>
    </ScrollView>
  );
}
