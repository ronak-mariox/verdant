import React from 'react';
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlusAddress } from '../assets/icons/checkout';
import { CheckoutHeader } from '../components/checkout/CheckoutHeader';
import { useCheckout } from '../context/CheckoutContext';
import { getErrorMessage } from '../services/api';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Address'>;

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Home: { bg: '#EFF6FF', text: '#1D4ED8' },
  Work: { bg: '#FEF3C7', text: '#92400E' },
  Other: { bg: '#F3F4F6', text: '#374151' },
};

export function AddressScreen({ navigation }: Props) {
  const { addressList, selectedAddressId, setSelectedAddressId, removeAddress } = useCheckout();

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CheckoutHeader
        title="Select Address"
        subtitle="Where should we deliver?"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.addNewWrap}>
          <Pressable
            style={styles.addNewButton}
            onPress={() => navigation.navigate('AddressForm', { mode: 'add' })}
          >
            <View style={styles.addNewIcon}>
              <PlusAddress width={16} height={16} />
            </View>
            <Text style={styles.addNewText}>Add new address</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Saved Addresses</Text>

        <View style={styles.listWrap}>
          {addressList.map((address) => {
            const selected = address.id === selectedAddressId;
            const tag = TAG_COLORS[address.type];
            return (
              <View key={address.id} style={[styles.card, selected && styles.cardSelected]}>
                <Pressable style={styles.cardMain} onPress={() => setSelectedAddressId(address.id)}>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.tagRow}>
                      <View style={[styles.tag, { backgroundColor: tag.bg }]}>
                        <Text style={[styles.tagText, { color: tag.text }]}>{address.type}</Text>
                      </View>
                      {address.isDefault ? (
                        <View style={styles.defaultTag}>
                          <Text style={styles.defaultTagText}>Default</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.name}>{address.name}</Text>
                    <Text style={styles.line}>{address.line1}</Text>
                    <Text style={styles.line}>{address.line2}</Text>
                    <Text style={styles.phone}>{address.phone}</Text>
                  </View>
                  <View style={styles.cardActions}>
                    <Pressable
                      style={styles.editButton}
                      onPress={() => navigation.navigate('AddressForm', { mode: 'edit', addressId: address.id })}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                    {!address.isDefault ? (
                      <Pressable
                        style={styles.deleteButton}
                        onPress={() =>
                          removeAddress(address.id).catch((err) => Alert.alert('Could not delete address', getErrorMessage(err)))
                        }
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </Pressable>
                    ) : null}
                  </View>
                </Pressable>
                {selected ? (
                  <View style={styles.cardFooter}>
                    <View style={styles.footerDivider} />
                    <View style={styles.footerRow}>
                      <View style={styles.footerLeft}>
                        <View style={styles.footerDot} />
                        <Text style={styles.footerText}>Delivery in 9 mins</Text>
                      </View>
                      <Pressable
                        style={styles.deliverButton}
                        onPress={() => navigation.navigate('DeliveryOptions')}
                      >
                        <Text style={styles.deliverButtonText}>Deliver here</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  addNewWrap: {
    padding: 16,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1CA672',
    borderStyle: 'dashed',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  addNewIcon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1CA672',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.77,
    textTransform: 'uppercase',
    paddingLeft: 20,
    paddingBottom: 10,
  },
  listWrap: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  cardSelected: {
    borderColor: '#1CA672',
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardMain: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginTop: 2,
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
  cardBody: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  defaultTag: {
    backgroundColor: '#FDF4FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  defaultTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7E22CE',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingTop: 6,
  },
  line: {
    fontSize: 12,
    color: '#374151',
    paddingTop: 2,
  },
  phone: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 3,
  },
  cardActions: {
    gap: 6,
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
  cardFooter: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#1CA672',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
  },
  deliverButton: {
    backgroundColor: '#1CA672',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deliverButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 24,
  },
});
