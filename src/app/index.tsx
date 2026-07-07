import * as Location from "expo-location";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  TextInput,
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
import {
  AuthSession,
  AuthSessionProvider,
  loadAuthSession,
  saveAuthSession,
} from "@/utils/auth-session";
import {
  CafeType,
  DistancePreference,
  loadTasteProfile,
  PricePreference,
  saveTasteProfile,
  TastePriority,
  TasteProfile,
} from "@/utils/taste-profile";

type FirstRunStep =
  | "splash"
  | "welcome"
  | "intro"
  | "auth"
  | "email-auth"
  | "location-primer"
  | "manual-location"
  | "taste-onboarding"
  | "main-map";

type LocationSelection =
  | {
      kind: "current";
      label: "Current location";
    }
  | {
      kind: "manual";
      label: string;
      meta: string;
    };

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

const recentLocations = [
  { name: "North Park", meta: "Recent neighborhood" },
  { name: "La Jolla", meta: "Recent coastal search" },
] as const;

const popularNeighborhoods = [
  "San Diego",
  "Mira Mesa",
  "La Jolla",
  "North Park",
  "Convoy",
] as const;

const cafeTypeOptions: CafeType[] = [
  "Work / Study",
  "Aesthetic",
  "Date Spot",
  "Quiet",
  "Outdoor",
  "Specialty Coffee",
];

const priorityOptions: TastePriority[] = [
  "Wi-Fi",
  "Outlets",
  "Parking",
  "Low noise",
  "Good latte",
  "Photo spots",
];

const distanceOptions: DistancePreference[] = [
  "5 min",
  "10 min",
  "20 min",
  "Anywhere",
];

const priceOptions: PricePreference[] = ["$", "$$", "$$$"];

