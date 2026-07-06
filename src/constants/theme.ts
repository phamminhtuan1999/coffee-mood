import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
} from "@expo-google-fonts/playfair-display";

const fontFamily = {
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemibold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
  serifMedium: "PlayfairDisplay_500Medium",
  serifSemibold: "PlayfairDisplay_600SemiBold",
} as const;

export const theme = {
  colors: {
    background: {
      cream50: "#FAF7F0",
      cream100: "#F3EDE2",
      warmPaper: "#EFE6D8",
    },
    text: {
      espresso900: "#241A14",
      espresso700: "#4A352A",
      muted: "#7B6A5E",
    },
    brand: {
      roastedBrown: "#8A5A3C",
      latteBeige: "#D8BFA5",
      oliveMatcha: "#7D8B64",
      terracotta: "#C97955",
    },
    surface: {
      cardCream: "rgba(255, 252, 246, 0.88)",
      glassCream: "rgba(250, 247, 240, 0.72)",
      borderSoft: "rgba(36, 26, 20, 0.08)",
      borderMedium: "rgba(36, 26, 20, 0.12)",
      borderStrong: "rgba(36, 26, 20, 0.18)",
      pressed: "rgba(36, 26, 20, 0.04)",
      disabled: "#E2D9CB",
      disabledText: "#A69787",
      skeletonBase: "#EFE6D8",
      skeletonHighlight: "#F6F0E5",
      overlayDark: "rgba(36, 26, 20, 0.58)",
    },
    score: {
      great: "#6F8B5E",
      good: "#B88A44",
      crowded: "#C76E4F",
    },
    map: {
      road: "#D8BFA5",
      park: "#B9C2A4",
      water: "#CBD4CF",
      land: "#EFE6D8",
      label: "#7B6A5E",
    },
  },
  fonts: {
    assets: {
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
      PlayfairDisplay_500Medium,
      PlayfairDisplay_600SemiBold,
    },
    family: fontFamily,
  },
  typography: {
    display: {
      fontFamily: fontFamily.serifMedium,
      fontSize: 36,
      lineHeight: 42,
    },
    title: {
      fontFamily: fontFamily.serifMedium,
      fontSize: 28,
      lineHeight: 34,
    },
    sectionTitle: {
      fontFamily: fontFamily.sansSemibold,
      fontSize: 20,
      lineHeight: 26,
    },
    body: {
      fontFamily: fontFamily.sans,
      fontSize: 16,
      lineHeight: 24,
    },
    bodySmall: {
      fontFamily: fontFamily.sans,
      fontSize: 14,
      lineHeight: 21,
    },
    caption: {
      fontFamily: fontFamily.sansMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    scoreNumber: {
      fontFamily: fontFamily.sansSemibold,
      fontSize: 28,
      lineHeight: 34,
      fontVariant: ["tabular-nums"],
    },
    chipLabel: {
      fontFamily: fontFamily.sansMedium,
      fontSize: 13,
      lineHeight: 18,
    },
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    screen: 20,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 56,
  },
  radius: {
    chip: 999,
    button: 18,
    card: 24,
    imageCard: 28,
    bottomSheetTop: 32,
    photoPin: 999,
  },
  shadows: {
    card: "0 16px 40px rgba(36, 26, 20, 0.14)",
    pin: "0 8px 22px rgba(36, 26, 20, 0.20)",
    button: "0 6px 16px rgba(36, 26, 20, 0.10)",
  },
} as const;

export const Colors = {
  light: {
    text: theme.colors.text.espresso900,
    background: theme.colors.background.cream50,
    tint: theme.colors.brand.roastedBrown,
    muted: theme.colors.text.muted,
    surface: theme.colors.surface.cardCream,
    border: theme.colors.surface.borderSoft,
  },
  dark: {
    text: theme.colors.text.espresso900,
    background: theme.colors.background.cream50,
    tint: theme.colors.brand.roastedBrown,
    muted: theme.colors.text.muted,
    surface: theme.colors.surface.cardCream,
    border: theme.colors.surface.borderSoft,
  },
} as const;

export const Spacing = theme.spacing;
export const Fonts = theme.fonts.family;
export const Typography = theme.typography;
export const Radius = theme.radius;
export const Shadows = theme.shadows;
