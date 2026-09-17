import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageSourcePropType, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon, EmptyBoxIcon, ReorderBtnIcon, TrackBtnIcon } from '../assets/icons/order';
import { api } from '../services/api';
import { resolveProductImage } from '../utils/productImage';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrderHistory'>;

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
  pricing: { itemsTotal: number; taxTotal: number; deliveryFee: number; platformFee: number; discount: number; grandTotal: number };
  status: BackendStatus;
  placedAt: string;
}

interface HistoryOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: 'active' | 'delivered' | 'cancelled';
  statusLabel: string;
  eta?: string;
  etaBy?: string;
  summary: string;
  itemCount: number;
  total: number;
  thumbs?: ImageSourcePropType[];
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

function groupStatus(status: BackendStatus): 'active' | 'delivered' | 'cancelled' {
  if (status === 'delivered') return 'delivered';
  if (status === 'cancelled' || status === 'rejected') return 'cancelled';
  return 'active';
}

function mapOrder(order: RawOrder): HistoryOrder {
  const placed = new Date(order.placedAt);
  const etaDate = new Date(placed.getTime() + 20 * 60 * 1000);
  const etaMinutes = Math.max(0, Math.round((etaDate.getTime() - Date.now()) / 60000));
  const summary =
    order.items.length > 1
      ? `${order.items[0]?.name ?? 'Item'} + ${order.items.length - 1} more`
      : order.items[0]?.name ?? 'Order';

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    date: placed.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
    status: groupStatus(order.status),
    statusLabel: STATUS_LABELS[order.status],
    eta: `${etaMinutes} min`,
    etaBy: etaDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    summary,
    itemCount: order.items.length,
    total: order.pricing.grandTotal,
    thumbs: order.items.slice(0, 4).map((item) => resolveProductImage(item.imageUrl)),
  };
}

