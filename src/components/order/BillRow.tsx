import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface BillRowProps {
  label: string;
  value: string;
  labelColor?: string;
  valueColor?: string;
  bold?: boolean;
}

export function BillRow({ label, value, labelColor, valueColor, bold }: BillRowProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, labelColor ? { color: labelColor } : null, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null, bold && styles.boldValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  label: {
    fontSize: 13,
    color: '#374151',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  bold: {
    fontWeight: '700',
  },
  boldValue: {
    fontWeight: '800',
    color: '#1A1A1A',
  },
});
