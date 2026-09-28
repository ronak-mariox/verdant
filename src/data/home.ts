import type { ImageSourcePropType } from 'react-native';
import * as img from '../assets/images/home';

export interface ProductItem {
  id: string;
  /** First in-stock variant — what "add to cart" uses. */
  variantId?: string;
  image: ImageSourcePropType;
  title: string;
  weight: string;
  rating?: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
  isAd?: boolean;
  /** Title of the vendor offer that produced `price`, when one applies. */
  offerLabel?: string;
  inStock?: boolean;
}

export interface CategoryTab {
  id: string;
  label: string;
  image: ImageSourcePropType;
}

export const featuredPicks = [
  img.featured1, img.featured2, img.featured3, img.featured4, img.featured5,
  img.featured6, img.featured7, img.featured8, img.featured9,
];

export interface CategoryLink {
  categoryId: string;
  subcategoryId?: string;
}

// Parallel to featuredPicks: Movie snacks!, New launch, What's cooking?, Breakfast spread,
// Smile please!, Sip & slurp, The organic zone, Chocolatey treats, Refresh it up!
export const featuredPickLinks: CategoryLink[] = [
  { categoryId: 'snacks', subcategoryId: 'chips-snacks' },
  { categoryId: 'snacks', subcategoryId: 'chips-snacks' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'dairy-breakfast' },
  { categoryId: 'personal-care', subcategoryId: 'oral-care' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'snacks', subcategoryId: 'chocolates' },
  { categoryId: 'snacks', subcategoryId: 'soft-drinks' },
];

export const storeCards = [
  img.store1, img.store2, img.store3, img.store4, img.store5, img.store6, img.store7,
];

export const essentialTiles = [
  img.essential1, img.essential2, img.essential3, img.essential4,
  img.essential5, img.essential6, img.essential7, img.essential8,
];

// Parallel to essentialTiles: Atta & rice, Oil & ghee, Dal & pulses, Suji & flours,
// Spices & pickles, Tea & coffee, Dry fruits, Cereals & muesli
export const essentialTileLinks: CategoryLink[] = [
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'snacks', subcategoryId: 'tea-coffee' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'dairy-breakfast' },
];

export const promoTiles = [img.tile1, img.tile2, img.tile3];

export const banners = {
  topDeals: img.bannerTopdeals,
  promo1: img.banner1,
  promo2: img.banner2,
  promo3: img.banner3,
  footer: img.footer,
};
