import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { SimilarProduct } from '../../data/product';

interface SimilarProductCardProps {
  item: SimilarProduct;
  onPress?: () => void;
  onAdd?: () => void;
}

export function SimilarProductCard({ item, onPress, onAdd }: SimilarProductCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </View>

      <Text style={styles.weight}>{item.weight}</Text>

      <View style={styles.nameRow}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
      </View>

      <View style={styles.ratingRow}>
        <Text style={styles.stars}>{item.rating}</Text>
        <Text style={styles.reviews}>{item.reviews}</Text>
      </View>

      <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>

      <Text style={styles.pricePerUnit}>{item.pricePerUnit}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{`₹${item.price}`}</Text>
        <Text style={styles.mrp}>{`₹${item.mrp}`}</Text>
      </View>
      <Text style={styles.discountLabel}>{item.discountLabel}</Text>

      <Pressable onPress={onAdd} style={styles.addButton}>
        <Text style={styles.addButtonText}>ADD</Text>
      </Pressable>
    </Pressable>
  );
}

const CARD_WIDTH = 148;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 10,
  },
  imageWrap: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    marginBottom: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  weight: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  nameRow: {
    height: 32,
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 2,
  },
  stars: {
    fontSize: 10,
    color: '#F59E0B',
    letterSpacing: 1,
  },
  reviews: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  deliveryTime: {
    fontSize: 11,
    color: '#1CA672',
    fontWeight: '600',
    paddingTop: 2,
  },
  pricePerUnit: {
    fontSize: 10,
    color: '#9CA3AF',
    paddingTop: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  mrp: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  discountLabel: {
    fontSize: 10,
    color: '#1CA672',
    paddingTop: 2,
  },
  addButton: {
    marginTop: 8,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1CA672',
  },
});
