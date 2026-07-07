import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  CafeImageCard,
  CollectionCard,
  MapPreviewSurface,
  PhotoMapPin,
  VibeChip,
} from "@/components/ui";
import { theme } from "@/constants/theme";

type FirstRunStep = "splash" | "welcome" | "intro" | "location-primer";

const introSlides = [
  {
    title: "Explore visually",
    copy: "See cafe vibes directly on the map.",
    kind: "map",
  },
  {
    title: "Match your mood",
    copy: "Find places for work, dates, photos, quiet time, or outdoor chill.",
    kind: "mood",
  },
  {
    title: "Save your coffee map",
    copy: "Build collections of cafes you want to try, love, or recommend.",
    kind: "save",
  },
] as const;

export default function Index() {
  const [step, setStep] = useState<FirstRunStep>("splash");
  const [slideIndex, setSlideIndex] = useState(0);

  const goToLocationPrimer = () => setStep("location-primer");

  if (step === "splash") {
    return <SplashScreen onContinue={() => setStep("welcome")} />;
  }

  if (step === "welcome") {
    return (
      <WelcomeScreen
        onGetStarted={() => {
          setSlideIndex(0);
          setStep("intro");
        }}
        onExploreGuest={goToLocationPrimer}
      />
    );
  }

  if (step === "location-primer") {
    return <LocationPrimerHandoff onBack={() => setStep("welcome")} />;
  }

  return (
    <FeatureIntroScreen
      slideIndex={slideIndex}
      onSkip={goToLocationPrimer}
      onContinue={() => {
        if (slideIndex === introSlides.length - 1) {
          goToLocationPrimer();
          return;
        }

        setSlideIndex((current) => current + 1);
      }}
    />
  );
}

type SplashScreenProps = {
  onContinue: () => void;
};

function SplashScreen({ onContinue }: SplashScreenProps) {
  const [reveal] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [reveal]);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onContinue}
      style={{
        flex: 1,
        minHeight: 844,
        backgroundColor: theme.colors.background.cream50,
      }}
    >
      <WarmMapTexture />
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: theme.spacing.screen,
          opacity: reveal,
          transform: [
            {
              translateY: reveal.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        }}
      >
        <BrandMark size={72} />
        <Text
          style={{
            ...theme.typography.title,
            marginTop: theme.spacing.lg,
            color: theme.colors.text.espresso900,
          }}
        >
          CafeMood Map
        </Text>
        <Text
          style={{
            ...theme.typography.bodySmall,
            marginTop: theme.spacing.xs,
            color: theme.colors.text.muted,
          }}
        >
          Find cafes by vibe.
        </Text>
      </Animated.View>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 70,
          flexDirection: "row",
          justifyContent: "center",
          gap: theme.spacing.xs,
        }}
      >
        {[0, 1, 2].map((dot) => (
          <View
            key={dot}
            style={{
              width: 6,
              height: 6,
              borderRadius: theme.radius.photoPin,
              backgroundColor: theme.colors.brand.roastedBrown,
              opacity: dot === 1 ? 0.66 : 0.34,
            }}
          />
        ))}
      </View>
    </Pressable>
  );
}

type WelcomeScreenProps = {
  onGetStarted: () => void;
  onExploreGuest: () => void;
};

function WelcomeScreen({ onGetStarted, onExploreGuest }: WelcomeScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        minHeight: 844,
        paddingHorizontal: 28,
        paddingTop: 84,
        paddingBottom: theme.spacing.xxl,
      }}
    >
      <WarmMapTexture />
      <WelcomeCollage />
      <Text
        style={{
          ...theme.typography.display,
          marginTop: theme.spacing.lg,
          color: theme.colors.text.espresso900,
        }}
      >
        Find a cafe that fits your mood.
      </Text>
      <Text
        style={{
          ...theme.typography.bodySmall,
          marginTop: theme.spacing.sm,
          color: theme.colors.text.muted,
        }}
      >
        Discover beautiful coffee shops nearby for work, dates, photos, or slow
        mornings.
      </Text>
      <View style={{ flex: 1, minHeight: theme.spacing.xxxl }} />
      <ActionButton label="Get Started" onPress={onGetStarted} />
      <Pressable
        accessibilityRole="button"
        onPress={onExploreGuest}
        style={({ pressed }) => ({
          alignItems: "center",
          padding: theme.spacing.md,
          opacity: pressed ? 0.72 : 1,
        })}
      >
        <Text
          style={{
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.family.sansSemibold,
            color: theme.colors.text.espresso700,
          }}
        >
          Explore as Guest
        </Text>
      </Pressable>
    </ScrollView>
  );
}

type FeatureIntroScreenProps = {
  slideIndex: number;
  onSkip: () => void;
  onContinue: () => void;
};

