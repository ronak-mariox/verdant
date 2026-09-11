import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRightSmall, ClockIcon } from '../assets/icons';
import { MicIcon, SearchIconHome } from '../assets/icons/homescreen';
import { BackWhiteIcon } from '../assets/icons/store';
import { CloseXIcon, FilterIcon, GridViewIcon, ListViewIcon, SortArrowsIcon } from '../assets/icons/searchscreen';
import { BottomNavBar, type NavTab } from '../components/home/BottomNavBar';
import { FilterSheet } from '../components/search/FilterSheet';
import { SearchProductCard } from '../components/search/SearchProductCard';
import { SortSheet } from '../components/search/SortSheet';
import { useCart } from '../context/CartContext';
import {
  DEFAULT_FILTERS,
  INITIAL_RECENT_SEARCHES,
  POPULAR_SEARCHES,
  SORT_OPTIONS,
  applyResultFilters,
  getAutocompleteSuggestions,
  searchCatalog,
  sortResults,
  type FilterState,
  type SearchProduct,
  type SortOption,
} from '../data/search';
import type { AuthStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Search'>;

function highlightMatch(text: string, query: string) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1 || !query) {
    return <Text style={styles.suggestionMuted}>{text}</Text>;
  }
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  return (
    <Text numberOfLines={1}>
      {before ? <Text style={styles.suggestionMuted}>{before}</Text> : null}
      <Text style={styles.suggestionBold}>{match}</Text>
      <Text style={styles.suggestionMuted}>{after}</Text>
    </Text>
  );
}

