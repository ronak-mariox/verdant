import React, { useState } from 'react';
import { Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckIcon, CopyIcon } from '../assets/icons/order';
import { VerticalStepList, type VerticalStep } from '../components/order/VerticalStepList';
import { ticketInfo } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'IssueSubmitted'>;

const STEPS: VerticalStep[] = [
  { title: 'Issue received', subtitle: ticketInfo.createdAt, status: 'done' },
  { title: 'Under review', subtitle: 'Our team will verify your claim', status: 'current' },
  { title: 'Resolution decision', subtitle: 'Refund, replacement or wallet credit', status: 'pending' },
  { title: 'Case closed', subtitle: "You'll be notified on the app", status: 'pending' },
];

export function IssueSubmittedScreen({ navigation }: Props) {
  const [copied, setCopied] = useState(false);

  const copyTicketRef = () => {
    setCopied(true);
    Share.share({ message: ticketInfo.id }).catch(() => {});
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor="#1CA672" />
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <View style={styles.heroDecor} />
          <View style={styles.heroContent}>
            <View style={styles.checkCircle}>
              <CheckIcon width={34} height={34} />
            </View>
            <Text style={styles.heroTitle}>Issue Submitted!</Text>
            <Text style={styles.heroSubtitle}>We&apos;re looking into it right away</Text>
            <View style={styles.heroChipsRow}>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipLabel}>TICKET ID</Text>
                <Text style={styles.heroChipValue}>{ticketInfo.id}</Text>
              </View>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipLabel}>RESPONSE IN</Text>
                <Text style={styles.heroChipValue}>{ticketInfo.responseTime}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What happens next</Text>
            <View style={styles.stepListWrap}>
              <VerticalStepList steps={STEPS} accentColor="#1CA672" />
            </View>
          </View>

          <View style={styles.ticketCard}>
            <View style={styles.ticketTextWrap}>
              <Text style={styles.ticketLabel}>Ticket reference</Text>
              <Text style={styles.ticketValue}>{ticketInfo.id}</Text>
            </View>
            <Pressable style={styles.copyButton} onPress={copyTicketRef}>
              <CopyIcon width={12} height={12} />
              <Text style={styles.copyButtonText}>{copied ? 'Copied' : 'Copy'}</Text>
            </Pressable>
          </View>

          <Pressable style={styles.trackButton} onPress={() => navigation.navigate('IssueResolution')}>
            <Text style={styles.trackButtonText}>Track This Issue</Text>
          </Pressable>
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
  heroSafe: {
    backgroundColor: '#1CA672',
    overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute',
    right: -14,
    top: -10,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.07)',
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
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    paddingTop: 2,
  },
  heroChipsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
  },
  heroChip: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  heroChipLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
  },
  heroChipValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
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
  },
  stepListWrap: {
    paddingTop: 16,
  },
  ticketCard: {
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
  ticketTextWrap: {
    flex: 1,
  },
  ticketLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  ticketValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingTop: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
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
  continueButton: {
    height: 46,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});
