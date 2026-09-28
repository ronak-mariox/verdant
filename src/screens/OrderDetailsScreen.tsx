import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BackIcon,
  InvoiceIcon,
  PinIcon,
  ReorderIcon,
  SupportIcon,
} from '../assets/icons/order';
import { BillRow } from '../components/order/BillRow';
import { LoadErrorView } from '../components/order/LoadErrorView';
import { OrderProgressTracker } from '../components/order/OrderProgressTracker';
import { RateOrderModal } from '../components/order/RateOrderModal';
import { api, getErrorMessage } from '../services/api';
import { resolveProductImage } from '../utils/productImage';
import type { AuthStackParamList } from '../navigation/types';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STEP,
  ORDER_STATUS_TEXT,
  formatOrderDate,
  isCustomerCancellable,
  isOrderRated,
  isTerminalStatus,
  summarizeLines,
  type RawOrder,
} from '../types/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrderDetails'>;

const PAYMENT_LABELS: Record<RawOrder['paymentMethod'], string> = { cod: 'Cash on Delivery', online: 'Online payment' };
const PAYMENT_STATUS_LABELS: Record<RawOrder['paymentStatus'], string> = {
  pending: 'Pay at your doorstep',
  paid: 'Paid',
  failed: 'Payment failed',
  refunded: 'Refunded',
};

