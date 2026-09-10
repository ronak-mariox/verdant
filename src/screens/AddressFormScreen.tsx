import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SaveHome, SaveOther, SaveWork } from '../assets/icons/checkout';
import { CheckoutHeader } from '../components/checkout/CheckoutHeader';
import { useCheckout } from '../context/CheckoutContext';
import type { Address } from '../data/checkout';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'AddressForm'>;

const SAVE_AS_OPTIONS: { id: Address['type']; label: string; Icon: React.ComponentType<{ width: number; height: number }> }[] = [
  { id: 'Home', label: 'Home', Icon: SaveHome },
  { id: 'Work', label: 'Work', Icon: SaveWork },
  { id: 'Other', label: 'Other', Icon: SaveOther },
];

export function AddressFormScreen({ navigation, route }: Props) {
  const { addressList, addAddress, updateAddress } = useCheckout();
  const params = route.params;
  const isEdit = params.mode === 'edit';
  const editing = isEdit ? addressList.find((a) => a.id === params.addressId) : undefined;

  const [name, setName] = useState(editing?.name ?? '');
  const [phone, setPhone] = useState(editing?.phone ?? '');
  const [house, setHouse] = useState(editing?.line1 ?? '');
  const [street, setStreet] = useState(editing ? editing.line2.split(',')[0] : '');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState(editing ? 'Noida' : '');
  const [pincode, setPincode] = useState(editing ? '201309' : '');
  const [state, setState] = useState(editing ? 'Uttar Pradesh' : '');
  const [saveAs, setSaveAs] = useState<Address['type']>(editing?.type ?? 'Home');

  const isValid = name.trim() && phone.trim().length === 10 && house.trim() && street.trim() && city.trim() && pincode.trim().length === 6 && state.trim();

  const handleSubmit = () => {
    const address: Address = {
      id: editing?.id ?? `addr-${Date.now()}`,
      type: saveAs,
      isDefault: editing?.isDefault,
      name: name.trim(),
      line1: house.trim(),
      line2: `${street.trim()}, ${city.trim()}, ${state.trim()} – ${pincode.trim()}`,
      phone: phone.trim(),
    };
    if (isEdit) {
      updateAddress(address);
    } else {
      addAddress(address);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CheckoutHeader title={isEdit ? 'Edit Address' : 'Add New Address'} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Field label="Full Name *" value={name} onChangeText={setName} placeholder="e.g. Priya Sharma" />
        <Field
          label="Phone Number *"
          value={phone}
          onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ''))}
          placeholder="10-digit mobile number"
          keyboardType="number-pad"
          maxLength={10}
        />
        <Field
          label="House / Flat / Building *"
          value={house}
          onChangeText={setHouse}
          placeholder="e.g. B-204, Green Valley Apartments"
        />
        <Field
          label="Street / Area / Locality *"
          value={street}
          onChangeText={setStreet}
          placeholder="e.g. Sector 62"
        />
        <Field
          label="Landmark (optional)"
          value={landmark}
          onChangeText={setLandmark}
          placeholder="e.g. Near Metro Station"
        />
        <View style={styles.row}>
          <View style={styles.rowGrow}>
            <Field label="City *" value={city} onChangeText={setCity} placeholder="e.g. Noida" />
          </View>
          <View style={styles.rowFixed}>
            <Field
              label="Pincode *"
              value={pincode}
              onChangeText={(t) => setPincode(t.replace(/[^0-9]/g, ''))}
              placeholder="6-digit"
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
        </View>
        <Field label="State *" value={state} onChangeText={setState} placeholder="Select state" />

        <View style={styles.saveAsWrap}>
          <Text style={styles.label}>Save As</Text>
          <View style={styles.saveAsRow}>
            {SAVE_AS_OPTIONS.map((opt) => {
              const active = opt.id === saveAs;
              const Icon = opt.Icon;
              return (
                <Pressable
                  key={opt.id}
                  style={[styles.saveAsChip, active && styles.saveAsChipActive]}
                  onPress={() => setSaveAs(opt.id)}
                >
                  <Icon width={18} height={18} />
                  <Text style={[styles.saveAsLabel, active && styles.saveAsLabelActive]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable
            style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
            disabled={!isValid}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>{isEdit ? 'Update Address' : 'Save Address'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'number-pad';
  maxLength?: number;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(26,26,26,0.5)"
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F9F9F9' },
  content: {
    padding: 20,
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.55,
    textTransform: 'uppercase',
  },
  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1A1A1A',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowGrow: {
    flex: 1,
  },
  rowFixed: {
    width: 100,
  },
  saveAsWrap: {
    gap: 10,
    paddingTop: 4,
  },
  saveAsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveAsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  saveAsChipActive: {
    borderColor: '#1CA672',
    backgroundColor: '#F0FDF4',
  },
  saveAsLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  saveAsLabelActive: {
    fontWeight: '700',
    color: '#1CA672',
  },
  footerSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footer: {
    padding: 16,
  },
  submitButton: {
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
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
