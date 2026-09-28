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

export const deliveryInstructionChips = ['Leave at door', 'Ring bell', 'Call on arrival', 'No plastic bag'];

export type PaymentMethodId = 'gpay' | 'phonepe' | 'paytm' | 'upi-other' | 'visa' | 'add-card' | 'netbanking' | 'cod' | 'wallet';

export interface PaymentMethod {
  id: PaymentMethodId;
  group: 'UPI' | 'Cards' | 'Banking' | 'More';
  title: string;
  subtitle: string;
}

/** Only Cash on Delivery is wired to the backend; everything else is shown as "Coming soon". */
export const AVAILABLE_PAYMENT_METHODS: PaymentMethodId[] = ['cod'];

export const paymentMethods: PaymentMethod[] = [
  { id: 'gpay', group: 'UPI', title: 'Google Pay', subtitle: 'UPI' },
  { id: 'phonepe', group: 'UPI', title: 'PhonePe', subtitle: 'UPI' },
  { id: 'paytm', group: 'UPI', title: 'Paytm', subtitle: 'UPI' },
  { id: 'visa', group: 'Cards', title: 'Debit / Credit card', subtitle: 'Visa, Mastercard, RuPay' },
  { id: 'add-card', group: 'Cards', title: 'Add new card', subtitle: 'Credit / Debit' },
  { id: 'netbanking', group: 'Banking', title: 'Net Banking', subtitle: '6 banks available' },
  { id: 'cod', group: 'More', title: 'Cash on Delivery', subtitle: 'Pay at your doorstep' },
  { id: 'wallet', group: 'More', title: 'Paytm Wallet', subtitle: 'Balance: ₹230' },
];
