import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import {
  galleryTabs,
  getCafeGallery,
  isGalleryTab,
  photosForTab,
  splitMasonryColumns,
} from "@/data/gallery-fixtures";
import type { GalleryPhoto, GalleryTab } from "@/data/gallery-fixtures";
import { cafeMapPins } from "@/data/map-pins";
import type { CafeMapPinTone } from "@/data/map-pins";

const toneColors: Record<CafeMapPinTone, { base: string; accent: string }> = {
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

export default function CafeGalleryScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    tab?: string;
    photo?: string;
  }>();
  const cafeId = typeof params.id === "string" ? params.id : "";
  const pin = cafeMapPins.find((cafe) => cafe.id === cafeId);
  const gallery = getCafeGallery(cafeId);
  const [activeTab, setActiveTab] = useState<GalleryTab>(() =>
    isGalleryTab(params.tab) ? params.tab : "Interior",
  );
  const [openPhotoId, setOpenPhotoId] = useState<string | null>(() =>
    typeof params.photo === "string" ? params.photo : null,
  );

  const photos = gallery ? photosForTab(gallery, activeTab) : [];
  const [leftColumn, rightColumn] = splitMasonryColumns(photos);
  const openPhoto =
    gallery?.photos.find((photo) => photo.id === openPhotoId) ?? null;

  const selectTab = (tab: GalleryTab) => {
    setActiveTab(tab);
    setOpenPhotoId(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
          paddingTop: Math.max(insets.top + theme.spacing.xs, 62),
          paddingHorizontal: theme.spacing.screen,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to cafe"
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
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: theme.fonts.family.serifSemibold,
              fontSize: 20,
              lineHeight: 26,
              color: theme.colors.text.espresso900,
            }}
          >
            {pin?.name ?? "Cafe photos"}
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              marginTop: 1,
              color: theme.colors.text.muted,
            }}
          >
            {gallery
              ? `${gallery.photoCount} photos · ${gallery.clipCount} clips`
              : "No photos yet"}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, marginTop: theme.spacing.md + 2 }}
        contentContainerStyle={{
          gap: theme.spacing.xs,
          paddingHorizontal: theme.spacing.screen,
          paddingBottom: theme.spacing.sm + 2,
        }}
      >
        {galleryTabs.map((tab) => {
          const selected = tab === activeTab;

          return (
            <Pressable
              key={tab}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => selectTab(tab)}
              style={({ pressed }) => ({
                paddingHorizontal: theme.spacing.md - 2,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.radius.chip,
                borderWidth: selected ? 0 : 1,
                borderColor: theme.colors.surface.borderMedium,
                backgroundColor: selected
                  ? theme.colors.text.espresso900
                  : pressed
                    ? theme.colors.surface.pressed
                    : theme.colors.surface.cardCream,
              })}
            >
              <Text
                style={{
                  ...theme.typography.chipLabel,
                  fontSize: 12,
                  color: selected
                    ? theme.colors.background.cream50
                    : theme.colors.text.espresso700,
                }}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {photos.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: theme.spacing.xl,
            paddingBottom: theme.spacing.xxxl,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: theme.radius.photoPin,
              borderWidth: 3,
              borderColor: theme.colors.background.cream50,
              backgroundColor: theme.colors.background.warmPaper,
            }}
          />
          <Text
            style={{
              ...theme.typography.bodySmall,
              fontFamily: theme.fonts.family.serifMedium,
              marginTop: theme.spacing.md,
              color: theme.colors.text.espresso900,
            }}
          >
            No photos in this vibe yet.
          </Text>
          <Text
            style={{
              ...theme.typography.caption,
              marginTop: theme.spacing.xxs,
              color: theme.colors.text.muted,
            }}
          >
            Try another tab or check back soon.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.screen,
            paddingBottom: theme.spacing.xxl,
          }}
        >
          <View style={{ flexDirection: "row", gap: theme.spacing.xs + 2 }}>
            {[leftColumn, rightColumn].map((column, columnIndex) => (
              <View
                key={columnIndex === 0 ? "left" : "right"}
                style={{ flex: 1, gap: theme.spacing.xs + 2 }}
              >
                {column.map((photo) => (
                  <GalleryPhotoCard
                    key={photo.id}
                    photo={photo}
                    onPress={() => setOpenPhotoId(photo.id)}
                  />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {openPhoto ? (
        <PhotoDetailOverlay
          photo={openPhoto}
          onClose={() => setOpenPhotoId(null)}
        />
      ) : null}
    </View>
  );
}

type GalleryPhotoCardProps = {
  photo: GalleryPhoto;
  onPress: () => void;
};

function GalleryPhotoCard({ photo, onPress }: GalleryPhotoCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={photo.caption}
      onPress={onPress}
      style={({ pressed }) => ({
        height: photo.height,
        overflow: "hidden",
        borderRadius: theme.radius.button,
        borderCurve: "continuous",
        backgroundColor: toneColors[photo.tone].base,
        opacity: pressed ? 0.82 : 1,
      })}
    >
      <View
        style={{
          position: "absolute",
          right: -30,
          bottom: -40,
          width: 130,
          height: 130,
          borderRadius: theme.radius.photoPin,
          backgroundColor: toneColors[photo.tone].accent,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: theme.spacing.xs,
          bottom: theme.spacing.xs,
          paddingHorizontal: theme.spacing.xs + 2,
          paddingVertical: theme.spacing.xxs,
          borderRadius: theme.radius.chip,
          backgroundColor: theme.colors.surface.cardCream,
        }}
      >
        <Text
          style={{
            ...theme.typography.caption,
            fontSize: 10,
            fontFamily: theme.fonts.family.sansSemibold,
            color: theme.colors.text.espresso700,
          }}
        >
          {photo.tag}
        </Text>
      </View>
    </Pressable>
  );
}

type PhotoDetailOverlayProps = {
  photo: GalleryPhoto;
  onClose: () => void;
};

function PhotoDetailOverlay({ photo, onClose }: PhotoDetailOverlayProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        justifyContent: "center",
        paddingHorizontal: theme.spacing.screen,
        backgroundColor: theme.colors.surface.overlayDark,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close photo"
        onPress={onClose}
        style={({ pressed }) => ({
          position: "absolute",
          top: Math.max(insets.top + theme.spacing.xs, 58),
          right: theme.spacing.screen,
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius.photoPin,
          backgroundColor: theme.colors.surface.cardCream,
          opacity: pressed ? 0.72 : 1,
        })}
      >
        <Image
          source="sf:xmark"
          style={{
            width: 14,
            height: 14,
            tintColor: theme.colors.text.espresso900,
          }}
        />
      </Pressable>

      <View
        style={{
          height: 380,
          overflow: "hidden",
          borderRadius: theme.radius.imageCard,
          borderCurve: "continuous",
          backgroundColor: toneColors[photo.tone].base,
        }}
      >
        <View
          style={{
            position: "absolute",
            right: -60,
            bottom: -80,
            width: 260,
            height: 260,
            borderRadius: theme.radius.photoPin,
            backgroundColor: toneColors[photo.tone].accent,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.spacing.sm,
          marginTop: theme.spacing.md,
        }}
      >
        <Text
          style={{
            ...theme.typography.bodySmall,
            flex: 1,
            fontFamily: theme.fonts.family.sansMedium,
            color: theme.colors.background.cream50,
          }}
        >
          {photo.caption}
        </Text>
        <View
          style={{
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xxs + 1,
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 10,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso700,
            }}
          >
            {photo.tag}
          </Text>
        </View>
      </View>
    </View>
  );
}