export default function Index() {
  const [authSession, setAuthSession] = useState<AuthSession | null>(() =>
    loadAuthSession(),
  );
  const [tasteProfile, setTasteProfile] = useState<TasteProfile | null>(() =>
    loadTasteProfile(),
  );
  const [step, setStep] = useState<FirstRunStep>(() =>
    tasteProfile ? "main-map" : authSession ? "location-primer" : "splash",
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [locationSelection, setLocationSelection] =
    useState<LocationSelection | null>(null);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const goToLocationPrimer = () => setStep("location-primer");
  const continueToTaste = (selection: LocationSelection) => {
    setLocationSelection(selection);
    setLocationNotice(null);
    setStep("taste-onboarding");
  };
  const completeTasteProfile = (profile: TasteProfile) => {
    saveTasteProfile(profile);
    setTasteProfile(profile);
    setStep("main-map");
  };
  const requestCurrentLocation = async () => {
    setIsRequestingLocation(true);
    setLocationNotice(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status === "granted") {
        continueToTaste({ kind: "current", label: "Current location" });
        return;
      }

      setLocationNotice(
        permission.canAskAgain
          ? "Location access was not granted. Choose a city or neighborhood instead."
          : "Location access is off in Settings. Choose a city or neighborhood instead.",
      );
      setStep("manual-location");
    } catch {
      setLocationNotice(
        "Location is unavailable right now. Choose a city or neighborhood instead.",
      );
      setStep("manual-location");
    } finally {
      setIsRequestingLocation(false);
    }
  };
  const continueWithSession = (
    provider: AuthSessionProvider,
    email?: string,
  ) => {
    const nextSession: AuthSession = {
      provider,
      email,
      createdAt: new Date().toISOString(),
    };

    saveAuthSession(nextSession);
    setAuthSession(nextSession);
    goToLocationPrimer();
  };

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
    return (
      <LocationPrimerScreen
        authSession={authSession}
        onUseCurrentLocation={requestCurrentLocation}
        onChooseManually={() => setStep("manual-location")}
        isRequestingLocation={isRequestingLocation}
      />
    );
  }

  if (step === "manual-location") {
    return (
      <ManualLocationScreen
        notice={locationNotice}
        onBack={goToLocationPrimer}
        onUseCurrentLocation={requestCurrentLocation}
        isRequestingLocation={isRequestingLocation}
        onChooseLocation={(location) =>
          continueToTaste({ kind: "manual", ...location })
        }
      />
    );
  }

  if (step === "taste-onboarding") {
    return (
      <TasteOnboardingScreen
        initialProfile={tasteProfile}
        onSkip={() =>
          completeTasteProfile({
            cafeTypes: [],
            priorities: [],
            distance: "10 min",
            price: "$$",
            skipped: true,
            updatedAt: new Date().toISOString(),
          })
        }
        onComplete={completeTasteProfile}
      />
    );
  }

  if (step === "main-map") {
    return (
      <MainMapHandoff
        profile={tasteProfile}
        selection={locationSelection}
        onEditTaste={() => setStep("taste-onboarding")}
      />
    );
  }

  if (step === "auth") {
    return (
      <AuthScreen
        onProvider={continueWithSession}
        onEmail={() => setStep("email-auth")}
        onGuest={() => continueWithSession("guest")}
      />
    );
  }

  if (step === "email-auth") {
    return (
      <EmailAuthScreen
        onBack={() => setStep("auth")}
        onContinue={(email) => continueWithSession("email", email)}
      />
    );
  }

  return (
    <FeatureIntroScreen
      slideIndex={slideIndex}
      onSkip={goToLocationPrimer}
      onContinue={() => {
        if (slideIndex === introSlides.length - 1) {
          setStep("auth");
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

type LocationPrimerScreenProps = {
  authSession: AuthSession | null;
  isRequestingLocation: boolean;
  onUseCurrentLocation: () => void;
  onChooseManually: () => void;
};

function LocationPrimerScreen({
  authSession,
  isRequestingLocation,
  onUseCurrentLocation,
  onChooseManually,
}: LocationPrimerScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        minHeight: 844,
        alignItems: "center",
        paddingHorizontal: 28,
        paddingTop: 104,
        paddingBottom: theme.spacing.xxl,
      }}
    >
      <WarmMapTexture />
      <LocationMapOrb />
      <Text
        style={{
          ...theme.typography.title,
          marginTop: theme.spacing.xl,
          color: theme.colors.text.espresso900,
          textAlign: "center",
        }}
      >
        Find cafes near you
      </Text>
      <Text
        style={{
          ...theme.typography.bodySmall,
          marginTop: theme.spacing.sm,
          color: theme.colors.text.muted,
          textAlign: "center",
        }}
      >
        We use your location to show nearby cafes and build routes. You can also
        choose a city manually.
      </Text>
      <View
        style={{
          alignSelf: "stretch",
          minHeight: theme.spacing.xxl,
          marginTop: theme.spacing.lg,
        }}
      >
        {authSession ? (
          <SessionPill label={authSessionLabel(authSession)} />
        ) : null}
      </View>
      <View style={{ flex: 1, minHeight: theme.spacing.xxl }} />
      <View
        style={{
          alignSelf: "stretch",
          gap: theme.spacing.xs,
          paddingBottom: theme.spacing.xxl,
        }}
      >
        <ActionButton
          label={isRequestingLocation ? "Opening Permission..." : "Use Current Location"}
          onPress={onUseCurrentLocation}
        />
        <Pressable
          accessibilityRole="button"
          onPress={onChooseManually}
          style={({ pressed }) => ({
            minHeight: 52,
            alignItems: "center",
            justifyContent: "center",
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
            Choose Manually
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

type ManualLocationScreenProps = {
  notice: string | null;
  isRequestingLocation: boolean;
  onBack: () => void;
  onUseCurrentLocation: () => void;
  onChooseLocation: (location: { label: string; meta: string }) => void;
};

function ManualLocationScreen({
  notice,
  isRequestingLocation,
  onBack,
  onUseCurrentLocation,
  onChooseLocation,
}: ManualLocationScreenProps) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const matchingNeighborhoods = popularNeighborhoods.filter((name) =>
    name.toLowerCase().includes(trimmedQuery.toLowerCase()),
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        minHeight: 844,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 62,
        paddingBottom: theme.spacing.xxl,
      }}
    >
      <WarmMapTexture />
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
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
          <Text
            style={{
              fontFamily: theme.fonts.family.sansSemibold,
              fontSize: 26,
              lineHeight: 30,
              color: theme.colors.text.espresso900,
            }}
          >
            ‹
          </Text>
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
            value={query}
            onChangeText={setQuery}
            placeholder="Search city or neighborhood"
            placeholderTextColor={theme.colors.text.muted}
            autoCapitalize="words"
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
      {notice ? (
        <View
          style={{
            marginTop: theme.spacing.lg,
            borderRadius: theme.radius.button,
            borderCurve: "continuous",
            backgroundColor: theme.colors.background.warmPaper,
            padding: theme.spacing.md,
          }}
        >
          <Text
            selectable
            style={{
              ...theme.typography.caption,
              color: theme.colors.text.muted,
            }}
          >
            {notice}
          </Text>
        </View>
      ) : null}
      <LocationSection title="Recent">
        {recentLocations.map((location) => (
          <LocationRow
            key={location.name}
            name={location.name}
            meta={location.meta}
            onPress={() =>
              onChooseLocation({ label: location.name, meta: location.meta })
            }
          />
        ))}
      </LocationSection>
      <LocationSection title="Popular neighborhoods">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.xs }}>
          {(trimmedQuery ? matchingNeighborhoods : popularNeighborhoods).map((name) => (
            <LocationChip
              key={name}
              label={name}
              onPress={() =>
                onChooseLocation({ label: name, meta: "Selected neighborhood" })
              }
            />
          ))}
          {trimmedQuery && matchingNeighborhoods.length === 0 ? (
            <LocationChip
              label={`Use "${trimmedQuery}"`}
              onPress={() =>
                onChooseLocation({
                  label: trimmedQuery,
                  meta: "Manual search location",
                })
              }
            />
          ) : null}
        </View>
      </LocationSection>
      <Pressable
        accessibilityRole="button"
        onPress={onUseCurrentLocation}
        style={({ pressed }) => ({
          minHeight: 52,
          alignItems: "center",
          justifyContent: "center",
          marginTop: theme.spacing.xl,
          opacity: pressed ? 0.72 : 1,
        })}
      >
        <Text
          style={{
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.family.sansSemibold,
            color: theme.colors.brand.roastedBrown,
          }}
        >
          {isRequestingLocation ? "Opening Permission..." : "Use current location"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

type TasteOnboardingScreenProps = {
  initialProfile: TasteProfile | null;
  onSkip: () => void;
  onComplete: (profile: TasteProfile) => void;
};

function TasteOnboardingScreen({
  initialProfile,
  onSkip,
  onComplete,
}: TasteOnboardingScreenProps) {
  const [cafeTypes, setCafeTypes] = useState<CafeType[]>(
    initialProfile?.cafeTypes.length ? initialProfile.cafeTypes : ["Work / Study"],
  );
  const [priorities, setPriorities] = useState<TastePriority[]>(
    initialProfile?.priorities.length ? initialProfile.priorities : ["Wi-Fi", "Good latte"],
  );
  const [distance, setDistance] = useState<DistancePreference>(
    initialProfile?.distance ?? "10 min",
  );
  const [price, setPrice] = useState<PricePreference>(initialProfile?.price ?? "$$");

  const selectedCount =
    cafeTypes.length + priorities.length + (distance ? 1 : 0) + (price ? 1 : 0);

  const toggleCafeType = (value: CafeType) =>
    setCafeTypes((current) => toggleSelection(current, value));
  const togglePriority = (value: TastePriority) =>
    setPriorities((current) => toggleSelection(current, value));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <WarmMapTexture />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: 76,
          paddingBottom: 150,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...theme.typography.caption,
                fontFamily: theme.fonts.family.sansBold,
                color: theme.colors.brand.terracotta,
                textTransform: "uppercase",
              }}
            >
              Your taste
            </Text>
            <Text
              style={{
                ...theme.typography.title,
                marginTop: theme.spacing.xs,
                color: theme.colors.text.espresso900,
              }}
            >
              Tell us how you cafe.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onSkip}
            style={({ pressed }) => ({
              minHeight: 42,
              justifyContent: "center",
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
        <TasteGroup title="What kind of cafe do you usually look for?">
          {cafeTypeOptions.map((option) => (
            <TasteChip
              key={option}
              label={option}
              selected={cafeTypes.includes(option)}
              onPress={() => toggleCafeType(option)}
            />
          ))}
        </TasteGroup>
        <TasteGroup title="What matters most?">
          {priorityOptions.map((option) => (
            <TasteChip
              key={option}
              label={option}
              selected={priorities.includes(option)}
              onPress={() => togglePriority(option)}
            />
          ))}
        </TasteGroup>
        <TasteGroup title="How far should we search?">
          {distanceOptions.map((option) => (
            <TasteChip
              key={option}
              label={option}
              selected={distance === option}
              onPress={() => setDistance(option)}
            />
          ))}
        </TasteGroup>
        <TasteGroup title="Preferred price?">
          {priceOptions.map((option) => (
            <TasteChip
              key={option}
              label={option}
              selected={price === option}
              onPress={() => setPrice(option)}
            />
          ))}
        </TasteGroup>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.lg,
          paddingBottom: 34,
          backgroundColor: theme.colors.background.cream50,
        }}
      >
        <Text
          style={{
            ...theme.typography.caption,
            marginBottom: theme.spacing.xs,
            color: theme.colors.text.muted,
            textAlign: "center",
          }}
        >
          {selectedCount} taste signals selected
        </Text>
        <ActionButton
          label="Build My Cafe Map"
          onPress={() =>
            onComplete({
              cafeTypes,
              priorities,
              distance,
              price,
              skipped: false,
              updatedAt: new Date().toISOString(),
            })
          }
        />
      </View>
    </View>
  );
}

type MainMapHandoffProps = {
  profile: TasteProfile | null;
  selection: LocationSelection | null;
  onEditTaste: () => void;
};

function MainMapHandoff({
  profile,
  selection,
  onEditTaste,
}: MainMapHandoffProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        minHeight: 844,
        paddingHorizontal: theme.spacing.screen,
        paddingTop: 72,
        paddingBottom: theme.spacing.xxl,
      }}
    >
      <WarmMapTexture />
      <View
        style={{
          height: 340,
          overflow: "hidden",
          borderRadius: theme.radius.imageCard,
          borderCurve: "continuous",
          backgroundColor: theme.colors.background.warmPaper,
        }}
      >
        <MapPreviewSurface>
          <View style={{ position: "absolute", top: 72, left: 60 }}>
            <PhotoMapPin label="Taste match cafe" score="9.1" selected tone="terracotta" />
          </View>
          <View style={{ position: "absolute", top: 156, right: 78 }}>
            <PhotoMapPin label="Quiet cafe" score="8.9" tone="latte" />
          </View>
          <View style={{ position: "absolute", bottom: 58, left: 110 }}>
            <PhotoMapPin label="Outdoor cafe" tone="olive" />
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
        Your cafe map is ready
      </Text>
      <Text
        style={{
          ...theme.typography.bodySmall,
          marginTop: theme.spacing.sm,
          color: theme.colors.text.muted,
        }}
      >
        We will tune discovery around your taste profile and selected area. The
        full main map arrives in US-008.
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
          Taste profile
        </Text>
        <Text
          style={{
            ...theme.typography.sectionTitle,
            marginTop: theme.spacing.xs,
            color: theme.colors.text.espresso900,
          }}
        >
          {profile?.skipped ? "Skipped for now" : tasteProfileSummary(profile)}
        </Text>
        <Text
          style={{
            ...theme.typography.caption,
            marginTop: theme.spacing.xs,
            color: theme.colors.text.muted,
          }}
        >
          {selection?.label ?? "Location can be set later"}
        </Text>
        {profile && !profile.skipped ? (
          <Text
            style={{
              ...theme.typography.caption,
              marginTop: theme.spacing.xs,
              color: theme.colors.text.muted,
            }}
          >
            {profile.distance} radius · {profile.price}
          </Text>
        ) : null}
      </View>
      <View style={{ flex: 1, minHeight: theme.spacing.xxxl }} />
      <ActionButton label="Edit Taste" variant="secondary" onPress={onEditTaste} />
    </ScrollView>
  );
}

