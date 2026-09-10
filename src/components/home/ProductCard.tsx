import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AddPlusIcon, StarIcon } from '../../assets/icons/homescreen';
import type { ProductItem } from '../../data/home';

interface ProductCardProps {
  item: ProductItem;
  onPress?: () => void;
  onAdd?: () => void;
}

export function ProductCard({ item, onPress, onAdd }: ProductCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />

        {item.rating ? (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating}</Text>
            <StarIcon width={10} height={10} />
          </View>
        ) : null}

        <Pressable onPress={onAdd} hitSlop={4} style={styles.addButton}>
          <AddPlusIcon width={16} height={16} />
        </Pressable>

        <View style={styles.discountRibbon}>
          <Text style={styles.discountText}>{`↓${item.discountPercent}%`}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.weightPill}>
          <Text style={styles.weightText} numberOfLines={1}>
            {item.weight}
          </Text>
        </View>
        {item.isAd ? <Text style={styles.adText}>AD</Text> : null}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.originalPrice}>{`₹${item.originalPrice}`}</Text>
        <Text style={styles.price}>{`₹${item.price}`}</Text>
      </View>
    </Pressable>
  );
}

const CARD_WIDTH = 104;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
  },
  imageWrap: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    overflow: 'visible',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -8,
    left: -2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
  },
  addButton: {
    position: 'absolute',
    bottom: -10,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 2,
  },
  discountRibbon: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: '#1CA672',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 10,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 14,
  },
  weightPill: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  weightText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#707070',
  },
  adText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
    lineHeight: 16,
    paddingTop: 4,
    height: 32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    paddingTop: 4,
  },
  originalPrice: {
    fontSize: 11,
    color: '#707070',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
});
