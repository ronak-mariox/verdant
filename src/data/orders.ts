import * as img from '../assets/images/order';
import { fortuneThumb } from '../assets/images/order';

export interface OrderLineItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: number;
}

export const activeOrder = {
  id: '#BLK240904-7831',
  date: '4 Sep 2026, 2:15 PM',
  shortDate: '4 Sep 2026',
  eta: '12',
  etaBy: '2:27 PM',
  items: [
    { id: 'oi-1', name: 'Fortune Sunflower Oil', subtitle: '1 L × 1', price: 148, image: fortuneThumb },
    { id: 'oi-2', name: 'Aashirvaad Besan', subtitle: '500g × 4', price: 265, image: img.besan },
  ] as OrderLineItem[],
  itemTotal: 413,
  itemDiscount: 22,
  couponCode: 'FRESH50',
  couponDiscount: 50,
  deliveryFee: 0,
  platformFee: 5,
  total: 346,
  savings: 72,
  address: {
    label: 'Home',
    name: 'Priya Sharma',
    line1: 'B-204, Green Valley Apartments',
    line2: 'Sector 62, Noida – 201309',
  },
  payment: {
    method: 'Google Pay',
    account: 'priya@okaxis',
    transactionId: 'TXN240904214523',
    dateTime: '4 Sep 2026, 2:15 PM',
    amount: 346,
  },
  partner: {
    initials: 'RK',
    name: 'Rajesh Kumar',
    rating: '4.8',
    trips: '1,236 trips',
  },
};

export interface HistoryOrder {
  id: string;
  date: string;
  status: 'active' | 'delivered' | 'cancelled';
  statusLabel: string;
  eta?: string;
  etaBy?: string;
  summary: string;
  itemCount: number;
  total: number;
  thumbs?: number[];
}

export const historyOrders: HistoryOrder[] = [
  {
    id: '#BLK240904-7831',
    date: '4 Sep 2026',
    status: 'active',
    statusLabel: 'Out for delivery',
    eta: '12 min',
    etaBy: '2:27 PM',
    summary: 'Fortune Oil · Aashirvaad Besan + 4 more',
    itemCount: 6,
    total: 477,
    thumbs: [img.historyThumb1, img.historyThumb2, img.historyThumb3, img.historyThumb4],
  },
  {
    id: '#BLK240831-2451',
    date: '31 Aug 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    summary: 'Fortune Oil · Farm Eggs · Harvest Bread',
    itemCount: 3,
    total: 312,
  },
  {
    id: '#BLK240828-9123',
    date: '28 Aug 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    summary: 'Aashirvaad Atta · Tata Salt · Milk +4 more',
    itemCount: 7,
    total: 689,
  },
  {
    id: '#BLK240820-5567',
    date: '20 Aug 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    summary: 'Dettol Handwash · Colgate Max Fresh',
    itemCount: 2,
    total: 178,
  },
  {
    id: '#BLK240815-3341',
    date: '15 Aug 2026',
    status: 'cancelled',
    statusLabel: 'Cancelled',
    summary: 'Alphonso Mangoes · Bananas · +3 more',
    itemCount: 5,
    total: 534,
  },
];

export const paySuccessItems = [
  { id: 'ps-1', label: 'Fortune', image: fortuneThumb },
  { id: 'ps-2', label: 'Aashirvaad', image: img.besan },
  { id: 'ps-3', label: 'Amul ×2', image: null },
  { id: 'ps-4', label: "Lay's", image: null },
  { id: 'ps-5', label: 'Spinach', image: null },
];

export const reorderItems: OrderLineItem[] = [
  { id: 'ro-1', name: 'Fortune Sunflower Oil', subtitle: '₹148 · 1 L', price: 148, image: img.reorderFortune },
  { id: 'ro-2', name: 'Aashirvaad Atta', subtitle: '₹265 · 5 kg', price: 265, image: img.reorderBesan },
  { id: 'ro-3', name: 'Amul Gold Milk', subtitle: '₹32 · 500 ml', price: 32, image: img.reorderMilk },
  { id: 'ro-4', name: "Lay's Classic Salted", subtitle: '₹20 · 52 g', price: 20, image: img.reorderLays },
  { id: 'ro-5', name: 'Spinach (Palak)', subtitle: '₹25 · 250 g', price: 25, image: img.reorderSpinach },
];

export interface CancellationReason {
  id: string;
  title: string;
  subtitle: string;
}

export const cancellationReasons: CancellationReason[] = [
  { id: 'changed-mind', title: 'Changed my mind', subtitle: 'I no longer want this order' },
  { id: 'mistake', title: 'Ordered by mistake', subtitle: 'Wrong items or quantities selected' },
  { id: 'better-price', title: 'Found a better price elsewhere', subtitle: 'The same items are cheaper elsewhere' },
  { id: 'too-long', title: 'Delivery time too long', subtitle: 'ETA is longer than I need' },
  { id: 'not-needed', title: 'Item no longer needed', subtitle: 'Circumstances have changed' },
  { id: 'other', title: 'Other reason', subtitle: 'Please describe below' },
];

export const cancellationPolicy = [
  'Orders can be cancelled within 60 seconds of placing.',
  'Cancellations after pickup are not guaranteed.',
  'Refund will be credited to your original payment method.',
  'COD orders will receive Blinkit wallet credit.',
];

export interface IssueType {
  id: string;
  title: string;
}

export const issueTypes: IssueType[] = [
  { id: 'missing-item', title: 'Missing item' },
  { id: 'wrong-item', title: 'Wrong item' },
  { id: 'damaged-item', title: 'Damaged item' },
  { id: 'poor-quality', title: 'Poor quality' },
  { id: 'delivery-issue', title: 'Delivery issue' },
  { id: 'payment-issue', title: 'Payment issue' },
  { id: 'refund-issue', title: 'Refund issue' },
  { id: 'other-issue', title: 'Other issue' },
];

export const supportFaqs = [
  'How long does a refund take?',
  'Can I cancel my order?',
  'What if an item is missing?',
  'My payment was deducted but order failed',
  'How do I get a replacement?',
];

export const ticketInfo = {
  id: 'TKT240904-3421',
  responseTime: '2 hours',
  createdAt: '4 Sep 2026, 2:45 PM',
  resolvedAt: '4 Sep 2026, 4:12 PM',
  agent: 'Vikram (Support)',
};
