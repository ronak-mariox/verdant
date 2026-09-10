import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Toggle } from '../components';
import { BackIcon } from '../assets/icons/order';
import {
  ChevronRightIcon,
  SettingsAboutIcon,
  SettingsLogoutIcon,
  SettingsPrivacyIcon,
  SettingsRefundIcon,
  SettingsTermsIcon,
} from '../assets/icons/profile';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Settings'>;

function ToggleRow({ title, subtitle, value, onValueChange, last }: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.toggleRow, !last && styles.rowBorder]}>
      <View style={styles.toggleTextWrap}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleSubtitle}>{subtitle}</Text>
      </View>
      <Toggle value={value} onValueChange={onValueChange} />
    </View>
  );
}

function LinkRow({ icon, title, onPress, last }: {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable style={[styles.linkRow, !last && styles.rowBorder]} onPress={onPress}>
      <View style={styles.linkIconWrap}>{icon}</View>
      <Text style={styles.linkTitle}>{title}</Text>
      <ChevronRightIcon width={14} height={14} />
    </Pressable>
  );
}

export function SettingsScreen({ navigation }: Props) {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offersPromos, setOffersPromos] = useState(true);
  const [priceDrops, setPriceDrops] = useState(false);
  const [reorderReminders, setReorderReminders] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const [locationAccess, setLocationAccess] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const openLegal = (title: string, body: string) => {
    Alert.alert(title, body, [{ text: 'OK' }]);
  };

  const openLanguagePicker = () => {
    Alert.alert('Select language', undefined, [
      { text: 'English', onPress: () => setLanguage('English') },
      { text: 'हिंदी (Hindi)', onPress: () => setLanguage('हिंदी') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>NOTIFICATION PREFERENCES</Text>
          <View style={styles.card}>
            <ToggleRow title="Order updates" subtitle="Delivery status & tracking" value={orderUpdates} onValueChange={setOrderUpdates} />
            <ToggleRow title="Offers & promos" subtitle="Deals, discounts & coupons" value={offersPromos} onValueChange={setOffersPromos} />
            <ToggleRow title="Price drops" subtitle="Wishlist item price alerts" value={priceDrops} onValueChange={setPriceDrops} />
            <ToggleRow title="Reorder reminders" subtitle="Nudges for regular items" value={reorderReminders} onValueChange={setReorderReminders} />
            <ToggleRow title="Push notifications" subtitle="Master notification switch" value={pushNotifications} onValueChange={setPushNotifications} last />
          </View>

          <Text style={styles.sectionTitle}>PRIVACY</Text>
          <View style={styles.card}>
            <ToggleRow title="Location access" subtitle="For accurate delivery estimates" value={locationAccess} onValueChange={setLocationAccess} />
            <ToggleRow title="Personalized ads" subtitle="Based on your shopping activity" value={personalizedAds} onValueChange={setPersonalizedAds} />
            <ToggleRow title="Data sharing" subtitle="Share data with partner brands" value={dataSharing} onValueChange={setDataSharing} last />
          </View>

          <Text style={styles.sectionTitle}>APP PREFERENCES</Text>
          <View style={styles.card}>
            <ToggleRow title="Dark mode" subtitle="Switch to a darker theme" value={darkMode} onValueChange={setDarkMode} />
            <Pressable style={styles.linkRowPlain} onPress={openLanguagePicker}>
              <Text style={styles.toggleTitle}>Language</Text>
              <View style={styles.languageValueWrap}>
                <Text style={styles.languageValue}>{language}</Text>
                <ChevronRightIcon width={14} height={14} />
              </View>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>LEGAL & INFO</Text>
          <View style={styles.card}>
            <LinkRow
              icon={<SettingsTermsIcon width={16} height={16} />}
              title="Terms of Service"
              onPress={() =>
                openLegal('Terms of Service', 'By using Verdant, you agree to our terms covering orders, delivery, payments, and account use.')
              }
            />
            <LinkRow
              icon={<SettingsPrivacyIcon width={16} height={16} />}
              title="Privacy Policy"
              onPress={() =>
                openLegal('Privacy Policy', 'We collect only the data needed to fulfill your orders and never sell your personal information to third parties.')
              }
            />
            <LinkRow
              icon={<SettingsRefundIcon width={16} height={16} />}
              title="Refund Policy"
              onPress={() =>
                openLegal('Refund Policy', 'Refunds for cancelled or returned orders are processed to your original payment method within 5-7 business days.')
              }
            />
            <LinkRow
              icon={<SettingsAboutIcon width={16} height={16} />}
              title="About Verdant"
              onPress={() => openLegal('About Verdant', 'Verdant v4.8.2 — fresh groceries delivered to your door in minutes.')}
              last
            />
          </View>

          <View style={styles.card}>
            <Pressable
              style={styles.logoutRow}
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
            >
              <View style={styles.linkIconWrap}>
                <SettingsLogoutIcon width={16} height={16} />
              </View>
              <Text style={styles.logoutTitle}>Logout</Text>
            </Pressable>
          </View>
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
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    paddingBottom: 8,
    paddingTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 12,
  },
  toggleTextWrap: { flex: 1 },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  toggleSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  linkRowPlain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  languageValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageValue: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  linkIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  logoutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
});
