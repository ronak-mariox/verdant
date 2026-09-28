import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavCategories, NavHome, NavOrders, NavProfile, NavSearch } from '../../assets/icons/homescreen';
import { fontFamily } from '../../theme';
import type { AuthStackParamList } from '../../navigation/types';

export type NavTab = 'home' | 'search' | 'categories' | 'orders' | 'profile';

interface BottomNavBarProps {
  active: NavTab;
}

const TABS: { id: NavTab; label: string; route: keyof AuthStackParamList; Icon: React.ComponentType<{ width: number; height: number }> }[] = [
  { id: 'home', label: 'Home', route: 'Home', Icon: NavHome },
  { id: 'search', label: 'Search', route: 'Search', Icon: NavSearch },
  { id: 'categories', label: 'Categories', route: 'Category', Icon: NavCategories },
  { id: 'orders', label: 'Orders', route: 'OrderHistory', Icon: NavOrders },
  { id: 'profile', label: 'Profile', route: 'Profile', Icon: NavProfile },
];

export function BottomNavBar({ active }: BottomNavBarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  // Tabs replace the stack instead of pushing so bouncing between them never piles up screens.
  const switchTab = (tab: (typeof TABS)[number]) => {
    if (tab.id === active) return;
    navigation.reset({ index: 0, routes: [{ name: tab.route as never }] });
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.row}>
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.Icon;
          return (
            <Pressable key={tab.id} onPress={() => switchTab(tab)} style={[styles.button, isActive && styles.buttonActive]}>
              <Icon width={22} height={22} />
              <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  button: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 60,
  },
  buttonActive: {
    backgroundColor: '#F0FDF4',
  },
  label: {
    fontSize: 10,
    fontFamily: fontFamily.bodySemiBold,
    color: '#9CA3AF',
  },
  labelActive: {
    color: '#1CA672',
  },
});
