export interface CancellationReason {
  id: string;
  title: string;
  subtitle: string;
}

export const cancellationReasons: CancellationReason[] = [
  { id: 'changed-mind', title: 'Changed my mind', subtitle: 'I no longer want this order' },
  { id: 'mistake', title: 'Ordered by mistake', subtitle: 'Wrong items or quantities selected' },
  { id: 'better-price', title: 'Found a better price elsewhere', subtitle: 'The same items are cheaper elsewhere' },
  { id: 'too-long', title: 'Delivery time too long', subtitle: 'Taking longer than I need' },
  { id: 'not-needed', title: 'Item no longer needed', subtitle: 'Circumstances have changed' },
  { id: 'other', title: 'Other reason', subtitle: 'Please describe below' },
];

export const cancellationPolicy = [
  'Orders can be cancelled until the store starts preparing them.',
  'Once an order is being prepared or is out for delivery, it can no longer be cancelled from the app.',
  'Cash on Delivery orders are never charged, so there is nothing to refund.',
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
  { id: 'other-issue', title: 'Other issue' },
];

export const supportFaqs: { question: string; answer: string }[] = [
  {
    question: 'Can I cancel my order?',
    answer: 'Yes — until the store starts preparing it. Open the order from Orders and tap "Cancel order".',
  },
  {
    question: 'What if an item is missing?',
    answer: 'Use "Report an issue", pick the order and the missing item, and we will follow up by email.',
  },
  {
    question: 'How do I report a damaged item?',
    answer: 'Use "Report an issue", pick the order and describe the damage. Our team will reply by email.',
  },
  {
    question: 'Which payment methods are supported?',
    answer: 'Verdant currently supports Cash on Delivery only.',
  },
  {
    question: 'How do I change my delivery address?',
    answer: 'Go to Profile → Saved addresses to add, edit or set a default address before checkout.',
  },
];

export const SUPPORT_PHONE = '18001234567';
export const SUPPORT_EMAIL = 'support@verdant.app';
