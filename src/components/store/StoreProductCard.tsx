import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { StarIcon } from '../../assets/icons/homescreen';
import { AddPlusPinkIcon } from '../../assets/icons/store';
import type { StoreProduct } from '../../data/store';

interface StoreProductCardProps {
  item: StoreProduct;
  cardWidth: number;
  onPress?: () => void;
  onAdd?: () => void;
}

export function StoreProductCard({ item, cardWidth, onPress, onAdd }: StoreProductCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, { width: cardWidth }]}>
      <View style={[styles.imageWrap, { height: cardWidth }]}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />

        {item.rating ? (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating}</Text>
            <StarIcon width={11} height={11} />
          </View>
        ) : null}

        <Pressable onPress={onAdd} hitSlop={6} style={styles.addButton}>
          <AddPlusPinkIcon width={18} height={18} />
        </Pressable>

        {item.discountPercent > 0 ? (
          <View style={styles.discountRibbon}>
            <Text style={styles.discountText}>{`↓${item.discountPercent}%`}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.weightRow}>
        <View style={styles.weightPill}>
          <Text style={styles.weightText} numberOfLines={1}>
            {item.weight}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{`₹${item.price}`}</Text>
        <Text style={styles.originalPrice}>{`₹${item.originalPrice}`}</Text>
      </View>

      {item.xtraSaverPrice ? (
        <View style={styles.xtraSaverPill}>
          <Text style={styles.xtraSaverText}>{`XtraSaver ₹${item.xtraSaverPrice}`}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  imageWrap: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    overflow: 'visible',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
  },
  addButton: {
    position: 'absolute',
    bottom: -12,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C70255',
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
    top: 0,
    left: 0,
    backgroundColor: '#1CA672',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weightRow: {
    paddingTop: 16,
  },
  weightPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  weightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#707070',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
    lineHeight: 18,
    paddingTop: 6,
    height: 36,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingTop: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  originalPrice: {
    fontSize: 12,
    color: '#707070',
    textDecorationLine: 'line-through',
  },
  xtraSaverPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFA1',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: 6,
  },
  xtraSaverText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
  },
});
