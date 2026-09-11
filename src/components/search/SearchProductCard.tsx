import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import type { SearchProduct } from '../../data/search';

interface SearchProductCardProps {
  product: SearchProduct;
  onPress?: () => void;
  onAddPress?: () => void;
}

export function SearchProductCard({ product, onPress, onAddPress }: SearchProductCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={product.image} style={styles.image} resizeMode="cover" />
        {product.discountPercent > 0 ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discountPercent}%</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.weight}>{product.weight}</Text>
        <View style={styles.etaRow}>
          <View style={styles.etaDot} />
          <Text style={styles.etaText}>{product.deliveryMins} mins</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.mrp}>₹{product.originalPrice}</Text>
          {product.discountPercent > 0 ? <Text style={styles.discountLabel}>{product.discountPercent}% off</Text> : null}
        </View>
      </View>

      <Pressable style={styles.addButton} onPress={onAddPress} hitSlop={8}>
        <Text style={styles.addText}>ADD</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.surfaceMuted,
  },
  imageWrap: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.background.surfaceMuted,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: colors.brand.primary,
    borderRadius: radius.sm - 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    ...typography.caption,
    fontFamily: typography.h1.fontFamily,
    fontSize: 8,
    lineHeight: 12,
    color: colors.text.onBrand,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.bodySmallBold,
    fontFamily: typography.buttonMedium.fontFamily,
    fontSize: 13.5,
    color: colors.text.heading,
  },
  weight: {
    ...typography.caption,
    color: colors.text.subtle,
    marginTop: 2,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  etaDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.brand.primary,
  },
  etaText: {
    ...typography.bodySmallBold,
    fontSize: 10,
    lineHeight: 15,
    color: colors.brand.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  price: {
    ...typography.h1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.heading,
  },
  mrp: {
    ...typography.caption,
    color: colors.text.subtle,
    textDecorationLine: 'line-through',
  },
  discountLabel: {
    ...typography.bodySmallBold,
    fontSize: 11,
    lineHeight: 16.5,
    color: colors.brand.primary,
  },
  addButton: {
    width: 72,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.brand.primary,
    backgroundColor: colors.background.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    ...typography.h1,
    fontSize: 14,
    lineHeight: 21,
    color: colors.brand.primary,
  },
});
