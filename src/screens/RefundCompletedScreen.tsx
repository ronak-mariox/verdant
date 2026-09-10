import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckIcon } from '../assets/icons/order';
import { activeOrder } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'RefundCompleted'>;

const EMOJIS = ['😞', '😐', '🙂', '😊', '🤩'];

export function RefundCompletedScreen({ navigation }: Props) {
  const [ratedIndex, setRatedIndex] = useState<number | null>(null);

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <Text style={styles.headerTitle}>Refund Completed</Text>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <View style={styles.heroDecor} />
          <View style={styles.heroContent}>
            <View style={styles.checkCircle}>
              <CheckIcon width={34} height={34} />
            </View>
            <Text style={styles.heroTitle}>Refund Credited!</Text>
            <Text style={styles.heroAmount}>₹477</Text>
            <Text style={styles.heroSubtitle}>Credited on 9 Sep 2026 · Google Pay</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.card}>
            <RefundRow label="Refund amount" value="₹477" />
            <RefundRow label="Credited to" value={activeOrder.payment.method} />
            <RefundRow label="UPI ID" value={activeOrder.payment.account} />
            <RefundRow label="Original order" value={activeOrder.id} />
            <RefundRow label="Initiated on" value="4 Sep 2026, 2:16 PM" />
            <RefundRow label="Credited on" value="9 Sep 2026, 10:43 AM" last />
          </View>

          <View style={styles.card}>
            <Text style={styles.feedbackTitle}>How was your cancellation experience?</Text>
            <View style={styles.emojiRow}>
              {EMOJIS.map((emoji, index) => (
                <Pressable
                  key={emoji}
                  style={[styles.emojiButton, ratedIndex === index && styles.emojiButtonActive]}
                  onPress={() => setRatedIndex(index)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            style={styles.continueButton}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
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
  headerSafe: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  heroWrap: {
    backgroundColor: '#1CA672',
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  heroDecor: {
    position: 'absolute',
    right: -14,
    top: -12,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  heroContent: {
    alignItems: 'center',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroAmount: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    paddingTop: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
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
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 14,
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiButtonActive: {
    backgroundColor: '#DCFCE7',
  },
  emojiText: {
    fontSize: 22,
  },
  continueButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