type TasteGroupProps = {
  title: string;
  children: ReactNode;
};

function TasteGroup({ title, children }: TasteGroupProps) {
  return (
    <View style={{ marginTop: 30 }}>
      <Text
        style={{
          ...theme.typography.bodySmall,
          fontFamily: theme.fonts.family.sansSemibold,
          color: theme.colors.text.espresso900,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: theme.spacing.xs,
          marginTop: theme.spacing.sm,
        }}
      >
        {children}
      </View>
    </View>
  );
}

type TasteChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function TasteChip({ label, selected, onPress }: TasteChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 42,
        justifyContent: "center",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radius.chip,
        borderWidth: 1,
        borderColor: selected
          ? theme.colors.text.espresso900
          : theme.colors.surface.borderMedium,
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
          color: selected
            ? theme.colors.background.cream50
            : theme.colors.text.espresso700,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function toggleSelection<T>(current: T[], value: T): T[] {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }

  return [...current, value];
}

function tasteProfileSummary(profile: TasteProfile | null) {
  if (!profile || profile.skipped) {
    return "Open to anything";
  }

  const firstType = profile.cafeTypes[0] ?? "Cafe";
  const firstPriority = profile.priorities[0] ?? "Good latte";

  return `${firstType} · ${firstPriority}`;
}

