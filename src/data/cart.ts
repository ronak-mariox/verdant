import * as img from '../assets/images/cart';

export interface RecommendedProduct {
  id: string;
  image: number | null;
  name: string;
  price: number;
  mrp: number;
  discountLabel: string;
  bgColor: string;
}

export const recommendedProducts: RecommendedProduct[] = [
  { id: 'rec-1', image: img.recMilk, name: 'Amul Gold Full Cream Milk', price: 32, mrp: 35, discountLabel: '9%', bgColor: '#EFF6FF' },
  { id: 'rec-2', image: img.recEggs, name: 'Farm Fresh Eggs 24g Protine', price: 89, mrp: 96, discountLabel: '7%', bgColor: '#FEFCE8' },
  { id: 'rec-3', image: img.recBread, name: 'Harvest Gold Bread', price: 45, mrp: 50, discountLabel: '10%', bgColor: '#FDF4FF' },
  { id: 'rec-4', image: img.recYogurt, name: 'Greek Yogurt', price: 40, mrp: 45, discountLabel: '11%', bgColor: '#FDF4FF' },
  { id: 'rec-5', image: null, name: 'Tata Salt', price: 22, mrp: 25, discountLabel: '12%', bgColor: '#F0FDF4' },
  { id: 'rec-6', image: img.recOil, name: 'Fortune Sunflower Oil', price: 148, mrp: 175, discountLabel: '15%', bgColor: '#FFF7ED' },
];

export const couponSuggestions = ['FRESH50', 'NEWUSER', 'SAVE30'];

export const MIN_ORDER_VALUE = 99;
export const DELIVERY_FEE = 30;
export const PLATFORM_FEE = 5;
