import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon } from '../assets/icons/order';
import { FilterIcon, SortArrowsIcon } from '../assets/icons/searchscreen';
import { BottomNavBar, type NavTab } from '../components/home/BottomNavBar';
import { ProductCard } from '../components/home/ProductCard';
import { CategoryFilterSheet } from '../components/category/CategoryFilterSheet';
import { SortSheet } from '../components/search/SortSheet';
import { useCart } from '../context/CartContext';
import {
  DEFAULT_CATEGORY_FILTERS,
  applyCategoryFilters,
  sortCategoryProducts,
  type CategoryFilterState,
} from '../data/categories';
import { SORT_OPTIONS, type SortOption } from '../data/search';
import type { AuthStackParamList } from '../navigation/types';
import type { ProductItem } from '../data/home';
import { api } from '../services/api';
import { resolveProductImage } from '../utils/productImage';
import { resolveCategoryCoverIcon } from '../utils/categoryIcon';
import { colors, radius, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'CategoryDetail'>;

interface RawSubcategory {
  id: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
}

interface RawCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  showOnHome: boolean;
  subcategories: RawSubcategory[];
}

interface RawVariant {
  id: string;
  label: string;
  mrp: number;
  price: number;
  stock: number;
}

interface RawProduct {
  id: string;
  name: string;
  unit?: string;
  images: string[];
  variants: RawVariant[];
}

function toProductItem(product: RawProduct): ProductItem {
  const variant = product.variants[0];
  const discountPercent =
    variant && variant.mrp > 0 ? Math.round(((variant.mrp - variant.price) / variant.mrp) * 100) : 0;
  return {
    id: product.id,
    image: resolveProductImage(product.images[0]),
    title: product.name,
    weight: product.unit ?? variant?.label ?? '',
    price: variant?.price ?? 0,
    originalPrice: variant?.mrp ?? 0,
    discountPercent,
  };
}

const FALLBACK_CATEGORY: RawCategory = {
  id: '',
  name: '',
  slug: '',
  sortOrder: 0,
  isActive: true,
  showOnHome: true,
  subcategories: [],
};

