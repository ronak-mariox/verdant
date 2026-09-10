import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon } from '../assets/icons/order';
import { AddrHomeIcon, AddrPlusIcon } from '../assets/icons/profile';
import { profileAddresses as initialAddresses, type ProfileAddress } from '../data/profile';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileAddresses'>;

const TYPE_ICON_BG: Record<ProfileAddress['type'], string> = {
  Home: '#F0FDF4',
  Work: '#EFF6FF',
  Other: '#FFFBEB',
};

const TYPE_EMOJI: Record<ProfileAddress['type'], string> = {
  Home: '🏠',
  Work: '💼',
  Other: '📍',
};

export function ProfileAddressesScreen({ navigation }: Props) {
  const [addresses, setAddresses] = useState(initialAddresses);

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
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
            <Text style={styles.headerTitle}>Saved Addresses</Text>
            <Text style={styles.headerSubtitle}>{addresses.length} addresses saved</Text>
          </View>
          <Pressable
            style={styles.addPill}
            onPress={() => navigation.navigate('AddressForm', { mode: 'add' })}
          >
            <AddrPlusIcon width={12} height={12} />
            <Text style={styles.addPillText}>Add</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {addresses.map((address) => (
            <View key={address.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.typeIconWrap, { backgroundColor: TYPE_ICON_BG[address.type] }]}>
                  {address.type === 'Home' ? (
                    <AddrHomeIcon width={20} height={20} />
                  ) : (
                    <Text style={styles.typeEmoji}>{TYPE_EMOJI[address.type]}</Text>
                  )}
                </View>
                <View style={styles.cardTextWrap}>
                  <View style={styles.typeRow}>
                    <Text style={styles.typeText}>{address.type}</Text>
                    {address.isDefault ? (
                      <View style={styles.defaultTag}>
                        <Text style={styles.defaultTagText}>DEFAULT</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.addressLine1}>{address.line1}</Text>
                  <Text style={styles.addressLine2}>{address.line2}</Text>
                </View>
              </View>
              <View style={styles.actionsRow}>
                {!address.isDefault ? (
                  <Pressable style={styles.actionButtonGray} onPress={() => setDefault(address.id)}>
                    <Text style={styles.actionButtonGrayText}>Set Default</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  style={styles.actionButtonBlue}
                  onPress={() => navigation.navigate('AddressForm', { mode: 'edit', addressId: address.id })}
                >
                  <Text style={styles.actionButtonBlueText}>Edit</Text>
                </Pressable>
                {!address.isDefault ? (
                  <Pressable style={styles.actionButtonRed} onPress={() => removeAddress(address.id)}>
                    <Text style={styles.actionButtonRedText}>Delete</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ))}

          <Pressable
            style={styles.addNewButton}
            onPress={() => navigation.navigate('AddressForm', { mode: 'add' })}
          >
            <AddrPlusIcon width={18} height={18} />
            <Text style={styles.addNewButtonText}>Add new address</Text>
          </Pressable>
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
  headerTitleWrap: {
    flex: 1,
  },
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
  addPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
  },
  body: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  typeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeEmoji: {
    fontSize: 18,
  },
  cardTextWrap: {
    flex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
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
  addressLine1: {
    fontSize: 13,
    color: '#374151',
    paddingTop: 2,
  },
  addressLine2: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  actionButtonGray: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionButtonGrayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  actionButtonBlue: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionButtonBlueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  actionButtonRed: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionButtonRedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 24,
    paddingVertical: 16,
  },
  addNewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
