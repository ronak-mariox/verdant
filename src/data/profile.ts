export const userProfile = {
  name: 'Priya Sharma',
  email: 'priya.sharma@gmail.com',
  phone: '+91 98765 43210',
  dob: '12 Mar 1994',
  gender: 'Female' as 'Female' | 'Male' | 'Other',
  memberSince: 'Aug 2024',
  stats: {
    orders: 24,
    saved: 8,
    savedAmount: '₹4,280',
  },
};

export interface ProfileAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
  line1: string;
  line2: string;
}

export const profileAddresses: ProfileAddress[] = [
  { id: 'pa-1', type: 'Home', isDefault: true, line1: 'B-204, Green Valley Apartments', line2: 'Sector 62, Noida – 201309' },
  { id: 'pa-2', type: 'Work', line1: 'Block A, Cyber City, Tower 8', line2: 'DLF Phase 2, Gurugram – 122002' },
  { id: 'pa-3', type: 'Other', line1: '12, Lajpat Nagar – III', line2: 'New Delhi – 110024' },
];

export interface SavedUpi {
  id: string;
  name: string;
  handle: string;
  isDefault?: boolean;
}

export const savedUpiMethods: SavedUpi[] = [
  { id: 'upi-1', name: 'Google Pay', handle: 'priya@okaxis', isDefault: true },
  { id: 'upi-2', name: 'PhonePe', handle: 'priya@ybl' },
];

export interface SavedCard {
  id: string;
  bank: string;
  last4: string;
  expiry: string;
  network: 'Visa' | 'Mastercard';
  gradientColors: [string, string];
}

export const savedCards: SavedCard[] = [
  { id: 'card-1', bank: 'HDFC Bank', last4: '4521', expiry: '08/27', network: 'Visa', gradientColors: ['#1A56DB', 'rgba(26,86,219,0.8)'] },
  { id: 'card-2', bank: 'SBI Card', last4: '8834', expiry: '03/26', network: 'Mastercard', gradientColors: ['#B91C1C', 'rgba(185,28,28,0.8)'] },
];

export type NotificationKind = 'order' | 'offer' | 'delivered' | 'reorder' | 'refund' | 'security';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  actionLabel: string;
}

export const notifications: AppNotification[] = [
  {
    id: 'n-1',
    kind: 'order',
    title: 'Order out for delivery!',
    body: 'Rajesh K. is on the way with your order #BLK240904-7831. ETA: 12 min.',
    time: '2 min ago',
    unread: true,
    actionLabel: 'Track →',
  },
  {
    id: 'n-2',
    kind: 'offer',
    title: 'Weekend offer — save big!',
    body: 'Use code FRESH50 for ₹50 off on orders above ₹299. Valid till Sunday.',
    time: '1 hr ago',
    unread: true,
    actionLabel: 'Shop →',
  },
  {
    id: 'n-3',
    kind: 'delivered',
    title: 'Order delivered',
    body: 'Your order #BLK240831-2451 was delivered on 31 Aug. Hope you enjoyed!',
    time: '3 days ago',
    unread: true,
    actionLabel: 'Rate →',
  },
  {
    id: 'n-4',
    kind: 'reorder',
    title: 'Time to reorder Amul Milk',
    body: 'You last ordered Amul Gold Milk 7 days ago. Running low?',
    time: '5 days ago',
    unread: false,
    actionLabel: 'Add →',
  },
  {
    id: 'n-5',
    kind: 'refund',
    title: 'Refund of ₹148 initiated',
    body: 'Your refund for the missing item has been processed. ETA: 5–7 days.',
    time: '6 days ago',
    unread: false,
    actionLabel: '',
  },
  {
    id: 'n-6',
    kind: 'security',
    title: 'New login from Delhi',
    body: 'A new login was detected from Delhi on 28 Aug, 9:14 AM. Was this you?',
    time: '7 days ago',
    unread: false,
    actionLabel: 'Review →',
  },
];
