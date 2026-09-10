import React, { createContext, useContext, useMemo, useState } from 'react';
import { addresses as defaultAddresses, type Address, type DeliverySpeedId, type PaymentMethodId } from '../data/checkout';

interface CheckoutContextValue {
  addressList: Address[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  deliverySpeed: DeliverySpeedId;
  setDeliverySpeed: (id: DeliverySpeedId) => void;
  deliverySlot: string;
  setDeliverySlot: (slot: string) => void;
  instructions: string;
  setInstructions: (value: string) => void;
  paymentMethod: PaymentMethodId;
  setPaymentMethod: (id: PaymentMethodId) => void;
  couponApplied: string | null;
  setCouponApplied: (code: string | null) => void;
}

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [addressList, setAddressList] = useState<Address[]>(defaultAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddresses[0].id);
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeedId>('express');
  const [deliverySlot, setDeliverySlot] = useState('Today, 2–4 PM');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('gpay');
  const [couponApplied, setCouponApplied] = useState<string | null>('FRESH50');

  const addAddress = (address: Address) => setAddressList((prev) => [...prev, address]);
  const updateAddress = (address: Address) =>
    setAddressList((prev) => prev.map((a) => (a.id === address.id ? address : a)));
  const removeAddress = (id: string) => setAddressList((prev) => prev.filter((a) => a.id !== id));

  const value = useMemo(
    () => ({
      addressList,
      selectedAddressId,
      setSelectedAddressId,
      addAddress,
      updateAddress,
      removeAddress,
      deliverySpeed,
      setDeliverySpeed,
      deliverySlot,
      setDeliverySlot,
      instructions,
      setInstructions,
      paymentMethod,
      setPaymentMethod,
      couponApplied,
      setCouponApplied,
    }),
    [addressList, selectedAddressId, deliverySpeed, deliverySlot, instructions, paymentMethod, couponApplied],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
