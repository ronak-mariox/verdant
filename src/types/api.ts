/** Response shapes shared across screens — mirrors the backend's customer routes. */

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

export interface RawOrderItem {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  imageUrl?: string;
  price: number;
  mrp: number;
  quantity: number;
  /** Post-offer line total. */
  subtotal: number;
  /** Pre-offer line total; only present when a vendor offer applied to the line. */
  originalSubtotal?: number;
  offerId?: string;
}

export interface RawOrderAddress {
  contactName?: string;
  contactPhone?: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface RawPricing {
  itemsTotal: number;
  taxTotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  grandTotal: number;
}

export interface RawDriver {
  id: string;
  name: string;
  phone: string;
  vehicleType?: string;
  vehicleNumber?: string;
  rating?: number;
}

export interface RawOrder {
  id: string;
  orderNumber: string;
  items: RawOrderItem[];
  address: RawOrderAddress;
  pricing: RawPricing;
  couponCode?: string;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: OrderStatus;
  placedAt: string;
  deliveredAt?: string;
  cancelReason?: string;
  cancelledBy?: 'customer' | 'vendor' | 'admin' | 'driver';
  /** Present only while `status === 'out_for_delivery'`. */
  deliveryOtp?: string;
  driver?: RawDriver | null;
  driverId?: string | null;
  rating?: unknown;
  vendorRating?: unknown;
}

export interface RawVariant {
  id: string;
  label: string;
  mrp: number;
  price: number;
  stock: number;
  sku?: string;
  /** Offer-discounted unit price the customer is actually charged. */
  effectivePrice?: number;
}

export interface RawActiveOffer {
  id: string;
  title: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
}

export interface RawProduct {
  id: string;
  vendorId?: string;
  categoryId?: string;
  subcategoryId?: string;
  name: string;
  description?: string;
  brand?: string;
  unit?: string;
  images: string[];
  variants: RawVariant[];
  tags?: string[];
  taxRate?: number;
  status?: string;
  isAvailable?: boolean;
  sku?: string;
  barcode?: string;
  hsnCode?: string;
  countryOfOrigin?: string;
  activeOffer?: RawActiveOffer | null;
}

export interface RawSubcategory {
  id: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface RawCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  showOnHome: boolean;
  subcategories: RawSubcategory[];
}

export interface RawCartItem {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  imageUrl?: string;
  price: number;
  mrp?: number;
  quantity: number;
  subtotal: number;
  originalSubtotal?: number;
  offerId?: string;
  maxStock: number;
}

export interface RawUnavailableCartLine {
  productId: string;
  variantId: string;
  reason: string;
}

export interface RawCart {
  items: RawCartItem[];
  unavailable: RawUnavailableCartLine[];
  couponCode: string | null;
  couponMessage?: string;
  pricing: RawPricing;
}

export type NotificationKind = 'order' | 'offer' | 'delivered' | 'reorder' | 'refund' | 'security';

export interface RawNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  orderId?: string;
  orderNumber?: string;
  data?: { orderId?: string; orderNumber?: string };
  isRead: boolean;
  createdAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

/** Some list endpoints return a bare array, others `{ items }` — accept either. */
export function unwrapList<T>(data: T[] | PagedResponse<T> | null | undefined): T[] {
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order placed',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

/** Friendly one-liner for where the order is right now — replaces any fake ETA maths. */
export const ORDER_STATUS_TEXT: Record<OrderStatus, string> = {
  placed: 'Waiting for the store to confirm',
  accepted: 'Confirmed — being prepared',
  preparing: 'Being prepared',
  ready_for_pickup: 'Packed and waiting for a delivery partner',
  out_for_delivery: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected by the store',
};

/** Index into the 5-step progress tracker (Confirmed → Preparing → Packed → Out for delivery → Delivered). */
export const ORDER_STATUS_STEP: Partial<Record<OrderStatus, number>> = {
  placed: 0,
  accepted: 1,
  preparing: 1,
  ready_for_pickup: 2,
  out_for_delivery: 3,
  delivered: 4,
};

export const CUSTOMER_CANCELLABLE_STATUSES: OrderStatus[] = ['placed', 'accepted'];
export const TERMINAL_ORDER_STATUSES: OrderStatus[] = ['delivered', 'cancelled', 'rejected'];

export function isTerminalStatus(status: OrderStatus): boolean {
  return TERMINAL_ORDER_STATUSES.includes(status);
}

export function isCustomerCancellable(status: OrderStatus): boolean {
  return CUSTOMER_CANCELLABLE_STATUSES.includes(status);
}

export function getNotificationOrderId(n: RawNotification): string | undefined {
  return n.orderId ?? n.data?.orderId;
}

export function getNotificationOrderNumber(n: RawNotification): string | undefined {
  return n.orderNumber ?? n.data?.orderNumber;
}

export function isOrderRated(order: Pick<RawOrder, 'rating' | 'vendorRating'>): boolean {
  return order.rating != null || order.vendorRating != null;
}

/** Bill maths shared by the cart, review and order screens so the rows always add up. */
export function summarizeLines(items: Array<Pick<RawOrderItem, 'subtotal' | 'originalSubtotal'>>) {
  const itemTotal = items.reduce((sum, i) => sum + (i.originalSubtotal ?? i.subtotal), 0);
  const offerDiscount = items.reduce((sum, i) => sum + ((i.originalSubtotal ?? i.subtotal) - i.subtotal), 0);
  return { itemTotal: round2(itemTotal), offerDiscount: round2(offerDiscount) };
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
