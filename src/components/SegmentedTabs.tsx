import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, typography } from '../theme';

interface SegmentedTabsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedTabs<T extends string>({ options, value, onChange }: SegmentedTabsProps<T>) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            style={[styles.tab, active ? styles.tabActive : null]}
          >
            <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.background.surfaceMuted,
    borderRadius: radius.md,
    padding: 4,
    height: 48,
    width: '100%',
  },
  tab: {
    flex: 1,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.background.screen,
    ...shadows.tab,
  },
  label: {
    ...typography.bodySmall,
    fontFamily: typography.buttonMedium.fontFamily,
  },
  labelActive: {
    color: colors.brand.primary,
  },
  labelInactive: {
    color: colors.text.chip,
  },
});
