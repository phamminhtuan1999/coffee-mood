import { View } from "react-native";
import type { ReactNode } from "react";

import { theme } from "@/constants/theme";

type MapPreviewSurfaceProps = {
  children: ReactNode;
};

export function MapPreviewSurface({ children }: MapPreviewSurfaceProps) {
  return (
    <View
      style={{
        flex: 1,
        overflow: "hidden",
        backgroundColor: theme.colors.map.land,
      }}
    >
      <View
        style={{
          position: "absolute",
          left: -80,
          top: 92,
          width: 560,
          height: 84,
          borderRadius: theme.radius.chip,
          backgroundColor: theme.colors.map.water,
          transform: [{ rotate: "-18deg" }],
          opacity: 0.36,
        }}
      />
      <View
        style={{
          position: "absolute",
          right: -48,
          top: 174,
          width: 180,
          height: 138,
          borderRadius: theme.radius.card,
          backgroundColor: theme.colors.map.park,
          opacity: 0.64,
          transform: [{ rotate: "8deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          left: -40,
          bottom: 184,
          width: 180,
          height: 126,
          borderRadius: theme.radius.card,
          backgroundColor: theme.colors.map.park,
          opacity: 0.52,
          transform: [{ rotate: "-10deg" }],
        }}
      />
      {[
        { top: 126, left: -28, width: 470, rotate: "-12deg" },
        { top: 238, left: -34, width: 470, rotate: "18deg" },
        { top: 376, left: -40, width: 500, rotate: "-25deg" },
        { top: 72, left: 142, width: 470, rotate: "74deg" },
        { top: 18, left: 272, width: 470, rotate: "88deg" },
      ].map((road) => (
        <View
          key={`${road.top}-${road.left}-${road.rotate}`}
          style={{
            position: "absolute",
            top: road.top,
            left: road.left,
            width: road.width,
            height: 18,
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.map.road,
            transform: [{ rotate: road.rotate }],
            opacity: 0.62,
          }}
        />
      ))}
      {[
        { top: 114, left: 60 },
        { top: 214, left: 212 },
        { top: 318, left: 104 },
        { top: 406, left: 278 },
      ].map((dot) => (
        <View
          key={`${dot.top}-${dot.left}`}
          style={{
            position: "absolute",
            top: dot.top,
            left: dot.left,
            width: 5,
            height: 5,
            borderRadius: theme.radius.photoPin,
            backgroundColor: theme.colors.map.label,
            opacity: 0.28,
          }}
        />
      ))}
      <View
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: theme.colors.surface.glassCream,
          opacity: 0.24,
        }}
      />
      {children}
    </View>
  );
}
