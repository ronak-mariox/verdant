import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomNavBar, type NavTab } from '../components/home/BottomNavBar';
import {
  ChevronRightIcon,
  EditBadgeIcon,
  MenuAddressesIcon,
  MenuEditProfileIcon,
  MenuHelpIcon,
  MenuLogoutIcon,
  MenuNotificationsIcon,
  MenuOrdersIcon,
  MenuPaymentsIcon,
  MenuSavedIcon,
  MenuSettingsIcon,
} from '../assets/icons/profile';
import { avatar as defaultAvatar } from '../assets/images/profile';
import type { AuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useCheckout } from '../context/CheckoutContext';
import { API_ORIGIN, api } from '../services/api';

const ACTIVE_ORDER_STATUSES = new Set(['placed', 'accepted', 'preparing', 'ready_for_pickup', 'out_for_delivery']);

interface RawOrderItem {
  mrp?: number;
  price: number;
  quantity: number;
}

interface RawOrder {
  status: string;
  pricing: { discount: number };
  items: RawOrderItem[];
}

type Props = NativeStackScreenProps<AuthStackParamList, 'Profile'>;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMemberSince(iso?: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function ProfileScreen({ navigation }: Props) {
  const { user, logout, refreshUser } = useAuth();
  const { addressList } = useCheckout();
  const [activeTab, setActiveTab] = useState<NavTab>('profile');
  const [orders, setOrders] = useState<RawOrder[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useFocusEffect(
    useCallback(() => {
      api.get<RawOrder[]>('/customer/orders').then(({ data }) => setOrders(data)).catch(() => {});
      api.get<unknown[]>('/customer/wishlist').then(({ data }) => setWishlistCount(data.length)).catch(() => {});
      api
        .get<{ count: number }>('/customer/notifications/unread-count')
        .then(({ data }) => setUnreadNotifications(data.count))
        .catch(() => {});
    }, []),
  );

  const ordersCount = orders.length;
  const activeOrdersCount = useMemo(
    () => orders.filter((o) => ACTIVE_ORDER_STATUSES.has(o.status)).length,
    [orders],
  );
  const totalSaved = useMemo(
    () =>
      orders.reduce((sum, order) => {
        const itemSavings = order.items.reduce((s, i) => s + ((i.mrp ?? i.price) - i.price) * i.quantity, 0);
        return sum + itemSavings + (order.pricing?.discount ?? 0);
      }, 0),
    [orders],
  );
  const defaultAddress = addressList.find((a) => a.isDefault) ?? addressList[0];

  // Picks up anything changed on EditProfileScreen (name/email/avatar) even if this
  // screen instance was already mounted before the user navigated there and back.
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshUser().catch(() => {
        // Best-effort — the profile still renders from the last-known user in context.
      });
    });
    return unsubscribe;
  }, [navigation, refreshUser]);

  const avatarSource = useMemo(
    () => (user?.avatarUrl ? { uri: `${API_ORIGIN}${user.avatarUrl}` } : defaultAvatar),
    [user?.avatarUrl],
  );

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation.navigate('Home');
    } else if (tab === 'search') {
      navigation.navigate('Search');
    } else if (tab === 'categories') {
      navigation.navigate('Category');
    } else if (tab === 'orders') {
      navigation.navigate('OrderHistory');
    }
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSafeArea}>
          <SafeAreaView edges={['top']}>
            <View style={styles.heroContent}>
              <Pressable style={styles.avatarWrap} onPress={() => navigation.navigate('EditProfile')} hitSlop={8}>
                <Image source={avatarSource} style={styles.avatarImage} />
                <View style={styles.editBadge}>
                  <EditBadgeIcon width={12} height={12} />
                </View>
              </Pressable>
              <Text style={styles.name}>{user?.name || 'Add your name'}</Text>
              {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
              <Text style={styles.phone}>+91 {user?.phone}</Text>

              <View style={styles.statsCard}>
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{ordersCount}</Text>
                  <Text style={styles.statLabel}>Orders</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{wishlistCount}</Text>
                  <Text style={styles.statLabel}>Saved</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>₹{Math.round(totalSaved)}</Text>
                  <Text style={styles.statLabel}>Saved ₹</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>ACCOUNT</Text>
            <MenuRow
              iconWrapStyle={styles.iconWrapGreen}
              icon={<MenuEditProfileIcon width={16} height={16} />}
              title="Edit Profile"
              subtitle="Name, email, phone"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <MenuRow
              iconWrapStyle={styles.iconWrapBlue}
              icon={<MenuAddressesIcon width={16} height={16} />}
              title="Addresses"
              subtitle={
                addressList.length === 0
                  ? 'No addresses saved yet'
                  : `${addressList.length} saved${defaultAddress ? ` · ${defaultAddress.type} is default` : ''}`
              }
              onPress={() => navigation.navigate('ProfileAddresses')}
            />
            <MenuRow
              iconWrapStyle={styles.iconWrapPurple}
              icon={<MenuPaymentsIcon width={16} height={16} />}
              title="Payments"
              subtitle="Cash on Delivery"
              onPress={() => navigation.navigate('ProfilePayments')}
              last
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>ACTIVITY</Text>
            <MenuRow
              iconWrapStyle={styles.iconWrapAmber}
              icon={<MenuOrdersIcon width={16} height={16} />}
              title="Orders"
              subtitle={`${ordersCount} order${ordersCount === 1 ? '' : 's'} placed`}
              onPress={() => navigation.navigate('OrderHistory')}
              badge={activeOrdersCount > 0 ? `${activeOrdersCount} Active` : undefined}
              badgeColor="#1CA672"
            />
            <MenuRow
              iconWrapStyle={styles.iconWrapRose}
              icon={<MenuSavedIcon width={16} height={16} />}
              title="Saved Items"
              subtitle={`${wishlistCount} item${wishlistCount === 1 ? '' : 's'} in wishlist`}
              onPress={() => navigation.navigate('SavedItems')}
              last
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>SUPPORT & PREFERENCES</Text>
            <MenuRow
              iconWrapStyle={styles.iconWrapGreen}
              icon={<MenuNotificationsIcon width={16} height={16} />}
              title="Notifications"
              subtitle={unreadNotifications > 0 ? `${unreadNotifications} unread` : 'All caught up'}
              onPress={() => navigation.navigate('Notifications')}
              badge={unreadNotifications > 0 ? String(unreadNotifications) : undefined}
              badgeColor="#EF4444"
            />
            <MenuRow
              iconWrapStyle={styles.iconWrapGray}
              icon={<MenuSettingsIcon width={16} height={16} />}
              title="Settings"
              subtitle="Preferences, privacy, security"
              onPress={() => navigation.navigate('Settings')}
            />
            <MenuRow
              iconWrapStyle={styles.iconWrapBlue}
              icon={<MenuHelpIcon width={16} height={16} />}
              title="Help & Support"
              subtitle="FAQs, issues, refunds"
              onPress={() => navigation.navigate('SupportHome')}
              last
            />
          </View>

          <View style={styles.card}>
            <MenuRow
              iconWrapStyle={styles.iconWrapRose}
              icon={<MenuLogoutIcon width={16} height={16} />}
              title="Logout"
              titleColor="#EF4444"
              onPress={handleLogout}
              last
            />
          </View>

          <Text style={styles.footerText}>Version 4.8.2 · Member since {formatMemberSince(user?.createdAt)}</Text>
        </View>
      </ScrollView>

      <BottomNavBar active={activeTab} onChange={handleTabChange} />
    </View>
  );
}

