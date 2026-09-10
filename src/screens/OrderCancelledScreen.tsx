import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckIcon, TrackIcon } from '../assets/icons/order';
import { activeOrder } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrderCancelled'>;

export function OrderCancelledScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <View style={styles.heroDecorLarge} />
          <View style={styles.heroDecorSmall} />
          <View style={styles.heroContent}>
            <View style={styles.checkCircle}>
              <CheckIcon width={34} height={34} />
            </View>
            <Text style={styles.heroTitle}>Order Cancelled</Text>
            <Text style={styles.heroSubtitle}>{activeOrder.id}</Text>
            <View style={styles.heroChipsRow}>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipLabel}>REFUND AMOUNT</Text>
                <Text style={styles.heroChipValueGreen}>₹477</Text>
              </View>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipLabel}>TIMELINE</Text>
                <Text style={styles.heroChipValue}>5–7 business days</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Refund details</Text>
            <RefundRow label="Refund to" value={activeOrder.payment.method} />
            <RefundRow label="UPI ID" value={activeOrder.payment.account} />
            <RefundRow label="Amount" value={`₹477`} />
            <RefundRow label="Reference" value={activeOrder.payment.transactionId} />
            <RefundRow label="Expected by" value="11 Sep 2026" last />
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerText}>
                Refunds to UPI usually arrive within 5–7 business days. Bank delays are rare but possible.
              </Text>
            </View>
          </View>

          <Pressable style={styles.trackButton} onPress={() => navigation.navigate('RefundStatus')}>
            <TrackIcon width={16} height={16} />
            <Text style={styles.trackButtonText}>Track Refund Status</Text>
          </Pressable>
          <Pressable
            style={styles.continueButton}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </Pressable>
          <Pressable style={styles.supportLinkWrap} onPress={() => navigation.navigate('SupportHome')}>
            <Text style={styles.supportLink}>Having an issue? Contact support</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function RefundRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[refundRowStyles.row, last && refundRowStyles.rowLast]}>
      <Text style={refundRowStyles.label}>{label}</Text>
      <Text style={refundRowStyles.value}>{value}</Text>
    </View>
  );
}

const refundRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  heroSafe: {
    backgroundColor: '#1E293B',
    overflow: 'hidden',
  },
  heroDecorLarge: {
    position: 'absolute',
    right: -20,
    top: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroDecorSmall: {
    position: 'absolute',
    left: -10,
    bottom: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    paddingTop: 4,
  },
  heroChipsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
  },
  heroChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 115,
  },
  heroChipLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },
  heroChipValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingTop: 4,
  },
  heroChipValueGreen: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4ADE80',
    paddingTop: 4,
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingBottom: 4,
  },
  infoBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  infoBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
    lineHeight: 18,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  trackButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  supportLinkWrap: {
    alignItems: 'center',
    paddingTop: 4,
  },
  supportLink: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },
});
