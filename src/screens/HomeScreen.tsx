import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CartIcon } from '../assets/icons/store';
import { BottomNavBar } from '../components/home/BottomNavBar';
import { CategoryTabs } from '../components/home/CategoryTabs';
import { HomeTopBar } from '../components/home/HomeTopBar';
import { ImageCardRow } from '../components/home/ImageCardRow';
import { ProductRow } from '../components/home/ProductRow';
import { SectionHeader } from '../components/home/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { absoluteUrl } from '../config';
import { api } from '../services/api';
import { alertCartError } from '../utils/cartAlerts';
import { resolveCategoryCoverIcon } from '../utils/categoryIcon';
import { toProductItem } from '../utils/productMappers';
import { avatar as defaultAvatar } from '../assets/images/home';
import {
  banners,
  essentialTileLinks,
  essentialTiles,
  featuredPickLinks,
  featuredPicks,
  promoTiles,
  storeCards,
  type CategoryLink,
  type CategoryTab,
  type ProductItem,
} from '../data/home';
import type { AuthStackParamList } from '../navigation/types';
import type { RawCategory, RawProduct } from '../types/api';

interface RawHomeResponse {
  categories?: RawCategory[];
  topDeals: RawProduct[];
  saverItems: RawProduct[];
  essentialItems: RawProduct[];
  snackItems: RawProduct[];
  monsoonItems: RawProduct[];
}

type Props = NativeStackScreenProps<AuthStackParamList, 'Home'>;

const HORIZONTAL_PADDING = 16;

