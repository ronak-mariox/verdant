import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRightSmall } from '../assets/icons';
import { MicIcon, SearchIconHome } from '../assets/icons/homescreen';
import { BottomNavBar, type NavTab } from '../components/home/BottomNavBar';
import { categoryPromoCards, recentlyViewed } from '../data/categories';
import type { AuthStackParamList } from '../navigation/types';
import { api } from '../services/api';
import { resolveCategoryIcon } from '../utils/categoryIcon';
import { colors, fontFamily, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Category'>;

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

const TILE_BACKGROUNDS = ['#F0FDF4', '#FFFBEB', '#FDF2F8', '#F0F9FF', '#F5F3FF'];

const GRID_GAP = 12;
const GRID_COLUMNS = 4;
const HORIZONTAL_PADDING = 16;

export function CategoryScreen({ navigation }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<NavTab>('categories');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mainCategories, setMainCategories] = useState<RawCategory[]>([]);

  useEffect(() => {
    api
      .get<RawCategory[]>('/customer/categories')
      .then(({ data }) => setMainCategories(data))
      .catch(() => {});
  }, []);

  const tileSize = (screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') navigation.navigate('Home');
    else if (tab === 'search') navigation.navigate('Search');
    else if (tab === 'orders') navigation.navigate('OrderHistory');
    else if (tab === 'profile') navigation.navigate('Profile');
  };

  const openSubcategory = (categoryId: string, subcategoryId: string) =>
    navigation.navigate('CategoryDetail', { categoryId, subcategoryId });

  const openCategory = (categoryId: string) => navigation.navigate('CategoryDetail', { categoryId });

  const visibleCategories =
    activeCategory === 'all' ? mainCategories : mainCategories.filter((c) => c.id === activeCategory);

  const renderCategorySection = (category: RawCategory, index: number) => (
    <View key={category.id} style={[styles.sectionWrap, index === 0 && styles.sectionWrapFirst]}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{category.name}</Text>
        <Pressable onPress={() => openCategory(category.id)} hitSlop={8}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>
      <View style={styles.grid}>
        {category.subcategories.map((sub) => (
          <Pressable
            key={sub.id}
            style={[styles.gridTile, { width: tileSize }]}
            onPress={() => openSubcategory(category.id, sub.id)}
          >
            <View
              style={[
                styles.gridIconWrap,
                { width: tileSize, height: tileSize, backgroundColor: TILE_BACKGROUNDS[index % TILE_BACKGROUNDS.length] },
              ]}
            >
              <Image source={resolveCategoryIcon(category, sub)} style={styles.gridIcon} resizeMode="cover" />
            </View>
            <Text style={styles.gridLabel} numberOfLines={2}>
              {sub.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.searchRow}>
          <Pressable style={styles.searchBox} onPress={() => navigation.navigate('Search')}>
            <SearchIconHome width={17} height={17} />
            <Text style={styles.searchPlaceholder} numberOfLines={1}>
              Search atta, dal & more
            </Text>
            <MicIcon width={18} height={18} />
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={[{ id: 'all', pillLabel: 'All' }, ...mainCategories.map((c) => ({ id: c.id, pillLabel: c.name }))]}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
          renderItem={({ item }) => {
            const active = item.id === activeCategory;
            return (
              <Pressable
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setActiveCategory(item.id)}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]} numberOfLines={1}>
                  {item.pillLabel}
                </Text>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        {activeCategory === 'all' ? (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.recentTitle}>Recently Viewed</Text>
              <Pressable hitSlop={8}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>
            <FlatList
              horizontal
              data={recentlyViewed}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentRow}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.recentItem}
                  onPress={() => openSubcategory(item.categoryId, item.subcategoryId)}
                >
                  <View style={styles.recentIconWrap}>
                    <Image source={item.icon} style={styles.recentIcon} resizeMode="cover" />
                  </View>
                  <Text style={styles.recentLabel} numberOfLines={1}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        ) : null}

        {activeCategory === 'all' ? (
          <View style={styles.bannerSection}>
            <Pressable onPress={() => navigation.navigate('Search')}>
              <LinearGradient
                colors={[...colors.gradients.categoryBanner]}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.85, y: 1 }}
                style={styles.banner}
              >
                <View style={styles.bannerDecor} />
                <View style={styles.bannerTextWrap}>
                  <Text style={styles.bannerTitle}>Fresh picks for you</Text>
                  <Text style={styles.bannerSubtitle}>Based on your recent orders</Text>
                </View>
                <View style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>Explore →</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        ) : null}

        {visibleCategories.map((category, index) => renderCategorySection(category, index))}

        {activeCategory === 'all' ? (
          <View style={styles.likeSection}>
            <Text style={styles.recentTitle}>You might like</Text>
            <View style={styles.likeCards}>
              {categoryPromoCards.map((card) => (
                <View key={card.id} style={styles.likeCard}>
                  <Image source={card.icon} style={styles.likeCardImage} resizeMode="cover" />
                  <View style={styles.likeCardBody}>
                    <View style={styles.likeCardTitleRow}>
                      <Text style={styles.likeCardTitle}>{card.title}</Text>
                      <View style={styles.likeCardBadge}>
                        <Text style={styles.likeCardBadgeText}>{card.badge}</Text>
                      </View>
                    </View>
                    <Text style={styles.likeCardSubtitle}>{card.subtitle}</Text>
                  </View>
                  <View style={styles.likeCardChevron}>
                    <ChevronRightSmall width={16} height={16} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.scrollBottomSpace} />
      </ScrollView>

      <BottomNavBar active={activeTab} onChange={handleTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FAF8F5' },
  headerSafe: {
    backgroundColor: '#FAF8F5',
  },
  searchRow: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 46,
    backgroundColor: colors.background.screen,
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: fontFamily.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: '#B5B5B5',
  },
  pillsRow: {
    gap: spacing.xs,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: spacing.sm,
  },
  pill: {
    height: 33,
    justifyContent: 'center',
    backgroundColor: colors.background.screen,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  pillActive: {
    backgroundColor: colors.brand.primaryDark,
    borderColor: colors.brand.primaryDark,
  },
  pillText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.buttonNeutral,
  },
  pillTextActive: {
    color: colors.text.onBrand,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAll: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 18,
    color: colors.brand.primaryDark,
  },
  recentSection: {
    paddingTop: spacing.lg,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  recentTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 15,
    lineHeight: 22.5,
    color: colors.text.heading,
  },
  recentRow: {
    gap: spacing.sm,
    paddingTop: 10,
    paddingBottom: spacing.xxs,
  },
  recentItem: {
    alignItems: 'center',
    gap: 6,
  },
  recentIconWrap: {
    width: 62,
    height: 62,
    borderRadius: radius.md,
    backgroundColor: colors.background.surfaceMuted,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  recentIcon: {
    width: '100%',
    height: '100%',
  },
  recentLabel: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 13,
    color: colors.text.buttonNeutral,
    textAlign: 'center',
  },
  bannerSection: {
    paddingTop: spacing.lg,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 76,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    overflow: 'hidden',
    shadowColor: colors.brand.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 6,
  },
  bannerDecor: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bannerTextWrap: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  bannerTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 15,
    lineHeight: 22.5,
    color: colors.text.onBrand,
  },
  bannerSubtitle: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: 11,
    lineHeight: 16.5,
    color: 'rgba(255,255,255,0.82)',
    paddingTop: 2,
  },
  bannerButton: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  bannerButtonText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 16.5,
    color: colors.text.onBrand,
  },
  sectionWrap: {
    paddingTop: spacing.xl,
  },
  sectionWrapFirst: {
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 18,
    lineHeight: 27,
    color: colors.text.heading,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: spacing.sm,
  },
  gridTile: {
    alignItems: 'center',
    gap: 6,
  },
  gridIconWrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  gridIcon: {
    width: '100%',
    height: '100%',
  },
  gridLabel: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 10.5,
    lineHeight: 13.65,
    color: colors.text.buttonNeutral,
    textAlign: 'center',
  },
  likeSection: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xs,
  },
  likeCards: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  likeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 80,
    backgroundColor: colors.background.screen,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  likeCardImage: {
    width: 80,
    height: 80,
  },
  likeCardBody: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.md,
  },
  likeCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  likeCardTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 14,
    lineHeight: 21,
    color: colors.text.heading,
  },
  likeCardBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  likeCardBadgeText: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 0.5,
    color: colors.brand.primaryDark,
  },
  likeCardSubtitle: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: 11,
    lineHeight: 16.5,
    color: colors.text.body,
    paddingTop: 4,
  },
  likeCardChevron: {
    paddingRight: spacing.sm,
  },
  scrollBottomSpace: {
    height: spacing.md,
  },
});
