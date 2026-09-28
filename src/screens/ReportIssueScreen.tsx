import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon } from '../assets/icons/order';
import { LoadErrorView } from '../components/order/LoadErrorView';
import { issueTypes } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';
import { api, getErrorMessage } from '../services/api';
import { formatOrderDate, unwrapList, type PagedResponse, type RawOrder } from '../types/api';
import { resolveProductImage } from '../utils/productImage';

type Props = NativeStackScreenProps<AuthStackParamList, 'ReportIssue'>;

const MAX_ORDERS = 10;

export function ReportIssueScreen({ navigation }: Props) {
  const [orders, setOrders] = useState<RawOrder[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const loadOrders = useCallback(() => {
    setLoadError(null);
    api
      .get<RawOrder[] | PagedResponse<RawOrder>>('/customer/orders')
      .then(({ data }) => {
        const list = unwrapList(data).slice(0, MAX_ORDERS);
        setOrders(list);
        setSelectedOrder((prev) => prev ?? list[0]?.id ?? null);
      })
      .catch((err) => setLoadError(getErrorMessage(err, 'Could not load your orders.')));
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const order = orders?.find((o) => o.id === selectedOrder);
  const canContinue = Boolean(order && selectedIssue);

  const handleContinue = () => {
    if (!order || !selectedIssue) return;
    navigation.navigate('IssueDetails', { issueType: selectedIssue, orderId: order.id, orderNumber: order.orderNumber });
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
            <Text style={styles.headerTitle}>Report an Issue</Text>
            <Text style={styles.headerSubtitle}>Select order and issue type</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View>
            <Text style={styles.sectionLabel}>SELECT ORDER</Text>
            {loadError ? (
              <LoadErrorView message={loadError} onRetry={loadOrders} />
            ) : orders === null ? (
              <ActivityIndicator color="#1CA672" />
            ) : orders.length === 0 ? (
              <Text style={styles.orderMeta}>You haven't placed any orders yet.</Text>
            ) : (
              <View style={styles.orderList}>
                {orders.map((o) => {
                  const active = o.id === selectedOrder;
                  const itemCount = o.items.reduce((sum, i) => sum + i.quantity, 0);
                  return (
                    <Pressable
                      key={o.id}
                      style={[styles.orderRow, active && styles.orderRowActive]}
                      onPress={() => setSelectedOrder(o.id)}
                    >
                      <View style={styles.orderThumbWrap}>
                        <Image source={resolveProductImage(o.items[0]?.imageUrl)} style={styles.orderThumb} resizeMode="contain" />
                      </View>
                      <View style={styles.orderInfo}>
                        <Text style={styles.orderId}>{o.orderNumber}</Text>
                        <Text style={styles.orderMeta}>
                          {formatOrderDate(o.placedAt)} · {itemCount} items · ₹{o.pricing.grandTotal}
                        </Text>
                      </View>
                      <View style={[styles.radio, active && styles.radioActive]}>
                        {active ? <View style={styles.radioDot} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <View>
            <Text style={styles.sectionLabel}>WHAT WENT WRONG?</Text>
            <View style={styles.issueGrid}>
              {issueTypes.map((issue) => {
                const active = issue.id === selectedIssue;
                return (
                  <Pressable
                    key={issue.id}
                    style={[styles.issueTile, active && styles.issueTileActive]}
                    onPress={() => setSelectedIssue(issue.id)}
                  >
                    <Text style={[styles.issueTileText, active && styles.issueTileTextActive]}>{issue.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            disabled={!canContinue}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>
              {canContinue ? 'Continue' : 'Select an order and issue to continue'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
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
    gap: 16,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    paddingBottom: 10,
  },
  orderList: {
    gap: 8,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  orderRowActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#1CA672',
  },
  orderThumbWrap: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orderThumb: {
    width: '80%',
    height: '80%',
  },
  orderInfo: {
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
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#1CA672',
    backgroundColor: '#1CA672',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  issueTile: {
    width: '48%',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  issueTileActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#1CA672',
  },
  issueTileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  issueTileTextActive: {
    color: '#1CA672',
  },
  footerSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footer: {
    padding: 16,
  },
  continueButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
