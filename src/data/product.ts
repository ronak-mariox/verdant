import * as img from '../assets/images/product';

export interface Variant {
  id: string;
  label: string;
  price: number;
  mrp: number;
  selected?: boolean;
}

export const variants: Variant[] = [
  { id: '500ml', label: '500ml', price: 160, mrp: 59, selected: true },
  { id: '1l', label: '1L', price: 250, mrp: 300 },
  { id: '5l', label: '5L', price: 1200, mrp: 160 },
];

export interface SimilarProduct {
  id: string;
  image: number;
  brand: string;
  name: string;
  weight: string;
  pricePerUnit: string;
  price: number;
  mrp: number;
  discountLabel: string;
  rating: string;
  reviews: string;
  deliveryTime: string;
}

export const similarProductsRow1: SimilarProduct[] = [
  {
    id: 'sp1-1',
    image: img.similar1_1,
    brand: 'Mahakosh',
    name: 'Mahakosh Refined',
    weight: 'Soyabean Oil',
    pricePerUnit: '₹17.9/100 g',
    price: 134,
    mrp: 176,
    discountLabel: '23% OFF on MRP',
    rating: '★★★★★',
    reviews: '36,716',
    deliveryTime: '14 mins',
  },
  {
    id: 'sp1-2',
    image: img.similar1_2,
    brand: 'Fortune',
    name: 'Fortune Soya Health-',
    weight: 'Refined Soyabean…',
    pricePerUnit: '₹17.9/100 g',
    price: 134,
    mrp: 176,
    discountLabel: '23% OFF on MRP',
    rating: '★★★★★',
    reviews: '36,716',
    deliveryTime: '14 mins',
  },
  {
    id: 'sp1-3',
    image: img.similar1_3,
    brand: 'Vibhor',
    name: 'Vibhor Refined',
    weight: 'Soyabean Oil',
    pricePerUnit: '₹17.9/100 g',
    price: 134,
    mrp: 176,
    discountLabel: '23% OFF on MRP',
    rating: '★★★★★',
    reviews: '36,716',
    deliveryTime: '14 mins',
  },
];

export const similarProductsRow2: SimilarProduct[] = [
  { ...similarProductsRow1[0], id: 'sp2-1', image: img.similar2_1 },
  { ...similarProductsRow1[1], id: 'sp2-2', image: img.similar2_2 },
  { ...similarProductsRow1[2], id: 'sp2-3', image: img.similar2_3 },
];
