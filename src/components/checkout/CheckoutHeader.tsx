import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackIcon } from '../../assets/icons/checkout';

interface CheckoutHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
}

export function CheckoutHeader({ title, subtitle, onBack }: CheckoutHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.row}>
        <Pressable style={styles.backButton} onPress={onBack} hitSlop={8}>
          <BackIcon width={17} height={17} />
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
});