export function OrderDetailsScreen({ navigation, route }: Props) {
  const { orderId, openRate } = route.params;
  const [order, setOrder] = useState<RawOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [rateVisible, setRateVisible] = useState(false);
  const [justRated, setJustRated] = useState(false);

  const load = useCallback(() => {
    setLoaded(false);
    setError(null);
    api
      .get<RawOrder>(`/customer/orders/${orderId}`)
      .then(({ data }) => setOrder(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoaded(true));
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const canRate = !!order && order.status === 'delivered' && !isOrderRated(order) && !justRated;

  useEffect(() => {
    if (openRate && canRate) setRateVisible(true);
  }, [openRate, canRate]);

  const { itemTotal, offerDiscount } = useMemo(() => summarizeLines(order?.items ?? []), [order]);

  if (!loaded) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#1CA672" size="large" />
      </View>
    );
  }

  if (error || !order) {
    return <LoadErrorView message={error ?? 'Order not found'} onRetry={load} onBack={() => navigation.goBack()} />;
  }

  const isCancelledLike = order.status === 'cancelled' || order.status === 'rejected';
  const isDelivered = order.status === 'delivered';
  const isTerminal = isTerminalStatus(order.status);
  const activeIndex = ORDER_STATUS_STEP[order.status] ?? 0;
  const savings = offerDiscount + order.pricing.discount;
  const paymentAmountLabel = order.paymentStatus === 'paid' ? 'Total paid' : 'Total payable';
  const deliveredDateText = order.deliveredAt ? formatOrderDate(order.deliveredAt) : '';

  const handleCancelPress = () => {
    if (isCustomerCancellable(order.status)) {
      navigation.navigate('CancelOrder', { orderId: order.id });
    } else {
      navigation.navigate('CancelIneligible', { orderId: order.id });
    }
  };

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
              {order.orderNumber} · {formatOrderDate(order.placedAt)}
            </Text>
          </View>
          <View style={[styles.statusPill, isCancelledLike && styles.statusPillCancelled]}>
            <View style={[styles.statusDot, isCancelledLike && styles.statusDotCancelled]} />
            <Text style={[styles.statusPillText, isCancelledLike && styles.statusPillTextCancelled]}>
              {ORDER_STATUS_LABELS[order.status]}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        {!isCancelledLike ? (
          <>
            <View style={styles.trackerSection}>
              <OrderProgressTracker activeIndex={activeIndex} />
              <Text style={styles.statusText}>
                {isDelivered
                  ? `Delivered${deliveredDateText ? ` on ${deliveredDateText}` : ''}`
                  : ORDER_STATUS_TEXT[order.status]}
              </Text>
              {!isTerminal ? (
                <Pressable onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })} hitSlop={6}>
                  <Text style={styles.cancelLink}>Track order →</Text>
                </Pressable>
              ) : null}
            </View>

            <View style={styles.divider} />
          </>
        ) : (
          <Text style={styles.cancelledNote}>
            {order.cancelReason ? `Reason: ${order.cancelReason}` : ORDER_STATUS_TEXT[order.status]}
          </Text>
        )}

        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.itemsHeaderRow}>
              <Text style={styles.itemsHeaderTitle}>
                {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
              </Text>
            </View>
            {order.items.map((item, index) => {
              const original = item.originalSubtotal ?? item.subtotal;
              return (
                <View
                  key={`${item.productId}-${item.variantId}`}
                  style={[styles.itemRow, index === order.items.length - 1 && styles.itemRowLast]}
                >
                  <View style={[styles.itemImageWrap, index === 0 ? styles.itemImageWrapFirst : styles.itemImageWrapRest]}>
                    <Image source={resolveProductImage(item.imageUrl)} style={styles.itemImage} resizeMode="contain" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSubtitle}>
                      {item.variantLabel} × {item.quantity}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.itemPrice}>₹{item.subtotal}</Text>
                    {original > item.subtotal ? <Text style={styles.itemOriginal}>₹{original}</Text> : null}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Bill summary</Text>
            </View>
            <View style={styles.billBody}>
              <BillRow label="Item total" value={`₹${itemTotal}`} />
              {offerDiscount > 0 ? <BillRow label="Offer discount" value={`-₹${offerDiscount}`} valueColor="#1CA672" /> : null}
              {order.couponCode && order.pricing.discount > 0 ? (
                <BillRow label={`Coupon ${order.couponCode}`} value={`-₹${order.pricing.discount}`} valueColor="#1CA672" />
              ) : null}
              {order.pricing.taxTotal > 0 ? (
                <BillRow label="Taxes" value={`₹${order.pricing.taxTotal}`} labelColor="#9CA3AF" />
              ) : null}
              <BillRow
                label="Delivery fee"
                value={order.pricing.deliveryFee === 0 ? 'FREE' : `₹${order.pricing.deliveryFee}`}
                valueColor="#1CA672"
              />
              {order.pricing.platformFee > 0 ? (
                <BillRow label="Platform fee" value={`₹${order.pricing.platformFee}`} labelColor="#9CA3AF" />
              ) : null}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{paymentAmountLabel}</Text>
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
              {order.address.contactName ? <Text style={styles.addressName}>{order.address.contactName}</Text> : null}
              <Text style={styles.addressLine}>{order.address.line1}</Text>
              <Text style={styles.addressLine}>
                {[order.address.line2, order.address.city, `${order.address.state} – ${order.address.pincode}`]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Payment</Text>
            </View>
            <View style={styles.paymentBody}>
              <View style={styles.paymentRow}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentMethod}>{PAYMENT_LABELS[order.paymentMethod]}</Text>
                  <Text style={styles.paymentAccount}>{PAYMENT_STATUS_LABELS[order.paymentStatus]}</Text>
                </View>
                <Text style={styles.paymentAmount}>₹{order.pricing.grandTotal}</Text>
              </View>
            </View>
          </View>

          {canRate ? (
            <Pressable style={styles.rateButton} onPress={() => setRateVisible(true)}>
              <Text style={styles.rateButtonText}>★ Rate this order</Text>
            </Pressable>
          ) : isDelivered ? (
            <Text style={styles.ratedText}>Thanks for rating this order</Text>
          ) : null}

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
                  message: `Verdant — Order ${order.orderNumber}\nTotal: ₹${order.pricing.grandTotal}\nPayment: ${PAYMENT_LABELS[order.paymentMethod]}`,
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

          {!isTerminal ? (
            <Pressable style={styles.cancelLinkWrap} onPress={handleCancelPress}>
              <Text style={styles.cancelLink}>Cancel order</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>

      <RateOrderModal
        visible={rateVisible}
        orderId={order.id}
        onClose={() => setRateVisible(false)}
        onRated={() => setJustRated(true)}
      />
    </View>
  );
}

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
  itemImageWrapFirst: {
    backgroundColor: '#FFF7ED',
  },
  itemImageWrapRest: {
    backgroundColor: '#FEF9C3',
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
  statusText: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    paddingTop: 12,
  },
  itemOriginal: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    textAlign: 'right',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 12,
  },
  rateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
  },
  ratedText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    paddingTop: 12,
  },
  cancelledNote: {
    fontSize: 13,
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
