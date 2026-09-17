import * as img from '../assets/images/category';
import { grabItems, saverItems, snackItems, topDeals, type ProductItem } from './home';
import { PRICE_RANGES, MIN_DISCOUNT_OPTIONS, type SortOption } from './search';

export interface Subcategory {
  id: string;
  label: string;
  icon: number;
  keywords: string[];
}

export interface MainCategory {
  id: string;
  label: string;
  pillLabel: string;
  tileBackground: string;
  subcategories: Subcategory[];
}

export const mainCategories: MainCategory[] = [
  {
    id: 'grocery',
    label: 'Grocery',
    pillLabel: 'Grocery',
    tileBackground: '#F0FDF4',
    subcategories: [
      { id: 'fruits-vegetables', label: 'Fruits & Vegetables', icon: img.groceryFruitsVegetables, keywords: ['tomato', 'banana', 'apple', 'mango', 'vegetable'] },
      { id: 'dairy-breakfast', label: 'Dairy & Breakfast', icon: img.groceryDairyBreakfast, keywords: ['milk', 'paneer', 'curd', 'ghee', 'cheese', 'cereal'] },
      { id: 'staples', label: 'Staples', icon: img.groceryStaples, keywords: ['dal', 'chana', 'atta', 'sugar', 'suji', 'raisin', 'oil', 'rice'] },
      { id: 'bakery', label: 'Bakery', icon: img.groceryBakery, keywords: ['bread', 'biscuit', 'cookie'] },
      { id: 'frozen-foods', label: 'Frozen Foods', icon: img.groceryFrozenFoods, keywords: ['peas', 'frozen'] },
    ],
  },
  {
    id: 'snacks',
    label: 'Snacks & Beverages',
    pillLabel: 'Snacks & Beverages',
    tileBackground: '#FFFBEB',
    subcategories: [
      { id: 'chips-snacks', label: 'Chips & Snacks', icon: img.snacksChipsSnacks, keywords: ['chip'] },
      { id: 'chocolates', label: 'Chocolates', icon: img.snacksChocolates, keywords: ['chocolate', 'cadbury'] },
      { id: 'soft-drinks', label: 'Soft Drinks', icon: img.snacksSoftDrinks, keywords: ['drink'] },
      { id: 'juices', label: 'Juices', icon: img.snacksJuices, keywords: ['juice'] },
      { id: 'tea-coffee', label: 'Tea & Coffee', icon: img.snacksTeaCoffee, keywords: ['tea', 'coffee'] },
    ],
  },
  {
    id: 'personal-care',
    label: 'Personal Care',
    pillLabel: 'Personal Care',
    tileBackground: '#FDF2F8',
    subcategories: [
      { id: 'bath-body', label: 'Bath & Body', icon: img.personalBathBody, keywords: ['soap', 'bath', 'pears'] },
      { id: 'hair-care', label: 'Hair Care', icon: img.personalHairCare, keywords: ['shampoo', 'hair'] },
      { id: 'oral-care', label: 'Oral Care', icon: img.personalOralCare, keywords: ['toothpaste', 'oral', 'brush'] },
      { id: 'grooming', label: 'Grooming', icon: img.personalGrooming, keywords: ['razor', 'grooming'] },
    ],
  },
  {
    id: 'household',
    label: 'Household',
    pillLabel: 'Household',
    tileBackground: '#F0F9FF',
    subcategories: [
      { id: 'cleaning', label: 'Cleaning', icon: img.householdCleaning, keywords: ['vim', 'clean', 'dish'] },
      { id: 'laundry', label: 'Laundry', icon: img.householdLaundry, keywords: ['detergent', 'laundry'] },
      { id: 'kitchen', label: 'Kitchen', icon: img.householdKitchen, keywords: ['kitchen'] },
      { id: 'home-essentials', label: 'Home Essentials', icon: img.householdHomeEssentials, keywords: ['home'] },
    ],
  },
  {
    id: 'baby-pet',
    label: 'Baby & Pet',
    pillLabel: 'Baby & Pet',
    tileBackground: '#F5F3FF',
    subcategories: [
      { id: 'baby-care', label: 'Baby Care', icon: img.babypetBabyCare, keywords: ['baby', 'diaper'] },
      { id: 'pet-food', label: 'Pet Food', icon: img.babypetPetFood, keywords: ['pet food'] },
      { id: 'pet-essentials', label: 'Pet Essentials', icon: img.babypetPetEssentials, keywords: ['pet'] },
    ],
  },
];

