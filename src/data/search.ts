import * as cartImg from '../assets/images/cart';
import * as homeImg from '../assets/images/home';
import * as orderImg from '../assets/images/order';
import * as searchImg from '../assets/images/search';

export interface SearchProduct {
  id: string;
  image: number;
  title: string;
  weight: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  deliveryMins: number;
  popularity: number;
  inStock: boolean;
}

export const SEARCH_CATALOG: SearchProduct[] = [
  {
    id: 'amul-gold-milk',
    image: searchImg.amulMilk,
    title: 'Amul Gold Full Cream Milk',
    weight: '500 ml',
    category: 'Dairy',
    brand: 'Amul',
    price: 32,
    originalPrice: 35,
    discountPercent: 9,
    deliveryMins: 9,
    popularity: 95,
    inStock: true,
  },
  {
    id: 'tata-tea-gold',
    image: homeImg.deal8,
    title: 'Tata Tea Gold',
    weight: '500 g',
    category: 'Beverages',
    brand: 'Tata',
    price: 271,
    originalPrice: 330,
    discountPercent: 18,
    deliveryMins: 12,
    popularity: 80,
    inStock: true,
  },
  {
    id: 'fortune-atta',
    image: homeImg.deal3,
    title: 'Fortune Chakki Fresh Atta',
    weight: '10 kg',
    category: 'Grocery',
    brand: 'Fortune',
    price: 476,
    originalPrice: 485,
    discountPercent: 2,
    deliveryMins: 15,
    popularity: 70,
    inStock: true,
  },
  {
    id: 'baby-spinach',
    image: orderImg.reorderSpinach,
    title: 'Baby Spinach',
    weight: '200 g',
    category: 'Vegetables',
    brand: 'Fresho',
    price: 28,
    originalPrice: 35,
    discountPercent: 20,
    deliveryMins: 9,
    popularity: 60,
    inStock: true,
  },
  {
    id: 'whole-wheat-bread',
    image: cartImg.recBread,
    title: 'Whole Wheat Bread',
    weight: '400 g',
    category: 'Bakery',
    brand: 'Britannia',
    price: 45,
    originalPrice: 50,
    discountPercent: 10,
    deliveryMins: 10,
    popularity: 65,
    inStock: true,
  },
  {
    id: 'greek-yogurt',
    image: cartImg.recYogurt,
    title: 'Greek Yogurt',
    weight: '400 g',
    category: 'Dairy',
    brand: 'Epigamia',
    price: 99,
    originalPrice: 120,
    discountPercent: 18,
    deliveryMins: 9,
    popularity: 55,
    inStock: true,
  },
  {
    id: 'sunflower-oil',
    image: cartImg.recOil,
    title: 'Sunflower Oil',
    weight: '1 L',
    category: 'Grocery',
    brand: 'Fortune',
    price: 145,
    originalPrice: 165,
    discountPercent: 12,
    deliveryMins: 11,
    popularity: 50,
    inStock: true,
  },
];

export const INITIAL_RECENT_SEARCHES = [
  'amul butter',
  'tata tea premium',
  'atta 10kg',
  'baby spinach',
  'tropicana orange',
];

export interface PopularSearchTerm {
  term: string;
  highlighted: boolean;
}

export const POPULAR_SEARCHES: PopularSearchTerm[] = [
  { term: 'fresh tomatoes', highlighted: true },
  { term: 'sunflower oil', highlighted: false },
  { term: 'whole wheat bread', highlighted: true },
  { term: 'greek yogurt', highlighted: false },
  { term: 'basmati rice 5kg', highlighted: false },
  { term: 'alphonso mango', highlighted: true },
  { term: 'dettol handwash', highlighted: false },
  { term: 'cold coffee', highlighted: true },
];

export const RESULT_CATEGORY_CHIPS = ['All', 'Dairy', 'Grocery', 'Snacks', 'Beverages', 'Fruits', 'Vegetables', 'Personal Care', 'Household'];

export const FILTER_BRANDS = ['Amul', 'Tata', 'Aashirvaad', 'Fortune', "Haldiram's", "Lay's", 'Dettol', 'Colgate', 'Tropicana', 'Epigamia'];

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

export type SortOption = 'relevance' | 'priceLowHigh' | 'priceHighLow' | 'discount' | 'popularity';

export const SORT_OPTIONS: { id: SortOption; title: string; subtitle: string }[] = [
  { id: 'relevance', title: 'Relevance', subtitle: 'Best match for your search' },
  { id: 'priceLowHigh', title: 'Price: Low to High', subtitle: 'Cheapest products first' },
  { id: 'priceHighLow', title: 'Price: High to Low', subtitle: 'Most expensive first' },
  { id: 'discount', title: 'Highest Discount', subtitle: 'Best savings first' },
  { id: 'popularity', title: 'Popularity', subtitle: 'Most reviewed & rated' },
];

export interface FilterState {
  category: string;
  priceRangeLabel: string | null;
  brands: string[];
  minDiscountLabel: string;
  inStockOnly: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  category: 'All',
  priceRangeLabel: null,
  brands: [],
  minDiscountLabel: 'Any',
  inStockOnly: false,
};

const parseMinDiscount = (label: string) => (label === 'Any' ? 0 : parseInt(label, 10));

export function searchCatalog(query: string): SearchProduct[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return SEARCH_CATALOG.filter(
    (item) => item.title.toLowerCase().includes(term) || item.category.toLowerCase().includes(term),
  );
}

export function applyResultFilters(items: SearchProduct[], filters: FilterState): SearchProduct[] {
  const minDiscount = parseMinDiscount(filters.minDiscountLabel);
  const priceRange = PRICE_RANGES.find((range) => range.label === filters.priceRangeLabel);
  return items.filter((item) => {
    if (filters.category !== 'All' && item.category !== filters.category) return false;
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
    case 'popularity':
      return sorted.sort((a, b) => b.popularity - a.popularity);
    default:
      return sorted;
  }
}

const SUGGESTION_POOL = Array.from(
  new Set([...INITIAL_RECENT_SEARCHES, ...POPULAR_SEARCHES.map((p) => p.term), ...SEARCH_CATALOG.map((p) => p.title)]),
);

export function getAutocompleteSuggestions(query: string): string[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return SUGGESTION_POOL.filter((suggestion) => suggestion.toLowerCase().includes(term)).slice(0, 5);
}
