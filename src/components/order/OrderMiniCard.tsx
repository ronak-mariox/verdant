import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { besan, fortuneThumb, reorderMilk } from '../../assets/images/order';
import { activeOrder } from '../../data/orders';

const THUMBS = [fortuneThumb, besan, reorderMilk];

export function OrderMiniCard() {
  return (
    <View style={styles.card}>
      <View style={styles.thumbsRow}>
        {THUMBS.map((thumb, index) => (
          <Image key={index} source={thumb} style={[styles.thumb, index > 0 && styles.thumbOverlap]} />
        ))}
      </View>
      <View style={styles.info}>
        <Text style={styles.orderId}>{activeOrder.id}</Text>
        <Text style={styles.orderMeta}>6 items · {activeOrder.date}</Text>
      </View>
      <Text style={styles.orderTotal}>₹477</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  thumbsRow: {
    flexDirection: 'row',
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#F5F5F5',
  },
  thumbOverlap: {
    marginLeft: -6,
  },
  info: {
    flex: 1,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  orderMeta: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
  },
});