function FeatureIntroScreen({
  slideIndex,
  onSkip,
  onContinue,
}: FeatureIntroScreenProps) {
  const slide = introSlides[slideIndex];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        minHeight: 844,
        paddingHorizontal: 28,
        paddingTop: 70,
        paddingBottom: theme.spacing.xxl,
      }}
    >
      <WarmMapTexture />
      <View style={{ alignItems: "flex-end" }}>
        <Pressable
          accessibilityRole="button"
          onPress={onSkip}
          style={({ pressed }) => ({
            paddingHorizontal: theme.spacing.xxs,
            paddingVertical: theme.spacing.xs,
            opacity: pressed ? 0.72 : 1,
          })}
        >
          <Text
            style={{
              ...theme.typography.caption,
              fontFamily: theme.fonts.family.sansBold,
              color: theme.colors.text.muted,
            }}
          >
            Skip
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          height: 350,
          overflow: "hidden",
          marginTop: theme.spacing.xs,
          borderRadius: theme.radius.imageCard,
          borderCurve: "continuous",
          backgroundColor: theme.colors.background.warmPaper,
        }}
      >
        {slide.kind === "map" ? <IntroMapVisual /> : null}
        {slide.kind === "mood" ? <IntroMoodVisual /> : null}
        {slide.kind === "save" ? <IntroSaveVisual /> : null}
      </View>
      <Text
        style={{
          ...theme.typography.title,
          marginTop: theme.spacing.xl,
          color: theme.colors.text.espresso900,
        }}
      >
        {slide.title}
      </Text>
      <Text
        style={{
          ...theme.typography.bodySmall,
          marginTop: theme.spacing.xs,
          color: theme.colors.text.muted,
        }}
      >
        {slide.copy}
      </Text>
      <View style={{ flex: 1, minHeight: theme.spacing.xxxl }} />
      <PageDots current={slideIndex} total={introSlides.length} />
      <ActionButton
        label={slideIndex === introSlides.length - 1 ? "Continue" : "Continue"}
        onPress={onContinue}
      />
    </ScrollView>
  );
}

type LocationPrimerHandoffProps = {
  onBack: () => void;
};

function LocationPrimerHandoff({ onBack }: LocationPrimerHandoffProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        minHeight: 844,
        padding: theme.spacing.screen,
        paddingTop: 96,
      }}
    >
      <WarmMapTexture />
      <BrandMark size={56} />
      <Text
        style={{
          ...theme.typography.title,
          marginTop: theme.spacing.lg,
          color: theme.colors.text.espresso900,
        }}
      >
        Location primer is next
      </Text>
      <Text
        style={{
          ...theme.typography.body,
          marginTop: theme.spacing.sm,
          color: theme.colors.text.muted,
        }}
      >
        Guest mode skips auth and continues to the location primer. US-006 owns
        the full permission and manual-location flow.
      </Text>
      <View
        style={{
          marginTop: theme.spacing.xl,
          padding: theme.spacing.screen,
          borderRadius: theme.radius.card,
          borderCurve: "continuous",
          borderColor: theme.colors.surface.borderSoft,
          borderWidth: 1,
          backgroundColor: theme.colors.surface.cardCream,
        }}
      >
        <Text
          style={{
            ...theme.typography.caption,
            color: theme.colors.brand.terracotta,
            textTransform: "uppercase",
          }}
        >
          Guest path
        </Text>
        <Text
          style={{
            ...theme.typography.sectionTitle,
            marginTop: theme.spacing.xs,
            color: theme.colors.text.espresso900,
          }}
        >
          Welcome -&gt; Explore as Guest -&gt; Location Primer
        </Text>
      </View>
      <View style={{ flex: 1, minHeight: theme.spacing.xxxl }} />
      <ActionButton label="Back to Welcome" variant="secondary" onPress={onBack} />
    </ScrollView>
  );
}

type BrandMarkProps = {
  size: number;
};

function BrandMark({ size }: BrandMarkProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.photoPin,
        borderWidth: 2,
        borderColor: theme.colors.brand.terracotta,
      }}
    >
      <Text
        style={{
          fontFamily: theme.fonts.family.serifSemibold,
          fontSize: size * 0.46,
          lineHeight: size * 0.54,
          color: theme.colors.text.espresso900,
        }}
      >
        C
      </Text>
    </View>
  );
}

function WarmMapTexture() {
  return (
    <>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
        }}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <View
            key={`h-${index}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: index * 88,
              height: 1,
              backgroundColor: theme.colors.surface.borderSoft,
            }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, index) => (
          <View
            key={`v-${index}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: index * 88,
              width: 1,
              backgroundColor: theme.colors.surface.borderSoft,
            }}
          />
        ))}
      </View>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 90,
          right: -60,
          width: 220,
          height: 200,
          borderRadius: theme.radius.imageCard,
          backgroundColor: theme.colors.map.park,
          opacity: 0.34,
          transform: [{ rotate: "8deg" }],
        }}
      />
    </>
  );
}

