import { Text, View } from "react-native";

import { theme } from "@/constants/theme";

// Compact route map for the route detail screen. react-native-svg is not a
// dependency, so the dashed route line is approximated with thin connector
// Views computed between fixed pin coordinates (design E2 viewBox 346x176).

// Pin coordinates use the design E2 viewBox width (346); a slightly narrower
// device just crops the right margin harmlessly.
const CANVAS_HEIGHT = 176;
const PIN_SIZE = 28;

// Pin centres along the curated arc; the first `stopCount` are drawn.
const PIN_CENTERS: { x: number; y: number }[] = [
  { x: 52, y: 128 },
  { x: 150, y: 56 },
  { x: 246, y: 100 },
  { x: 306, y: 48 },
];

const PIN_COLORS = [
  theme.colors.text.espresso900,
  theme.colors.brand.terracotta,
  theme.colors.brand.oliveMatcha,
  theme.colors.brand.roastedBrown,
];

type Connector = { x: number; y: number; length: number; angle: number };

function connectorsFor(count: number): Connector[] {
  const connectors: Connector[] = [];

  for (let index = 0; index < count - 1; index += 1) {
    const from = PIN_CENTERS[index];
    const to = PIN_CENTERS[index + 1];
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    connectors.push({
      x: from.x,
      y: from.y,
      length: Math.sqrt(dx * dx + dy * dy),
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    });
  }

  return connectors;
}

type RouteMapPreviewProps = {
  stopCount: number;
};

export function RouteMapPreview({ stopCount }: RouteMapPreviewProps) {
  const count = Math.min(PIN_CENTERS.length, Math.max(2, stopCount));
  const connectors = connectorsFor(count);

  return (
    <View
      accessibilityLabel={`Route map with ${count} stops`}
      style={{
        height: CANVAS_HEIGHT,
        borderRadius: theme.radius.card,
        borderCurve: "continuous",
        overflow: "hidden",
        backgroundColor: theme.colors.background.warmPaper,
      }}
    >
      {/* Faint street grid. */}
      {[0, 1, 2].map((row) => (
        <View
          key={`h-${row}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 44 * (row + 1),
            height: 1,
            backgroundColor: theme.colors.surface.borderSoft,
          }}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((col) => (
        <View
          key={`v-${col}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 52 * (col + 1),
            width: 1,
            backgroundColor: theme.colors.surface.borderSoft,
          }}
        />
      ))}

      {connectors.map((connector, index) => (
        <View
          key={`c-${index}`}
          style={{
            position: "absolute",
            left: connector.x,
            top: connector.y - 1.25,
            width: connector.length,
            height: 2.5,
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.brand.terracotta,
            opacity: 0.7,
            transformOrigin: "left center",
            transform: [{ rotate: `${connector.angle}deg` }],
          }}
        />
      ))}

      {PIN_CENTERS.slice(0, count).map((center, index) => (
        <View
          key={`p-${index}`}
          style={{
            position: "absolute",
            left: center.x - PIN_SIZE / 2,
            top: center.y - PIN_SIZE / 2,
            width: PIN_SIZE,
            height: PIN_SIZE,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.photoPin,
            borderWidth: 3,
            borderColor: theme.colors.background.cream50,
            backgroundColor: PIN_COLORS[index],
            boxShadow: theme.shadows.pin,
          }}
        >
          <Text
            style={{
              ...theme.typography.caption,
              fontSize: 12,
              fontFamily: theme.fonts.family.sansBold,
              color: theme.colors.background.cream50,
            }}
          >
            {index + 1}
          </Text>
        </View>
      ))}
    </View>
  );
}
