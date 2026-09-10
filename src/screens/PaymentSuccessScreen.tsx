import React from 'react';
import { Image, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DownloadIcon, PayCheckIcon, PaySavingsIcon } from '../assets/icons/order';
import { gpayLogo } from '../assets/images/order';
import { activeOrder, paySuccessItems } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'PaymentSuccess'>;

export function PaymentSuccessScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <View style={styles.heroContent}>
            <View style={styles.logoWrap}>
              <Image source={gpayLogo} style={styles.logoImage} resizeMode="contain" />
              <View style={styles.logoCheckBadge}>
                <PayCheckIcon width={12} height={12} />
              </View>
            </View>
            <Text style={styles.heroTitle}>Payment Successful!</Text>
            <Text style={styles.heroAmount}>₹{activeOrder.payment.amount}</Text>
            <Text style={styles.heroSubtitle}>
              {activeOrder.payment.method} · {activeOrder.payment.account}
            </Text>

            <View style={styles.receiptCard}>
              <ReceiptRow label="Transaction ID" value={activeOrder.payment.transactionId} />
              <ReceiptRow label="Date &amp; Time" value={activeOrder.payment.dateTime} />
              <ReceiptRow label="Order ID" value={activeOrder.id} last />
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.divider} />

        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Order summary</Text>
              <Text style={styles.cardHeaderCount}>6 items</Text>
            </View>
            <View style={styles.chipsWrap}>
              {paySuccessItems.map((item) => (
                <View key={item.id} style={styles.chip}>
                  {item.image ? (
                    <Image source={item.image} style={styles.chipImage} resizeMode="contain" />
                  ) : (
                    <View style={styles.chipImagePlaceholder} />
                  )}
                  <Text style={styles.chipText}>{item.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryLabel}>Delivery in</Text>
              <View style={styles.deliveryEtaRow}>
                <View style={styles.deliveryDot} />
                <Text style={styles.deliveryEtaValue}>{activeOrder.eta} mins</Text>
              </View>
            </View>
          </View>

          <View style={styles.savingsCard}>
            <PaySavingsIcon width={32} height={32} />
            <View style={styles.savingsTextWrap}>
              <Text style={styles.savingsTitle}>You saved ₹133!</Text>
              <Text style={styles.savingsSubtitle}>Item discounts + coupon FRESH50 applied</Text>
            </View>
          </View>

          <Pressable style={styles.trackButton} onPress={() => navigation.navigate('OrderTracking')}>
            <Text style={styles.trackButtonText}>Track your order →</Text>
          </Pressable>
          <Pressable
            style={styles.downloadButton}
            onPress={() =>
              Share.share({
                message: `Verdant Receipt — Order #${activeOrder.id}\nAmount: ₹${activeOrder.payment.amount}\n${activeOrder.payment.method} · ${activeOrder.payment.account}\nTransaction ID: ${activeOrder.payment.transactionId}\n${activeOrder.payment.dateTime}`,
              }).catch(() => {})
            }
          >
            <DownloadIcon width={14} height={14} />
            <Text style={styles.downloadButtonText}>Download receipt</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function ReceiptRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[receiptStyles.row, last && receiptStyles.rowLast]}>
      <Text style={receiptStyles.label}>{label}</Text>
      <Text style={receiptStyles.value}>{value}</Text>
    </View>
  );
}

const receiptStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  heroSafe: {
    backgroundColor: '#FFFFFF',
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoCheckBadge: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1CA672',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  heroAmount: {
    fontSize: 38,
    fontWeight: '900',
    color: '#1CA672',
    paddingTop: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    paddingTop: 4,
  },
  receiptCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    width: '100%',
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
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipImage: {
    width: 20,
    height: 20,
    borderRadius: 999,
  },
  chipImagePlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  deliveryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  deliveryEtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliveryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1CA672',
  },
  deliveryEtaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  savingsTextWrap: {
    flex: 1,
  },
  savingsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  savingsSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    paddingTop: 1,
  },
  trackButton: {
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
  trackButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
