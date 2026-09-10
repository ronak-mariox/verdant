import React from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronDownIcon, HelpIcon, IssueWarningIcon } from '../assets/icons/order';
import { map } from '../assets/images/order';
import { DeliveryPartnerCard } from '../components/order/DeliveryPartnerCard';
import { OrderProgressTracker } from '../components/order/OrderProgressTracker';
import { activeOrder } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrderTracking'>;

export function OrderTrackingScreen({ navigation, route }: Props) {
  const variant = route.params?.variant ?? 'onTime';
  const isDelayed = variant === 'delayed';
  const accent = isDelayed ? '#F59E0B' : '#1CA672';

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={isDelayed ? styles.delayedHeaderSafe : styles.headerSafe}>
          {isDelayed ? (
            <View style={styles.delayedBanner}>
              <View style={styles.delayedIconWrap}>
                <IssueWarningIcon width={18} height={18} />
              </View>
              <View style={styles.delayedTextWrap}>
                <Text style={styles.delayedTitle}>Your order is running late</Text>
                <Text style={styles.delayedSubtitle}>Heavy traffic on Sector 62 Expressway</Text>
              </View>
            </View>
          ) : (
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.arrivingLabel}>ARRIVING IN</Text>
                <View style={styles.etaRow}>
                  <Text style={[styles.etaValue, { color: accent }]}>{activeOrder.eta}</Text>
                  <Text style={[styles.etaUnit, { color: accent }]}>mins</Text>
                </View>
                <Text style={styles.etaBy}>By {activeOrder.etaBy} · {activeOrder.shortDate}</Text>
              </View>
              <View style={styles.headerRight}>
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusPillText}>Out for delivery</Text>
                </View>
                <Text style={styles.orderIdLink}>Order {activeOrder.id} →</Text>
              </View>
            </View>
          )}
        </SafeAreaView>

        <View style={styles.mapWrap}>
          <Image source={map} style={styles.mapImage} resizeMode="cover" />
          <View style={styles.liveBadge}>
            <View style={[styles.liveDot, isDelayed && styles.delayedDot]} />
            <Text style={styles.liveBadgeText}>{isDelayed ? 'DELAYED' : 'LIVE'}</Text>
          </View>
          <View style={styles.mapFade} />
        </View>

        <View style={styles.trackerSection}>
          <OrderProgressTracker activeIndex={3} color={accent} />
          {isDelayed ? (
            <Text style={styles.delayedEta}>~28 mins away · Updated 2:43 PM</Text>
          ) : (
            <View style={styles.onWayRow}>
              <View style={styles.onWayDot} />
              <Text style={styles.onWayText}>Your order is on the way!</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.partnerSection}>
          <Text style={styles.sectionLabel}>DELIVERY PARTNER</Text>
          <View style={styles.partnerCardWrap}>
            <DeliveryPartnerCard onChatPress={() => navigation.navigate('SupportHome')} />
          </View>
        </View>

        <View style={styles.divider} />

        <Pressable
          style={styles.summaryRow}
          onPress={() => navigation.navigate('OrderDetails', { orderId: activeOrder.id })}
        >
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>Order summary</Text>
            <Text style={styles.summarySubtitle}>(6 items · ₹477)</Text>
          </View>
          <ChevronDownIcon width={16} height={16} />
        </Pressable>

        <View style={styles.divider} />

        {isDelayed ? (
          <View style={styles.actionsSection}>
            <Pressable style={styles.contactSupportButton} onPress={() => navigation.navigate('SupportHome')}>
              <Text style={styles.contactSupportText}>Contact Support</Text>
            </Pressable>
            <Pressable style={styles.cancelLinkWrap} onPress={() => navigation.navigate('CancelOrder')}>
              <Text style={styles.cancelLink}>Cancel order</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.helpSection}>
            <Pressable style={styles.helpRow} onPress={() => navigation.navigate('SupportHome')}>
              <View style={styles.helpIconWrap}>
                <HelpIcon width={16} height={16} />
              </View>
              <View style={styles.helpTextWrap}>
                <Text style={styles.helpTitle}>Need help?</Text>
                <Text style={styles.helpSubtitle}>Chat or call our support team</Text>
              </View>
            </Pressable>
            <Pressable style={styles.cancelLinkWrap} onPress={() => navigation.navigate('CancelOrder')}>
              <Text style={styles.cancelLink}>Cancel order</Text>
            </Pressable>
          </View>
        )}
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  arrivingLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  etaValue: {
    fontSize: 42,
    fontWeight: '900',
  },
  etaUnit: {
    fontSize: 18,
    fontWeight: '700',
  },
  etaBy: {
    fontSize: 12,
    color: '#6B7280',
    paddingTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1CA672',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1CA672',
  },
  orderIdLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  delayedHeaderSafe: {
    backgroundColor: '#FFFBEB',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  delayedBanner: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  delayedIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  delayedTextWrap: {
    flex: 1,
  },
  delayedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
  },
  delayedSubtitle: {
    fontSize: 12,
    color: '#B45309',
    paddingTop: 2,
  },
  mapWrap: {
    height: 196,
    backgroundColor: '#EAF5EC',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
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
  delayedDot: {
    backgroundColor: '#F59E0B',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  mapFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: '#FFFFFF',
    opacity: 0,
  },
  trackerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  onWayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  onWayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1CA672',
  },
  onWayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  delayedEta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
  partnerSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.4,
  },
  partnerCardWrap: {
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  summarySubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  helpSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  helpIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTextWrap: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  helpSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  cancelLinkWrap: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  cancelLink: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  actionsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  contactSupportButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  contactSupportText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
});
