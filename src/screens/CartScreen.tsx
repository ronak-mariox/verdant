import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BackIcon,
  CouponTag,
  DeliveryClock,
  HeartSave,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from '../assets/icons/cart';
import { useCart, type CartItem } from '../context/CartContext';
import { DELIVERY_FEE, MIN_ORDER_VALUE, PLATFORM_FEE, couponSuggestions, recommendedProducts } from '../data/cart';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Cart'>;

const COUPON_DISCOUNTS: Record<string, number> = {
  FRESH50: 50,
  NEWUSER: 40,
  SAVE30: 30,
};

export function CartScreen({ navigation }: Props) {
  const { items, itemCount, increment, decrement, removeItem, addItem } = useCart();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const itemTotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.mrp ?? i.price) * i.quantity, 0),
    [items],
  );
  const productDiscount = useMemo(
    () => items.reduce((sum, i) => sum + ((i.mrp ?? i.price) - i.price) * i.quantity, 0),
    [items],
  );
  const couponDiscount = appliedCoupon ? COUPON_DISCOUNTS[appliedCoupon] ?? 0 : 0;
  const toPay = Math.max(0, itemTotal - productDiscount - couponDiscount + DELIVERY_FEE + PLATFORM_FEE);
  const amountNeeded = Math.max(0, MIN_ORDER_VALUE - (itemTotal - productDiscount));
  const progress = Math.min(1, (itemTotal - productDiscount) / MIN_ORDER_VALUE);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (COUPON_DISCOUNTS[code]) {
      setAppliedCoupon(code);
      Alert.alert('Coupon applied', `You saved an extra ₹${COUPON_DISCOUNTS[code]} with ${code}!`);
    } else {
      setAppliedCoupon(null);
      Alert.alert('Invalid coupon', `"${code}" is not a valid coupon code.`);
    }
  };

  const saveForLater = (item: CartItem) => {
    removeItem(item.id);
    Alert.alert('Saved for later', `${item.title} was moved out of your cart.`);
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
            <View style={styles.headerTitleRow}>
              <View>
                <Text style={styles.headerTitle}>My Cart</Text>
                <Text style={styles.headerSubtitle}>{itemCount} items</Text>
              </View>
              <View style={styles.deliveryBadge}>
                <View style={styles.deliveryDot}>
                  <DeliveryClock width={10} height={10} />
                </View>
                <Text style={styles.deliveryBadgeText}>9 min delivery</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Pressable style={styles.emptyButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.emptyButtonText}>Browse items</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
          {amountNeeded > 0 ? (
            <View style={styles.minOrderWrap}>
              <View style={styles.minOrderCard}>
                <View style={styles.minOrderBanner}>
                  <View style={styles.minOrderTopRow}>
                    <Text style={styles.minOrderLabel}>Minimum order: ₹{MIN_ORDER_VALUE}</Text>
                    <Text style={styles.minOrderNeeded}>₹{amountNeeded} more needed</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                  </View>
                </View>
                <View style={styles.minOrderBody}>
                  <Text style={styles.minOrderHint}>
                    Add items worth ₹{amountNeeded} more to place your order.
                  </Text>
                  <Pressable style={styles.browseButton} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.browseButtonText}>Browse items</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null}

          <View style={styles.itemsWrap}>
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onIncrement={() => increment(item.id)}
                onDecrement={() => decrement(item.id)}
                onRemove={() => removeItem(item.id)}
                onSave={() => saveForLater(item)}
              />
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.couponSection}>
            <View style={styles.couponHeaderRow}>
              <CouponTag width={18} height={18} />
              <Text style={styles.couponHeaderText}>Coupons & Offers</Text>
            </View>
            <View style={styles.couponInputRow}>
              <TextInput
                value={coupon}
                onChangeText={setCoupon}
                placeholder="Enter coupon code"
                placeholderTextColor="rgba(26,26,26,0.5)"
                style={styles.couponInput}
              />
              <Pressable
                style={[styles.couponApply, coupon.length > 0 && styles.couponApplyActive]}
                onPress={applyCoupon}
              >
                <Text style={[styles.couponApplyText, coupon.length > 0 && styles.couponApplyTextActive]}>
                  Apply
                </Text>
              </Pressable>
            </View>
            <View style={styles.couponChipsRow}>
              {couponSuggestions.map((code) => (
                <Pressable key={code} style={styles.couponChip} onPress={() => setCoupon(code)}>
                  <Text style={styles.couponChipText}>{code}</Text>
                </Pressable>
              ))}
            </View>
            {appliedCoupon ? (
              <Text style={styles.couponAppliedText}>
                &quot;{appliedCoupon}&quot; applied — you saved ₹{couponDiscount}
              </Text>
            ) : null}
          </View>

          <View style={styles.divider} />

          <View style={styles.recSection}>
            <View style={styles.recHeaderRow}>
              <Text style={styles.recHeaderTitle}>You may also want</Text>
              <Pressable onPress={() => navigation.navigate('Home')}>
                <Text style={styles.recSeeAll}>See all</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recList}
            >
              {recommendedProducts.map((p) => (
                <View key={p.id} style={styles.recCard}>
                  <View style={[styles.recImageWrap, { backgroundColor: p.bgColor }]}>
                    {p.image ? (
                      <Image source={p.image} style={styles.recImage} resizeMode="cover" />
                    ) : null}
                    <View style={styles.recDiscountBadge}>
                      <Text style={styles.recDiscountText}>{p.discountLabel}</Text>
                    </View>
                  </View>
                  <View style={styles.recBody}>
                    <Text style={styles.recName} numberOfLines={2}>
                      {p.name}
                    </Text>
                    <View style={styles.recPriceRow}>
                      <Text style={styles.recPrice}>₹{p.price}</Text>
                      <Text style={styles.recMrp}>₹{p.mrp}</Text>
                    </View>
                    <Pressable
                      style={styles.recAddButton}
                      onPress={() =>
                        addItem({
                          id: p.id,
                          title: p.name,
                          subtitle: '',
                          price: p.price,
                          mrp: p.mrp,
                          image: p.image ?? recommendedProducts[0].image!,
                        })
                      }
                    >
                      <Text style={styles.recAddText}>ADD</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.divider} />

          <View style={styles.billSection}>
            <Text style={styles.billTitle}>Bill Details</Text>
            <BillRow label="Item total (MRP)" value={`₹${itemTotal}`} />
            <BillRow label="Product discount" value={`−₹${productDiscount}`} valueColor="#1CA672" />
            {appliedCoupon ? (
              <BillRow label={`Coupon (${appliedCoupon})`} value={`−₹${couponDiscount}`} valueColor="#1CA672" />
            ) : null}
            <BillRow label="Delivery fee" value={`₹${DELIVERY_FEE}`} labelColor="#9CA3AF" />
            <BillRow label="Platform fee" value={`₹${PLATFORM_FEE}`} labelColor="#9CA3AF" />
            <View style={styles.billDividerLine} />
            <BillRow label="To Pay" value={`₹${toPay}`} bold />
            {productDiscount > 0 ? (
              <View style={styles.savingsBanner}>
                <Text style={styles.savingsEmoji}>🎉</Text>
                <Text style={styles.savingsText}>You save ₹{productDiscount} on this order!</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.divider} />

          <View style={styles.policySection}>
            <Text style={styles.policyText}>
              <Text style={styles.policyBold}>Cancellation Policy: </Text>
              Orders can be cancelled within 60 seconds of placing. A 100% refund will be issued for
              cancellations. We may not accept cancellations if the order is already being packed.
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {items.length > 0 ? (
        <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerAmount}>₹{toPay}</Text>
              <Text style={styles.footerLink}>View price details</Text>
            </View>
            <Pressable
              style={[styles.placeOrderButton, amountNeeded > 0 && styles.placeOrderDisabled]}
              disabled={amountNeeded > 0}
              onPress={() => navigation.navigate('Address')}
            >
              <Text style={styles.placeOrderText}>Place order</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      ) : null}
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
    <View style={billRowStyles.row}>
      <Text style={[billRowStyles.label, labelColor ? { color: labelColor } : null, bold && billRowStyles.bold]}>
        {label}
      </Text>
      <Text style={[billRowStyles.value, valueColor ? { color: valueColor } : null, bold && billRowStyles.boldValue]}>
        {value}
      </Text>
    </View>
  );
}