function WelcomeCollage() {
  return (
    <View style={{ height: 330, marginTop: theme.spacing.xs }}>
      <View
        style={{
          position: "absolute",
          top: theme.spacing.lg,
          left: theme.spacing.xxs,
          width: 170,
          transform: [{ rotate: "-5deg" }],
        }}
      >
        <CafeImageCard title="Fernway Coffee" accent="latte" />
      </View>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: theme.spacing.xs,
          width: 160,
          height: 200,
          overflow: "hidden",
          borderRadius: theme.radius.card,
          borderCurve: "continuous",
          backgroundColor: theme.colors.map.land,
          transform: [{ rotate: "4deg" }],
          boxShadow: theme.shadows.card,
        }}
      >
        <MapPreviewSurface>
          <View style={{ position: "absolute", top: 58, left: 46 }}>
            <PhotoMapPin label="Map preview cafe" score="9.2" selected />
          </View>
        </MapPreviewSurface>
      </View>
      <View
        style={{
          position: "absolute",
          right: 60,
          bottom: 0,
          width: 150,
          transform: [{ rotate: "-2deg" }],
        }}
      >
        <CollectionCard title="Slow mornings" count="8 cafes" />
      </View>
      <View style={{ position: "absolute", left: 40, bottom: 46 }}>
        <PhotoMapPin label="Cafe collage pin" tone="latte" />
      </View>
    </View>
  );
}

function IntroMapVisual() {
  return (
    <MapPreviewSurface>
      <View style={{ position: "absolute", top: 68, left: 58 }}>
        <PhotoMapPin label="Cafe one" tone="terracotta" />
      </View>
      <View style={{ position: "absolute", top: 154, left: 174 }}>
        <PhotoMapPin label="Featured cafe" score="9.2" selected tone="latte" />
      </View>
      <View style={{ position: "absolute", bottom: 48, left: 88 }}>
        <PhotoMapPin label="Outdoor cafe" tone="olive" />
      </View>
    </MapPreviewSurface>
  );
}

function IntroMoodVisual() {
  return (
    <View style={{ flex: 1, padding: theme.spacing.lg }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: theme.spacing.xs,
        }}
      >
        {["Work", "Date", "Quiet", "Aesthetic"].map((label, index) => (
          <VibeChip key={label} label={label} selected={index === 0 || index === 3} />
        ))}
      </View>
      <View
        style={{
          position: "absolute",
          left: theme.spacing.lg,
          bottom: 28,
          width: 150,
        }}
      >
        <CafeImageCard title="Quiet corner" accent="latte" />
      </View>
      <View
        style={{
          position: "absolute",
          right: 24,
          bottom: 52,
          width: 150,
          transform: [{ rotate: "3deg" }],
        }}
      >
        <CafeImageCard title="Photo light" accent="terracotta" featured />
      </View>
    </View>
  );
}

function IntroSaveVisual() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: theme.spacing.xs,
        padding: theme.spacing.lg,
      }}
    >
      {[
        { title: "Work Spots", count: "12 cafes", accent: "latte" },
        { title: "Date Cafes", count: "8 cafes", accent: "olive" },
        { title: "Photo Walk", count: "6 cafes", accent: "terracotta" },
        { title: "Want to Try", count: "18 cafes", accent: "latte" },
      ].map((item, index) => (
        <View key={item.title} style={{ width: "48%" }}>
          <View
            style={{
              height: 136,
              overflow: "hidden",
              borderRadius: theme.radius.button,
              borderCurve: "continuous",
              backgroundColor:
                item.accent === "olive"
                  ? theme.colors.brand.oliveMatcha
                  : item.accent === "terracotta"
                    ? theme.colors.brand.terracotta
                    : theme.colors.brand.latteBeige,
            }}
          >
            {index === 1 ? (
              <View
                style={{
                  position: "absolute",
                  top: theme.spacing.xs,
                  right: theme.spacing.xs,
                  width: 26,
                  height: 26,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: theme.radius.photoPin,
                  backgroundColor: theme.colors.surface.cardCream,
                }}
              >
                <Image
                  source="sf:heart.fill"
                  style={{
                    width: 12,
                    height: 12,
                    tintColor: theme.colors.brand.terracotta,
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

type ActionButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  onPress: () => void;
};

function ActionButton({
  label,
  variant = "primary",
  onPress,
}: ActionButtonProps) {
  const primary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 52,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.button,
        borderCurve: "continuous",
        borderWidth: primary ? 0 : 1.5,
        borderColor: theme.colors.surface.borderStrong,
        backgroundColor: primary
          ? pressed
            ? theme.colors.text.espresso700
            : theme.colors.text.espresso900
          : pressed
            ? theme.colors.surface.pressed
            : "transparent",
        boxShadow: primary ? theme.shadows.button : undefined,
      })}
    >
      <Text
        style={{
          ...theme.typography.bodySmall,
          fontFamily: theme.fonts.family.sansSemibold,
          color: primary
            ? theme.colors.background.cream50
            : theme.colors.text.espresso900,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type PageDotsProps = {
  current: number;
  total: number;
};

function PageDots({ current, total }: PageDotsProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 7,
        marginBottom: theme.spacing.screen,
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={{
            width: index === current ? 20 : 7,
            height: 7,
            borderRadius: theme.radius.chip,
            backgroundColor:
              index === current
                ? theme.colors.text.espresso900
                : theme.colors.surface.borderStrong,
          }}
        />
      ))}
    </View>
  );
}
