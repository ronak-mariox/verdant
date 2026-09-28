import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon, ChatIcon, IneligibleWarnIcon, StatusCurrentIcon } from '../assets/icons/order';
import { LoadErrorView } from '../components/order/LoadErrorView';
import { OrderMiniCard } from '../components/order/OrderMiniCard';
import { api, getErrorMessage } from '../services/api';
import { resolveProductImage } from '../utils/productImage';
import type { AuthStackParamList } from '../navigation/types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_TEXT, formatOrderDate, isCustomerCancellable, type RawOrder } from '../types/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'CancelIneligible'>;

const WHY_TEXT: Partial<Record<RawOrder['status'], string>> = {
  preparing: 'The store has already started preparing your order, so it can no longer be cancelled from the app.',
  ready_for_pickup: 'Your order is packed and waiting for a delivery partner, so it can no longer be cancelled from the app.',
  out_for_delivery: 'Your delivery partner has already picked up your order, so it can no longer be cancelled from the app.',
  delivered: 'This order has already been delivered.',
  cancelled: 'This order has already been cancelled.',
  rejected: 'This order was rejected by the store, so there is nothing to cancel.',
};

export function CancelIneligibleScreen({ navigation, route }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<RawOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

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

  // If the order turns out to be cancellable after all, send the user to the real cancel flow.
  useEffect(() => {
    if (order && isCustomerCancellable(order.status)) {
      navigation.replace('CancelOrder', { orderId: order.id });
    }
  }, [navigation, order]);

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Cancel Order</Text>
            <Text style={styles.headerSubtitle}>Order cancellation status</Text>
          </View>
        </View>
      </SafeAreaView>

      {!loaded ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color="#1CA672" size="large" />
        </View>
      ) : error || !order ? (
        <LoadErrorView message={error ?? 'Order not found'} onRetry={load} onBack={() => navigation.goBack()} />
      ) : (
        <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <OrderMiniCard
              orderNumber={order.orderNumber}
              date={formatOrderDate(order.placedAt)}
              itemCount={order.items.length}
              total={order.pricing.grandTotal}
              thumbs={order.items.slice(0, 3).map((item) => resolveProductImage(item.imageUrl))}
            />

            <View style={styles.errorCard}>
              <View style={styles.errorHeaderRow}>
                <View style={styles.errorIconWrap}>
                  <IneligibleWarnIcon width={20} height={20} />
                </View>
                <View style={styles.errorTextWrap}>
                  <Text style={styles.errorTitle}>Order cannot be cancelled</Text>
                  <Text style={styles.errorSubtitle}>Cancellation is only possible before the store starts preparing</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.statusLabel}>CURRENT STATUS</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusIconWrap}>
                  <StatusCurrentIcon width={18} height={18} />
                </View>
                <View style={styles.statusTextWrap}>
                  <Text style={styles.statusTitle}>{ORDER_STATUS_LABELS[order.status]}</Text>
                  <Text style={styles.statusSubtitle}>{ORDER_STATUS_TEXT[order.status]}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Why can&apos;t I cancel?</Text>
              <Text style={styles.cardBody}>{WHY_TEXT[order.status] ?? 'This order can no longer be cancelled from the app.'}</Text>
            </View>

            <Text style={styles.sectionLabel}>WHAT YOU CAN DO</Text>

            <Pressable style={styles.optionCardGreen} onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}>
              <Text style={styles.optionEmoji}>📦</Text>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>Accept the delivery</Text>
                <Text style={styles.optionSubtitle}>Receive your order, then report any problem with it</Text>
              </View>
              <Text style={styles.optionLinkGreen}>Track Order →</Text>
            </Pressable>

            <Pressable style={styles.optionCardBlue} onPress={() => navigation.navigate('SupportHome')}>
              <ChatIcon width={22} height={22} />
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>Contact support</Text>
                <Text style={styles.optionSubtitle}>Our team will do their best to help in exceptional cases</Text>
              </View>
              <Text style={styles.optionLinkBlue}>Get help →</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  headerSafe: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  body: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  errorCard: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 24,
    padding: 20,
  },
  errorHeaderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  errorIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTextWrap: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
  },
  errorSubtitle: {
    fontSize: 12,
    color: '#EF4444',
    paddingTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
  },
  statusIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextWrap: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statusSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    paddingTop: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardBody: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 22.1,
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  optionCardGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 24,
    padding: 16,
  },
  optionCardBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 24,
    padding: 16,
  },
  optionEmoji: {
    fontSize: 26,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  optionSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    paddingTop: 2,
  },
  optionLinkGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
  },
  optionLinkBlue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