function LocationMapOrb() {
  return (
    <View
      style={{
        width: 240,
        height: 240,
        overflow: "hidden",
        borderRadius: theme.radius.photoPin,
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.background.warmPaper,
      }}
    >
      <MapPreviewSurface>
        <View style={{ position: "absolute", top: 42, left: 52 }}>
          <PhotoMapPin label="Nearby cafe" tone="terracotta" />
        </View>
        <View style={{ position: "absolute", top: 108, left: 138 }}>
          <PhotoMapPin label="Nearby outdoor cafe" tone="olive" />
        </View>
        <View
          style={{
            position: "absolute",
            top: 150,
            left: 70,
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            backgroundColor: theme.colors.surface.borderStrong,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: theme.radius.photoPin,
              borderWidth: 2,
              borderColor: theme.colors.background.cream50,
              backgroundColor: theme.colors.text.espresso900,
            }}
          />
        </View>
      </MapPreviewSurface>
    </View>
  );
}

type SessionPillProps = {
  label: string;
};

function SessionPill({ label }: SessionPillProps) {
  return (
    <View
      style={{
        alignSelf: "center",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radius.chip,
        borderWidth: 1,
        borderColor: theme.colors.surface.borderSoft,
        backgroundColor: theme.colors.surface.cardCream,
      }}
    >
      <Text
        style={{
          ...theme.typography.caption,
          color: theme.colors.text.muted,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

type LocationSectionProps = {
  title: string;
  children: ReactNode;
};

function LocationSection({ title, children }: LocationSectionProps) {
  return (
    <View style={{ marginTop: theme.spacing.xl }}>
      <Text
        style={{
          ...theme.typography.caption,
          fontFamily: theme.fonts.family.sansBold,
          color: theme.colors.text.muted,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
      <View style={{ marginTop: theme.spacing.sm }}>{children}</View>
    </View>
  );
}

type LocationRowProps = {
  name: string;
  meta: string;
  onPress: () => void;
};

function LocationRow({ name, meta, onPress }: LocationRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 62,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surface.borderSoft,
        paddingVertical: theme.spacing.sm,
        opacity: pressed ? 0.72 : 1,
      })}
    >
      <View
        style={{
          width: 34,
          height: 34,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius.photoPin,
          backgroundColor: theme.colors.background.warmPaper,
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: theme.radius.photoPin,
            borderWidth: 2,
            borderColor: theme.colors.brand.roastedBrown,
          }}
        />
      </View>
      <View>
        <Text
          style={{
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.family.sansMedium,
            color: theme.colors.text.espresso900,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            ...theme.typography.caption,
            marginTop: 2,
            color: theme.colors.text.muted,
          }}
        >
          {meta}
        </Text>
      </View>
    </Pressable>
  );
}

type LocationChipProps = {
  label: string;
  onPress: () => void;
};

function LocationChip({ label, onPress }: LocationChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 42,
        justifyContent: "center",
        paddingHorizontal: theme.spacing.screen,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radius.chip,
        borderWidth: 1,
        borderColor: theme.colors.surface.borderMedium,
        backgroundColor: pressed
          ? theme.colors.surface.pressed
          : theme.colors.surface.cardCream,
      })}
    >
      <Text
        style={{
          ...theme.typography.bodySmall,
          fontFamily: theme.fonts.family.sansMedium,
          color: theme.colors.text.espresso700,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type AuthScreenProps = {
  onProvider: (provider: AuthSessionProvider) => void;
  onEmail: () => void;
  onGuest: () => void;
};

function AuthScreen({ onProvider, onEmail, onGuest }: AuthScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        minHeight: 844,
        paddingHorizontal: 28,
        paddingTop: 78,
        paddingBottom: theme.spacing.xxl,
      }}
    >
      <WarmMapTexture />
      <View style={{ alignItems: "center" }}>
        <BrandMark size={62} />
      </View>
      <View
        style={{
          minHeight: 260,
          justifyContent: "center",
          paddingVertical: theme.spacing.xl,
        }}
      >
        <Text
          style={{
            ...theme.typography.title,
            color: theme.colors.text.espresso900,
            textAlign: "center",
          }}
        >
          Save your cafe mood.
        </Text>
        <Text
          style={{
            ...theme.typography.bodySmall,
            marginTop: theme.spacing.xs,
            color: theme.colors.text.muted,
            textAlign: "center",
          }}
        >
          Sign in to keep collections, routes, and your taste profile. Or keep
          exploring - no pressure.
        </Text>
      </View>
      <View style={{ gap: theme.spacing.sm }}>
        <AuthOptionButton
          icon="sf:apple.logo"
          label="Continue with Apple"
          variant="dark"
          onPress={() => onProvider("apple")}
        />
        <AuthOptionButton
          icon="sf:g.circle.fill"
          label="Continue with Google"
          onPress={() => onProvider("google")}
        />
        <AuthOptionButton
          icon="sf:envelope.fill"
          label="Continue with Email"
          onPress={onEmail}
        />
      </View>
      <View style={{ flex: 1, minHeight: theme.spacing.lg }} />
      <Pressable
        accessibilityRole="button"
        onPress={onGuest}
        style={({ pressed }) => ({
          minHeight: 52,
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.md,
          opacity: pressed ? 0.72 : 1,
        })}
      >
        <Text
          style={{
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.family.sansSemibold,
            color: theme.colors.text.muted,
          }}
        >
          Continue as Guest
        </Text>
      </Pressable>
    </ScrollView>
  );
}

