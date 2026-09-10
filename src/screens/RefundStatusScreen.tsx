import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InfoIcon, SavingsIcon } from '../assets/icons/order';
import { VerticalStepList, type VerticalStep } from '../components/order/VerticalStepList';
import { activeOrder } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'RefundStatus'>;

const STEPS: VerticalStep[] = [
  { title: 'Cancellation confirmed', subtitle: '4 Sep 2026, 2:15 PM', status: 'done' },
  { title: 'Refund initiated with bank', subtitle: '4 Sep 2026, 2:16 PM', status: 'done' },
  { title: 'Bank processing refund', subtitle: 'Expected by 7 Sep 2026', status: 'current', badge: 'In progress' },
  { title: 'Credited to Google Pay', subtitle: 'Expected by 11 Sep 2026', status: 'pending' },
];

const AUTO_ADVANCE_MS = 5000;

export function RefundStatusScreen({ navigation }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      navigation.replace('RefundCompleted');
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [navigation]);

  const handleReportDelay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    navigation.navigate('RefundDelayed');
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Refund Status</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Processing</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.amountCard}>
            <View style={styles.amountIconWrap}>
              <SavingsIcon width={22} height={22} />
            </View>
            <View style={styles.amountTextWrap}>
              <Text style={styles.amountValue}>₹477</Text>
              <Text style={styles.amountSubtitle}>Order cancelled · {activeOrder.id}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Refund timeline</Text>
            <View style={styles.stepListWrap}>
              <VerticalStepList steps={STEPS} accentColor="#1CA672" />
            </View>
          </View>

          <View style={styles.infoBanner}>
            <InfoIcon width={16} height={16} />
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoTitle}>About UPI refunds</Text>
              <Text style={styles.infoSubtitle}>
                UPI refunds are processed by your bank and usually reflect within 5–7 business days. Once we
                initiate, we have no control over bank processing speeds.
              </Text>
            </View>
          </View>

          <Pressable style={styles.helpButton} onPress={handleReportDelay}>
            <Text style={styles.helpButtonText}>Refund not received? Get help →</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statusPill: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
  },
  body: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  amountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  amountIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountTextWrap: {
    flex: 1,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  amountSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    paddingTop: 2,
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
  },
  stepListWrap: {
    paddingTop: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 24,
    padding: 16,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 17,
    paddingTop: 2,
  },
  helpButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});
