export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
  name: string;
  line1: string;
  line2: string;
  phone: string;
}

export const addresses: Address[] = [
  {
    id: 'addr-1',
    type: 'Home',
    isDefault: true,
    name: 'Priya Sharma',
    line1: 'B-204, Green Valley Apartments',
    line2: 'Sector 62, Noida, UP – 201309',
    phone: '98765 43210',
  },
  {
    id: 'addr-2',
    type: 'Work',
    name: 'Priya Sharma',
    line1: 'Tower A, Infosys Campus, Sector 144',
    line2: 'Noida, UP – 201304',
    phone: '98765 43210',
  },
  {
    id: 'addr-3',
    type: 'Other',
    name: 'Rahul Sharma',
    line1: '12A, Ram Nagar Colony, Rajouri Garden',
    line2: 'New Delhi – 110027',
    phone: '91234 56789',
  },
];

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