export function HomeScreen({ navigation }: Props) {
  const [activeCategory, setActiveCategory] = useState('');
  const { width: screenWidth } = useWindowDimensions();
  const { itemCount, addItem } = useCart();
  const { user } = useAuth();
  const { addressList } = useCheckout();
  const avatarSource = user?.avatarUrl ? { uri: absoluteUrl(user.avatarUrl) } : defaultAvatar;
  const defaultAddress = addressList.find((a) => a.isDefault) ?? addressList[0];
  const locationLabel = defaultAddress
    ? [defaultAddress.line1, defaultAddress.city].filter(Boolean).join(', ')
    : 'Set location';

  const [homeData, setHomeData] = useState<RawHomeResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useFocusEffect(
    useCallback(() => {
      api
        .get<{ count: number }>('/customer/notifications/unread-count')
        .then(({ data }) => setHasUnreadNotifications(data.count > 0))
        .catch(() => {});
    }, []),
  );

  const loadHome = useCallback(
    () =>
      api
        .get<RawHomeResponse>('/customer/home')
        .then(({ data }) => setHomeData(data))
        .catch(() => {}),
    [],
  );

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadHome().finally(() => setRefreshing(false));
  };

  const categories = useMemo(() => homeData?.categories ?? [], [homeData]);
  const categoryTabs = useMemo<CategoryTab[]>(
    () => categories.map((c) => ({ id: c.id, label: c.name, image: resolveCategoryCoverIcon(c) })),
    [categories],
  );
  const storeTiles = useMemo(
    () => categories.map((c, index) => (c.imageUrl ? { uri: absoluteUrl(c.imageUrl) } : storeCards[index % storeCards.length])),
    [categories],
  );

  const topDealItems = homeData ? homeData.topDeals.map(toProductItem) : [];
  const essentialProductItems = homeData ? homeData.essentialItems.map(toProductItem) : [];
  const saverProductItems = homeData ? homeData.saverItems.map(toProductItem) : [];
  const snackProductItems = homeData ? homeData.snackItems.map(toProductItem) : [];
  const monsoonProductItems = homeData ? homeData.monsoonItems.map(toProductItem) : [];

  const fullWidthHeight = (aspect: number) => screenWidth / aspect;
  const paddedWidth = screenWidth - HORIZONTAL_PADDING * 2;
  const paddedHeight = (aspect: number) => paddedWidth / aspect;
  const openProduct = (item: ProductItem) => navigation.navigate('ProductDetail', { productId: item.id });
  const openStore = (index: number) => {
    const category = categories[index];
    if (category) navigation.navigate('StoreDetail', { categoryId: category.id, categoryName: category.name });
  };
  const openCategoryLink = (link: CategoryLink) =>
    navigation.navigate('CategoryDetail', { categoryId: link.categoryId, subcategoryId: link.subcategoryId });
  const openFeaturedPick = (index: number) => openCategoryLink(featuredPickLinks[index]);
  const openEssential = (index: number) => openCategoryLink(essentialTileLinks[index]);
  const handleAddToCart = (item: ProductItem) => {
    if (item.variantId) addItem(item.id, item.variantId).catch(alertCartError);
  };
  const handleCategoryTabChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    navigation.navigate('CategoryDetail', { categoryId });
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor="#1CA672" />
      <HomeTopBar
        location={locationLabel}
        avatarSource={avatarSource}
        hasUnreadNotifications={hasUnreadNotifications}
        onSearchPress={() => navigation.navigate('Search')}
        onLocationPress={() => navigation.navigate('LocationSelection')}
        onNotificationsPress={() => navigation.navigate('Notifications')}
        onAvatarPress={() => navigation.navigate('Profile')}
      />

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {categoryTabs.length > 0 ? (
          <CategoryTabs data={categoryTabs} activeId={activeCategory} onChange={handleCategoryTabChange} />
        ) : null}

        <ImageCardRow data={featuredPicks} cardWidth={116} cardHeight={175} onItemPress={openFeaturedPick} />

        <Image
          source={banners.topDeals}
          style={{ width: screenWidth, height: fullWidthHeight(960 / 213) }}
          resizeMode="cover"
        />
        <ProductRow data={topDealItems} backgroundColor="#65C6FF" onItemPress={openProduct} onAddPress={handleAddToCart} />

        <SectionHeader title="Grab it before it's gone!" />
        <ProductRow data={essentialProductItems} onItemPress={openProduct} onAddPress={handleAddToCart} />

        {storeTiles.length > 0 ? (
          <>
            <SectionHeader title="Shop by store" />
            <ImageCardRow data={storeTiles} cardWidth={116} cardHeight={153} onItemPress={openStore} />
          </>
        ) : null}

        <SectionHeader title="Munch on these snacks!" />
        <ProductRow data={snackProductItems} onItemPress={openProduct} onAddPress={handleAddToCart} />

        <SectionHeader title="Daily essentials" />
        <ImageCardRow data={essentialTiles} cardWidth={83} cardHeight={120} resizeMode="contain" onItemPress={openEssential} />

        <View style={styles.bannerPad}>
          <Image
            source={banners.promo1}
            style={{ width: paddedWidth, height: paddedHeight(949 / 220), borderRadius: 16 }}
            resizeMode="cover"
          />
        </View>
        <ProductRow data={saverProductItems} backgroundColor="#9AE9DD" onItemPress={openProduct} onAddPress={handleAddToCart} />

        <View style={[styles.bannerPad, styles.bannerGray]}>
          <Image
            source={banners.promo2}
            style={{ width: paddedWidth, height: paddedHeight(863 / 200), borderRadius: 16 }}
            resizeMode="contain"
          />
        </View>

        <Image
          source={banners.promo3}
          style={{ width: screenWidth, height: fullWidthHeight(960 / 320) }}
          resizeMode="cover"
        />

        <View style={styles.tileRow}>
          {promoTiles.map((tile, index) => (
            <Image
              key={index}
              source={tile}
              style={{ width: screenWidth / 3, height: (screenWidth / 3) * (142 / 133) }}
              resizeMode="cover"
            />
          ))}
        </View>

        <SectionHeader title="Rainy day specials" />
        <ProductRow data={monsoonProductItems} onItemPress={openProduct} onAddPress={handleAddToCart} />

        <View style={styles.footerPad}>
          <Image
            source={banners.footer}
            style={{ width: paddedWidth, height: paddedHeight(880 / 633) }}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

      {itemCount > 0 ? (
        <Pressable style={styles.viewCartPill} onPress={() => navigation.navigate('Cart')}>
          <View style={styles.viewCartIconWrap}>
            <CartIcon width={18} height={18} />
            <View style={styles.viewCartBadge}>
              <Text style={styles.viewCartBadgeText}>{itemCount}</Text>
            </View>
          </View>
          <Text style={styles.viewCartText}>View cart</Text>
        </Pressable>
      ) : null}

      <BottomNavBar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FFFFFF' },
  bannerPad: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
  },
  bannerGray: {
    backgroundColor: '#F1F3F6',
  },
  tileRow: {
    flexDirection: 'row',
  },
  footerPad: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
  },
  viewCartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#1CA672',
    borderRadius: 9999,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  viewCartIconWrap: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  viewCartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1CA672',
  },
  viewCartText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
