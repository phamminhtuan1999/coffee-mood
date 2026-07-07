import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import {
  CafeBottomSheetShell,
  ClusteredPhotoPin,
  IconButton,
  MapPreviewSurface,
  PhotoMapPin,
  SearchBar,
  VibeChip,
} from "@/components/ui";
import { theme } from "@/constants/theme";

type SnapPoint = "collapsed" | "half" | "expanded";

const vibeChips = ["Work", "Aesthetic", "Date", "Quiet", "Outdoor"];
const snapPoints: SnapPoint[] = ["collapsed", "half", "expanded"];

const cafe = {
  name: "Mostra Coffee",
  meta: "North Park · 0.3 mi",
  score: "9.1",
  tags: ["Aesthetic", "Specialty Coffee", "Good Latte"],
  scores: [
    { label: "Aesthetic", value: "9.1" },
    { label: "Coffee", value: "8.8" },
    { label: "Work", value: "6.5" },
  ],
  summary:
    "Great coffee and cozy interior. Better for casual hangout or photos than long work sessions.",
};

export default function Index() {
  const [snapPoint, setSnapPoint] = useState<SnapPoint>("half");
  const [selectedPin, setSelectedPin] = useState("mostra");
  const [saved, setSaved] = useState(false);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.map.land }}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <View style={{ minHeight: 844 }}>
        <MapPreviewSurface>
          <View
            style={{
              position: "absolute",
              top: 64,
              left: theme.spacing.screen,
              right: theme.spacing.screen,
              zIndex: 5,
            }}
          >
            <SearchBar />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              position: "absolute",
              top: 128,
              left: 0,
              right: 0,
              zIndex: 5,
            }}
            contentContainerStyle={{
              gap: theme.spacing.xs,
              paddingHorizontal: theme.spacing.screen,
            }}
          >
            {vibeChips.map((vibe, index) => (
              <VibeChip key={vibe} label={vibe} selected={index === 1} />
            ))}
          </ScrollView>

          <View style={{ position: "absolute", top: 236, left: 50 }}>
            <PhotoMapPin
              label="Mostra Coffee"
              score="9.1"
              selected={selectedPin === "mostra"}
              saved={saved}
              onPress={() => setSelectedPin("mostra")}
            />
          </View>
          <View style={{ position: "absolute", top: 188, right: 70 }}>
            <PhotoMapPin
              label="Marigold and Oak"
              score="8.9"
              tone="latte"
              selected={selectedPin === "marigold"}
              onPress={() => setSelectedPin("marigold")}
            />
          </View>
          <View style={{ position: "absolute", top: 350, left: 154 }}>
            <PhotoMapPin
              label="Terrace and Thistle"
              score="8.4"
              tone="olive"
              selected={selectedPin === "terrace"}
              onPress={() => setSelectedPin("terrace")}
            />
          </View>
          <View style={{ position: "absolute", top: 430, right: 62 }}>
            <ClusteredPhotoPin count={6} label="Six nearby cafes" />
          </View>

          <View
            style={{
              position: "absolute",
              right: theme.spacing.md,
              bottom: 536,
              gap: theme.spacing.sm,
              zIndex: 5,
              alignItems: "flex-end",
            }}
          >
            <IconButton symbol="sf:location.fill" label="Current location" />
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => ({
                minHeight: 46,
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xs,
                paddingHorizontal: theme.spacing.screen,
                borderRadius: theme.radius.chip,
                backgroundColor: theme.colors.text.espresso900,
                opacity: pressed ? 0.86 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                boxShadow: theme.shadows.pin,
              })}
            >
              <Image
                source="sf:sparkles"
                style={{
                  width: 14,
                  height: 14,
                  tintColor: theme.colors.brand.latteBeige,
                }}
              />
              <Text
                style={{
                  ...theme.typography.chipLabel,
                  fontFamily: theme.fonts.family.sansSemibold,
                  color: theme.colors.background.cream50,
                }}
              >
                Ask AI
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              position: "absolute",
              left: theme.spacing.sm,
              right: theme.spacing.sm,
              bottom: 96,
              zIndex: 6,
            }}
          >
            <CafeBottomSheetShell
              snapPoint={snapPoint}
              name={cafe.name}
              meta={cafe.meta}
              score={cafe.score}
              tags={cafe.tags}
              scores={cafe.scores}
              summary={cafe.summary}
              saved={saved}
            />
          </View>

          <View
            style={{
              position: "absolute",
              left: theme.spacing.screen,
              right: theme.spacing.screen,
              bottom: theme.spacing.lg,
              zIndex: 8,
              flexDirection: "row",
              gap: theme.spacing.xs,
              padding: theme.spacing.xs,
              borderRadius: theme.radius.chip,
              borderWidth: 1,
              borderColor: theme.colors.surface.borderSoft,
              backgroundColor: theme.colors.surface.glassCream,
            }}
          >
            {snapPoints.map((point) => (
              <Pressable
                key={point}
                accessibilityRole="button"
                accessibilityState={{ selected: snapPoint === point }}
                onPress={() => setSnapPoint(point)}
                style={({ pressed }) => ({
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.radius.chip,
                  backgroundColor:
                    snapPoint === point
                      ? theme.colors.text.espresso900
                      : "transparent",
                  opacity: pressed ? 0.84 : 1,
                })}
              >
                <Text
                  style={{
                    ...theme.typography.caption,
                    color:
                      snapPoint === point
                        ? theme.colors.background.cream50
                        : theme.colors.text.espresso700,
                    textTransform: "capitalize",
                  }}
                >
                  {point}
                </Text>
              </Pressable>
            ))}
          </View>
        </MapPreviewSurface>
      </View>

      <View
        style={{
          gap: theme.spacing.md,
          padding: theme.spacing.screen,
          backgroundColor: theme.colors.background.cream50,
        }}
      >
        <View style={{ gap: theme.spacing.xs }}>
          <Text
            style={{
              ...theme.typography.caption,
              color: theme.colors.brand.terracotta,
              textTransform: "uppercase",
            }}
          >
            US-003 components
          </Text>
          <Text
            style={{
              ...theme.typography.sectionTitle,
              color: theme.colors.text.espresso900,
            }}
          >
            Pin states
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-end",
            gap: theme.spacing.lg,
          }}
        >
          <PhotoMapPin label="Default cafe" score="8.8" tone="latte" />
          <PhotoMapPin label="Selected cafe" score="9.1" selected />
          <PhotoMapPin label="Saved cafe" score="8.4" tone="olive" saved />
          <ClusteredPhotoPin count={6} label="Clustered cafes" />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => setSaved((current) => !current)}
          style={({ pressed }) => ({
            alignSelf: "flex-start",
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.radius.chip,
            borderWidth: 1,
            borderColor: theme.colors.surface.borderMedium,
            backgroundColor: saved
              ? theme.colors.brand.terracotta
              : theme.colors.surface.cardCream,
            opacity: pressed ? 0.84 : 1,
          })}
        >
          <Text
            style={{
              ...theme.typography.chipLabel,
              color: saved
                ? theme.colors.background.cream50
                : theme.colors.text.espresso900,
            }}
          >
            {saved ? "Saved state on" : "Saved state off"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
