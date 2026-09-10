import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CategoryTab } from '../../data/home';

interface CategoryTabsProps {
  data: CategoryTab[];
  activeId: string;
  onChange: (id: string) => void;
}

export function CategoryTabs({ data, activeId, onChange }: CategoryTabsProps) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      style={styles.list}
      renderItem={({ item }) => {
        const active = item.id === activeId;
        return (
          <Pressable style={styles.tab} onPress={() => onChange(item.id)}>
            <View style={styles.iconWrap}>
              <Image source={item.image} style={styles.icon} resizeMode="contain" />
            </View>
            <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
              {item.label}
            </Text>
            {active ? <View style={styles.indicator} /> : null}
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.16)',
  },
  tab: {
    width: 71,
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 8,
  },
  iconWrap: {
    width: 44,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 36,
    height: 36,
  },
  label: {
    fontSize: 11,
    color: '#000000',
    textAlign: 'center',
    paddingTop: 2,
  },
  labelActive: {
    fontWeight: '700',
  },
  indicator: {
    height: 4,
    width: 44,
    borderRadius: 2,
    backgroundColor: '#1CA672',
    marginTop: 4,
  },
});