type EmailAuthScreenProps = {
  onBack: () => void;
  onContinue: (email: string) => void;
};

function EmailAuthScreen({ onBack, onContinue }: EmailAuthScreenProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    "Use a strong password to keep collections and taste profile synced later.",
  );

  const isSignIn = mode === "sign-in";
  const submitLabel = isSignIn ? "Sign In" : "Create Account";
  const title = isSignIn ? "Welcome back." : "Create your account.";
  const subtitle = isSignIn
    ? "Pick up your saved cafes and routes."
    : "Keep your cafe map, taste profile, and future routes together.";

  const handleSubmit = () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setMessage("Enter a valid email address to continue.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    onContinue(trimmedEmail);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        minHeight: 844,
        paddingHorizontal: 28,
        paddingTop: 62,
        paddingBottom: theme.spacing.xxl,
      }}
    >
      <WarmMapTexture />
      <View style={{ alignItems: "flex-start" }}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => ({
            minHeight: 42,
            justifyContent: "center",
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
            Back
          </Text>
        </Pressable>
      </View>
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
        <Text
          style={{
            ...theme.typography.title,
            color: theme.colors.text.espresso900,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            ...theme.typography.bodySmall,
            marginTop: theme.spacing.xs,
            color: theme.colors.text.muted,
          }}
        >
          {subtitle}
        </Text>
        <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          <AuthTextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
          />
          <AuthTextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="8+ characters"
          />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            setMessage("Password reset email will be enabled with Supabase Auth.")
          }
          style={({ pressed }) => ({
            alignItems: "center",
            paddingVertical: theme.spacing.sm,
            opacity: pressed ? 0.72 : 1,
          })}
        >
          <Text
            style={{
              ...theme.typography.caption,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.brand.roastedBrown,
            }}
          >
            Forgot password?
          </Text>
        </Pressable>
        <View
          style={{
            minHeight: 48,
            justifyContent: "center",
            borderRadius: theme.radius.button,
            borderCurve: "continuous",
            backgroundColor: theme.colors.background.warmPaper,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          }}
        >
          <Text
            selectable
            style={{
              ...theme.typography.caption,
              color: theme.colors.text.muted,
              textAlign: "center",
            }}
          >
            {message}
          </Text>
        </View>
        <View style={{ marginTop: theme.spacing.md }}>
          <ActionButton label={submitLabel} onPress={handleSubmit} />
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setMode(isSignIn ? "sign-up" : "sign-in");
          setMessage(
            isSignIn
              ? "Create an account with email and password."
              : "Sign in with your saved email and password.",
          );
        }}
        style={({ pressed }) => ({
          alignItems: "center",
          paddingVertical: theme.spacing.lg,
          opacity: pressed ? 0.72 : 1,
        })}
      >
        <Text
          style={{
            ...theme.typography.bodySmall,
            color: theme.colors.text.muted,
          }}
        >
          {isSignIn ? "New here? " : "Already have an account? "}
          <Text
            style={{
              fontFamily: theme.fonts.family.sansBold,
              color: theme.colors.brand.roastedBrown,
            }}
          >
            {isSignIn ? "Create account" : "Sign in"}
          </Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