export function CategoryDetailScreen({ navigation, route }: Props) {
  const { categoryId, subcategoryId } = route.params;
  const { addItem } = useCart();

  const [categories, setCategories] = useState<RawCategory[]>([]);
  const [rawProducts, setRawProducts] = useState<RawProduct[]>([]);

  // Callers pass either a real category id (tapping a tile in CategoryScreen's grid,
  // which already has the fetched category objects) or a stable slug (HomeScreen's
  // featuredPicks/essentialTiles/category-tab links, defined statically in data/home.ts
  // before any category id is known) — match against both.
  const category =
    categories.find((c) => c.id === categoryId || c.slug === categoryId) ?? categories[0] ?? FALLBACK_CATEGORY;
  const otherCategories = categories.filter((c) => c.id !== category.id);

  const [activeTab, setActiveTab] = useState<NavTab>('categories');
  const [activeSubcategory, setActiveSubcategory] = useState<string>(subcategoryId ?? 'all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<CategoryFilterState>(DEFAULT_CATEGORY_FILTERS);
  const [sortSheetVisible, setSortSheetVisible] = useState(false);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  useEffect(() => {
    api
      .get<RawCategory[]>('/customer/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Wait for `category` to resolve to a real fetched category (with a real id) before
    // querying products — querying with a not-yet-resolved id would either 404 or,
    // worse, silently return an unrelated category's products.
    if (!category.id) return;
    api
      .get<{ items: RawProduct[] }>('/customer/products', {
        params: {
          categoryId: category.id,
          subcategoryId: activeSubcategory !== 'all' ? activeSubcategory : undefined,
          limit: 50,
        },
      })
      .then(({ data }) => setRawProducts(data.items))
      .catch(() => setRawProducts([]));
  }, [category.id, activeSubcategory]);

  const baseProducts = useMemo(() => rawProducts.map(toProductItem), [rawProducts]);
  const filteredProducts = useMemo(() => applyCategoryFilters(baseProducts, filters), [baseProducts, filters]);
  const sortedProducts = useMemo(() => sortCategoryProducts(filteredProducts, sortBy), [filteredProducts, sortBy]);

  const hasProducts = sortedProducts.length > 0;
  const activeSortLabel = SORT_OPTIONS.find((option) => option.id === sortBy)?.title ?? 'Relevance';

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') navigation.navigate('Home');
    else if (tab === 'search') navigation.navigate('Search');
    else if (tab === 'orders') navigation.navigate('OrderHistory');
    else if (tab === 'profile') navigation.navigate('Profile');
  };

  const handleSelectSubcategory = (id: string) => {
    setActiveSubcategory(id);
    setFilters(DEFAULT_CATEGORY_FILTERS);
  };

  const handleAddToCart = (item: ProductItem) => {
    const variantId = rawProducts.find((p) => p.id === item.id)?.variants[0]?.id;
    if (variantId) addItem(item.id, variantId);
  };

  const openProduct = (item: ProductItem) => navigation.navigate('ProductDetail', { productId: item.id });

  const openOtherCategory = (id: string) => navigation.replace('CategoryDetail', { categoryId: id });

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.screen} />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {category.name}
          </Text>
        </View>

        <FlatList
          horizontal
          data={[{ id: 'all', name: 'All' }, ...category.subcategories]}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subcategoryRow}
          renderItem={({ item }) => {
            const active = item.id === activeSubcategory;
            return (
              <Pressable
                style={[styles.subcategoryChip, active && styles.subcategoryChipActive]}
                onPress={() => handleSelectSubcategory(item.id)}
              >
                <Text style={[styles.subcategoryChipText, active && styles.subcategoryChipTextActive]} numberOfLines={1}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />

        {hasProducts ? (
          <View style={styles.filterSortRow}>
            <Pressable style={styles.filterSortChip} onPress={() => setFilterSheetVisible(true)}>
              <FilterIcon width={14} height={14} />
              <Text style={styles.filterSortChipText}>Filter</Text>
            </Pressable>
            <Pressable style={styles.filterSortChip} onPress={() => setSortSheetVisible(true)}>
              <SortArrowsIcon width={14} height={14} />
              <Text style={styles.filterSortChipText} numberOfLines={1}>
                {activeSortLabel}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </SafeAreaView>

      {hasProducts ? (
        <FlatList
          key={activeSubcategory}
          data={sortedProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridColumnWrapper}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <View style={styles.gridCell}>
              <ProductCard item={item} onPress={() => openProduct(item)} onAdd={() => handleAddToCart(item)} />
            </View>
          )}
          ListFooterComponent={
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Showing all {sortedProducts.length} results</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No products here yet</Text>
          <Text style={styles.emptySubtitle}>
            {baseProducts.length === 0
              ? `${category.name} is coming soon to your area.`
              : 'Try a different subcategory or clear your filters.'}
          </Text>
          {baseProducts.length > 0 && filteredProducts.length === 0 ? (
            <Pressable style={styles.clearFiltersButton} onPress={() => setFilters(DEFAULT_CATEGORY_FILTERS)}>
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </Pressable>
          ) : null}

          <Text style={styles.recommendedTitle}>Recommended categories</Text>
          <FlatList
            horizontal
            style={styles.recommendedList}
            data={otherCategories}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedRow}
            renderItem={({ item }) => (
              <Pressable style={styles.recommendedCard} onPress={() => openOtherCategory(item.id)}>
                <View style={[styles.recommendedIconWrap, { backgroundColor: colors.background.surfaceMuted }]}>
                  <Image
                    source={resolveCategoryCoverIcon(item)}
                    style={styles.recommendedIcon}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.recommendedLabel} numberOfLines={2}>
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}

      <BottomNavBar active={activeTab} onChange={handleTabChange} />

      <SortSheet visible={sortSheetVisible} value={sortBy} onSelect={setSortBy} onClose={() => setSortSheetVisible(false)} />
      <CategoryFilterSheet
        visible={filterSheetVisible}
        filters={filters}
        onApply={setFilters}
        onClose={() => setFilterSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background.screen },
  headerSafe: {
    backgroundColor: colors.background.screen,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.background.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 18,
    lineHeight: 27,
    color: colors.text.heading,
    flex: 1,
  },
  subcategoryRow: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  subcategoryChip: {
    backgroundColor: colors.background.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  subcategoryChipActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  subcategoryChipText: {
    ...typography.captionMedium,
    fontSize: 13,
    color: colors.text.buttonNeutral,
  },
  subcategoryChipTextActive: {
    color: colors.text.onBrand,
  },
  filterSortRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  filterSortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.surfaceMuted,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  filterSortChipText: {
    ...typography.buttonMedium,
    fontSize: 13,
    lineHeight: 19.5,
    color: colors.text.buttonNeutral,
  },
  gridColumnWrapper: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  gridContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  gridCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  footerRow: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.subtle,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.xxxl,
    gap: spacing.xs,
  },
  emptyTitle: {
    ...typography.h1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.heading,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.text.subtle,
    textAlign: 'center',
  },
  clearFiltersButton: {
    marginTop: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.brand.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  clearFiltersText: {
    ...typography.buttonMedium,
    fontSize: 13,
    color: colors.brand.primary,
  },
  recommendedTitle: {
    ...typography.buttonMedium,
    fontSize: 15,
    color: colors.text.heading,
    marginTop: spacing.xxl,
    alignSelf: 'flex-start',
  },
  recommendedList: {
    flexGrow: 0,
  },
  recommendedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  recommendedCard: {
    width: 96,
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  recommendedIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  recommendedIcon: {
    width: '100%',
    height: '100%',
  },
  recommendedLabel: {
    ...typography.caption,
    fontSize: 11,
    textAlign: 'center',
    color: colors.text.listItem,
  },
});
