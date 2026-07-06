import { Text, View } from "react-native";

import { PreferenceChip } from "@/components/ui/chip";
import { theme } from "@/constants/theme";

type FilterRowProps = {
  label: string;
  hint: string;
  options: string[];
  selected: string;
};

export function FilterRow({ label, hint, options, selected }: FilterRowProps) {
  return (
    <View
      style={{
        gap: theme.spacing.sm,
        padding: theme.spacing.md,
        borderRadius: theme.spacing.screen,
        borderCurve: "continuous",
        borderColor: theme.colors.surface.borderSoft,
        borderWidth: 1,
        backgroundColor: theme.colors.surface.cardCream,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: theme.spacing.sm,
        }}
      >
        <Text
          selectable
          style={{
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.family.sansSemibold,
            color: theme.colors.text.espresso900,
          }}
        >
          {label}
        </Text>
        <Text
          selectable
          style={{
            ...theme.typography.caption,
            color: theme.colors.text.muted,
          }}
        >
          {hint}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: theme.spacing.xs,
        }}
      >
        {options.map((option) => (
          <PreferenceChip
            key={option}
            label={option}
            selected={option === selected}
          />
        ))}
      </View>
    </View>
  );
}
