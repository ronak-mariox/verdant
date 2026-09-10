import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon, ReorderPinIcon } from '../assets/icons/order';
import { useCart } from '../context/CartContext';
import { activeOrder, reorderItems } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Reorder'>;

const DELIVERY_FEE = 0;
const PLATFORM_FEE = 5;

export function ReorderScreen({ navigation, route }: Props) {
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(reorderItems.map((item) => [item.id, item.id === 'ro-3' ? 2 : 1])),
  );

  const orderId = route.params?.orderId ?? activeOrder.id;

  const setQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  };

  const cartItemCount = useMemo(
    () => Object.values(quantities).reduce((sum, q) => sum + q, 0),
    [quantities],
  );
  const itemTotal = useMemo(
    () => reorderItems.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 0), 0),
    [quantities],
  );
  const total = itemTotal + DELIVERY_FEE + PLATFORM_FEE;

  const handlePlaceReorder = () => {
    reorderItems.forEach((item) => {
      const qty = quantities[item.id] ?? 0;
      if (qty > 0) {
        addItem(
          {
            id: item.id,
            title: item.name,
            subtitle: item.subtitle,
            price: item.price,
            image: item.image,
          },
          qty,
        );
      }
    });
    navigation.navigate('Cart');
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
            <Text style={styles.headerTitle}>Reorder</Text>
            <Text style={styles.headerSubtitle}>
              From {orderId} · {activeOrder.shortDate}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Items</Text>
              <Text style={styles.cardHeaderCount}>{cartItemCount} in cart</Text>
            </View>
            {reorderItems.map((item, index) => {
              const qty = quantities[item.id] ?? 0;
              return (
                <View
                  key={item.id}
                  style={[styles.itemRow, index === reorderItems.length - 1 && styles.itemRowLast]}
                >
                  <View style={styles.itemImageWrap}>
                    <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  </View>
                  <View style={styles.stepper}>
                    <Pressable style={styles.stepperButton} onPress={() => setQuantity(item.id, -1)} hitSlop={4}>
                      <Text style={styles.stepperSymbol}>−</Text>
                    </Pressable>
                    <Text style={styles.stepperValue}>{qty}</Text>
                    <Pressable style={styles.stepperButton} onPress={() => setQuantity(item.id, 1)} hitSlop={4}>
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
                <Text style={styles.homeTagText}>🏠 {activeOrder.address.label}</Text>
              </View>
            </View>
            <View style={styles.addressBody}>
              <Text style={styles.addressName}>{activeOrder.address.name}</Text>
              <Text style={styles.addressLine}>{activeOrder.address.line1}</Text>
              <Text style={styles.addressLine}>{activeOrder.address.line2}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Bill summary</Text>
            </View>
            <View style={styles.billBody}>
              <BillRow label="Item total" value={`₹${itemTotal}`} />
              <BillRow label="Delivery fee" value={DELIVERY_FEE === 0 ? 'FREE' : `₹${DELIVERY_FEE}`} valueColor="#1CA672" />
              <BillRow label="Platform fee" value={`₹${PLATFORM_FEE}`} labelColor="#9CA3AF" />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{total}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <View style={styles.footerTopRow}>
            <View>
              <Text style={styles.footerItemCount}>{cartItemCount} items</Text>
              <Text style={styles.footerTotal}>₹{total}</Text>
            </View>
            <View style={styles.footerEtaPill}>
              <View style={styles.footerEtaDot} />
              <Text style={styles.footerEtaText}>12 min delivery</Text>
            </View>
          </View>
          <Pressable
            style={[styles.placeReorderButton, cartItemCount === 0 && styles.placeReorderButtonDisabled]}
            disabled={cartItemCount === 0}
            onPress={handlePlaceReorder}
          >
            <Text style={styles.placeReorderText}>Place Reorder · ₹{total}</Text>
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
  footerEtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  footerEtaDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1CA672',
  },
  footerEtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
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
