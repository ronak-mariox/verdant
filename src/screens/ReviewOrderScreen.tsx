import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CouponCheck, DeliveryPin } from '../assets/icons/checkout';
import { CheckoutHeader } from '../components/checkout/CheckoutHeader';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { DELIVERY_FEE, PLATFORM_FEE } from '../data/cart';
import { paymentMethods } from '../data/checkout';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ReviewOrder'>;

export function ReviewOrderScreen({ navigation }: Props) {
  const { items } = useCart();
  const { addressList, selectedAddressId, paymentMethod, couponApplied } = useCheckout();

  const address = addressList.find((a) => a.id === selectedAddressId) ?? addressList[0];
  const method = paymentMethods.find((m) => m.id === paymentMethod);

  const itemTotal = useMemo(() => items.reduce((sum, i) => sum + (i.mrp ?? i.price) * i.quantity, 0), [items]);
  const productDiscount = useMemo(
    () => items.reduce((sum, i) => sum + ((i.mrp ?? i.price) - i.price) * i.quantity, 0),
    [items],
  );
  const couponDiscount = couponApplied ? 50 : 0;
  const toPay = Math.max(0, itemTotal - productDiscount - couponDiscount + DELIVERY_FEE + PLATFORM_FEE);
  const totalSavings = productDiscount + couponDiscount;

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CheckoutHeader title="Review Order" subtitle="Confirm before you place it" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIcon}>
              <DeliveryPin width={16} height={16} />
            </View>
            <Text style={styles.cardTitle}>Deliver to</Text>
            <Pressable style={styles.changeLinkWrap} onPress={() => navigation.navigate('Address')}>
              <Text style={styles.changeLink}>Change</Text>
            </Pressable>
          </View>
          <Text style={styles.addressName}>
            {address.type} · {address.name}
          </Text>
          <Text style={styles.addressLine}>{address.line1}</Text>
          <Text style={styles.addressLine}>{address.line2}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Order Items ({items.length})</Text>
            <Pressable style={styles.changeLinkWrap} onPress={() => navigation.navigate('Cart')}>
              <Text style={styles.changeLink}>Edit cart</Text>
            </Pressable>
          </View>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
              <View style={styles.itemBody}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Payment Method</Text>
            <Pressable style={styles.changeLinkWrap} onPress={() => navigation.navigate('Payment')}>
              <Text style={styles.changeLink}>Change</Text>
            </Pressable>
          </View>
          <Text style={styles.paymentTitle}>{method?.title}</Text>
          <Text style={styles.paymentSubtitle}>{method?.subtitle}</Text>
        </View>

        {couponApplied ? (
          <View style={[styles.card, styles.couponCard]}>
            <CouponCheck width={18} height={18} />
            <View style={styles.couponBody}>
              <Text style={styles.couponCode}>{couponApplied} applied</Text>
              <Text style={styles.couponHint}>You saved ₹{couponDiscount} with this coupon</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill Summary</Text>
          <BillRow label="Item total (MRP)" value={`₹${itemTotal}`} />
          <BillRow label="Product discount" value={`−₹${productDiscount}`} valueColor="#1CA672" />
          {couponApplied ? <BillRow label="Coupon discount" value={`−₹${couponDiscount}`} valueColor="#1CA672" /> : null}
          <BillRow label="Delivery fee" value={`₹${DELIVERY_FEE}`} labelColor="#9CA3AF" />
          <BillRow label="Platform fee" value={`₹${PLATFORM_FEE}`} labelColor="#9CA3AF" />
          <View style={styles.billDividerLine} />
          <BillRow label="Total" value={`₹${toPay}`} bold />
        </View>

        {totalSavings > 0 ? (
          <View style={styles.savingsBanner}>
            <Text style={styles.savingsEmoji}>🎉</Text>
            <Text style={styles.savingsText}>You are saving ₹{totalSavings} on this order!</Text>
          </View>
        ) : null}

        <Text style={styles.termsText}>
          By placing this order, you agree to our Terms of Service and Refund Policy.
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable style={styles.placeOrderButton} onPress={() => navigation.navigate('Processing')}>
            <Text style={styles.placeOrderButtonText}>Place Order · ₹{toPay}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function BillRow({
  label,
  value,
  labelColor,
  valueColor,
  bold,
}: {
  label: string;
  value: string;
  labelColor?: string;
  valueColor?: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, labelColor ? { color: labelColor } : null, bold && styles.billBold]}>
        {label}
      </Text>
      <Text style={[styles.billValue, valueColor ? { color: valueColor } : null, bold && styles.billBoldValue]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
  },
  cardIcon: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  changeLinkWrap: {
    paddingLeft: 8,
  },
  changeLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
  },
  addressName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  addressLine: {
    fontSize: 12,
    color: '#6B7280',
    paddingTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8F8F8',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
  },
  itemBody: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  itemQty: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  paymentSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
  },
  couponBody: {
    flex: 1,
  },
  couponCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1CA672',
  },
  couponHint: {
    fontSize: 11,
    color: '#4D7C64',
    paddingTop: 2,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  billLabel: {
    fontSize: 13,
    color: '#374151',
  },
  billValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  billBold: {
    fontWeight: '700',
  },
  billBoldValue: {
    fontWeight: '800',
    color: '#1A1A1A',
    fontSize: 15,
  },
  billDividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
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
  },
  termsText: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  bottomSpacer: {
    height: 12,
  },
  footerSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footer: {
    padding: 16,
  },
  placeOrderButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 11,
    elevation: 4,
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
