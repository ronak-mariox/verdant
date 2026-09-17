export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
  name: string;
  phone: string;
  line1: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  /** Combined display string for list screens: "street, city, state – pincode". */
  line2: string;
}

export type DeliverySpeedId = 'express' | 'scheduled' | 'standard';

export interface DeliverySpeed {
  id: DeliverySpeedId;
  title: string;
  badge?: string;
  subtitle: string;
  price: string;
}

export const deliverySpeeds: DeliverySpeed[] = [
  { id: 'express', title: 'Express Delivery', badge: 'Fastest', subtitle: 'Arrives in 8–12 mins', price: 'FREE' },
  { id: 'scheduled', title: 'Scheduled', subtitle: 'Choose your time slot', price: 'FREE' },
  { id: 'standard', title: 'Standard', badge: 'Eco', subtitle: 'Arrives in 2–4 hours', price: 'FREE' },
];

export const deliverySlots = ['Today, 2–4 PM', 'Today, 4–6 PM', 'Today, 6–8 PM', 'Tomorrow, 9–11 AM'];

export const deliveryInstructionChips = ['Leave at door', 'Ring bell', 'Call on arrival', 'No plastic bag'];

export type PaymentMethodId = 'gpay' | 'phonepe' | 'paytm' | 'upi-other' | 'visa' | 'add-card' | 'netbanking' | 'cod' | 'wallet';

export interface PaymentMethod {
  id: PaymentMethodId;
  group: 'UPI' | 'Cards' | 'Banking' | 'More';
  title: string;
  subtitle: string;
}

export const paymentMethods: PaymentMethod[] = [
  { id: 'gpay', group: 'UPI', title: 'Google Pay', subtitle: 'UPI' },
  { id: 'phonepe', group: 'UPI', title: 'PhonePe', subtitle: 'UPI' },
  { id: 'paytm', group: 'UPI', title: 'Paytm', subtitle: 'UPI' },
  { id: 'visa', group: 'Cards', title: 'Visa ····4242', subtitle: 'Priya Sharma' },
  { id: 'add-card', group: 'Cards', title: 'Add new card', subtitle: 'Credit / Debit' },
  { id: 'netbanking', group: 'Banking', title: 'Net Banking', subtitle: '6 banks available' },
  { id: 'cod', group: 'More', title: 'Cash on Delivery', subtitle: '₹10 handling fee' },
  { id: 'wallet', group: 'More', title: 'Paytm Wallet', subtitle: 'Balance: ₹230' },
];
