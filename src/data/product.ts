import type { ImageSourcePropType } from 'react-native';

export interface SimilarProduct {
  id: string;
  image: ImageSourcePropType;
  brand: string;
  name: string;
  weight: string;
  pricePerUnit: string;
  price: number;
  mrp: number;
  discountLabel: string;
  rating: string;
  reviews: string;
  offerLabel?: string;
}
