import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon, RefundWalletIcon } from '../assets/icons/order';
import { OrderMiniCard } from '../components/order/OrderMiniCard';
import { cancellationPolicy, cancellationReasons } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CancelOrder'>;

export function CancelOrderScreen({ navigation }: Props) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Cancel Order</Text>
            <Text style={styles.headerSubtitle}>Order will be cancelled and refund initiated</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <OrderMiniCard />

          <View style={styles.refundBanner}>
            <View style={styles.refundIconWrap}>
              <RefundWalletIcon width={16} height={16} />
            </View>
            <View style={styles.refundTextWrap}>
              <Text style={styles.refundTitle}>₹477 refund to Google Pay</Text>
              <Text style={styles.refundSubtitle}>Within 5–7 business days · priya@okaxis</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Why are you cancelling?</Text>
            {cancellationReasons.map((reason, index) => {
              const active = reason.id === selectedReason;
              return (
                <Pressable
                  key={reason.id}
                  style={[styles.reasonRow, index === cancellationReasons.length - 1 && styles.reasonRowLast]}
                  onPress={() => setSelectedReason(reason.id)}
                >
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active ? <View style={styles.radioDot} /> : null}
                  </View>
                  <View style={styles.reasonTextWrap}>
                    <Text style={styles.reasonTitle}>{reason.title}</Text>
                    <Text style={styles.reasonSubtitle}>{reason.subtitle}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.card}>
            <Text style={styles.policyTitle}>Cancellation policy</Text>
            {cancellationPolicy.map((line) => (
              <View key={line} style={styles.policyRow}>
                <View style={styles.policyDot} />
                <Text style={styles.policyText}>{line}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable
            style={[styles.confirmButton, !selectedReason && styles.confirmButtonDisabled]}
            disabled={!selectedReason}
            onPress={() => navigation.navigate('OrderCancelled')}
          >
            <Text style={styles.confirmButtonText}>
              {selectedReason ? 'Confirm Cancellation' : 'Select a reason to continue'}
            </Text>
          </Pressable>
          <Pressable style={styles.keepButton} onPress={() => navigation.goBack()}>
            <Text style={styles.keepButtonText}>Keep My Order</Text>
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
    gap: 12,
    paddingBottom: 32,
  },
  refundBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  refundIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refundTextWrap: {
    flex: 1,
  },
  refundTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  refundSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    paddingTop: 1,
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
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  reasonRowLast: {
    borderBottomWidth: 0,
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
  reasonTextWrap: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  reasonSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  policyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    paddingBottom: 8,
  },
  policyRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  policyDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#9CA3AF',
    marginTop: 7,
  },
  policyText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 19.2,
  },
  footerSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 10,
  },
  confirmButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  keepButton: {
    height: 46,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
});
