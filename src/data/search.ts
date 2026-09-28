import type { ImageSourcePropType } from 'react-native';

export interface SearchProduct {
  id: string;
  variantId?: string;
  image: ImageSourcePropType;
  title: string;
  weight: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  inStock: boolean;
  offerLabel?: string;
}

export interface PriceRangeOption {
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGES: PriceRangeOption[] = [
  { label: '₹0–₹100', min: 0, max: 100 },
  { label: '₹0–₹200', min: 0, max: 200 },
  { label: '₹0–₹300', min: 0, max: 300 },
  { label: '₹100–₹300', min: 100, max: 300 },
  { label: '₹200–500+', min: 200, max: Infinity },
];

export const MIN_DISCOUNT_OPTIONS = ['Any', '10%+', '15%+', '20%+', '30%+'];

export type SortOption = 'relevance' | 'priceLowHigh' | 'priceHighLow' | 'discount';

export const SORT_OPTIONS: { id: SortOption; title: string; subtitle: string }[] = [
  { id: 'relevance', title: 'Relevance', subtitle: 'Best match for your search' },
  { id: 'priceLowHigh', title: 'Price: Low to High', subtitle: 'Cheapest products first' },
  { id: 'priceHighLow', title: 'Price: High to Low', subtitle: 'Most expensive first' },
  { id: 'discount', title: 'Highest Discount', subtitle: 'Best savings first' },
];

export interface FilterState {
  priceRangeLabel: string | null;
  brands: string[];
  minDiscountLabel: string;
  inStockOnly: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  priceRangeLabel: null,
  brands: [],
  minDiscountLabel: 'Any',
  inStockOnly: false,
};

export const RECENT_SEARCHES_STORAGE_KEY = 'verdant_recent_searches';
export const MAX_RECENT_SEARCHES = 8;

const parseMinDiscount = (label: string) => (label === 'Any' ? 0 : parseInt(label, 10));

export function applyResultFilters(items: SearchProduct[], filters: FilterState): SearchProduct[] {
  const minDiscount = parseMinDiscount(filters.minDiscountLabel);
  const priceRange = PRICE_RANGES.find((range) => range.label === filters.priceRangeLabel);
  return items.filter((item) => {
    if (filters.brands.length > 0 && !filters.brands.includes(item.brand)) return false;
    if (priceRange && (item.price < priceRange.min || item.price > priceRange.max)) return false;
    if (item.discountPercent < minDiscount) return false;
    if (filters.inStockOnly && !item.inStock) return false;
    return true;
  });
}

export function sortResults(items: SearchProduct[], sortBy: SortOption): SearchProduct[] {
  const sorted = [...items];
  switch (sortBy) {
    case 'priceLowHigh':
      return sorted.sort((a, b) => a.price - b.price);
    case 'priceHighLow':
      return sorted.sort((a, b) => b.price - a.price);
    case 'discount':
      return sorted.sort((a, b) => b.discountPercent - a.discountPercent);
    default:
      return sorted;
  }
}
