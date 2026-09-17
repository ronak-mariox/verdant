import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckIcon, PinIcon, SavingsIcon, TrackIcon } from '../assets/icons/order';
import { api } from '../services/api';
import { resolveProductImage } from '../utils/productImage';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrderConfirmation'>;

interface RawOrderItem {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  imageUrl?: string;
  price: number;
  mrp: number;
  quantity: number;
  subtotal: number;
}

interface RawOrder {
  id: string;
  orderNumber: string;
  items: RawOrderItem[];
  address: { contactName?: string; line1: string; line2?: string; city: string; state: string; pincode: string };
  pricing: { itemsTotal: number; taxTotal: number; deliveryFee: number; platformFee: number; discount: number; grandTotal: number };
  couponCode?: string;
  placedAt: string;
}

export function OrderConfirmationScreen({ navigation, route }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<RawOrder | null>(null);

  useEffect(() => {
    api.get<RawOrder>(`/customer/orders/${orderId}`).then(({ data }) => setOrder(data));
  }, [orderId]);

  const etaBy = useMemo(() => {
    if (!order) return '';
    const eta = new Date(new Date(order.placedAt).getTime() + 20 * 60 * 1000);
    return eta.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }, [order]);

  const itemDiscount = useMemo(
    () => order?.items.reduce((sum, i) => sum + (i.mrp - i.price) * i.quantity, 0) ?? 0,
    [order],
  );
  const savings = itemDiscount + (order?.pricing.discount ?? 0);

  if (!order) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#1CA672" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor="#1CA672" />
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <View style={styles.heroDecorLarge} />
          <View style={styles.heroDecorSmall} />
          <View style={styles.heroContent}>
            <View style={styles.checkCircle}>
              <CheckIcon width={36} height={36} />
            </View>
            <Text style={styles.heroTitle}>Order Placed!</Text>
            <Text style={styles.heroSubtitle}>Your order has been confirmed</Text>
            <View style={styles.heroChipsRow}>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipLabel}>ORDER ID</Text>
                <Text style={styles.heroChipValue}>{order.orderNumber}</Text>
              </View>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipLabel}>ARRIVING BY</Text>
                <Text style={styles.heroChipValue}>{etaBy}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.pinIconWrap}>
                  <PinIcon width={13} height={13} />
                </View>
                <Text style={styles.cardHeaderTitle}>Delivery address</Text>
              </View>
              <View style={styles.homeTag}>
                <Text style={styles.homeTagText}>Delivery</Text>
              </View>
            </View>
            <View style={styles.addressBody}>
              <Text style={styles.addressName}>{order.address.contactName}</Text>
              <Text style={styles.addressLine}>{order.address.line1}</Text>
              <Text style={styles.addressLine}>
                {[order.address.line2, order.address.city, `${order.address.state} – ${order.address.pincode}`]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.itemsHeaderRow}>
              <Text style={styles.itemsHeaderTitle}>{order.items.length} Items</Text>
              <Pressable onPress={() => navigation.navigate('Home')}>
                <Text style={styles.editCartLink}>Continue shopping</Text>
              </Pressable>
            </View>
            {order.items.map((item, index) => (
              <View
                key={`${item.productId}-${item.variantId}`}
                style={[styles.itemRow, index === order.items.length - 1 && styles.itemRowLast]}
              >
                <View style={[styles.itemImageWrap, { backgroundColor: index === 0 ? '#FFF7ED' : '#FEF9C3' }]}>
                  <Image source={resolveProductImage(item.imageUrl)} style={styles.itemImage} resizeMode="contain" />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSubtitle}>
                    {item.variantLabel} × {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>₹{item.subtotal}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Bill summary</Text>
            </View>
            <View style={styles.billBody}>
              <BillRow label="Item total" value={`₹${order.pricing.itemsTotal}`} />
              {itemDiscount > 0 ? <BillRow label="Item discount" value={`-₹${itemDiscount}`} valueColor="#1CA672" /> : null}
              {order.couponCode ? (
                <BillRow label={`Coupon ${order.couponCode}`} value={`-₹${order.pricing.discount}`} valueColor="#1CA672" />
              ) : null}
              <BillRow
                label="Delivery fee"
                value={order.pricing.deliveryFee === 0 ? 'FREE' : `₹${order.pricing.deliveryFee}`}
                valueColor="#1CA672"
              />
              <BillRow label="Platform fee" value={`₹${order.pricing.platformFee}`} labelColor="#9CA3AF" />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total paid</Text>
                <Text style={styles.totalValue}>₹{order.pricing.grandTotal}</Text>
              </View>
            </View>
            {savings > 0 ? (
              <View style={styles.savingsBannerWrap}>
                <View style={styles.savingsBanner}>
                  <SavingsIcon width={32} height={32} />
                  <Text style={styles.savingsText}>You saved ₹{savings} on this order!</Text>
                </View>
              </View>
            ) : null}
          </View>

          <Pressable style={styles.trackButton} onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}>
            <TrackIcon width={16} height={16} />
            <Text style={styles.trackButtonText}>Track Order</Text>
          </Pressable>
          <Pressable
            style={styles.detailsButton}
            onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
          >
            <Text style={styles.detailsButtonText}>View Order Details</Text>
          </Pressable>
          <Pressable
            style={styles.continueButton}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function BillRow({
  label,
  value,
  labelColor,
  valueColor,
}: {
  label: string;
  value: string;
  labelColor?: string;
  valueColor?: string;
}) {
  return (
    <View style={billStyles.row}>
      <Text style={[billStyles.label, labelColor ? { color: labelColor } : null]}>{label}</Text>
      <Text style={[billStyles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

const billStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  label: {
    fontSize: 13,
    color: '#374151',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
});

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' },
  heroSafe: {
    backgroundColor: '#1CA672',
    overflow: 'hidden',
  },
  heroDecorLarge: {
    position: 'absolute',
    right: -30,
    top: -36,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  heroDecorSmall: {
    position: 'absolute',
    left: -20,
    bottom: -20,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  checkCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    paddingTop: 4,
  },
  heroChipsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
  },
  heroChip: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 130,
  },
  heroChipLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
  },
  heroChipValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingTop: 4,
  },
  body: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  homeTag: {
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  homeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1CA672',
  },
  addressBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addressName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  addressLine: {
    fontSize: 12,
    color: '#6B7280',
    paddingTop: 2,
  },
  itemsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  itemsHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  editCartLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemImageWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  billBody: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#F0F0F0',
    borderStyle: 'dashed',
    paddingTop: 14,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  totalValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  savingsBannerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  savingsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1CA672',
    flex: 1,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  trackButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailsButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  continueButton: {
    height: 44,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});
