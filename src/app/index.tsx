import { ScrollView, Text, View } from "react-native";

import {
  AISummaryCard,
  CafeButton,
  CafeImageCard,
  CollectionCard,
  EmptyStateCard,
  FilterRow,
  IconButton,
  LoadingSkeleton,
  RouteStopCard,
  SearchBar,
  ScoreBadge,
  VibeChip,
} from "@/components/ui";
import { theme } from "@/constants/theme";

const vibes = ["Work", "Date", "Quiet", "Aesthetic"];

export default function Index() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background.cream50 }}
      contentContainerStyle={{
        flexGrow: 1,
        gap: theme.spacing.lg,
        padding: theme.spacing.screen,
        paddingTop: theme.spacing.xxxl,
        paddingBottom: theme.spacing.xxxl,
      }}
    >
      <View style={{ gap: theme.spacing.sm }}>
        <Text
          selectable
          style={{
            ...theme.typography.caption,
            color: theme.colors.brand.terracotta,
            textTransform: "uppercase",
          }}
        >
          Core UI Kit
        </Text>
        <Text
          selectable
          style={{
            ...theme.typography.display,
            color: theme.colors.text.espresso900,
          }}
        >
          CafeMood Map
        </Text>
        <Text
          selectable
          style={{
            ...theme.typography.body,
            color: theme.colors.text.muted,
          }}
        >
          Reusable components for discovering cafes by vibe.
        </Text>
      </View>

      <View style={{ gap: theme.spacing.sm }}>
        <SearchBar />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs,
          }}
        >
          {vibes.map((vibe, index) => (
            <VibeChip key={vibe} label={vibe} selected={index === 0} />
          ))}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        <CafeButton label="Primary Button" />
        <CafeButton label="Secondary Button" variant="secondary" />
        <CafeButton label="Disabled" disabled />
        <IconButton symbol="sf:heart" label="Save cafe" />
        <IconButton symbol="sf:square.and.arrow.up" label="Share cafe" />
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: theme.spacing.xs,
        }}
      >
        <ScoreBadge label="Great" score="9.2" tone="great" />
        <ScoreBadge label="Good" score="8.4" tone="good" />
        <ScoreBadge label="Crowded" score="7.1" tone="crowded" />
      </View>

      <AISummaryCard>
        Bright, plant-filled corner spot with warm service, strong latte, and
        quiet tables before 11am.
      </AISummaryCard>

      <View style={{ gap: theme.spacing.md }}>
        <CafeImageCard
          title="Mostra Coffee"
          meta="North Park · Open now"
          featured
        />
        <CollectionCard title="Weekend coffee walks" count="6 saved cafes" />
      </View>

      <FilterRow
        label="Mood levels"
        hint="tune the map"
        options={["Quiet", "Cozy", "Bright", "Outdoor"]}
        selected="Cozy"
      />

      <View style={{ gap: theme.spacing.xs }}>
        <RouteStopCard index={1} name="Mostra Coffee" tag="Start · work mood" />
        <RouteStopCard
          index={2}
          name="Communal Coffee"
          tag="15 min walk · photos"
          isLast
        />
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <EmptyStateCard
          title="No saved cafes"
          copy="Your coffee map starts with one save. Tap a heart on any cafe."
          cta="Explore the map"
          tone="saved"
        />
        <LoadingSkeleton title="AI recommendation" hint="Reading the room..." />
      </View>
    </ScrollView>
  );
}
