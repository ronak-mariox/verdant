import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon } from '../assets/icons/order';
import { VerticalStepList, type VerticalStep } from '../components/order/VerticalStepList';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'IssueResolved'>;

const STEPS: VerticalStep[] = [
  { title: 'Refund initiated', subtitle: '4 Sep 2026, 4:15 PM', status: 'done' },
  { title: 'Bank processing', subtitle: 'Expected by 9 Sep 2026', status: 'current' },
  { title: 'Credited to Google Pay', subtitle: 'Expected by 11 Sep 2026', status: 'pending' },
];

export function IssueResolvedScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <Text style={styles.headerTitle}>Issue Resolution</Text>
          <View style={styles.resolvedPill}>
            <Text style={styles.resolvedPillText}>✓ Resolved</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.summaryRow}>
              <Text style={styles.celebrationEmoji}>🎉</Text>
              <Text style={styles.celebrationTitle}>Refund accepted!</Text>
              <Text style={styles.celebrationSubtitle}>
                ₹148 will be credited to your Google Pay account within 5–7 business days.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.stepListWrap}>
              <VerticalStepList steps={STEPS} accentColor="#1CA672" />
            </View>
          </View>

          <View style={styles.rateRow}>
            <Text style={styles.rateEmoji}>⭐</Text>
            <View style={styles.rateTextWrap}>
              <Text style={styles.rateTitle}>Rate your experience</Text>
              <Text style={styles.rateSubtitle}>Help us improve our support quality</Text>
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
  headerTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  resolvedPill: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resolvedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1CA672',
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  summaryRow: {
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 40,
  },
  celebrationTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingTop: 8,
  },
  celebrationSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingTop: 6,
  },
  stepListWrap: {
    paddingTop: 4,
  },
  rateRow: {
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
  rateEmoji: {
    fontSize: 22,
  },
  rateTextWrap: {
    flex: 1,
  },
  rateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  rateSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  continueButton: {
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
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
