import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CheckmarkWhiteIcon,
  CloseXIcon,
  DiscountTagIcon,
  PopularityIcon,
  PriceArrowIcon,
  RelevanceIcon,
} from '../../assets/icons/searchscreen';
import { colors, radius, spacing, typography } from '../../theme';
import { SORT_OPTIONS, type SortOption } from '../../data/search';

interface SortSheetProps {
  visible: boolean;
  value: SortOption;
  onSelect: (option: SortOption) => void;
  onClose: () => void;
}

const ICONS: Record<SortOption, React.ReactNode> = {
  relevance: <RelevanceIcon width={20} height={20} />,
  priceLowHigh: (
    <View style={{ transform: [{ rotate: '180deg' }] }}>
      <PriceArrowIcon width={20} height={21.6} />
    </View>
  ),
  priceHighLow: <PriceArrowIcon width={20} height={21.6} />,
  discount: <DiscountTagIcon width={20} height={19.2} />,
  popularity: <PopularityIcon width={20} height={19.3} />,
};

export function SortSheet({ visible, value, onSelect, onClose }: SortSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sort by</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <CloseXIcon width={20} height={20} />
          </Pressable>
        </View>

        <View style={styles.list}>
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.id === value;
            return (
              <Pressable
                key={option.id}
                style={styles.row}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
              >
                <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>{ICONS[option.id]}</View>
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, isSelected && styles.rowTitleSelected]}>{option.title}</Text>
                  <Text style={styles.rowSubtitle}>{option.subtitle}</Text>
                </View>
                {isSelected ? (
                  <View style={styles.checkCircle}>
                    <CheckmarkWhiteIcon width={12} height={12} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
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
    paddingBottom: spacing.xxxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
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
  list: {
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.surfaceAlt,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(240,253,244,0.81)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: colors.background.greenTint,
    borderWidth: 1.5,
    borderColor: colors.border.green,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    ...typography.buttonMedium,
    fontSize: 15,
    lineHeight: 22.5,
    color: '#111827',
  },
  rowTitleSelected: {
    color: colors.brand.primary,
  },
  rowSubtitle: {
    ...typography.caption,
    color: colors.text.subtle,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
