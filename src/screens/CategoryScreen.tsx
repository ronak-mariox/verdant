import React, { useEffect, useState } from 'react';
import {
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
import { SearchIconHome } from '../assets/icons/homescreen';
import { BottomNavBar } from '../components/home/BottomNavBar';
import type { AuthStackParamList } from '../navigation/types';
import { api } from '../services/api';
import type { RawCategory } from '../types/api';
import { resolveCategoryIcon } from '../utils/categoryIcon';
import { colors, fontFamily, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Category'>;

const TILE_BACKGROUNDS = ['#F0FDF4', '#FFFBEB', '#FDF2F8', '#F0F9FF', '#F5F3FF'];

const GRID_GAP = 12;
const GRID_COLUMNS = 4;
const HORIZONTAL_PADDING = 16;

export function CategoryScreen({ navigation }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mainCategories, setMainCategories] = useState<RawCategory[]>([]);

  useEffect(() => {
    api
      .get<RawCategory[]>('/customer/categories')
      .then(({ data }) => setMainCategories(data))
      .catch(() => {});
  }, []);

  const tileSize = (screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;


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

        <View style={styles.scrollBottomSpace} />
      </ScrollView>

      <BottomNavBar active="categories" />
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
  scrollBottomSpace: {
    height: spacing.md,
  },
});