function GridProductCard({ product, onAddPress }: { product: SearchProduct; onAddPress: () => void }) {
  return (
    <View style={styles.gridCard}>
      <Image source={product.image} style={styles.gridImage} resizeMode="cover" />
      <Text style={styles.gridTitle} numberOfLines={2}>
        {product.title}
      </Text>
      <Text style={styles.gridWeight}>{product.weight}</Text>
      <View style={styles.gridBottomRow}>
        <Text style={styles.gridPrice}>₹{product.price}</Text>
        <Pressable style={styles.gridAddButton} onPress={onAddPress} hitSlop={8}>
          <Text style={styles.gridAddText}>ADD</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function SearchScreen({ navigation }: Props) {
  const { addItem } = useCart();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(INITIAL_RECENT_SEARCHES);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortSheetVisible, setSortSheetVisible] = useState(false);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  const showResults = submittedQuery !== null && query === submittedQuery;
  const showSuggestions = query.length > 0 && !showResults;
  const showIdle = query.length === 0;

  const baseResults = useMemo(() => searchCatalog(submittedQuery ?? ''), [submittedQuery]);

  const categoryChips = useMemo(() => {
    const categories = Array.from(new Set(baseResults.map((item) => item.category)));
    return ['All', ...categories];
  }, [baseResults]);

  const filteredResults = useMemo(() => applyResultFilters(baseResults, filters), [baseResults, filters]);

  const sortedResults = useMemo(() => sortResults(filteredResults, sortBy), [filteredResults, sortBy]);

  const suggestions = useMemo(() => getAutocompleteSuggestions(query), [query]);

  const handleSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setSubmittedQuery(trimmed);
    setFilters(DEFAULT_FILTERS);
    setRecentSearches((prev) => [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8));
    Keyboard.dismiss();
  };

  const handleClearInput = () => {
    setQuery('');
    setSubmittedQuery(null);
    inputRef.current?.focus();
  };

  const handleRemoveRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((t) => t !== term));
  };

  const handleAddToCart = (product: SearchProduct) => {
    addItem({ id: product.id, title: product.title, subtitle: product.weight, price: product.price, mrp: product.originalPrice, image: product.image });
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'home') navigation.navigate('Home');
    else if (tab === 'orders') navigation.navigate('OrderHistory');
    else if (tab === 'profile') navigation.navigate('Profile');
  };

  const activeSortLabel = SORT_OPTIONS.find((option) => option.id === sortBy)?.title ?? 'Relevance';

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brand.primary} />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.searchBarRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackWhiteIcon width={20} height={20} />
          </Pressable>
          <View style={styles.searchInputWrap}>
            <SearchIconHome width={18} height={18} />
            <TextInput
              ref={inputRef}
              autoFocus
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => handleSearch(query)}
              placeholder='Search "tomatoes, milk, chips…"'
              placeholderTextColor={colors.text.subtle}
              returnKeyType="search"
            />
            {query.length > 0 ? (
              <Pressable style={styles.clearButton} onPress={handleClearInput} hitSlop={8}>
                <CloseXIcon width={10} height={10} />
              </Pressable>
            ) : (
              <Pressable hitSlop={8}>
                <MicIcon width={18} height={18} />
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.flex}>
        {showIdle ? (
          <ScrollView contentContainerStyle={styles.idleContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {recentSearches.length > 0 ? (
              <View>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Recent searches</Text>
                  <Pressable onPress={() => setRecentSearches([])} hitSlop={8}>
                    <Text style={styles.clearAllText}>Clear all</Text>
                  </Pressable>
                </View>
                <View>
                  {recentSearches.map((term) => (
                    <Pressable key={term} style={styles.recentRow} onPress={() => handleSearch(term)}>
                      <View style={styles.recentIconWrap}>
                        <ClockIcon width={16} height={16} />
                      </View>
                      <Text style={styles.recentText} numberOfLines={1}>
                        {term}
                      </Text>
                      <Pressable style={styles.recentRemove} onPress={() => handleRemoveRecent(term)} hitSlop={8}>
                        <CloseXIcon width={14} height={14} />
                      </Pressable>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.popularSection}>
              <Text style={styles.sectionTitle}>Popular right now</Text>
              <View style={styles.popularChipWrap}>
                {POPULAR_SEARCHES.map(({ term, highlighted }) => (
                  <Pressable
                    key={term}
                    style={[styles.popularChip, highlighted && styles.popularChipHighlighted]}
                    onPress={() => handleSearch(term)}
                  >
                    <Text style={styles.popularChipText}>{term}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        ) : null}

        {showSuggestions ? (
          <ScrollView contentContainerStyle={styles.suggestionsContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {suggestions.length > 0 ? (
              <View style={styles.suggestionCard}>
                {suggestions.map((suggestion, index) => (
                  <Pressable
                    key={suggestion}
                    style={[styles.suggestionRow, index === suggestions.length - 1 && styles.suggestionRowLast]}
                    onPress={() => handleSearch(suggestion)}
                  >
                    <SearchIconHome width={16} height={16} />
                    <View style={styles.suggestionTextWrap}>{highlightMatch(suggestion, query)}</View>
                    <ChevronRightSmall width={14} height={14} />
                  </Pressable>
                ))}
              </View>
            ) : null}

            {recentSearches.length > 0 ? (
              <View style={styles.recentChipsSection}>
                <Text style={styles.recentChipsLabel}>RECENT</Text>
                <View style={styles.recentChipsWrap}>
                  {recentSearches.map((term) => (
                    <Pressable key={term} style={styles.recentChip} onPress={() => handleSearch(term)}>
                      <ClockIcon width={12} height={12} />
                      <Text style={styles.recentChipText}>{term}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
          </ScrollView>
        ) : null}

        {showResults ? (
          <View style={styles.flex}>
            <View style={styles.resultsHeader}>
              <View style={styles.resultsHeaderTop}>
                <Text style={styles.resultsCountText} numberOfLines={1}>
                  {sortedResults.length} results for <Text style={styles.resultsQueryText}>“{submittedQuery}”</Text>
                </Text>
                <View style={styles.viewToggleRow}>
                  <Pressable
                    style={[styles.viewToggleButton, viewMode === 'list' && styles.viewToggleButtonActive]}
                    onPress={() => setViewMode('list')}
                  >
                    <ListViewIcon width={16} height={16} />
                  </Pressable>
                  <Pressable
                    style={[styles.viewToggleButton, viewMode === 'grid' && styles.viewToggleButtonActive]}
                    onPress={() => setViewMode('grid')}
                  >
                    <GridViewIcon width={16} height={16} />
                  </Pressable>
                </View>
              </View>

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
                {categoryChips.length > 1 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.categoryChipsRow}>
                      {categoryChips.map((category) => (
                        <Pressable
                          key={category}
                          style={[styles.categoryChip, filters.category === category && styles.categoryChipActive]}
                          onPress={() => setFilters((prev) => ({ ...prev, category }))}
                        >
                          <Text style={[styles.categoryChipText, filters.category === category && styles.categoryChipTextActive]}>
                            {category}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                ) : null}
              </View>
            </View>

            {sortedResults.length > 0 ? (
              <FlatList
                key={viewMode}
                data={sortedResults}
                keyExtractor={(item) => item.id}
                numColumns={viewMode === 'grid' ? 2 : 1}
                columnWrapperStyle={viewMode === 'grid' ? styles.gridColumnWrapper : undefined}
                contentContainerStyle={viewMode === 'grid' ? styles.gridContent : undefined}
                renderItem={({ item }) =>
                  viewMode === 'list' ? (
                    <SearchProductCard product={item} onAddPress={() => handleAddToCart(item)} />
                  ) : (
                    <GridProductCard product={item} onAddPress={() => handleAddToCart(item)} />
                  )
                }
                ListFooterComponent={
                  <View style={styles.footerRow}>
                    <View style={styles.footerDivider} />
                    <Text style={styles.footerText}>Showing all {sortedResults.length} results</Text>
                  </View>
                }
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtitle}>Try a different search term or adjust your filters.</Text>
              </View>
            )}
          </View>
        ) : null}
      </View>

      <BottomNavBar active="search" onChange={handleTabChange} />

      <SortSheet visible={sortSheetVisible} value={sortBy} onSelect={setSortBy} onClose={() => setSortSheetVisible(false)} />
      <FilterSheet
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
    backgroundColor: colors.brand.primary,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.overlay.whiteFainter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 50,
    backgroundColor: colors.background.screen,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    flex: 1,
    ...typography.body,
    fontSize: 15,
    color: colors.text.heading,
    padding: 0,
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.h1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.heading,
  },
  clearAllText: {
    ...typography.buttonMedium,
    fontSize: 13,
    lineHeight: 19.5,
    color: colors.brand.primary,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.surfaceAlt,
  },
  recentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.background.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentText: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.text.listItem,
  },
  recentRemove: {
    padding: spacing.xxs,
  },
  popularSection: {
    marginTop: spacing.xl,
  },
  popularChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  popularChip: {
    backgroundColor: colors.background.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: spacing.xs,
  },
  popularChipHighlighted: {
    backgroundColor: colors.background.greenTint,
    borderColor: colors.border.green,
  },
  popularChipText: {
    ...typography.captionMedium,
    fontSize: 13,
    color: colors.text.listItem,
  },
  suggestionsContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  suggestionCard: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.surfaceAlt,
  },
  suggestionRowLast: {
    borderBottomWidth: 0,
  },
  suggestionTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  suggestionBold: {
    ...typography.bodySmallBold,
    fontFamily: typography.buttonMedium.fontFamily,
    color: colors.text.heading,
  },
  suggestionMuted: {
    ...typography.bodySmall,
    color: colors.text.subtle,
  },
  recentChipsSection: {
    marginTop: spacing.xl,
  },
  recentChipsLabel: {
    ...typography.sectionLabel,
    color: colors.text.subtle,
  },
  recentChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  recentChipText: {
    ...typography.caption,
    color: colors.text.buttonNeutral,
  },
  resultsHeader: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  resultsHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsCountText: {
    flex: 1,
    ...typography.bodySmall,
    fontFamily: typography.h1.fontFamily,
    color: colors.text.heading,
    marginRight: spacing.sm,
  },
  resultsQueryText: {
    fontFamily: typography.buttonMedium.fontFamily,
    color: colors.brand.primary,
  },
  viewToggleRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  viewToggleButton: {
    padding: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.background.surfaceMuted,
  },
  viewToggleButtonActive: {
    backgroundColor: colors.background.greenTint,
  },
  filterSortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  categoryChipsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  categoryChip: {
    backgroundColor: colors.background.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: colors.brand.primary,
  },
  categoryChipText: {
    ...typography.captionMedium,
    color: colors.text.buttonNeutral,
  },
  categoryChipTextActive: {
    color: colors.text.onBrand,
  },
  footerRow: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
  footerDivider: {
    width: 32,
    height: 2,
    borderRadius: radius.full,
    backgroundColor: colors.border.default,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.subtle,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  gridColumnWrapper: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  gridContent: {
    paddingTop: spacing.md,
  },
  gridCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  gridImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.background.surfaceMuted,
  },
  gridTitle: {
    ...typography.bodySmallBold,
    fontFamily: typography.buttonMedium.fontFamily,
    fontSize: 13,
    color: colors.text.heading,
    marginTop: spacing.xs,
  },
  gridWeight: {
    ...typography.caption,
    color: colors.text.subtle,
    marginTop: 2,
  },
  gridBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  gridPrice: {
    ...typography.h1,
    fontSize: 15,
    lineHeight: 22.5,
    color: colors.text.heading,
  },
  gridAddButton: {
    borderWidth: 1.5,
    borderColor: colors.brand.primary,
    borderRadius: radius.sm - 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  gridAddText: {
    ...typography.h1,
    fontSize: 11,
    lineHeight: 16.5,
    color: colors.brand.primary,
  },
});
