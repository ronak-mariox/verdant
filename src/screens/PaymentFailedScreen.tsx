import React, { useMemo } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FailedIcon } from '../assets/icons/checkout';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'PaymentFailed'>;

const REASONS = [
  'Insufficient balance in your account',
  'Bank server took too long to respond',
  'Incorrect UPI PIN or card details',
  'Network connection was interrupted',
];

export function PaymentFailedScreen({ navigation, route }: Props) {
  const transactionId = useMemo(() => `TXN${Math.floor(100000000 + Math.random() * 900000000)}`, []);

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <FailedIcon width={56} height={56} />
        </View>
        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.subtitle}>
          {route.params?.message ??
            "We couldn't process your payment. Don't worry, no amount has been deducted from your account."}
        </Text>

        <View style={styles.txnCard}>
          <Text style={styles.txnLabel}>Transaction ID</Text>
          <Text style={styles.txnValue}>{transactionId}</Text>
        </View>

        <View style={styles.reasonsCard}>
          <Text style={styles.reasonsTitle}>Possible reasons</Text>
          {REASONS.map((reason) => (
            <View key={reason} style={styles.reasonRow}>
              <View style={styles.reasonBullet} />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable style={styles.retryButton} onPress={() => navigation.replace('Processing')}>
            <Text style={styles.retryButtonText}>Retry Payment</Text>
          </Pressable>
          <Pressable style={styles.altButton} onPress={() => navigation.replace('Payment')}>
            <Text style={styles.altButtonText}>Try Another Method</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    paddingTop: 8,
  },
  txnCard: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 24,
  },
  txnLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  txnValue: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  reasonsCard: {
    alignSelf: 'stretch',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    gap: 8,
  },
  reasonsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    paddingBottom: 2,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  reasonBullet: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#DC2626',
    marginTop: 6,
  },
  reasonText: {
    flex: 1,
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 17,
  },
  footerSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footer: {
    padding: 16,
    gap: 10,
  },
  retryButton: {
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
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  altButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  altButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
});
