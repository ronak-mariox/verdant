import type { ProductItem } from '../data/home';
import type { SearchProduct } from '../data/search';
import type { StoreProduct } from '../data/store';
import type { RawProduct, RawVariant } from '../types/api';
import { resolveProductImage } from './productImage';

export function primaryVariant(product: RawProduct): RawVariant | undefined {
  return product.variants.find((v) => v.stock > 0) ?? product.variants[0];
}

/** What the customer is actually charged — the offer price when one applies. */
export function variantPrice(variant?: RawVariant): number {
  return variant?.effectivePrice ?? variant?.price ?? 0;
}

export function discountPercent(price: number, mrp: number): number {
  return mrp > 0 && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
}

export function isProductInStock(product: RawProduct): boolean {
  return (product.isAvailable ?? true) && product.variants.some((v) => v.stock > 0);
}

export function toProductItem(product: RawProduct): ProductItem {
  const variant = primaryVariant(product);
  const price = variantPrice(variant);
  const mrp = variant?.mrp ?? 0;
  return {
    id: product.id,
    variantId: variant?.id,
    image: resolveProductImage(product.images[0]),
    title: product.name,
    weight: product.unit ?? variant?.label ?? '',
    price,
    originalPrice: mrp,
    discountPercent: discountPercent(price, mrp),
    offerLabel: product.activeOffer?.title,
    inStock: isProductInStock(product),
  };
}

export function toStoreProduct(product: RawProduct): StoreProduct {
  const variant = primaryVariant(product);
  const price = variantPrice(variant);
  const mrp = variant?.mrp ?? 0;
  return {
    id: product.id,
    variantId: variant?.id,
    image: resolveProductImage(product.images[0]),
    title: product.name,
    weight: product.unit ?? variant?.label ?? '',
    price,
    originalPrice: mrp,
    discountPercent: discountPercent(price, mrp),
    offerLabel: product.activeOffer?.title,
    inStock: isProductInStock(product),
  };
}

export function toSearchProduct(product: RawProduct): SearchProduct {
  const variant = primaryVariant(product);
  const price = variantPrice(variant);
  const mrp = variant?.mrp ?? 0;
  return {
    id: product.id,
    variantId: variant?.id,
    image: resolveProductImage(product.images[0]),
    title: product.name,
    weight: product.unit ?? variant?.label ?? '',
    brand: product.brand ?? '',
    price,
    originalPrice: mrp,
    discountPercent: discountPercent(price, mrp),
    inStock: isProductInStock(product),
    offerLabel: product.activeOffer?.title,
  };
}
