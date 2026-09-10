import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon } from '../assets/icons/order';
import { CardChipIcon, PlusCardIcon, PlusUpiIcon, ShieldLockIcon, TrashIcon } from '../assets/icons/profile';
import { upiGpay, upiPhonepe } from '../assets/images/profile';
import { savedCards as initialCards, savedUpiMethods as initialUpi, type SavedCard, type SavedUpi } from '../data/profile';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfilePayments'>;

let upiCounter = 0;
let cardCounter = 0;

export function ProfilePaymentsScreen({ navigation }: Props) {
  const [savedUpiMethods, setSavedUpiMethods] = useState<SavedUpi[]>(initialUpi);
  const [savedCards, setSavedCards] = useState<SavedCard[]>(initialCards);

  const removeUpi = (id: string) => {
    Alert.alert('Remove UPI ID', 'Are you sure you want to remove this UPI ID?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setSavedUpiMethods((prev) => prev.filter((u) => u.id !== id)) },
    ]);
  };

  const addUpi = () => {
    upiCounter += 1;
    setSavedUpiMethods((prev) => [...prev, { id: `upi-new-${upiCounter}`, name: 'PhonePe', handle: `priya.new${upiCounter}@ybl` }]);
  };

  const addCard = () => {
    cardCounter += 1;
    setSavedCards((prev) => [
      ...prev,
      {
        id: `card-new-${cardCounter}`,
        bank: 'ICICI Bank',
        last4: '1029',
        expiry: '11/28',
        network: 'Visa',
        gradientColors: ['#4C1D95', 'rgba(76,29,149,0.8)'],
      },
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
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Payment Methods</Text>
            <Text style={styles.headerSubtitle}>Manage UPI & cards</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>SAVED UPI</Text>
          <View style={styles.card}>
            {savedUpiMethods.map((upi, index) => (
              <View
                key={upi.id}
                style={[styles.upiRow, index !== savedUpiMethods.length - 1 && styles.rowBorder]}
              >
                <Image source={upi.name === 'Google Pay' ? upiGpay : upiPhonepe} style={styles.upiLogo} />
                <View style={styles.rowTextWrap}>
                  <View style={styles.rowTitleLine}>
                    <Text style={styles.rowTitle}>{upi.name}</Text>
                    {upi.isDefault ? (
                      <View style={styles.defaultTag}>
                        <Text style={styles.defaultTagText}>DEFAULT</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.rowSubtitle}>{upi.handle}</Text>
                </View>
                <Pressable hitSlop={8} onPress={() => removeUpi(upi.id)}>
                  <TrashIcon width={16} height={16} />
                </Pressable>
              </View>
            ))}
            <Pressable style={styles.dashedRow} onPress={addUpi}>
              <PlusUpiIcon width={16} height={16} />
              <Text style={styles.dashedRowText}>Add UPI ID</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>SAVED CARDS</Text>
          <View style={styles.cardsGap}>
            {savedCards.map((card) => (
              <View key={card.id} style={[styles.cardTile, { backgroundColor: card.gradientColors[0] }]}>
                <View style={styles.cardTileTop}>
                  <CardChipIcon width={32} height={24} />
                  <Text style={styles.cardNetwork}>{card.network}</Text>
                </View>
                <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
                <View style={styles.cardTileBottom}>
                  <View>
                    <Text style={styles.cardBankLabel}>BANK</Text>
                    <Text style={styles.cardBankValue}>{card.bank}</Text>
                  </View>
                  <View>
                    <Text style={styles.cardBankLabel}>EXPIRES</Text>
                    <Text style={styles.cardBankValue}>{card.expiry}</Text>
                  </View>
                </View>
              </View>
            ))}
            <Pressable style={styles.dashedCard} onPress={addCard}>
              <PlusCardIcon width={18} height={18} />
              <Text style={styles.dashedRowText}>Add debit/credit card</Text>
            </Pressable>
          </View>

          <View style={styles.securityBanner}>
            <ShieldLockIcon width={18} height={18} />
            <Text style={styles.securityText}>
              Your payment details are encrypted and PCI-DSS compliant. We never store your CVV.
            </Text>
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
  headerTitleWrap: { flex: 1 },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 2,
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
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  upiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  upiLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  rowTextWrap: { flex: 1 },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  rowSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  defaultTag: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  defaultTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1CA672',
  },
  dashedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 12,
    marginVertical: 12,
  },
  dashedRowText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  cardsGap: {
    gap: 14,
    marginBottom: 24,
  },
  cardTile: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  cardTileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardNetwork: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  cardNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    paddingTop: 20,
    paddingBottom: 20,
  },
  cardTileBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBankLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
  },
  cardBankValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingTop: 2,
  },
  dashedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingVertical: 18,
  },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 14,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
  },
});
