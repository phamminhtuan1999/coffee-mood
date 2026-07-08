import { Image } from "expo-image";
import { TextInput, View } from "react-native";

import { theme } from "@/constants/theme";

type SearchBarProps = {
  value?: string;
  placeholder?: string;
  focused?: boolean;
  filterLabel?: string;
};

export function SearchBar({
  value,
  placeholder = "Search cafes, vibes, or neighborhoods",
  focused = false,
  filterLabel = "Filters",
}: SearchBarProps) {
  return (
    <View
      style={{
        minHeight: theme.sizing.searchControl,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.xs,
        borderRadius: theme.radius.chip,
        borderWidth: focused ? 1.5 : 1,
        borderColor: focused
          ? theme.colors.text.espresso900
          : theme.colors.surface.borderMedium,
        backgroundColor: theme.colors.surface.cardCream,
      }}
    >
      <Image
        source="sf:magnifyingglass"
        style={{
          width: 15,
          height: 15,
          tintColor: focused
            ? theme.colors.text.espresso900
            : theme.colors.text.muted,
        }}
      />
      <TextInput
        accessibilityLabel="Search"
        editable={false}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.muted}
        value={value}
        style={{
          fontFamily: theme.typography.bodySmall.fontFamily,
          fontSize: theme.typography.bodySmall.fontSize,
          flex: 1,
          height: theme.sizing.searchControl,
          color: theme.colors.text.espresso900,
          includeFontPadding: false,
          paddingHorizontal: 0,
          paddingVertical: 0,
          textAlignVertical: "center",
        }}
      />
      <View
        accessibilityLabel={filterLabel}
        style={{
          width: 36,
          height: 36,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius.photoPin,
          backgroundColor: theme.colors.surface.pressed,
        }}
      >
        <Image
          source="sf:slider.horizontal.3"
          style={{
            width: 16,
            height: 16,
            tintColor: theme.colors.text.espresso700,
          }}
        />
      </View>
    </View>
  );
}
