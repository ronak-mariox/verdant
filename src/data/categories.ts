import type { ProductItem } from './home';
import { PRICE_RANGES, MIN_DISCOUNT_OPTIONS, type SortOption } from './search';

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
    default:
      return sorted;
  }
}
