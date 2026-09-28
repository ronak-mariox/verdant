import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
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
  HeartSave,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from '../assets/icons/cart';
import { BillRow } from '../components/order/BillRow';
import { useCart, type CartItem, type UnavailableCartLine } from '../context/CartContext';
import { MIN_ORDER_VALUE } from '../data/cart';
import { api, getErrorMessage } from '../services/api';
import { resolveProductImage } from '../utils/productImage';
import { primaryVariant, variantPrice } from '../utils/productMappers';
import type { AuthStackParamList } from '../navigation/types';
import { summarizeLines, type PagedResponse, type RawProduct } from '../types/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Cart'>;

interface RecommendedProduct {
  id: string;
  variantId: string;
  image: ReturnType<typeof resolveProductImage>;
  name: string;
  price: number;
  mrp: number;
  discountLabel: string;
  bgColor: string;
}

const REC_BG_COLORS = ['#EFF6FF', '#FEFCE8', '#FDF4FF', '#F0FDF4', '#FFF7ED'];

export function CartScreen({ navigation }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const billOffsetY = useRef(0);
  const {
    items,
    itemCount,
    increment,
    decrement,
    removeItem,
    addItem,
    pricing,
    couponCode,
    couponMessage,
    unavailable,
    applyCoupon: applyCouponToCart,
    removeCoupon,
    refreshCart,
  } = useCart();
  const [coupon, setCoupon] = useState('');
  const [removingCoupon, setRemovingCoupon] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [recommended, setRecommended] = useState<RecommendedProduct[]>([]);

  useEffect(() => {
    api
      .get<PagedResponse<RawProduct>>('/customer/products', { params: { limit: 6, sort: 'newest' } })
      .then(({ data }) => {
        setRecommended(
          data.items
            .map((p, index) => {
              const variant = primaryVariant(p);
              if (!variant || variant.stock <= 0) return null;
              const price = variantPrice(variant);
              const discountPct = variant.mrp > 0 && variant.mrp > price ? Math.round(((variant.mrp - price) / variant.mrp) * 100) : 0;
              return {
                id: p.id,
                variantId: variant.id,
                image: resolveProductImage(p.images[0]),
                name: p.name,
                price,
                mrp: variant.mrp,
                discountLabel: `${discountPct}%`,
                bgColor: REC_BG_COLORS[index % REC_BG_COLORS.length],
              };
            })
            .filter((p): p is RecommendedProduct => p !== null),
        );
      })
      .catch(() => {});
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshCart()
      .catch((err) => Alert.alert('Could not refresh cart', getErrorMessage(err)))
      .finally(() => setRefreshing(false));
  }, [refreshCart]);

  const { itemTotal, offerDiscount } = useMemo(() => summarizeLines(items), [items]);
  const deliveryFee = pricing?.deliveryFee ?? 0;
  const platformFee = pricing?.platformFee ?? 0;
  const taxTotal = pricing?.taxTotal ?? 0;
  const couponDiscount = pricing?.discount ?? 0;
  const toPay = pricing?.grandTotal ?? 0;
  const amountNeeded = Math.max(0, MIN_ORDER_VALUE - (pricing?.itemsTotal ?? 0));
  const progress = Math.min(1, (pricing?.itemsTotal ?? 0) / MIN_ORDER_VALUE);

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    try {
      await applyCouponToCart(code);
      setCoupon('');
      Alert.alert('Coupon applied', `"${code}" was applied to your order!`);
    } catch (err) {
      Alert.alert('Invalid coupon', getErrorMessage(err, `"${code}" is not a valid coupon code.`));
    }
  };

  const handleRemoveCoupon = async () => {
    setRemovingCoupon(true);
    try {
      await removeCoupon();
    } catch (err) {
      Alert.alert('Could not remove coupon', getErrorMessage(err));
    } finally {
      setRemovingCoupon(false);
    }
  };

  const saveForLater = async (item: CartItem) => {
    try {
      const { data } = await api.post<{ isWishlisted: boolean }>(`/customer/wishlist/${item.productId}/toggle`);
      // Toggle un-saves an already-saved product; flip it back so "save" is never a remove.
      if (!data.isWishlisted) await api.post(`/customer/wishlist/${item.productId}/toggle`);
      await removeItem(item.id);
      Alert.alert('Saved for later', `${item.title} was moved to your saved items.`);
    } catch (err) {
      Alert.alert('Could not save item', getErrorMessage(err));
    }
  };

  const handleCartAction = (action: Promise<void>) => {
    action.catch((err) => Alert.alert('Could not update cart', getErrorMessage(err)));
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
                <Text style={styles.headerSubtitle}>
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {items.length === 0 && unavailable.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyWrap}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1CA672" />}
        >
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Pressable style={styles.emptyButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.emptyButtonText}>Browse items</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1CA672" />}
        >
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
            {unavailable.map((line) => (
              <UnavailableLineCard
                key={`${line.productId}::${line.variantId}`}
                line={line}
                onRemove={() => handleCartAction(removeItem(`${line.productId}::${line.variantId}`))}
              />
            ))}
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onIncrement={() => handleCartAction(increment(item.id))}
                onDecrement={() => handleCartAction(decrement(item.id))}
                onRemove={() => handleCartAction(removeItem(item.id))}
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
                onPress={handleApplyCoupon}
              >
                <Text style={[styles.couponApplyText, coupon.length > 0 && styles.couponApplyTextActive]}>
                  Apply
                </Text>
              </Pressable>
            </View>
            {couponCode ? (
              <View style={styles.couponAppliedRow}>
                <Text style={styles.couponAppliedText}>
                  &quot;{couponCode}&quot; applied — you saved ₹{couponDiscount}
                </Text>
                <Pressable onPress={handleRemoveCoupon} disabled={removingCoupon} hitSlop={8}>
                  <Text style={styles.couponRemoveText}>{removingCoupon ? 'Removing…' : 'Remove'}</Text>
                </Pressable>
              </View>
            ) : couponMessage ? (
              <Text style={styles.couponAppliedText}>{couponMessage}</Text>
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
              {recommended.map((p) => (
                <View key={p.id} style={styles.recCard}>
                  <View style={[styles.recImageWrap, { backgroundColor: p.bgColor }]}>
                    <Image source={p.image} style={styles.recImage} resizeMode="cover" />
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
                      onPress={() => addItem(p.id, p.variantId).catch((err) => Alert.alert('Could not add to cart', getErrorMessage(err)))}
                    >
                      <Text style={styles.recAddText}>ADD</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.divider} />

          <View
            style={styles.billSection}
            onLayout={(event) => {
              billOffsetY.current = event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.billTitle}>Bill Details</Text>
            <BillRow label="Item total" value={`₹${itemTotal}`} />
            {offerDiscount > 0 ? <BillRow label="Offer discount" value={`−₹${offerDiscount}`} valueColor="#1CA672" /> : null}
            {couponCode && couponDiscount > 0 ? (
              <BillRow label={`Coupon (${couponCode})`} value={`−₹${couponDiscount}`} valueColor="#1CA672" />
            ) : null}
            {taxTotal > 0 ? <BillRow label="Taxes" value={`₹${taxTotal}`} labelColor="#9CA3AF" /> : null}
            <BillRow label="Delivery fee" value={deliveryFee > 0 ? `₹${deliveryFee}` : 'FREE'} labelColor="#9CA3AF" />
            {platformFee > 0 ? <BillRow label="Platform fee" value={`₹${platformFee}`} labelColor="#9CA3AF" /> : null}
            <View style={styles.billDividerLine} />
            <BillRow label="To Pay" value={`₹${toPay}`} bold />
            {offerDiscount + couponDiscount > 0 ? (
              <View style={styles.savingsBanner}>
                <Text style={styles.savingsEmoji}>🎉</Text>
                <Text style={styles.savingsText}>You save ₹{offerDiscount + couponDiscount} on this order!</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.divider} />

          <View style={styles.policySection}>
            <Text style={styles.policyText}>
              <Text style={styles.policyBold}>Cancellation Policy: </Text>
              Orders can be cancelled until the store starts preparing them. Cash on Delivery orders are never
              charged, so there is nothing to refund.
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {items.length > 0 || unavailable.length > 0 ? (
        <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerAmount}>₹{toPay}</Text>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => scrollRef.current?.scrollTo({ y: billOffsetY.current, animated: true })}
              >
                <Text style={styles.footerLink}>View price details</Text>
              </Pressable>
            </View>
            <Pressable
              style={[styles.placeOrderButton, (amountNeeded > 0 || items.length === 0) && styles.placeOrderDisabled]}
              disabled={amountNeeded > 0 || items.length === 0}
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
  const canIncrement = item.quantity < item.maxStock;
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
          {!canIncrement ? <Text style={styles.stockHint}>Only {item.maxStock} available</Text> : null}
        </View>
      </View>
      <View style={styles.itemBottomRow}>
        <View style={styles.itemActionsRow}>
          <View style={styles.stepper}>
            <Pressable style={styles.stepperButton} onPress={onDecrement} hitSlop={4}>
              <MinusIcon width={14} height={14} />
            </Pressable>
            <Text style={styles.stepperValue}>{item.quantity}</Text>
            <Pressable
              style={[styles.stepperButton, !canIncrement && styles.stepperButtonDisabled]}
              onPress={onIncrement}
              disabled={!canIncrement}
              hitSlop={4}
            >
              <PlusIcon width={14} height={14} />
            </Pressable>
          </View>
          <Pressable style={styles.saveButton} onPress={onSave}>
            <HeartSave width={13} height={13} />
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
        <View style={styles.itemPriceWrap}>
          <Text style={styles.itemPrice}>₹{item.subtotal}</Text>
          {item.originalSubtotal > item.subtotal ? <Text style={styles.itemMrp}>₹{item.originalSubtotal}</Text> : null}
        </View>
      </View>
    </View>
  );
}

function UnavailableLineCard({ line, onRemove }: { line: UnavailableCartLine; onRemove: () => void }) {
  return (
    <View style={[styles.itemCard, styles.unavailableCard]}>
      <View style={styles.itemInfoTop}>
        <View style={styles.itemInfo}>
          <Text style={styles.unavailableTitle}>Item unavailable</Text>
          <Text style={styles.unavailableReason}>{line.reason}</Text>
        </View>
        <Pressable style={styles.itemRemoveButton} onPress={onRemove} hitSlop={6}>
          <TrashIcon width={13} height={13} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepperButtonDisabled: {
    opacity: 0.35,
  },
  stockHint: {
    fontSize: 11,
    color: '#DC2626',
    paddingTop: 2,
  },
  unavailableCard: {
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  unavailableTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
  },
  unavailableReason: {
    fontSize: 12,
    color: '#7F1D1D',
    paddingTop: 2,
  },
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
  couponAppliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 10,
  },
  couponAppliedText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
  },
  couponRemoveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
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
