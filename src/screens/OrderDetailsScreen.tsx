import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BackIcon,
  InvoiceIcon,
  PinIcon,
  ReorderIcon,
  SupportIcon,
} from '../assets/icons/order';
import { OrderProgressTracker } from '../components/order/OrderProgressTracker';
import { api } from '../services/api';
import { resolveProductImage } from '../utils/productImage';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrderDetails'>;

type BackendStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

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
  paymentMethod: 'cod' | 'online';
  status: BackendStatus;
  placedAt: string;
  deliveredAt?: string;
}

const STATUS_LABELS: Record<BackendStatus, string> = {
  placed: 'Order placed',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

const STATUS_INDEX: Partial<Record<BackendStatus, number>> = {
  placed: 0,
  accepted: 1,
  preparing: 1,
  ready_for_pickup: 2,
  out_for_delivery: 3,
  delivered: 4,
};

const CANCELLABLE_STATUSES: BackendStatus[] = ['placed', 'accepted', 'preparing'];

export function OrderDetailsScreen({ navigation, route }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<RawOrder | null>(null);

  useEffect(() => {
    api.get<RawOrder>(`/customer/orders/${orderId}`).then(({ data }) => setOrder(data));
  }, [orderId]);

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

  const isCancelledLike = order.status === 'cancelled' || order.status === 'rejected';
  const isDelivered = order.status === 'delivered';
  const isCancellable = CANCELLABLE_STATUSES.includes(order.status);
  const activeIndex = isDelivered ? 4 : STATUS_INDEX[order.status] ?? 0;

  const placedDate = new Date(order.placedAt);
  const etaDate = new Date(placedDate.getTime() + 20 * 60 * 1000);
  const etaMinutes = Math.max(0, Math.round((etaDate.getTime() - Date.now()) / 60000));
  const etaByText = etaDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const deliveredDateText = order.deliveredAt
    ? new Date(order.deliveredAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Order Details</Text>
            <Text style={styles.headerSubtitle}>
              {order.orderNumber} · {placedDate.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View style={[styles.statusPill, isCancelledLike && styles.statusPillCancelled]}>
            <View style={[styles.statusDot, isCancelledLike && styles.statusDotCancelled]} />
            <Text style={[styles.statusPillText, isCancelledLike && styles.statusPillTextCancelled]}>
              {STATUS_LABELS[order.status]}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        {!isCancelledLike ? (
          <>
            <View style={styles.trackerSection}>
              <OrderProgressTracker activeIndex={activeIndex} />
              <Text style={styles.etaText}>
                {isDelivered ? (
                  `Delivered${deliveredDateText ? ` on ${deliveredDateText}` : ''}`
                ) : (
                  <>
                    Arriving in <Text style={styles.etaBold}>{etaMinutes} mins</Text> · By {etaByText}
                  </>
                )}
              </Text>
            </View>

            <View style={styles.divider} />
          </>
        ) : null}

        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.itemsHeaderRow}>
              <Text style={styles.itemsHeaderTitle}>{order.items.length} Items</Text>
              <Pressable onPress={() => navigation.navigate('Cart')}>
                <Text style={styles.editCartLink}>Edit cart</Text>
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
                <BillRow
                  label={`Coupon ${order.couponCode}`}
                  value={`-₹${order.pricing.discount}`}
                  valueColor="#1CA672"
                />
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
                  <Text style={styles.savingsEmoji}>🎉</Text>
                  <Text style={styles.savingsText}>You saved ₹{savings} on this order!</Text>
                </View>
              </View>
            ) : null}
          </View>

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

          <Pressable
            style={styles.card}
            onPress={() => Alert.alert('Payment details', `Cash on Delivery\nAmount due: ₹${order.pricing.grandTotal}`)}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Payment</Text>
            </View>
            <View style={styles.paymentBody}>
              <View style={styles.paymentRow}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentMethod}>Cash on Delivery</Text>
                  <Text style={styles.paymentAccount}>Pay at your doorstep</Text>
                </View>
                <Text style={styles.paymentAmount}>₹{order.pricing.grandTotal}</Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            style={styles.reorderButton}
            onPress={() => navigation.navigate('Reorder', { orderId: order.id })}
          >
            <ReorderIcon width={16} height={16} />
            <Text style={styles.reorderButtonText}>Reorder All Items</Text>
          </Pressable>

          <View style={styles.actionsRow}>
            <Pressable
              style={styles.invoiceButton}
              onPress={() =>
                Share.share({
                  message: `Verdant Invoice — Order #${order.orderNumber}\nTotal: ₹${order.pricing.grandTotal}\nPayment: Cash on Delivery`,
                }).catch(() => {})
              }
            >
              <InvoiceIcon width={13} height={13} />
              <Text style={styles.invoiceButtonText}>Invoice</Text>
            </Pressable>
            <Pressable style={styles.supportButton} onPress={() => navigation.navigate('SupportHome')}>
              <SupportIcon width={13} height={13} />
              <Text style={styles.supportButtonText}>Support</Text>
            </Pressable>
          </View>

          {isCancellable ? (
            <Pressable
              style={styles.cancelLinkWrap}
              onPress={() => navigation.navigate('CancelOrder', { orderId: order.id })}
            >
              <Text style={styles.cancelLink}>Cancel order</Text>
            </Pressable>
          ) : null}
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
  headerSafe: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusPillCancelled: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1CA672',
  },
  statusDotCancelled: {
    backgroundColor: '#EF4444',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1CA672',
  },
  statusPillTextCancelled: {
    color: '#EF4444',
  },
  trackerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  etaText: {
    fontSize: 12,
    color: '#6B7280',
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  etaBold: {
    fontWeight: '700',
    color: '#1CA672',
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
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
  savingsEmoji: {
    fontSize: 15,
  },
  savingsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1CA672',
    flex: 1,
  },
  paymentBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  paymentIconImage: {
    width: 20,
    height: 20,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMethod: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  paymentAccount: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  transactionRow: {
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  transactionText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  transactionValue: {
    fontWeight: '600',
    color: '#374151',
  },
  reorderButton: {
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
  reorderButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  invoiceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  invoiceButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  supportButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  cancelLinkWrap: {
    alignItems: 'center',
    paddingTop: 4,
  },
  cancelLink: {
    fontSize: 13,
    fontWeight: '500',
    color: '#EF4444',
  },
});