export interface RecentlyViewedItem {
  id: string;
  label: string;
  icon: number;
  categoryId: string;
  subcategoryId: string;
}

export const recentlyViewed: RecentlyViewedItem[] = [
  { id: 'rv-fruits-veg', label: 'Fruits & Veg', icon: img.recentFruitsVeg, categoryId: 'grocery', subcategoryId: 'fruits-vegetables' },
  { id: 'rv-dairy', label: 'Dairy', icon: img.recentDairy, categoryId: 'grocery', subcategoryId: 'dairy-breakfast' },
  { id: 'rv-chips', label: 'Chips', icon: img.recentChips, categoryId: 'snacks', subcategoryId: 'chips-snacks' },
  { id: 'rv-bath-body', label: 'Bath & Body', icon: img.recentBathBody, categoryId: 'personal-care', subcategoryId: 'bath-body' },
  { id: 'rv-tea-coffee', label: 'Tea & Coffee', icon: img.recentTeaCoffee, categoryId: 'snacks', subcategoryId: 'tea-coffee' },
];

export interface CategoryPromoCard {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  icon: number;
}

export const categoryPromoCards: CategoryPromoCard[] = [
  { id: 'seasonal', title: 'Seasonal Specials', badge: 'NEW', subtitle: 'Monsoon freshness, delivered', icon: img.promoSeasonalSpecials },
  { id: 'organic', title: 'Organic Range', badge: 'ORGANIC', subtitle: 'Certified organic produce', icon: img.promoOrganicRange },
];

export const categoryProducts: Record<string, ProductItem[]> = {
  grocery: [...saverItems, topDeals[2], topDeals[5], topDeals[6], topDeals[8], topDeals[9]],
  snacks: [...snackItems, grabItems[4], grabItems[1], topDeals[3], topDeals[7]],
  'personal-care': [topDeals[1]],
  household: [topDeals[10]],
  'baby-pet': [],
};

export function getCategoryProducts(categoryId: string, subcategoryId: string | 'all'): ProductItem[] {
  const pool = categoryProducts[categoryId] ?? [];
  if (subcategoryId === 'all') return pool;
  const subcategory = mainCategories.find((c) => c.id === categoryId)?.subcategories.find((s) => s.id === subcategoryId);
  if (!subcategory) return pool;
  return pool.filter((item) => subcategory.keywords.some((keyword) => item.title.toLowerCase().includes(keyword)));
}

export interface CategoryFilterState {
  priceRangeLabel: string | null;
  minDiscountLabel: string;
}

export const DEFAULT_CATEGORY_FILTERS: CategoryFilterState = {
  priceRangeLabel: null,
  minDiscountLabel: 'Any',
};

export { PRICE_RANGES, MIN_DISCOUNT_OPTIONS };

export function applyCategoryFilters(items: ProductItem[], filters: CategoryFilterState): ProductItem[] {
  const minDiscount = filters.minDiscountLabel === 'Any' ? 0 : parseInt(filters.minDiscountLabel, 10);
  const priceRange = PRICE_RANGES.find((range) => range.label === filters.priceRangeLabel);
  return items.filter((item) => {
    if (priceRange && (item.price < priceRange.min || item.price > priceRange.max)) return false;
    if (item.discountPercent < minDiscount) return false;
    return true;
  });
}

export function sortCategoryProducts(items: ProductItem[], sortBy: SortOption): ProductItem[] {
  const sorted = [...items];
  switch (sortBy) {
    case 'priceLowHigh':
      return sorted.sort((a, b) => a.price - b.price);
    case 'priceHighLow':
      return sorted.sort((a, b) => b.price - a.price);
    case 'discount':
      return sorted.sort((a, b) => b.discountPercent - a.discountPercent);
    case 'popularity':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    default:
      return sorted;
  }
}
