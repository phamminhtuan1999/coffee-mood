import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#2D1B12",
    background: "#FAF6F1",
    tint: "#8B5E3C",
    muted: "#9C8578",
    surface: "#FFFFFF",
  },
  dark: {
    text: "#F0E8E1",
    background: "#1A120D",
    tint: "#C99B72",
    muted: "#8A7A6F",
    surface: "#261C15",
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export const Fonts = Platform.select({
  ios: { sans: "system-ui", serif: "ui-serif", mono: "ui-monospace" },
  default: { sans: "normal", serif: "serif", mono: "monospace" },
});
