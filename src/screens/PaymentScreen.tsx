import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SecurityShield, WalletIcon, NetBankingIcon } from '../assets/icons/checkout';
import { googlepay, moreCard, paytm, phonepe, visaCard } from '../assets/images/payment';
import { CheckoutHeader } from '../components/checkout/CheckoutHeader';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { paymentMethods, type PaymentMethodId } from '../data/checkout';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Payment'>;

const METHOD_VISUAL: Partial<Record<PaymentMethodId, any>> = {
  gpay: googlepay,
  phonepe: phonepe,
  paytm: paytm,
  visa: visaCard,
  'add-card': moreCard,
};

const GROUP_ORDER: Array<'UPI' | 'Cards' | 'Banking' | 'More'> = ['UPI', 'Cards', 'Banking', 'More'];

export function PaymentScreen({ navigation }: Props) {
  const { paymentMethod, setPaymentMethod } = useCheckout();
  const { pricing } = useCart();
  const [upiId, setUpiId] = useState('');
  const amountToPay = pricing?.grandTotal ?? 0;

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CheckoutHeader title="Payment" subtitle="Choose how you'd like to pay" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to pay</Text>
          <Text style={styles.amountValue}>₹{amountToPay}</Text>
        </View>

        {GROUP_ORDER.map((group) => (
          <View key={group}>
            <Text style={styles.sectionLabel}>{group}</Text>
            <View style={styles.methodList}>
              {paymentMethods
                .filter((m) => m.group === group)
                .map((method) => {
                  const selected = method.id === paymentMethod;
                  const visual = METHOD_VISUAL[method.id];
                  return (
                    <Pressable
                      key={method.id}
                      style={[styles.methodCard, selected && styles.methodCardSelected]}
                      onPress={() => setPaymentMethod(method.id)}
                    >
                      <View style={styles.methodIcon}>
                        {visual ? (
                          <Image source={visual} style={styles.methodIconImage} resizeMode="contain" />
                        ) : method.id === 'netbanking' ? (
                          <NetBankingIcon width={20} height={20} />
                        ) : method.id === 'wallet' ? (
                          <WalletIcon width={20} height={20} />
                        ) : method.id === 'cod' ? (
                          <Text style={styles.methodIconFallback}>₹</Text>
                        ) : null}
                      </View>
                      <View style={styles.methodBody}>
                        <Text style={styles.methodTitle}>{method.title}</Text>
                        <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                      </View>
                      <View style={[styles.radio, selected && styles.radioSelected]}>
                        {selected ? <View style={styles.radioDot} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              {group === 'UPI' ? (
                <View style={styles.upiOtherRow}>
                  <TextInput
                    value={upiId}
                    onChangeText={setUpiId}
                    onFocus={() => setPaymentMethod('upi-other')}
                    placeholder="Enter other UPI ID"
                    placeholderTextColor="rgba(26,26,26,0.4)"
                    style={[
                      styles.upiInput,
                      paymentMethod === 'upi-other' && styles.upiInputActive,
                    ]}
                  />
                </View>
              ) : null}
            </View>
          </View>
        ))}

        <View style={styles.securityRow}>
          <SecurityShield width={16} height={16} />
          <Text style={styles.securityText}>Your payment information is encrypted and secure</Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable style={styles.payButton} onPress={() => navigation.navigate('ReviewOrder')}>
            <Text style={styles.payButtonText}>Pay ₹{amountToPay}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  content: {
    padding: 16,
    gap: 4,
  },
  amountCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    paddingTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.77,
    textTransform: 'uppercase',
    paddingTop: 12,
    paddingBottom: 8,
  },
  methodList: {
    gap: 10,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  methodCardSelected: {
    borderColor: '#1CA672',
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  methodIconImage: {
    width: 24,
    height: 24,
  },
  methodIconFallback: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  methodBody: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  methodSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#1CA672',
    backgroundColor: '#1CA672',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  upiOtherRow: {
    paddingTop: 2,
  },
  upiInput: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#1A1A1A',
  },
  upiInputActive: {
    borderColor: '#1CA672',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingTop: 16,
  },
  securityText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 12,
  },
  footerSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footer: {
    padding: 16,
  },
  payButton: {
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
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