export function OrderHistoryScreen({ navigation }: Props) {
  const [orders, setOrders] = useState<HistoryOrder[] | null>(null);

  useEffect(() => {
    api.get<RawOrder[]>('/customer/orders').then(({ data }) => {
      setOrders(data.map(mapOrder));
    });
  }, []);

  if (!orders) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#1CA672" size="large" />
      </View>
    );
  }

  const activeOrders = orders.filter((o) => o.status === 'active');
  const pastOrders = orders.filter((o) => o.status !== 'active');
  const isEmpty = orders.length === 0;

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>My Orders</Text>
            {!isEmpty ? <Text style={styles.headerSubtitle}>{orders.length} orders total</Text> : null}
          </View>
        </View>
      </SafeAreaView>

      {isEmpty ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconWrap}>
            <EmptyBoxIcon width={58} height={58} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            Your order history will appear here. Start shopping to enjoy fast delivery in minutes!
          </Text>
          <Pressable
            style={styles.startShoppingButton}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          >
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </Pressable>
          <Pressable
            style={styles.browseLinkWrap}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          >
            <Text style={styles.browseLink}>Browse categories</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            {activeOrders.length > 0 ? (
              <View>
                <Text style={styles.sectionLabel}>ACTIVE ORDER</Text>
                <View style={styles.sectionSpacer}>
                  {activeOrders.map((order) => (
                    <ActiveOrderCard key={order.id} order={order} navigation={navigation} />
                  ))}
                </View>
              </View>
            ) : null}

            {pastOrders.length > 0 ? (
              <View>
                <Text style={styles.sectionLabel}>PAST ORDERS</Text>
                <View style={styles.pastList}>
                  {pastOrders.map((order) => (
                    <PastOrderCard key={order.id} order={order} navigation={navigation} />
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function ActiveOrderCard({ order, navigation }: { order: HistoryOrder; navigation: Props['navigation'] }) {
  return (
    <View style={styles.activeCard}>
      <View style={styles.activeCardHeader}>
        <View style={styles.activeCardHeaderRow}>
          <View style={styles.activeStatusRow}>
            <View style={styles.activeStatusDot} />
            <Text style={styles.activeStatusText}>{order.statusLabel}</Text>
          </View>
          <Text style={styles.activeEtaText}>{order.eta}</Text>
        </View>
        <Text style={styles.activeSubtitle}>
          Arriving by {order.etaBy} · {order.orderNumber}
        </Text>
      </View>
      <View style={styles.activeThumbsRow}>
        <View style={styles.activeThumbsList}>
          {(order.thumbs ?? []).slice(0, 4).map((thumb, index) => (
            <Image key={index} source={thumb} style={[styles.activeThumb, index > 0 && styles.activeThumbOverlap]} />
          ))}
        </View>
        <Text style={styles.activeItemsText}>
          {order.itemCount} items · <Text style={styles.activeItemsBold}>₹{order.total}</Text>
        </Text>
      </View>
      <View style={styles.activeActionsRow}>
        <Pressable
          style={styles.activeTrackButton}
          onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
        >
          <TrackBtnIcon width={13} height={13} />
          <Text style={styles.activeTrackText}>Track</Text>
        </Pressable>
        <Pressable
          style={styles.activeDetailsButton}
          onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
        >
          <Text style={styles.activeDetailsText}>View Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

function PastOrderCard({ order, navigation }: { order: HistoryOrder; navigation: Props['navigation'] }) {
  const cancelled = order.status === 'cancelled';
  return (
    <View style={styles.pastCard}>
      <View style={styles.pastCardHeader}>
        <View>
          <Text style={styles.pastOrderId}>{order.orderNumber}</Text>
          <Text style={styles.pastDate}>{order.date}</Text>
        </View>
        <View style={[styles.pastStatusPill, cancelled && styles.pastStatusPillCancelled]}>
          <Text style={[styles.pastStatusText, cancelled && styles.pastStatusTextCancelled]}>
            {cancelled ? '✕' : '✓'} {order.statusLabel}
          </Text>
        </View>
      </View>
      <View style={styles.pastCardBody}>
        <Text style={styles.pastSummary}>{order.summary}</Text>
        <Text style={styles.pastItemsText}>
          {order.itemCount} items · <Text style={styles.pastItemsBold}>₹{order.total}</Text>
        </Text>
      </View>
      <View style={styles.pastActionsRow}>
        <Pressable
          style={styles.pastViewButton}
          onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
        >
          <Text style={styles.pastViewText}>View Details</Text>
        </Pressable>
        <Pressable
          style={styles.pastReorderButton}
          onPress={() => navigation.navigate('Reorder', { orderId: order.id })}
        >
          <ReorderBtnIcon width={12} height={12} />
          <Text style={styles.pastReorderText}>Reorder</Text>
        </Pressable>
      </View>
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
    gap: 16,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.6,
  },
  sectionSpacer: {
    paddingTop: 10,
  },
  pastList: {
    paddingTop: 10,
    gap: 12,
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  activeCardHeader: {
    backgroundColor: '#1CA672',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activeCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  activeStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activeEtaText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  activeSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    paddingTop: 2,
  },
  activeThumbsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  activeThumbsList: {
    flexDirection: 'row',
  },
  activeThumb: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#F5F5F5',
  },
  activeThumbOverlap: {
    marginLeft: -8,
  },
  activeThumbMore: {
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeThumbMoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1CA672',
  },
  activeItemsText: {
    fontSize: 13,
    color: '#374151',
  },
  activeItemsBold: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  activeActionsRow: {
    flexDirection: 'row',
  },
  activeTrackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#F5F5F5',
  },
  activeTrackText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1CA672',
  },
  activeDetailsButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  pastCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  pastCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  pastOrderId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  pastDate: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  pastStatusPill: {
    backgroundColor: '#F0FDF4',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pastStatusPillCancelled: {
    backgroundColor: '#FFF1F2',
  },
  pastStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1CA672',
  },
  pastStatusTextCancelled: {
    color: '#EF4444',
  },
  pastCardBody: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  pastSummary: {
    fontSize: 12,
    color: '#374151',
  },
  pastItemsText: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  pastItemsBold: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  pastActionsRow: {
    flexDirection: 'row',
  },
  pastViewButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#F5F5F5',
  },
  pastViewText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  pastReorderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  pastReorderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  emptyIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 23.8,
    paddingTop: 10,
    paddingBottom: 32,
    maxWidth: 280,
  },
  startShoppingButton: {
    backgroundColor: '#1CA672',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  startShoppingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  browseLinkWrap: {
    paddingTop: 12,
  },
  browseLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
