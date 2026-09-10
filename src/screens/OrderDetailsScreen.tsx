import React from 'react';
import { Alert, Image, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BackIcon,
  InvoiceIcon,
  PinIcon,
  ReorderIcon,
  SupportIcon,
} from '../assets/icons/order';
import { gpayIconSmall } from '../assets/images/order';
import { OrderProgressTracker } from '../components/order/OrderProgressTracker';
import { activeOrder } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrderDetails'>;

export function OrderDetailsScreen({ navigation }: Props) {
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
              {activeOrder.id} · {activeOrder.date}
            </Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusPillText}>Out for delivery</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.trackerSection}>
          <OrderProgressTracker activeIndex={3} />
          <Text style={styles.etaText}>
            Arriving in <Text style={styles.etaBold}>{activeOrder.eta} mins</Text> · By {activeOrder.etaBy}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.itemsHeaderRow}>
              <Text style={styles.itemsHeaderTitle}>{activeOrder.items.length} Items</Text>
              <Pressable onPress={() => navigation.navigate('Cart')}>
                <Text style={styles.editCartLink}>Edit cart</Text>
              </Pressable>
            </View>
            {activeOrder.items.map((item, index) => (
              <View
                key={item.id}
                style={[styles.itemRow, index === activeOrder.items.length - 1 && styles.itemRowLast]}
              >
                <View style={[styles.itemImageWrap, { backgroundColor: index === 0 ? '#FFF7ED' : '#FEF9C3' }]}>
                  <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Bill summary</Text>
            </View>
            <View style={styles.billBody}>
              <BillRow label="Item total" value={`₹${activeOrder.itemTotal}`} />
              <BillRow label="Item discount" value={`-₹${activeOrder.itemDiscount}`} valueColor="#1CA672" />
              {activeOrder.couponCode ? (
                <BillRow
                  label={`Coupon ${activeOrder.couponCode}`}
                  value={`-₹${activeOrder.couponDiscount}`}
                  valueColor="#1CA672"
                />
              ) : null}
              <BillRow
                label="Delivery fee"
                value={activeOrder.deliveryFee === 0 ? 'FREE' : `₹${activeOrder.deliveryFee}`}
                valueColor="#1CA672"
              />
              <BillRow label="Platform fee" value={`₹${activeOrder.platformFee}`} labelColor="#9CA3AF" />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total paid</Text>
                <Text style={styles.totalValue}>₹{activeOrder.total}</Text>
              </View>
            </View>
            <View style={styles.savingsBannerWrap}>
              <View style={styles.savingsBanner}>
                <Text style={styles.savingsEmoji}>🎉</Text>
                <Text style={styles.savingsText}>You saved ₹{activeOrder.savings} on this order!</Text>
              </View>
            </View>
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
                <Text style={styles.homeTagText}>🏠 {activeOrder.address.label}</Text>
              </View>
            </View>
            <View style={styles.addressBody}>
              <Text style={styles.addressName}>{activeOrder.address.name}</Text>
              <Text style={styles.addressLine}>{activeOrder.address.line1}</Text>
              <Text style={styles.addressLine}>{activeOrder.address.line2}</Text>
            </View>
          </View>

          <Pressable
            style={styles.card}
            onPress={() =>
              Alert.alert(
                'Payment details',
                `${activeOrder.payment.method} · ${activeOrder.payment.account}\nTransaction ID: ${activeOrder.payment.transactionId}\nAmount paid: ₹${activeOrder.total}`,
              )
            }
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Payment</Text>
            </View>
            <View style={styles.paymentBody}>
              <View style={styles.paymentRow}>
                <View style={styles.paymentIconWrap}>
                  <Image source={gpayIconSmall} style={styles.paymentIconImage} resizeMode="contain" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentMethod}>{activeOrder.payment.method}</Text>
                  <Text style={styles.paymentAccount}>{activeOrder.payment.account}</Text>
                </View>
                <Text style={styles.paymentAmount}>₹{activeOrder.total}</Text>
              </View>
              <View style={styles.transactionRow}>
                <Text style={styles.transactionText}>
                  Transaction ID: <Text style={styles.transactionValue}>{activeOrder.payment.transactionId}</Text>
                </Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            style={styles.reorderButton}
            onPress={() => navigation.navigate('Reorder', { orderId: activeOrder.id })}
          >
            <ReorderIcon width={16} height={16} />
            <Text style={styles.reorderButtonText}>Reorder All Items</Text>
          </Pressable>

          <View style={styles.actionsRow}>
            <Pressable
              style={styles.invoiceButton}
              onPress={() =>
                Share.share({
                  message: `Verdant Invoice — Order #${activeOrder.id}\nTotal: ₹${activeOrder.total}\nPayment: ${activeOrder.payment.method}\nTransaction ID: ${activeOrder.payment.transactionId}`,
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

          <Pressable style={styles.cancelLinkWrap} onPress={() => navigation.navigate('CancelOrder')}>
            <Text style={styles.cancelLink}>Cancel order</Text>
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
