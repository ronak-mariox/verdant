import type { ImageSourcePropType } from 'react-native';

export interface StoreProduct {
  id: string;
  variantId?: string;
  image: ImageSourcePropType;
  title: string;
  weight: string;
  rating?: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
  offerLabel?: string;
  inStock: boolean;
}