const billRowStyles = StyleSheet.create({
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
  bold: {
    fontWeight: '700',
  },
  boldValue: {
    fontWeight: '800',
    color: '#1A1A1A',
  },
});

function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onSave,
}: {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onSave: () => void;
}) {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemTopRow}>
        <View style={styles.itemImageWrap}>
          <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
        </View>
        <View style={styles.itemInfo}>
          <View style={styles.itemInfoTop}>
            <Text style={styles.itemTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Pressable style={styles.itemRemoveButton} onPress={onRemove} hitSlop={6}>
              <TrashIcon width={13} height={13} />
            </Pressable>
          </View>
          {item.subtitle ? <Text style={styles.itemSubtitle}>{item.subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.itemBottomRow}>
        <View style={styles.itemActionsRow}>
          <View style={styles.stepper}>
            <Pressable style={styles.stepperButton} onPress={onDecrement} hitSlop={4}>
              <MinusIcon width={14} height={14} />
            </Pressable>
            <Text style={styles.stepperValue}>{item.quantity}</Text>
            <Pressable style={styles.stepperButton} onPress={onIncrement} hitSlop={4}>
              <PlusIcon width={14} height={14} />
            </Pressable>
          </View>
          <Pressable style={styles.saveButton} onPress={onSave}>
            <HeartSave width={13} height={13} />
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
        <View style={styles.itemPriceWrap}>
          <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
          {item.mrp && item.mrp > item.price ? (
            <Text style={styles.itemMrp}>₹{item.mrp * item.quantity}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  headerSafe: { backgroundColor: '#FFFFFF' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deliveryDot: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#6A7282',
  },
  emptyButton: {
    backgroundColor: '#1CA672',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  minOrderWrap: {
    padding: 16,
  },
  minOrderCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    overflow: 'hidden',
  },
  minOrderBanner: {
    backgroundColor: '#FEF9C3',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  minOrderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  minOrderLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#713F12',
  },
  minOrderNeeded: {
    fontSize: 13,
    fontWeight: '800',
    color: '#713F12',
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#FDE68A',
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#D97706',
  },
  minOrderBody: {
    padding: 16,
    gap: 8,
  },
  minOrderHint: {
    fontSize: 12,
    color: '#6B7280',
  },
  browseButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#1CA672',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  browseButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemsWrap: {
    paddingHorizontal: 16,
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
  },
  itemTopRow: {
    flexDirection: 'row',
    gap: 16,
  },
  itemImageWrap: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemInfoTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },
  itemRemoveButton: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#6A7282',
    paddingTop: 2,
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  itemActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    width: 94,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    overflow: 'hidden',
  },
  stepperButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  itemPriceWrap: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  itemMrp: {
    fontSize: 10,
    color: '#C0C0C0',
    textDecorationLine: 'line-through',
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
    marginTop: 12,
  },
  couponSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  couponHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  couponHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    color: '#1A1A1A',
  },
  couponApply: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponApplyActive: {
    backgroundColor: '#1CA672',
  },
  couponApplyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  couponApplyTextActive: {
    color: '#FFFFFF',
  },
  couponChipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
  },
  couponChip: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  couponChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1CA672',
  },
  couponAppliedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
    paddingTop: 10,
  },
  recSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  recHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  recHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  recSeeAll: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
  },
  recList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  recCard: {
    width: 138,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    overflow: 'hidden',
  },
  recImageWrap: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recImage: {
    width: '100%',
    height: '100%',
  },
  recDiscountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#1CA672',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  recDiscountText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recBody: {
    padding: 10,
  },
  recName: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1A1A1A',
    height: 30,
  },
  recPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingTop: 6,
    paddingBottom: 8,
  },
  recPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  recMrp: {
    fontSize: 10,
    color: '#C0C0C0',
    textDecorationLine: 'line-through',
  },
  recAddButton: {
    height: 28,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recAddText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
  },
  billSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  billTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingBottom: 4,
  },
  billDividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 10,
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
    marginTop: 12,
  },
  savingsEmoji: {
    fontSize: 15,
  },
  savingsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1CA672',
  },
  policySection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  policyText: {
    fontSize: 11,
    lineHeight: 17.6,
    color: '#9CA3AF',
  },
  policyBold: {
    fontWeight: '700',
    color: '#6B7280',
  },
  bottomSpacer: {
    height: 16,
  },
  footerSafe: {
    backgroundColor: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 4,
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  footerLink: {
    fontSize: 14,
    color: '#2A55E5',
  },
  placeOrderButton: {
    backgroundColor: '#1CA672',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  placeOrderDisabled: {
    opacity: 0.5,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
