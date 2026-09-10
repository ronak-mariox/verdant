import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.17,
  },
});