type AuthOptionButtonProps = {
  icon: string;
  label: string;
  variant?: "light" | "dark";
  onPress: () => void;
};

function AuthOptionButton({
  icon,
  label,
  variant = "light",
  onPress,
}: AuthOptionButtonProps) {
  const dark = variant === "dark";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing.sm,
        borderRadius: theme.radius.button,
        borderCurve: "continuous",
        borderWidth: dark ? 0 : 1,
        borderColor: theme.colors.surface.borderMedium,
        backgroundColor: dark
          ? pressed
            ? theme.colors.text.espresso700
            : theme.colors.text.espresso900
          : pressed
            ? theme.colors.surface.pressed
            : theme.colors.surface.cardCream,
        boxShadow: dark ? theme.shadows.button : undefined,
      })}
    >
      <Image
        source={icon}
        style={{
          width: 18,
          height: 18,
          tintColor: dark
            ? theme.colors.background.cream50
            : theme.colors.text.espresso900,
        }}
      />
      <Text
        style={{
          ...theme.typography.bodySmall,
          fontFamily: theme.fonts.family.sansSemibold,
          color: dark
            ? theme.colors.background.cream50
            : theme.colors.text.espresso900,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type AuthTextFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
};

function AuthTextField({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry = false,
}: AuthTextFieldProps) {
  return (
    <View
      style={{
        gap: theme.spacing.xs,
        borderRadius: theme.radius.button,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.surface.borderMedium,
        backgroundColor: theme.colors.background.cream50,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
      }}
    >
      <Text
        style={{
          ...theme.typography.caption,
          fontFamily: theme.fonts.family.sansBold,
          color: theme.colors.text.muted,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.surface.disabledText}
        style={{
          ...theme.typography.body,
          minHeight: 32,
          color: theme.colors.text.espresso900,
          padding: 0,
        }}
      />
    </View>
  );
}

function authSessionLabel(session: AuthSession) {
  if (session.provider === "guest") {
    return "Guest session";
  }

  if (session.provider === "email" && session.email) {
    return session.email;
  }

  return `${session.provider[0].toUpperCase()}${session.provider.slice(1)} session`;
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
