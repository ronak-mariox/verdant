import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { Address, DeliverySpeedId, PaymentMethodId } from '../data/checkout';
import { useAuth } from './AuthContext';

interface RawAddress {
  id: string;
  label: 'home' | 'work' | 'other';
  contactName?: string;
  contactPhone?: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const LABEL_TO_TYPE: Record<RawAddress['label'], Address['type']> = { home: 'Home', work: 'Work', other: 'Other' };
const TYPE_TO_LABEL: Record<Address['type'], RawAddress['label']> = { Home: 'home', Work: 'work', Other: 'other' };

function toAddress(raw: RawAddress): Address {
  return {
    id: raw.id,
    type: LABEL_TO_TYPE[raw.label],
    isDefault: raw.isDefault,
    name: raw.contactName ?? '',
    phone: raw.contactPhone ?? '',
    line1: raw.line1,
    street: raw.line2 ?? '',
    landmark: raw.landmark,
    city: raw.city,
    state: raw.state,
    pincode: raw.pincode,
    line2: [raw.line2, raw.city, raw.state && raw.pincode ? `${raw.state} – ${raw.pincode}` : undefined]
      .filter(Boolean)
      .join(', '),
  };
}

export type AddressInput = Pick<Address, 'type' | 'name' | 'phone' | 'line1' | 'street' | 'landmark' | 'city' | 'state' | 'pincode'>;

function toRequestBody(input: AddressInput) {
  return {
    label: TYPE_TO_LABEL[input.type],
    contactName: input.name,
    contactPhone: input.phone,
    line1: input.line1,
    line2: input.street,
    landmark: input.landmark,
    city: input.city,
    state: input.state,
    pincode: input.pincode,
  };
}

interface CheckoutContextValue {
  addressList: Address[];
  isLoadingAddresses: boolean;
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  addAddress: (input: AddressInput) => Promise<void>;
  updateAddress: (id: string, input: AddressInput) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  refreshAddresses: () => Promise<void>;
  deliverySpeed: DeliverySpeedId;
  setDeliverySpeed: (id: DeliverySpeedId) => void;
  deliverySlot: string;
  setDeliverySlot: (slot: string) => void;
  instructions: string;
  setInstructions: (value: string) => void;
  paymentMethod: PaymentMethodId;
  setPaymentMethod: (id: PaymentMethodId) => void;
}

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeedId>('express');
  const [deliverySlot, setDeliverySlot] = useState('Today, 2–4 PM');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('gpay');

  const refreshAddresses = useCallback(async () => {
    setIsLoadingAddresses(true);
    try {
      const { data } = await api.get<RawAddress[]>('/customer/addresses');
      const mapped = data.map(toAddress);
      setAddressList(mapped);
      setSelectedAddressId((prev) => {
        if (prev && mapped.some((a) => a.id === prev)) return prev;
        return mapped.find((a) => a.isDefault)?.id ?? mapped[0]?.id ?? '';
      });
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAddresses().catch(() => {});
    } else {
      setAddressList([]);
      setSelectedAddressId('');
    }
  }, [isAuthenticated, refreshAddresses]);

  const addAddress = useCallback(
    async (input: AddressInput) => {
      const { data } = await api.post<RawAddress>('/customer/addresses', toRequestBody(input));
      await refreshAddresses();
      setSelectedAddressId(data.id);
    },
    [refreshAddresses],
  );

  const updateAddress = useCallback(
    async (id: string, input: AddressInput) => {
      await api.patch<RawAddress>(`/customer/addresses/${id}`, toRequestBody(input));
      await refreshAddresses();
    },
    [refreshAddresses],
  );

  const removeAddress = useCallback(
    async (id: string) => {
      await api.delete(`/customer/addresses/${id}`);
      await refreshAddresses();
    },
    [refreshAddresses],
  );

  const value = useMemo(
    () => ({
      addressList,
      isLoadingAddresses,
      selectedAddressId,
      setSelectedAddressId,
      addAddress,
      updateAddress,
      removeAddress,
      refreshAddresses,
      deliverySpeed,
      setDeliverySpeed,
      deliverySlot,
      setDeliverySlot,
      instructions,
      setInstructions,
      paymentMethod,
      setPaymentMethod,
    }),
    [
      addressList,
      isLoadingAddresses,
      selectedAddressId,
      addAddress,
      updateAddress,
      removeAddress,
      refreshAddresses,
      deliverySpeed,
      deliverySlot,
      instructions,
      paymentMethod,
    ],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
