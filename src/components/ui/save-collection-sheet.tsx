import { Image } from "expo-image";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import { collectionSwatch, SAVE_NOTE_PLACEHOLDER } from "@/data/collections";
import type { CollectionTone } from "@/data/collections";

export type SaveCollectionOption = {
  id: string;
  name: string;
  tone: CollectionTone;
  count: number;
};

type SaveCollectionSheetProps = {
  cafeName: string;
  collections: SaveCollectionOption[];
  selectedIds: string[];
  note: string;
  onToggleCollection: (id: string) => void;
  onChangeNote: (text: string) => void;
  onCreateNew: () => void;
  onCancel: () => void;
  onSave: () => void;
};

export function SaveCollectionSheet({
  cafeName,
  collections,
  selectedIds,
  note,
  onToggleCollection,
  onChangeNote,
  onCreateNew,
  onCancel,
  onSave,
}: SaveCollectionSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      accessibilityViewIsModal
      style={{
        position: "absolute",
        inset: 0,
        justifyContent: "flex-end",
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss save sheet"
        onPress={onCancel}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: theme.colors.surface.overlayDark,
        }}
      />
      <View
        style={{
          borderTopLeftRadius: theme.radius.bottomSheetTop,
          borderTopRightRadius: theme.radius.bottomSheetTop,
          borderCurve: "continuous",
          backgroundColor: theme.colors.background.cream50,
          paddingHorizontal: theme.spacing.lg - 2,
          paddingTop: theme.spacing.sm + 2,
          paddingBottom: Math.max(insets.bottom, theme.spacing.md) + theme.spacing.lg,
          boxShadow: theme.shadows.card,
        }}
      >
        <View
          style={{
            width: 36,
            height: 4,
            alignSelf: "center",
            borderRadius: theme.radius.chip,
            backgroundColor: theme.colors.surface.borderStrong,
            marginBottom: theme.spacing.md,
          }}
        />
        <Text
          style={{
            fontFamily: theme.fonts.family.serifSemibold,
            fontSize: 21,
            lineHeight: 27,
            color: theme.colors.text.espresso900,
          }}
        >
          Save {cafeName}
        </Text>
        <Text
          style={{
            ...theme.typography.caption,
            marginTop: theme.spacing.xxs,
            color: theme.colors.text.muted,
          }}
        >
          Choose a collection
        </Text>

        <ScrollView
          style={{ marginTop: theme.spacing.md }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: theme.spacing.xs + 1 }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: theme.spacing.xs + 1,
            }}
          >
            {collections.map((collection) => {
              const selected = selectedIds.includes(collection.id);

              return (
                <Pressable
                  key={collection.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${collection.name}, ${collection.count} saved`}
                  onPress={() => onToggleCollection(collection.id)}
                  style={{
                    width: "48%",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                    paddingHorizontal: theme.spacing.sm,
                    paddingVertical: theme.spacing.sm - 1,
                    borderRadius: theme.radius.button - 2,
                    borderCurve: "continuous",
                    borderWidth: 1.5,
                    borderColor: selected
                      ? theme.colors.brand.terracotta
                      : theme.colors.surface.borderSoft,
                    backgroundColor: selected
                      ? theme.colors.surface.positiveSoft
                      : theme.colors.surface.cardCream,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: theme.spacing.xs + 2,
                      backgroundColor: collectionSwatch[collection.tone],
                    }}
                  />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...theme.typography.caption,
                        fontFamily: theme.fonts.family.sansSemibold,
                        color: theme.colors.text.espresso900,
                      }}
                    >
                      {collection.name}
                    </Text>
                    <Text
                      style={{
                        ...theme.typography.caption,
                        fontSize: 10,
                        lineHeight: 13,
                        marginTop: 1,
                        color: theme.colors.text.muted,
                      }}
                    >
                      {collection.count} saved
                    </Text>
                  </View>
                  <SelectIndicator selected={selected} />
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create new collection"
            onPress={onCreateNew}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs + 2,
              paddingHorizontal: theme.spacing.sm + 2,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.radius.button - 2,
              borderCurve: "continuous",
              borderWidth: 1.5,
              borderStyle: "dashed",
              borderColor: theme.colors.surface.borderStrong,
            }}
          >
            <View
              style={{
                width: 26,
                height: 26,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: theme.radius.photoPin,
                backgroundColor: theme.colors.surface.pressed,
              }}
            >
              <Image
                source="sf:plus"
                style={{
                  width: 13,
                  height: 13,
                  tintColor: theme.colors.text.espresso700,
                }}
              />
            </View>
            <Text
              style={{
                ...theme.typography.chipLabel,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.text.espresso700,
              }}
            >
              Create new collection
            </Text>
          </Pressable>

          <View
            style={{
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.radius.button - 2,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: theme.colors.surface.borderMedium,
              backgroundColor: theme.colors.surface.cardCream,
            }}
          >
            <Text
              style={{
                ...theme.typography.caption,
                fontSize: 10,
                lineHeight: 13,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.text.muted,
              }}
            >
              Private note
            </Text>
            <TextInput
              value={note}
              onChangeText={onChangeNote}
              placeholder={SAVE_NOTE_PLACEHOLDER}
              placeholderTextColor={theme.colors.surface.disabledText}
              accessibilityLabel="Private note"
              multiline
              style={{
                ...theme.typography.bodySmall,
                fontSize: 13,
                marginTop: theme.spacing.xxs,
                padding: 0,
                color: theme.colors.text.espresso900,
              }}
            />
          </View>
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.xs + 2,
            marginTop: theme.spacing.md,
          }}
        >
          <Pressable
            accessibilityRole="button"
            onPress={onCancel}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: theme.sizing.control,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.button,
              borderCurve: "continuous",
              borderWidth: 1.5,
              borderColor: theme.colors.surface.borderStrong,
              backgroundColor: pressed
                ? theme.colors.surface.pressed
                : "transparent",
            })}
          >
            <Text
              style={{
                ...theme.typography.chipLabel,
                fontSize: 14,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.text.espresso900,
              }}
            >
              Cancel
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save cafe to collections"
            onPress={onSave}
            style={({ pressed }) => ({
              flex: 2,
              minHeight: theme.sizing.control,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.button,
              borderCurve: "continuous",
              backgroundColor: pressed
                ? theme.colors.text.espresso700
                : theme.colors.text.espresso900,
              boxShadow: theme.shadows.button,
            })}
          >
            <Text
              style={{
                ...theme.typography.chipLabel,
                fontSize: 14,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.background.cream50,
              }}
            >
              Save Cafe
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type SelectIndicatorProps = {
  selected: boolean;
};

function SelectIndicator({ selected }: SelectIndicatorProps) {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.photoPin,
        borderWidth: selected ? 0 : 1.5,
        borderColor: theme.colors.surface.borderStrong,
        backgroundColor: selected ? theme.colors.brand.terracotta : "transparent",
      }}
    >
      {selected ? (
        <Image
          source="sf:checkmark"
          style={{
            width: 11,
            height: 11,
            tintColor: theme.colors.background.cream50,
          }}
        />
      ) : null}
    </View>
  );
}
