import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon, ResolutionMissingIcon, ResolutionOfferIcon, StepCheckIcon } from '../assets/icons/order';
import { ticketInfo } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'IssueResolution'>;

export function IssueResolutionScreen({ navigation }: Props) {
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
              <View style={styles.summaryIconWrap}>
                <ResolutionMissingIcon width={20} height={20} />
              </View>
              <View style={styles.summaryTextWrap}>
                <Text style={styles.summaryTitle}>Missing item — {ticketInfo.id}</Text>
                <Text style={styles.summarySubtitle}>
                  Resolved on {ticketInfo.resolvedAt} · by {ticketInfo.agent}
                </Text>
              </View>
            </View>
            <Text style={styles.summaryBody}>
              We verified that Fortune Sunflower Oil (1 L) was missing from your delivery bag. We apologise for
              the inconvenience caused.
            </Text>
          </View>

          <View style={styles.offerCard}>
            <View style={styles.offerHeader}>
              <ResolutionOfferIcon width={18} height={18} />
              <Text style={styles.offerHeaderText}>RESOLUTION OFFERED</Text>
            </View>
            <View style={styles.offerBody}>
              <Text style={styles.offerAmount}>₹148 Refund</Text>
              <Text style={styles.offerDescription}>
                Full refund for Fortune Sunflower Oil (1 L) to your Google Pay account (priya@okaxis) within
                5–7 business days.
              </Text>
              <View style={styles.refBanner}>
                <StepCheckIcon width={14} height={14} />
                <Text style={styles.refBannerText}>Transaction ref: REFUND-04214523</Text>
              </View>
            </View>
          </View>

          <Pressable style={styles.acceptButton} onPress={() => navigation.navigate('IssueResolved')}>
            <Text style={styles.acceptButtonText}>Accept Refund</Text>
          </Pressable>
          <Pressable style={styles.disputeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.disputeButtonText}>Dispute Resolution</Text>
          </Pressable>
          <Text style={styles.footerNote}>
            Accepting this resolution closes the case. Disputes are reviewed within 48 hours.
          </Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  summaryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  summarySubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  summaryBody: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 20.4,
    padding: 16,
  },
  offerCard: {
    borderWidth: 2,
    borderColor: '#1CA672',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1CA672',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  offerHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.3,
  },
  offerBody: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  offerAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1CA672',
  },
  offerDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20.8,
    paddingTop: 2,
  },
  refBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 14,
  },
  refBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
  },
  acceptButton: {
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
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disputeButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.19)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disputeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  footerNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 19.2,
  },
});
