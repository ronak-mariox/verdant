import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { map } from '../assets/images/order';
import { BackIcon } from '../assets/icons/order';
import {
  DetailCallIcon,
  DetailHistoryIcon,
  DetailStarIcon,
  NotifCalendarIcon,
  NotifCheckIcon,
  NotifOrderIcon,
  NotifReorderIcon,
  NotifRefundIcon,
  NotifSecurityIcon,
} from '../assets/icons/profile';
import { notifications, type NotificationKind } from '../data/profile';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'NotificationDetail'>;

function KindIcon({ kind }: { kind: NotificationKind }) {
  switch (kind) {
    case 'order':
      return <NotifOrderIcon width={22} height={22} />;
    case 'offer':
      return <NotifCalendarIcon width={22} height={22} />;
    case 'delivered':
      return <NotifCheckIcon width={22} height={22} />;
    case 'reorder':
      return <NotifReorderIcon width={22} height={22} />;
    case 'refund':
      return <NotifRefundIcon width={22} height={22} />;
    case 'security':
      return <NotifSecurityIcon width={22} height={22} />;
    default:
      return null;
  }
}

export function NotificationDetailScreen({ navigation, route }: Props) {
  const notification = useMemo(
    () => notifications.find((n) => n.id === route.params.notificationId) ?? notifications[0],
    [route.params.notificationId],
  );

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <Text style={styles.headerTitle}>Notification</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconWrap}>
              <KindIcon kind={notification.kind} />
            </View>
            <Text style={styles.summaryTitle}>{notification.title}</Text>
            <Text style={styles.summaryBody}>{notification.body}</Text>
            <Text style={styles.summaryTime}>{notification.time}</Text>
          </View>

          {notification.kind === 'order' ? (
            <View style={styles.mapCard}>
              <Image source={map} style={styles.mapImage} />
              <View style={styles.mapOverlay}>
                <Text style={styles.mapOverlayText}>Arriving in 12 min</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.actionsWrap}>
            <Pressable style={styles.actionRow} onPress={() => navigation.navigate('OrderHistory')}>
              <View style={[styles.actionIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <DetailHistoryIcon width={16} height={16} />
              </View>
              <Text style={styles.actionText}>View order details</Text>
            </Pressable>
            <Pressable style={styles.actionRow} onPress={() => navigation.navigate('SupportHome')}>
              <View style={[styles.actionIconWrap, { backgroundColor: '#F0FDF4' }]}>
                <DetailCallIcon width={16} height={16} />
              </View>
              <Text style={styles.actionText}>Contact delivery partner</Text>
            </Pressable>
            <Pressable style={styles.actionRow} onPress={() => navigation.navigate('OrderHistory')}>
              <View style={[styles.actionIconWrap, { backgroundColor: '#FFFBEB' }]}>
                <DetailStarIcon width={16} height={16} />
              </View>
              <Text style={styles.actionText}>Rate previous order</Text>
            </Pressable>
          </View>

          <Pressable style={styles.backLink} onPress={() => navigation.goBack()}>
            <Text style={styles.backLinkText}>← Back to notifications</Text>
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
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  body: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 24,
    padding: 24,
  },
  summaryIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  summaryBody: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    paddingTop: 8,
  },
  summaryTime: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 10,
  },
  mapCard: {
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: 140,
  },
  mapOverlay: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mapOverlayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionsWrap: {
    marginTop: 20,
    gap: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    padding: 14,
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  backLink: {
    alignItems: 'center',
    paddingTop: 20,
  },
  backLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1CA672',
  },
});
