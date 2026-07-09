import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { VibeChip } from "@/components/ui";
import { theme } from "@/constants/theme";
import {
  CLIP_NOTE_PLACEHOLDER,
  CLIP_TAGS,
  CLIP_UPLOAD_HINT,
  CLIP_UPLOAD_TITLE,
} from "@/data/contribute";

export default function AddVibeClipScreen() {
  const insets = useSafeAreaInsets();
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const toggleTag = (tag: string) =>
    setTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: Math.max(insets.top, theme.spacing.lg) + theme.spacing.lg,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.xxl,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
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
              style={{ width: 15, height: 15, tintColor: theme.colors.text.espresso900 }}
            />
          </Pressable>
          <Text
            style={{
              fontFamily: theme.fonts.family.serifSemibold,
              fontSize: 19,
              lineHeight: 24,
              color: theme.colors.text.espresso900,
            }}
          >
            Add a vibe clip
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Media capture stays inert until the media provider lands (decision
            0018) - the dashed target ships so the flow reads photo-first. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={CLIP_UPLOAD_TITLE}
          style={{
            height: 300,
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing.sm,
            marginTop: theme.spacing.screen,
            borderRadius: theme.radius.card + 2,
            borderCurve: "continuous",
            borderWidth: 1.5,
            borderStyle: "dashed",
            borderColor: theme.colors.surface.borderStrong,
            backgroundColor: theme.colors.surface.glassCream,
          }}
        >
          <View
            style={{
              width: 54,
              height: 54,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.surface.latteSoft,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                color: theme.colors.brand.roastedBrown,
              }}
            >
              +
            </Text>
          </View>
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso700,
            }}
          >
            {CLIP_UPLOAD_TITLE}
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 11,
              color: theme.colors.text.muted,
            }}
          >
            {CLIP_UPLOAD_HINT}
          </Text>
        </Pressable>

        <Text
          style={{
            ...theme.typography.caption,
            fontFamily: theme.fonts.family.sansBold,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginTop: theme.spacing.lg - 2,
            color: theme.colors.text.muted,
          }}
        >
          Vibe tags
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs + 1,
            marginTop: theme.spacing.sm - 2,
          }}
        >
          {CLIP_TAGS.map((tag) => (
            <VibeChip
              key={tag}
              label={tag}
              selected={tags.includes(tag)}
              onPress={() => toggleTag(tag)}
            />
          ))}
        </View>

        <View
          style={{
            marginTop: theme.spacing.md + 2,
            paddingVertical: theme.spacing.sm + 1,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.radius.button - 2,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: theme.colors.surface.borderMedium,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 10,
              fontFamily: theme.fonts.family.sansSemibold,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: theme.colors.text.muted,
            }}
          >
            Note (optional)
          </Text>
          <TextInput
            accessibilityLabel="Clip note"
            value={note}
            onChangeText={setNote}
            placeholder={CLIP_NOTE_PLACEHOLDER}
            placeholderTextColor={theme.colors.surface.disabledText}
            style={{
              ...theme.typography.chipLabel,
              marginTop: theme.spacing.xxs,
              paddingVertical: 0,
              fontStyle: note ? "normal" : "italic",
              color: theme.colors.text.espresso900,
            }}
          />
        </View>

        {/* Post Clip stays inert until media upload/storage/moderation land
            (decision 0018), consistent with the other deferred actions. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Post Clip"
          style={({ pressed }) => ({
            minHeight: theme.sizing.control,
            alignItems: "center",
            justifyContent: "center",
            marginTop: theme.spacing.lg,
            borderRadius: theme.radius.button,
            borderCurve: "continuous",
            backgroundColor: pressed
              ? theme.colors.text.espresso700
              : theme.colors.text.espresso900,
            boxShadow: theme.shadows.button,
          })}
        >
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.background.cream50,
            }}
          >
            Post Clip
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
