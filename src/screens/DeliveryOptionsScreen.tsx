import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DeliveryPin } from '../assets/icons/checkout';
import { CheckoutHeader } from '../components/checkout/CheckoutHeader';
import { useCheckout } from '../context/CheckoutContext';
import { deliveryInstructionChips, deliverySlots, deliverySpeeds } from '../data/checkout';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'DeliveryOptions'>;

export function DeliveryOptionsScreen({ navigation }: Props) {
  const {
    addressList,
    selectedAddressId,
    deliverySpeed,
    setDeliverySpeed,
    deliverySlot,
    setDeliverySlot,
    instructions,
    setInstructions,
  } = useCheckout();
  const address = addressList.find((a) => a.id === selectedAddressId) ?? addressList[0];

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CheckoutHeader
        title="Delivery Options"
        subtitle="Choose how you'd like it"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.deliverCard}>
          <View style={styles.deliverIcon}>
            <DeliveryPin width={18} height={18} />
          </View>
          <View style={styles.deliverBody}>
            <Text style={styles.deliverLabel}>Delivering to</Text>
            <Text style={styles.deliverName}>
              {address.type} · {address.name}
            </Text>
            <Text style={styles.deliverLine} numberOfLines={1}>
              {address.line1}, {address.line2}
            </Text>
          </View>
          <Pressable onPress={() => navigation.navigate('Address')}>
            <Text style={styles.changeLink}>Change</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Delivery Speed</Text>
        <View style={styles.speedList}>
          {deliverySpeeds.map((speed) => {
            const selected = speed.id === deliverySpeed;
            return (
              <View key={speed.id}>
                <Pressable
                  style={[styles.speedCard, selected && styles.speedCardSelected]}
                  onPress={() => setDeliverySpeed(speed.id)}
                >
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                  <View style={styles.speedBody}>
                    <View style={styles.speedTitleRow}>
                      <Text style={styles.speedTitle}>{speed.title}</Text>
                      {speed.badge ? (
                        <View style={styles.speedBadge}>
                          <Text style={styles.speedBadgeText}>{speed.badge}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.speedSubtitle}>{speed.subtitle}</Text>
                  </View>
                  <Text style={styles.speedPrice}>{speed.price}</Text>
                </Pressable>
                {speed.id === 'scheduled' && selected ? (
                  <View style={styles.slotRow}>
                    {deliverySlots.map((slot) => {
                      const slotSelected = slot === deliverySlot;
                      return (
                        <Pressable
                          key={slot}
                          style={[styles.slotChip, slotSelected && styles.slotChipActive]}
                          onPress={() => setDeliverySlot(slot)}
                        >
                          <Text style={[styles.slotChipText, slotSelected && styles.slotChipTextActive]}>
                            {slot}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Delivery Instructions</Text>
        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Add instructions for the delivery partner"
          placeholderTextColor="rgba(26,26,26,0.4)"
          multiline
          style={styles.instructionsInput}
        />
        <View style={styles.chipRow}>
          {deliveryInstructionChips.map((chip) => (
            <Pressable
              key={chip}
              style={styles.chip}
              onPress={() => setInstructions(instructions ? `${instructions}, ${chip}` : chip)}
            >
              <Text style={styles.chipText}>{chip}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable style={styles.continueButton} onPress={() => navigation.navigate('Payment')}>
            <Text style={styles.continueButtonText}>Continue to Payment →</Text>
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
    gap: 12,
  },
  deliverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  deliverIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliverBody: {
    flex: 1,
  },
  deliverLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deliverName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingTop: 3,
  },
  deliverLine: {
    fontSize: 11,
    color: '#6B7280',
    paddingTop: 2,
  },
  changeLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.77,
    textTransform: 'uppercase',
    paddingTop: 8,
    paddingBottom: 2,
  },
  speedList: {
    gap: 10,
  },
  speedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 16,
  },
  speedCardSelected: {
    borderColor: '#1CA672',
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
  speedBody: {
    flex: 1,
  },
  speedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  speedBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  speedBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#92400E',
  },
  speedSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    paddingTop: 2,
  },
  speedPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1CA672',
  },
  slotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
    paddingLeft: 4,
  },
  slotChip: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  slotChipActive: {
    borderColor: '#1CA672',
    backgroundColor: '#F0FDF4',
  },
  slotChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  slotChipTextActive: {
    color: '#1CA672',
  },
  instructionsInput: {
    minHeight: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 14,
    fontSize: 13,
    color: '#1A1A1A',
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
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
  continueButton: {
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
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
