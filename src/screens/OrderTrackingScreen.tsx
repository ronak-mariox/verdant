import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronDownIcon, HelpIcon } from '../assets/icons/order';
import { map } from '../assets/images/order';
import { DeliveryPartnerCard } from '../components/order/DeliveryPartnerCard';
import { LoadErrorView } from '../components/order/LoadErrorView';
import { OrderProgressTracker } from '../components/order/OrderProgressTracker';
import { api, getErrorMessage } from '../services/api';
import type { AuthStackParamList } from '../navigation/types';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STEP,
  ORDER_STATUS_TEXT,
  formatOrderDate,
  isCustomerCancellable,
  isTerminalStatus,
  unwrapList,
  type RawOrder,
} from '../types/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrderTracking'>;

const POLL_INTERVAL_MS = 15000;

export function OrderTrackingScreen({ navigation, route }: Props) {
  const paramOrderId = route.params?.orderId;

  const [order, setOrder] = useState<RawOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (paramOrderId) {
      const { data } = await api.get<RawOrder>(`/customer/orders/${paramOrderId}`);
      return data;
    }
    const { data } = await api.get<RawOrder[]>('/customer/orders');
    const orders = unwrapList(data);
    // Prefer something still in flight; otherwise fall back to the most recent order in "completed" mode.
    return orders.find((o) => !isTerminalStatus(o.status)) ?? orders[0] ?? null;
  }, [paramOrderId]);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setError(null);
    load()
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const isActive = !!order && !isTerminalStatus(order.status);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      load()
        .then((data) => setOrder(data))
        .catch(() => {});
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isActive, load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load()
      .then((data) => {
        setOrder(data);
        setError(null);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setRefreshing(false));
  }, [load]);

  if (!loaded) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#1CA672" size="large" />
      </View>
    );
  }

  if (error && !order) {
    return <LoadErrorView message={error} onRetry={onRefresh} onBack={() => navigation.goBack()} />;
  }

  if (!order) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.emptyText}>No orders to track yet.</Text>
      </View>
    );
  }

  const isTerminal = isTerminalStatus(order.status);
  const isCancelledOrRejected = order.status === 'cancelled' || order.status === 'rejected';
  const activeIndex = ORDER_STATUS_STEP[order.status] ?? 0;
  const accent = isCancelledOrRejected ? '#DC2626' : '#1CA672';
  const showOtp = order.status === 'out_for_delivery' && !!order.deliveryOtp;

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
      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1CA672" />}
      >
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.headerRow}>
            <View style={styles.flex}>
              <Text style={[styles.statusTitle, { color: accent }]}>{ORDER_STATUS_LABELS[order.status]}</Text>
              <Text style={styles.statusText}>{ORDER_STATUS_TEXT[order.status]}</Text>
              <Text style={styles.placedText}>Placed {formatOrderDate(order.placedAt)}</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.statusPill}>
                <View style={[styles.statusDot, { backgroundColor: accent }]} />
                <Text style={styles.statusPillText}>{ORDER_STATUS_LABELS[order.status]}</Text>
              </View>
              <Pressable onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })} hitSlop={6}>
                <Text style={styles.orderIdLink}>Order {order.orderNumber} →</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>

        {showOtp ? (
          <View style={styles.otpCard}>
            <Text style={styles.otpLabel}>DELIVERY OTP</Text>
            <Text style={styles.otpValue}>{order.deliveryOtp}</Text>
            <Text style={styles.otpHint}>Share this OTP with your delivery partner to receive your order</Text>
          </View>
        ) : null}

        {!isTerminal ? (
          <View style={styles.mapWrap}>
            <Image source={map} style={styles.mapImage} resizeMode="cover" />
            <View style={styles.mapFade} />
          </View>
        ) : null}

        {isCancelledOrRejected ? (
          <Text style={styles.terminalNote}>
            {order.cancelReason ? `Reason: ${order.cancelReason}` : ORDER_STATUS_TEXT[order.status]}
          </Text>
        ) : (
          <View style={styles.trackerSection}>
            <OrderProgressTracker activeIndex={activeIndex} color={accent} />
            <View style={styles.onWayRow}>
              <View style={[styles.onWayDot, { backgroundColor: accent }]} />
              <Text style={styles.onWayText}>{ORDER_STATUS_TEXT[order.status]}</Text>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {order.driver ? (
          <>
            <View style={styles.partnerSection}>
              <Text style={styles.sectionLabel}>DELIVERY PARTNER</Text>
              <View style={styles.partnerCardWrap}>
                <DeliveryPartnerCard driver={order.driver} onChatPress={() => navigation.navigate('SupportHome')} />
              </View>
            </View>

            <View style={styles.divider} />
          </>
        ) : null}

        <Pressable
          style={styles.summaryRow}
          onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
        >
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>Order summary</Text>
            <Text style={styles.summarySubtitle}>
              ({order.items.length} {order.items.length === 1 ? 'item' : 'items'} · ₹{order.pricing.grandTotal})
            </Text>
          </View>
          <ChevronDownIcon width={16} height={16} />
        </Pressable>

        <View style={styles.divider} />

        <View style={styles.helpSection}>
          <Pressable style={styles.helpRow} onPress={() => navigation.navigate('SupportHome')}>
            <View style={styles.helpIconWrap}>
              <HelpIcon width={16} height={16} />
            </View>
            <View style={styles.helpTextWrap}>
              <Text style={styles.helpTitle}>Need help?</Text>
              <Text style={styles.helpSubtitle}>Call or email our support team</Text>
            </View>
          </Pressable>
          {!isTerminal ? (
            <Pressable style={styles.cancelLinkWrap} onPress={handleCancelPress}>
              <Text style={styles.cancelLink}>Cancel order</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 32 },
  headerSafe: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
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
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1CA672',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1CA672',
  },
  orderIdLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  mapWrap: {
    height: 196,
    backgroundColor: '#EAF5EC',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: '#FFFFFF',
    opacity: 0,
  },
  trackerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  onWayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  onWayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1CA672',
  },
  onWayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
  partnerSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.4,
  },
  partnerCardWrap: {
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  summarySubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  helpSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  helpIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTextWrap: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  helpSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  cancelLinkWrap: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  cancelLink: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  statusText: {
    fontSize: 13,
    color: '#6B7280',
    paddingTop: 4,
  },
  placedText: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  otpCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
    letterSpacing: 0.5,
  },
  otpValue: {
    fontSize: 34,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: 8,
    paddingTop: 6,
  },
  otpHint: {
    fontSize: 12,
    color: '#047857',
    textAlign: 'center',
    paddingTop: 6,
  },
  terminalNote: {
    fontSize: 13,
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
