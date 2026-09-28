import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon, ReorderPinIcon } from '../assets/icons/order';
import { BillRow } from '../components/order/BillRow';
import { LoadErrorView } from '../components/order/LoadErrorView';
import { useCart } from '../context/CartContext';
import type { AuthStackParamList } from '../navigation/types';
import { api, getErrorMessage } from '../services/api';
import { resolveProductImage } from '../utils/productImage';
import { formatOrderDate, type RawOrder, type RawOrderItem } from '../types/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Reorder'>;

const EMPTY_ITEMS: RawOrderItem[] = [];

function lineKey(item: RawOrderItem): string {
  return `${item.productId}::${item.variantId}`;
}

export function ReorderScreen({ navigation, route }: Props) {
  const { addItem } = useCart();
  const { orderId } = route.params;
  const [order, setOrder] = useState<RawOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoaded(false);
    setError(null);
    api
      .get<RawOrder>(`/customer/orders/${orderId}`)
      .then(({ data }) => {
        setOrder(data);
        setQuantities(Object.fromEntries(data.items.map((item) => [lineKey(item), item.quantity])));
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoaded(true));
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const orderItems = order?.items ?? EMPTY_ITEMS;

  const setQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  };

  const cartItemCount = useMemo(
    () => Object.values(quantities).reduce((sum, q) => sum + q, 0),
    [quantities],
  );
  const itemTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price * (quantities[lineKey(item)] ?? 0), 0),
    [orderItems, quantities],
  );

  const handlePlaceReorder = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const selected = orderItems.filter((item) => (quantities[lineKey(item)] ?? 0) > 0);
      const results = await Promise.allSettled(
        selected.map((item) => addItem(item.productId, item.variantId, quantities[lineKey(item)])),
      );
      const failed = results
        .map((result, index) => (result.status === 'rejected' ? { item: selected[index], reason: result.reason } : null))
        .filter((entry): entry is { item: RawOrderItem; reason: unknown } => entry !== null);

      const goToCart = () => navigation.replace('Cart');
      if (failed.length === 0) {
        goToCart();
      } else if (failed.length === selected.length) {
        Alert.alert('Could not add items', getErrorMessage(failed[0].reason));
      } else {
        const names = failed.map((f) => `• ${f.item.name}`).join('\n');
        Alert.alert(
          `${selected.length - failed.length} of ${selected.length} items added`,
          `These could not be added:\n${names}`,
          [{ text: 'Go to cart', onPress: goToCart }],
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Reorder</Text>
            <Text style={styles.headerSubtitle}>
              From {order.orderNumber} · {formatOrderDate(order.placedAt)}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Items</Text>
              <Text style={styles.cardHeaderCount}>{cartItemCount} selected</Text>
            </View>
            {orderItems.map((item, index) => {
              const key = lineKey(item);
              const qty = quantities[key] ?? 0;
              return (
                <View
                  key={key}
                  style={[styles.itemRow, index === orderItems.length - 1 && styles.itemRowLast]}
                >
                  <View style={styles.itemImageWrap}>
                    <Image source={resolveProductImage(item.imageUrl)} style={styles.itemImage} resizeMode="contain" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSubtitle}>{item.variantLabel}</Text>
                  </View>
                  <View style={styles.stepper}>
                    <Pressable style={styles.stepperButton} onPress={() => setQuantity(key, -1)} hitSlop={4}>
                      <Text style={styles.stepperSymbol}>−</Text>
                    </Pressable>
                    <Text style={styles.stepperValue}>{qty}</Text>
                    <Pressable style={styles.stepperButton} onPress={() => setQuantity(key, 1)} hitSlop={4}>
                      <Text style={styles.stepperSymbol}>+</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.addressHeaderLeft}>
                <View style={styles.pinIconWrap}>
                  <ReorderPinIcon width={13} height={13} />
                </View>
                <Text style={styles.cardHeaderTitle}>Delivery address</Text>
              </View>
              <View style={styles.homeTag}>
                <Text style={styles.homeTagText}>Last used</Text>
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
              <Text style={styles.cardHeaderTitle}>Estimate</Text>
            </View>
            <View style={styles.billBody}>
              <BillRow label="Item total (at last order's prices)" value={`₹${itemTotal}`} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Final bill</Text>
                <Text style={styles.totalValue}>Shown in cart</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <View style={styles.footerTopRow}>
            <View>
              <Text style={styles.footerItemCount}>{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}</Text>
              <Text style={styles.footerTotal}>₹{itemTotal}</Text>
            </View>
          </View>
          <Pressable
            style={[styles.placeReorderButton, (cartItemCount === 0 || submitting) && styles.placeReorderButtonDisabled]}
            disabled={cartItemCount === 0 || submitting}
            onPress={handlePlaceReorder}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.placeReorderText}>Add all to cart</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
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
    paddingTop: 1,
  },
  body: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardHeaderCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemImageWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F8F8F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '80%',
    height: '80%',
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
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    width: 78,
    borderRadius: 12,
    backgroundColor: '#1CA672',
    overflow: 'hidden',
  },
  stepperButton: {
    width: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSymbol: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  stepperValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addressHeaderLeft: {
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
  billBody: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
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
  footerSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  footerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  footerItemCount: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  footerTotal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  placeReorderButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  placeReorderButtonDisabled: {
    opacity: 0.5,
  },
  placeReorderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