function MenuRow({
  iconWrapStyle,
  icon,
  title,
  titleColor,
  subtitle,
  onPress,
  badge,
  badgeColor,
  last,
}: {
  iconWrapStyle: object;
  icon: React.ReactNode;
  title: string;
  titleColor?: string;
  subtitle?: string;
  onPress: () => void;
  badge?: string;
  badgeColor?: string;
  last?: boolean;
}) {
  return (
    <Pressable style={[styles.menuRow, !last && styles.menuRowBorder]} onPress={onPress}>
      <View style={[styles.iconWrap, iconWrapStyle]}>{icon}</View>
      <View style={styles.menuTextWrap}>
        <Text style={[styles.menuTitle, titleColor ? { color: titleColor } : null]}>{title}</Text>
        {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : (
        <ChevronRightIcon width={14} height={14} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  heroSafeArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    marginBottom: 14,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  email: {
    fontSize: 13,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  phone: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  statsCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    marginTop: 16,
    width: 320,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    paddingTop: 1,
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
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    paddingTop: 12,
    paddingBottom: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapGreen: { backgroundColor: '#F0FDF4' },
  iconWrapBlue: { backgroundColor: '#EFF6FF' },
  iconWrapPurple: { backgroundColor: '#FDF4FF' },
  iconWrapAmber: { backgroundColor: '#FFFBEB' },
  iconWrapRose: { backgroundColor: '#FFF1F2' },
  iconWrapGray: { backgroundColor: '#F5F5F5' },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerText: {
    fontSize: 11,
    color: '#D1D5DB',
    textAlign: 'center',
    paddingTop: 8,
  },
});
