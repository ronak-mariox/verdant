import React from 'react';
import { Linking, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatIcon, CallIcon, HelpIcon, MoneyAmberIcon } from '../assets/icons/order';
import { VerticalStepList, type VerticalStep } from '../components/order/VerticalStepList';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'RefundDelayed'>;

const STEPS: VerticalStep[] = [
  { title: 'Cancellation confirmed', subtitle: '4 Sep 2026, 2:15 PM', status: 'done' },
  { title: 'Refund initiated', subtitle: '4 Sep 2026, 2:16 PM', status: 'done' },
  { title: 'Waiting on bank processing', subtitle: 'Delayed — expected 7 Sep, still pending', status: 'current' },
  { title: 'Credited to Google Pay', subtitle: 'No update yet', status: 'pending' },
];

export function RefundDelayedScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Refund Delayed</Text>
          <View style={styles.overduePill}>
            <Text style={styles.overduePillText}>Overdue</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.warnCard}>
            <View style={styles.warnHeaderRow}>
              <View style={styles.warnIconWrap}>
                <MoneyAmberIcon width={20} height={20} />
              </View>
              <View style={styles.warnTextWrap}>
                <Text style={styles.warnTitle}>Refund is taking longer than expected</Text>
                <Text style={styles.warnSubtitle}>Expected by 11 Sep · Now overdue</Text>
              </View>
            </View>
            <View style={styles.overdueRow}>
              <Text style={styles.overdueLabel}>Overdue by</Text>
              <Text style={styles.overdueValue}>3 days</Text>
            </View>
          </View>

          <View style={styles.amountCard}>
            <View style={styles.amountIconWrap}>
              <MoneyAmberIcon width={20} height={20} />
            </View>
            <View style={styles.amountTextWrap}>
              <Text style={styles.amountValue}>₹477</Text>
              <Text style={styles.amountSubtitle}>Google Pay · priya@okaxis</Text>
            </View>
            <View style={styles.amountRight}>
              <Text style={styles.initiatedLabel}>Initiated</Text>
              <Text style={styles.initiatedValue}>4 Sep 2026</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What happened</Text>
            <View style={styles.stepListWrap}>
              <VerticalStepList steps={STEPS} accentColor="#F59E0B" />
            </View>
            <View style={styles.warnBanner}>
              <Text style={styles.warnBannerText}>
                ⏱ Blinkit initiated the refund on time. Bank processing delays are outside our control, but
                we&apos;re monitoring it.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>ESCALATION OPTIONS</Text>

          <Pressable style={styles.optionCardGreen} onPress={() => navigation.navigate('SupportHome')}>
            <ChatIcon width={22} height={22} />
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Chat with Blinkit support</Text>
              <Text style={styles.optionSubtitle}>We&apos;ll track the refund with your bank on your behalf</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.optionCardBlue}
            onPress={() =>
              Share.share({
                message: 'Refund reference details — TXN240904214523 · REFUND-04214523. Please share this with your bank to trace the pending UPI refund.',
              }).catch(() => {})
            }
          >
            <CallIcon width={22} height={22} />
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Contact your bank directly</Text>
              <Text style={styles.optionSubtitle}>Share ref: TXN240904214523 · REFUND-04214523</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.optionCardPurple}
            onPress={() => Linking.openURL('https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism')}
          >
            <HelpIcon width={22} height={22} />
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Raise NPCI complaint</Text>
              <Text style={styles.optionSubtitle}>File via UPI Dispute portal if bank doesn&apos;t resolve in 7d</Text>
            </View>
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
  overduePill: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  overduePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  body: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  warnCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 24,
    padding: 20,
  },
  warnHeaderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  warnIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warnTextWrap: {
    flex: 1,
  },
  warnTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
  },
  warnSubtitle: {
    fontSize: 12,
    color: '#B45309',
    paddingTop: 2,
  },
  overdueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  overdueLabel: {
    fontSize: 12,
    color: '#92400E',
  },
  overdueValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F59E0B',
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
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountTextWrap: {
    flex: 1,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  amountSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    paddingTop: 2,
  },
  amountRight: {
    alignItems: 'flex-end',
  },
  initiatedLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  initiatedValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
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
  },
  stepListWrap: {
    paddingTop: 16,
  },
  warnBanner: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
  },
  warnBannerText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    paddingLeft: 4,
    paddingTop: 4,
  },
  optionCardGreen: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 24,
    padding: 16,
  },
  optionCardBlue: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 24,
    padding: 16,
  },
  optionCardPurple: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FDF4FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 24,
    padding: 16,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  optionSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    paddingTop: 2,
  },
});
