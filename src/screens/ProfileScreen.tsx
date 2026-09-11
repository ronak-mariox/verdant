import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { avatar } from '../assets/images/profile';
import { userProfile } from '../data/profile';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<NavTab>('profile');

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation.navigate('Home');
    } else if (tab === 'search') {
      navigation.navigate('Search');
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
              <View style={styles.avatarWrap}>
                <Image source={avatar} style={styles.avatarImage} />
                <View style={styles.editBadge}>
                  <EditBadgeIcon width={12} height={12} />
                </View>
              </View>
              <Text style={styles.name}>{userProfile.name}</Text>
              <Text style={styles.email}>{userProfile.email}</Text>
              <Text style={styles.phone}>{userProfile.phone}</Text>

              <View style={styles.statsCard}>
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{userProfile.stats.orders}</Text>
                  <Text style={styles.statLabel}>Orders</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{userProfile.stats.saved}</Text>
                  <Text style={styles.statLabel}>Saved</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{userProfile.stats.savedAmount}</Text>
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
              subtitle="3 saved · Home is default"
              onPress={() => navigation.navigate('ProfileAddresses')}
            />
            <MenuRow
              iconWrapStyle={styles.iconWrapPurple}
              icon={<MenuPaymentsIcon width={16} height={16} />}
              title="Payments"
              subtitle="2 UPI · 1 card saved"
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
              subtitle="24 orders placed"
              onPress={() => navigation.navigate('OrderHistory')}
              badge="1 Active"
              badgeColor="#1CA672"
            />
            <MenuRow
              iconWrapStyle={styles.iconWrapRose}
              icon={<MenuSavedIcon width={16} height={16} />}
              title="Saved Items"
              subtitle="8 items in wishlist"
              onPress={() => navigation.navigate('Home')}
              last
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>SUPPORT & PREFERENCES</Text>
            <MenuRow
              iconWrapStyle={styles.iconWrapGreen}
              icon={<MenuNotificationsIcon width={16} height={16} />}
              title="Notifications"
              subtitle="3 unread"
              onPress={() => navigation.navigate('Notifications')}
              badge="3"
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
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
              last
            />
          </View>

          <Text style={styles.footerText}>Version 4.8.2 · Member since {userProfile.memberSince}</Text>
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
