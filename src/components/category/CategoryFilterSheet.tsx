import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import {
  DEFAULT_CATEGORY_FILTERS,
  MIN_DISCOUNT_OPTIONS,
  PRICE_RANGES,
  type CategoryFilterState,
} from '../../data/categories';

interface CategoryFilterSheetProps {
  visible: boolean;
  filters: CategoryFilterState;
  onApply: (filters: CategoryFilterState) => void;
  onClose: () => void;
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function CategoryFilterSheet({ visible, filters, onApply, onClose }: CategoryFilterSheetProps) {
  const [draft, setDraft] = useState<CategoryFilterState>(filters);

  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible, filters]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filters</Text>
          <Pressable onPress={() => setDraft(DEFAULT_CATEGORY_FILTERS)} hitSlop={8}>
            <Text style={styles.clearAll}>Clear all</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.chipWrap}>
            {PRICE_RANGES.map((range) => (
              <Chip
                key={range.label}
                label={range.label}
                active={draft.priceRangeLabel === range.label}
                onPress={() =>
                  setDraft((prev) => ({
                    ...prev,
                    priceRangeLabel: prev.priceRangeLabel === range.label ? null : range.label,
                  }))
                }
              />
            ))}
          </View>

          <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Min. Discount</Text>
          <View style={styles.chipWrap}>
            {MIN_DISCOUNT_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={option}
                active={draft.minDiscountLabel === option}
                onPress={() => setDraft((prev) => ({ ...prev, minDiscountLabel: option }))}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={styles.applyButton}
            onPress={() => {
              onApply(draft);
              onClose();
            }}
          >
            <Text style={styles.applyText}>Apply Filters</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.background.screen,
    borderTopLeftRadius: radius.lg + 4,
    borderTopRightRadius: radius.lg + 4,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.surfaceAlt,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 18,
    lineHeight: 27,
    color: colors.text.heading,
  },
  clearAll: {
    ...typography.buttonMedium,
    fontSize: 14,
    lineHeight: 21,
    color: colors.brand.primary,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.buttonMedium,
    fontSize: 15,
    lineHeight: 22.5,
    color: '#1E2939',
  },
  sectionSpacing: {
    marginTop: spacing.xl,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    backgroundColor: colors.background.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  chipText: {
    ...typography.captionMedium,
    fontSize: 13,
    color: colors.text.buttonNeutral,
  },
  chipTextActive: {
    color: colors.text.onBrand,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  applyButton: {
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  applyText: {
    ...typography.buttonLargeBold,
    color: colors.text.onBrand,
  },
});
