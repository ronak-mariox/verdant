import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FailedIcon } from '../assets/icons/checkout';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'PaymentFailed'>;

export function PaymentFailedScreen({ navigation, route }: Props) {
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <FailedIcon width={56} height={56} />
        </View>
        <Text style={styles.title}>Order not placed</Text>
        <Text style={styles.subtitle}>
          {route.params?.message ?? "We couldn't reach the server to place your order."}
        </Text>
        <Text style={styles.hint}>Nothing has been charged. Your cart is still saved — you can try again.</Text>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable style={styles.retryButton} onPress={() => navigation.replace('ReviewOrder')}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
          <Pressable style={styles.altButton} onPress={() => navigation.replace('Cart')}>
            <Text style={styles.altButtonText}>Back to cart</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    paddingTop: 8,
  },
  footerSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footer: {
    padding: 16,
    gap: 10,
  },
  retryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 11,
    elevation: 4,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  altButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  altButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingTop: 12,
    paddingHorizontal: 24,
  },
});
