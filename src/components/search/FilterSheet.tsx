import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckmarkWhiteIcon } from '../../assets/icons/searchscreen';
import { Toggle } from '../Toggle';
import { colors, radius, spacing, typography } from '../../theme';
import {
  DEFAULT_FILTERS,
  FILTER_BRANDS,
  MIN_DISCOUNT_OPTIONS,
  PRICE_RANGES,
  RESULT_CATEGORY_CHIPS,
  type FilterState,
} from '../../data/search';

interface FilterSheetProps {
  visible: boolean;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function FilterSheet({ visible, filters, onApply, onClose }: FilterSheetProps) {
  const [draft, setDraft] = useState<FilterState>(filters);

  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible, filters]);

  const toggleBrand = (brand: string) => {
    setDraft((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand) ? prev.brands.filter((b) => b !== brand) : [...prev.brands, brand],
    }));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filters</Text>
          <Pressable onPress={() => setDraft(DEFAULT_FILTERS)} hitSlop={8}>
            <Text style={styles.clearAll}>Clear all</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipWrap}>
            {RESULT_CATEGORY_CHIPS.map((category) => (
              <Chip
                key={category}
                label={category}
                active={draft.category === category}
                onPress={() => setDraft((prev) => ({ ...prev, category }))}
              />
            ))}
          </View>

          <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Price Range</Text>
          <Text style={styles.priceHint}>₹0 – ₹500+</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priceScroll}>
            <View style={styles.priceRow}>
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
          </ScrollView>

          <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Brand</Text>
          <View style={styles.brandList}>
            {FILTER_BRANDS.map((brand) => {
              const checked = draft.brands.includes(brand);
              return (
                <Pressable key={brand} style={styles.brandRow} onPress={() => toggleBrand(brand)}>
                  <Text style={styles.brandLabel}>{brand}</Text>
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked ? <CheckmarkWhiteIcon width={12} height={12} /> : null}
                  </View>
                </Pressable>
              );
            })}
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

          <View style={[styles.stockRow, styles.sectionSpacing]}>
            <View style={styles.stockText}>
              <Text style={styles.stockTitle}>In Stock Only</Text>
              <Text style={styles.stockSubtitle}>Hide unavailable products</Text>
            </View>
            <Toggle value={draft.inStockOnly} onValueChange={(next) => setDraft((prev) => ({ ...prev, inStockOnly: next }))} />
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
    maxHeight: '88%',
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
  priceHint: {
    ...typography.bodySmall,
    color: colors.text.subtle,
    marginTop: spacing.xxs,
  },
  priceScroll: {
    marginTop: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  brandList: {
    marginTop: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.surfaceAlt,
  },
  brandLabel: {
    ...typography.bodySmall,
    color: '#1E2939',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: colors.background.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.lg,
  },
  stockText: {
    flex: 1,
    minWidth: 0,
  },
  stockTitle: {
    ...typography.buttonMedium,
    fontSize: 15,
    lineHeight: 22.5,
    color: '#1E2939',
  },
  stockSubtitle: {
    ...typography.caption,
    color: colors.text.subtle,
    marginTop: 2,
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
