import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon, ChatIcon, IneligibleWarnIcon, StatusCurrentIcon } from '../assets/icons/order';
import { OrderMiniCard } from '../components/order/OrderMiniCard';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CancelIneligible'>;

export function CancelIneligibleScreen({ navigation }: Props) {
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
            <Text style={styles.headerSubtitle}>Order cancellation status</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <OrderMiniCard />

          <View style={styles.errorCard}>
            <View style={styles.errorHeaderRow}>
              <View style={styles.errorIconWrap}>
                <IneligibleWarnIcon width={20} height={20} />
              </View>
              <View style={styles.errorTextWrap}>
                <Text style={styles.errorTitle}>Order cannot be cancelled</Text>
                <Text style={styles.errorSubtitle}>Cancellation window has passed</Text>
              </View>
            </View>
            <View style={styles.windowRow}>
              <Text style={styles.windowLabel}>Cancellation window</Text>
              <View style={styles.windowRight}>
                <View style={styles.windowBadge}>
                  <Text style={styles.windowBadgeText}>0:00</Text>
                </View>
                <Text style={styles.windowExpired}>expired</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.statusLabel}>CURRENT STATUS</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusIconWrap}>
                <StatusCurrentIcon width={18} height={18} />
              </View>
              <View style={styles.statusTextWrap}>
                <Text style={styles.statusTitle}>Out for delivery</Text>
                <Text style={styles.statusSubtitle}>Rajesh K. picked up your order at 2:24 PM</Text>
              </View>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>Live</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Why can&apos;t I cancel?</Text>
            <Text style={styles.cardBody}>
              Your delivery partner has already picked up your order. Cancellations are only possible within 60
              seconds of placing the order or before the order is picked up for delivery.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>WHAT YOU CAN DO</Text>

          <Pressable style={styles.optionCardGreen} onPress={() => navigation.navigate('OrderTracking')}>
            <Text style={styles.optionEmoji}>📦</Text>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Accept the delivery</Text>
              <Text style={styles.optionSubtitle}>Receive your order, then raise a return request if needed</Text>
            </View>
            <Text style={styles.optionLinkGreen}>Track Order →</Text>
          </Pressable>

          <Pressable style={styles.optionCardBlue} onPress={() => navigation.navigate('SupportHome')}>
            <ChatIcon width={22} height={22} />
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Contact support</Text>
              <Text style={styles.optionSubtitle}>Our team will do their best to help in exceptional cases</Text>
            </View>
            <Text style={styles.optionLinkBlue}>Chat Now →</Text>
          </Pressable>

          <Pressable style={styles.optionCardPurple} onPress={() => navigation.navigate('ReportIssue')}>
            <Text style={styles.optionEmoji}>📝</Text>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Raise an issue</Text>
              <Text style={styles.optionSubtitle}>Report the order after delivery for a possible refund</Text>
            </View>
            <Text style={styles.optionLinkPurple}>Raise Issue →</Text>
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
  errorCard: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 24,
    padding: 20,
  },
  errorHeaderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  errorIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTextWrap: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
  },
  errorSubtitle: {
    fontSize: 12,
    color: '#EF4444',
    paddingTop: 2,
  },
  windowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  windowLabel: {
    fontSize: 12,
    color: '#991B1B',
  },
  windowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  windowBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    height: 28,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  windowBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  windowExpired: {
    fontSize: 11,
    color: '#9CA3AF',
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
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
  },
  statusIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextWrap: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statusSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    paddingTop: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1CA672',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1CA672',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardBody: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 22.1,
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  optionCardGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 24,
    padding: 16,
  },
  optionCardBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 24,
    padding: 16,
  },
  optionCardPurple: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FDF4FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 24,
    padding: 16,
  },
  optionEmoji: {
    fontSize: 26,
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
  optionLinkGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
  },
  optionLinkBlue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
  optionLinkPurple: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
});
