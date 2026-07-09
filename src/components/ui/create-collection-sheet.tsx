import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import {
  CREATE_DESCRIPTION_PLACEHOLDER,
  CREATE_NAME_PLACEHOLDER,
  SUGGESTED_COLLECTION_NAMES,
} from "@/data/collections";
import type { CollectionPrivacy } from "@/utils/saved-store";

type CreateCollectionSheetProps = {
  name: string;
  description: string;
  privacy: CollectionPrivacy;
  onChangeName: (text: string) => void;
  onChangeDescription: (text: string) => void;
  onPickSuggested: (name: string) => void;
  onTogglePrivacy: () => void;
  onCancel: () => void;
  onCreate: () => void;
};

export function CreateCollectionSheet({
  name,
  description,
  privacy,
  onChangeName,
  onChangeDescription,
  onPickSuggested,
  onTogglePrivacy,
  onCancel,
  onCreate,
}: CreateCollectionSheetProps) {
  const insets = useSafeAreaInsets();
  const isPrivate = privacy === "private";
  const canCreate = name.trim().length > 0;

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
        accessibilityLabel="Dismiss create collection sheet"
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
          New collection
        </Text>
        <Text
          style={{
            ...theme.typography.caption,
            marginTop: theme.spacing.xxs,
            color: theme.colors.text.muted,
          }}
        >
          Name it after the mood, not the map.
        </Text>

        <Field label="Name">
          <TextInput
            value={name}
            onChangeText={onChangeName}
            placeholder={CREATE_NAME_PLACEHOLDER}
            placeholderTextColor={theme.colors.surface.disabledText}
            accessibilityLabel="Collection name"
            style={{
              ...theme.typography.bodySmall,
              fontSize: 15,
              marginTop: theme.spacing.xxs,
              padding: 0,
              fontFamily: theme.fonts.family.sansSemibold,
              color: theme.colors.text.espresso900,
            }}
          />
        </Field>

        <Field label="Description · optional">
          <TextInput
            value={description}
            onChangeText={onChangeDescription}
            placeholder={CREATE_DESCRIPTION_PLACEHOLDER}
            placeholderTextColor={theme.colors.surface.disabledText}
            accessibilityLabel="Collection description"
            multiline
            style={{
              ...theme.typography.bodySmall,
              fontSize: 13,
              marginTop: theme.spacing.xxs,
              padding: 0,
              color: theme.colors.text.espresso900,
            }}
          />
        </Field>

        <Text
          style={{
            ...theme.typography.caption,
            fontFamily: theme.fonts.family.sansBold,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginTop: theme.spacing.md,
            color: theme.colors.text.muted,
          }}
        >
          Suggested names
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs,
            marginTop: theme.spacing.xs + 2,
          }}
        >
          {SUGGESTED_COLLECTION_NAMES.map((suggested) => (
            <Pressable
              key={suggested}
              accessibilityRole="button"
              accessibilityLabel={`Use suggested name ${suggested}`}
              onPress={() => onPickSuggested(suggested)}
              style={({ pressed }) => ({
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.xs + 1,
                borderRadius: theme.radius.chip,
                opacity: pressed ? 0.7 : 1,
                backgroundColor: theme.colors.surface.latteSoft,
              })}
            >
              <Text
                style={{
                  ...theme.typography.caption,
                  color: theme.colors.text.espresso700,
                }}
              >
                {suggested}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="switch"
          accessibilityLabel="Collection privacy"
          accessibilityState={{ checked: isPrivate }}
          onPress={onTogglePrivacy}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: theme.spacing.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radius.button - 2,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: theme.colors.surface.borderMedium,
            backgroundColor: theme.colors.surface.cardCream,
          }}
        >
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={{
                ...theme.typography.chipLabel,
                fontFamily: theme.fonts.family.sansSemibold,
                color: theme.colors.text.espresso900,
              }}
            >
              {isPrivate ? "Private collection" : "Public collection"}
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                marginTop: 2,
                color: theme.colors.text.muted,
              }}
            >
              {isPrivate
                ? "Only you can see this"
                : "Anyone with the link can view"}
            </Text>
          </View>
          <View
            style={{
              width: 46,
              height: 28,
              borderRadius: theme.radius.chip,
              padding: 3,
              justifyContent: "center",
              alignItems: isPrivate ? "flex-start" : "flex-end",
              backgroundColor: isPrivate
                ? theme.colors.surface.borderStrong
                : theme.colors.brand.oliveMatcha,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: theme.radius.photoPin,
                backgroundColor: theme.colors.background.cream50,
              }}
            />
          </View>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.xs + 2,
            marginTop: theme.spacing.lg,
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
            accessibilityLabel="Create Collection"
            accessibilityState={{ disabled: !canCreate }}
            disabled={!canCreate}
            onPress={onCreate}
            style={({ pressed }) => ({
              flex: 2,
              minHeight: theme.sizing.control,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radius.button,
              borderCurve: "continuous",
              backgroundColor: !canCreate
                ? theme.colors.surface.disabled
                : pressed
                  ? theme.colors.text.espresso700
                  : theme.colors.text.espresso900,
              boxShadow: canCreate ? theme.shadows.button : undefined,
            })}
          >
            <Text
              style={{
                ...theme.typography.chipLabel,
                fontSize: 14,
                fontFamily: theme.fonts.family.sansSemibold,
                color: canCreate
                  ? theme.colors.background.cream50
                  : theme.colors.surface.disabledText,
              }}
            >
              Create Collection
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <View
      style={{
        marginTop: theme.spacing.md,
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
        {label}
      </Text>
      {children}
    </View>
  );
}
