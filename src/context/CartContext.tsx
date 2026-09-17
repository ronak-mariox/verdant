import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { api, getErrorMessage } from '../services/api';
import { resolveProductImage } from '../utils/productImage';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string; // `${productId}::${variantId}` — unique per cart line
  productId: string;
  variantId: string;
  title: string;
  subtitle: string;
  price: number;
  mrp?: number;
  image: ImageSourcePropType;
  quantity: number;
  maxStock: number;
}

export interface CartPricing {
  itemsTotal: number;
  taxTotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  grandTotal: number;
}

interface RawCartItem {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  imageUrl?: string;
  price: number;
  mrp?: number;
  quantity: number;
  maxStock: number;
}

interface RawCartResponse {
  items: RawCartItem[];
  unavailable: { productId: string; variantId: string; reason: string }[];
  couponCode: string | null;
  couponMessage?: string;
  pricing: CartPricing;
}

function toCartItem(raw: RawCartItem): CartItem {
  return {
    id: `${raw.productId}::${raw.variantId}`,
    productId: raw.productId,
    variantId: raw.variantId,
    title: raw.name,
    subtitle: raw.variantLabel,
    price: raw.price,
    mrp: raw.mrp,
    image: resolveProductImage(raw.imageUrl),
    quantity: raw.quantity,
    maxStock: raw.maxStock,
  };
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  pricing: CartPricing | null;
  couponCode: string | null;
  couponMessage?: string;
  unavailable: { productId: string; variantId: string; reason: string }[];
  addItem: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  increment: (id: string) => Promise<void>;
  decrement: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const EMPTY_CART: RawCartResponse = { items: [], unavailable: [], couponCode: null, pricing: { itemsTotal: 0, taxTotal: 0, deliveryFee: 0, platformFee: 0, discount: 0, grandTotal: 0 } };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<RawCartResponse>(EMPTY_CART);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<RawCartResponse>('/customer/cart');
      setCart(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart().catch(() => {});
    } else {
      setCart(EMPTY_CART);
    }
  }, [isAuthenticated, refreshCart]);

  const addItem = useCallback(async (productId: string, variantId: string, quantity = 1) => {
    const { data } = await api.post<RawCartResponse>('/customer/cart/items', { productId, variantId, quantity });
    setCart(data);
  }, []);

  const setQuantity = useCallback(async (id: string, quantity: number) => {
    const [productId, variantId] = id.split('::');
    const { data } = await api.patch<RawCartResponse>(`/customer/cart/items/${productId}/${variantId}`, { quantity });
    setCart(data);
  }, []);

  const increment = useCallback(
    async (id: string) => {
      const current = cart.items.find((i) => `${i.productId}::${i.variantId}` === id);
      await setQuantity(id, (current?.quantity ?? 0) + 1);
    },
    [cart.items, setQuantity],
  );

  const decrement = useCallback(
    async (id: string) => {
      const current = cart.items.find((i) => `${i.productId}::${i.variantId}` === id);
      await setQuantity(id, (current?.quantity ?? 1) - 1);
    },
    [cart.items, setQuantity],
  );

  const removeItem = useCallback(async (id: string) => {
    const [productId, variantId] = id.split('::');
    const { data } = await api.delete<RawCartResponse>(`/customer/cart/items/${productId}/${variantId}`);
    setCart(data);
  }, []);

  const clearCart = useCallback(async () => {
    const { data } = await api.delete<RawCartResponse>('/customer/cart');
    setCart(data);
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const { data } = await api.post<RawCartResponse>('/customer/cart/coupon', { code });
      setCart(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, 'This coupon cannot be applied'));
    }
  }, []);

  const removeCoupon = useCallback(async () => {
    const { data } = await api.delete<RawCartResponse>('/customer/cart/coupon');
    setCart(data);
  }, []);

  const items = useMemo(() => cart.items.map(toCartItem), [cart.items]);
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      isLoading,
      pricing: cart.pricing,
      couponCode: cart.couponCode,
      couponMessage: cart.couponMessage,
      unavailable: cart.unavailable,
      addItem,
      increment,
      decrement,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      refreshCart,
    }),
    [items, itemCount, isLoading, cart, addItem, increment, decrement, removeItem, clearCart, applyCoupon, removeCoupon, refreshCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
