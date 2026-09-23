import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavCategories, NavHome, NavOrders, NavProfile, NavSearch } from '../../assets/icons/homescreen';
import { fontFamily } from '../../theme';

export type NavTab = 'home' | 'search' | 'categories' | 'orders' | 'profile';

interface BottomNavBarProps {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}

const TABS: { id: NavTab; label: string; Icon: React.ComponentType<{ width: number; height: number }> }[] = [
  { id: 'home', label: 'Home', Icon: NavHome },
  { id: 'search', label: 'Search', Icon: NavSearch },
  { id: 'categories', label: 'Categories', Icon: NavCategories },
  { id: 'orders', label: 'Orders', Icon: NavOrders },
  { id: 'profile', label: 'Profile', Icon: NavProfile },
];

export function BottomNavBar({ active, onChange }: BottomNavBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.row}>
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.Icon;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onChange(tab.id)}
              style={[styles.button, isActive && styles.buttonActive]}
            >
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
