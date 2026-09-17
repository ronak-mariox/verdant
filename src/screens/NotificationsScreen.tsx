import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon } from '../assets/icons/order';
import {
  NotifCalendarIcon,
  NotifCheckIcon,
  NotifOrderIcon,
  NotifReorderIcon,
  NotifRefundIcon,
  NotifSecurityIcon,
} from '../assets/icons/profile';
import type { NotificationKind } from '../data/profile';
import type { AuthStackParamList } from '../navigation/types';
import { api } from '../services/api';
import { formatRelativeTime } from '../utils/relativeTime';

type Props = NativeStackScreenProps<AuthStackParamList, 'Notifications'>;

interface RawNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  orderId?: string;
  isRead: boolean;
  createdAt: string;
}

const KIND_BG: Record<NotificationKind, string> = {
  order: '#EFF6FF',
  offer: '#FFFBEB',
  delivered: '#F0FDF4',
  reorder: '#FDF4FF',
  refund: '#F0FDF4',
  security: '#FFF1F2',
};

const ACTION_LABEL: Record<NotificationKind, string> = {
  order: 'Track →',
  offer: 'Shop →',
  delivered: 'Rate →',
  reorder: 'Reorder →',
  refund: '',
  security: 'Review →',
};

function KindIcon({ kind }: { kind: NotificationKind }) {
  switch (kind) {
    case 'order':
      return <NotifOrderIcon width={18} height={18} />;
    case 'offer':
      return <NotifCalendarIcon width={18} height={18} />;
    case 'delivered':
      return <NotifCheckIcon width={18} height={18} />;
    case 'reorder':
      return <NotifReorderIcon width={18} height={18} />;
    case 'refund':
      return <NotifRefundIcon width={18} height={18} />;
    case 'security':
      return <NotifSecurityIcon width={18} height={18} />;
    default:
      return null;
  }
}

export function NotificationsScreen({ navigation }: Props) {
  const [items, setItems] = useState<RawNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'unread'>('all');

  useFocusEffect(
    useCallback(() => {
      api
        .get<RawNotification[]>('/customer/notifications')
        .then(({ data }) => setItems(data))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }, []),
  );

  const unreadCount = useMemo(() => items.filter((n) => !n.isRead).length, [items]);
  const visible = tab === 'unread' ? items.filter((n) => !n.isRead) : items;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    api.patch('/customer/notifications/read-all').catch(() => {});
  };

  const openNotification = (notification: RawNotification) => {
    setItems((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)));
    api.patch(`/customer/notifications/${notification.id}/read`).catch(() => {});
    navigation.navigate('NotificationDetail', { notificationId: notification.id });
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>{unreadCount} unread</Text>
          </View>
          <Pressable onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        </View>

        <View style={styles.tabsRow}>
          <Pressable style={[styles.tab, tab === 'all' && styles.tabActive]} onPress={() => setTab('all')}>
            <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>All</Text>
          </Pressable>
          <Pressable style={[styles.tab, tab === 'unread' && styles.tabActive]} onPress={() => setTab('unread')}>
            <Text style={[styles.tabText, tab === 'unread' && styles.tabTextActive]}>Unread ({unreadCount})</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {isLoading ? (
            <View style={styles.emptyWrap}>
              <ActivityIndicator color="#1CA672" />
            </View>
          ) : visible.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>{tab === 'unread' ? 'No unread notifications' : 'No notifications yet'}</Text>
              <Text style={styles.emptySubtitle}>We'll let you know when there's something new.</Text>
            </View>
          ) : (
            visible.map((notification) => (
              <Pressable
                key={notification.id}
                style={[styles.card, !notification.isRead && styles.cardUnread]}
                onPress={() => openNotification(notification)}
              >
                <View style={[styles.iconWrap, { backgroundColor: KIND_BG[notification.kind] }]}>
                  <KindIcon kind={notification.kind} />
                </View>
                <View style={styles.textWrap}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{notification.title}</Text>
                    {!notification.isRead ? <View style={styles.unreadDot} /> : null}
                  </View>
                  <Text style={styles.bodyText} numberOfLines={2}>
                    {notification.body}
                  </Text>
                  <View style={styles.footerRow}>
                    <Text style={styles.time}>{formatRelativeTime(notification.createdAt)}</Text>
                    {ACTION_LABEL[notification.kind] ? (
                      <Text style={styles.action}>{ACTION_LABEL[notification.kind]}</Text>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            ))
          )}
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
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: { flex: 1 },
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
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F5F5F5',
  },
  tabActive: {
    backgroundColor: '#1CA672',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  body: {
    padding: 16,
    gap: 10,
    paddingBottom: 32,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 20,
    padding: 14,
  },
  cardUnread: {
    borderColor: '#BBF7D0',
    backgroundColor: '#FAFFFC',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1CA672',
  },
  bodyText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    paddingTop: 3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  time: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  action: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1CA672',
  },
});
