import type { ImageSourcePropType } from 'react-native';
import * as img from '../assets/images/category';
import { hero as placeholderImage } from '../assets/images/product';
import { API_ORIGIN } from '../services/api';

interface CategoryIconFamily {
  /** Substrings checked against the category's slugified name — first match wins, so
   * order families most-specific-first to avoid a generic word stealing a better match. */
  keywords: string[];
  icon: number;
  subcategories: Record<string, number>;
}

/** Matches the taxonomy in `data/categories.ts` — the bundled illustration set Verdant
 * ships with. Backend categories seeded by `scripts/seedCatalog.ts` use these exact
 * slugs/ids and resolve directly; a category the admin typed freely (e.g. "Grocery &
 * Staple", "Beauty & groom") resolves via the keyword scan in `findCategoryFamily`. */
const CATEGORY_FAMILIES: Record<string, CategoryIconFamily> = {
  grocery: {
    keywords: ['grocery', 'staple', 'fruit', 'vegetable', 'dairy'],
    icon: img.groceryFruitsVegetables,
    subcategories: {
      'fruits-vegetables': img.groceryFruitsVegetables,
      'dairy-breakfast': img.groceryDairyBreakfast,
      staples: img.groceryStaples,
      bakery: img.groceryBakery,
      'frozen-foods': img.groceryFrozenFoods,
    },
  },
  snacks: {
    keywords: ['snack', 'beverage', 'drink'],
    icon: img.snacksChipsSnacks,
    subcategories: {
      'chips-snacks': img.snacksChipsSnacks,
      chocolates: img.snacksChocolates,
      'soft-drinks': img.snacksSoftDrinks,
      juices: img.snacksJuices,
      'tea-coffee': img.snacksTeaCoffee,
    },
  },
  'personal-care': {
    keywords: ['personal', 'beauty', 'groom', 'cosmetic'],
    icon: img.personalBathBody,
    subcategories: {
      'bath-body': img.personalBathBody,
      'hair-care': img.personalHairCare,
      'oral-care': img.personalOralCare,
      grooming: img.personalGrooming,
    },
  },
  household: {
    keywords: ['household', 'home', 'clean'],
    icon: img.householdCleaning,
    subcategories: {
      cleaning: img.householdCleaning,
      laundry: img.householdLaundry,
      kitchen: img.householdKitchen,
      'home-essentials': img.householdHomeEssentials,
    },
  },
  'baby-pet': {
    keywords: ['baby', 'pet'],
    icon: img.babypetBabyCare,
    subcategories: {
      'baby-care': img.babypetBabyCare,
      'pet-food': img.babypetPetFood,
      'pet-essentials': img.babypetPetEssentials,
    },
  },
};

function toImageUri(url: string): { uri: string } {
  return { uri: /^https?:\/\//.test(url) ? url : `${API_ORIGIN}${url}` };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function findCategoryEntry(slug?: string, name?: string): CategoryIconFamily | undefined {
  if (slug && CATEGORY_FAMILIES[slug]) return CATEGORY_FAMILIES[slug];

  const bySlugifiedName = slugify(name ?? '');
  if (CATEGORY_FAMILIES[bySlugifiedName]) return CATEGORY_FAMILIES[bySlugifiedName];

  // Free-typed admin category names (e.g. "Grocery & Staple", "Beauty & groom") rarely
  // match a dictionary key exactly — fall back to a keyword scan across both the slug
  // and the display name so the icon family still resolves.
  const haystack = `${slug ?? ''} ${name ?? ''}`.toLowerCase();
  return Object.values(CATEGORY_FAMILIES).find((family) => family.keywords.some((keyword) => haystack.includes(keyword)));
}

/**
 * Resolves the best available icon for a subcategory tile:
 * 1. A real uploaded imageUrl always wins.
 * 2. Otherwise, match the category+subcategory against Verdant's bundled illustration set.
 * 3. Otherwise, a generic placeholder (better than a broken image).
 */
export function resolveCategoryIcon(
  category: { slug?: string; name?: string },
  subcategory?: { id?: string; name?: string; imageUrl?: string | null },
): ImageSourcePropType {
  if (subcategory?.imageUrl) return toImageUri(subcategory.imageUrl);

  const entry = findCategoryEntry(category.slug, category.name);
  if (!entry) return placeholderImage;

  const subKey = subcategory?.id && entry.subcategories[subcategory.id] ? subcategory.id : slugify(subcategory?.name ?? '');
  return entry.subcategories[subKey] ?? entry.icon;
}

/**
 * Resolves a cover icon for a whole category card (e.g. a "recommended categories" row) —
 * prefers a real category-level imageUrl, then a real first-subcategory imageUrl, then the
 * bundled illustration for the category, then the first subcategory's bundled illustration.
 */
export function resolveCategoryCoverIcon(category: {
  slug?: string;
  name?: string;
  imageUrl?: string | null;
  subcategories?: { id?: string; name?: string; imageUrl?: string | null }[];
}): ImageSourcePropType {
  const realUrl = category.imageUrl ?? category.subcategories?.[0]?.imageUrl;
  if (realUrl) return toImageUri(realUrl);

  const entry = findCategoryEntry(category.slug, category.name);
  if (!entry) return placeholderImage;

  const firstSub = category.subcategories?.[0];
  if (firstSub) {
    const subKey = firstSub.id && entry.subcategories[firstSub.id] ? firstSub.id : slugify(firstSub.name ?? '');
    return entry.subcategories[subKey] ?? entry.icon;
  }
  return entry.icon;
}
