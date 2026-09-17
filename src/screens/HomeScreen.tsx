import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CartIcon } from '../assets/icons/store';
import { BottomNavBar, type NavTab } from '../components/home/BottomNavBar';
import { CategoryTabs } from '../components/home/CategoryTabs';
import { HomeTopBar } from '../components/home/HomeTopBar';
import { ImageCardRow } from '../components/home/ImageCardRow';
import { ProductRow } from '../components/home/ProductRow';
import { SectionHeader } from '../components/home/SectionHeader';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { resolveProductImage } from '../utils/productImage';
import {
  banners,
  categoryTabs,
  essentialTileLinks,
  essentialTiles,
  featuredPickLinks,
  featuredPicks,
  promoTiles,
  rainyItems,
  snackItems,
  storeCards,
  type CategoryLink,
  type ProductItem,
} from '../data/home';
import type { AuthStackParamList } from '../navigation/types';

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

interface RawHomeResponse {
  topDeals: RawProduct[];
  saverItems: RawProduct[];
  essentialItems: RawProduct[];
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Home'>;

const HORIZONTAL_PADDING = 16;

const STORE_NAMES = [
  'Organic store',
  'The Ration Shop',
  'Spice market',
  'Chocolate store',
  'Munchies store',
  'Tiffin faves',
  'House of Flipkart',
];

export function HomeScreen({ navigation }: Props) {
  const [activeCategory, setActiveCategory] = useState('foryou');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const { width: screenWidth } = useWindowDimensions();
  const { itemCount, addItem } = useCart();

  const [homeData, setHomeData] = useState<RawHomeResponse | null>(null);
  const [rawProducts, setRawProducts] = useState<RawProduct[]>([]);

  useEffect(() => {
    api
      .get<RawHomeResponse>('/customer/home')
      .then(({ data }) => {
        setHomeData(data);
        setRawProducts([...data.topDeals, ...data.saverItems, ...data.essentialItems]);
      })
      .catch(() => {});
  }, []);

  const topDealItems = homeData ? homeData.topDeals.map(toProductItem) : [];
  const essentialProductItems = homeData ? homeData.essentialItems.map(toProductItem) : [];
  const saverProductItems = homeData ? homeData.saverItems.map(toProductItem) : [];

  const fullWidthHeight = (aspect: number) => screenWidth / aspect;
  const paddedWidth = screenWidth - HORIZONTAL_PADDING * 2;
  const paddedHeight = (aspect: number) => paddedWidth / aspect;
  const openProduct = (item: ProductItem) => navigation.navigate('ProductDetail', { productId: item.id });
  const openStore = (index: number) =>
    navigation.navigate('StoreDetail', { storeId: `store-${index + 1}`, storeName: STORE_NAMES[index] });
  const openCategoryLink = (link: CategoryLink) =>
    navigation.navigate('CategoryDetail', { categoryId: link.categoryId, subcategoryId: link.subcategoryId });
  const openFeaturedPick = (index: number) => openCategoryLink(featuredPickLinks[index]);
  const openEssential = (index: number) => openCategoryLink(essentialTileLinks[index]);
  const handleAddToCart = (item: ProductItem) => {
    const variantId = rawProducts.find((p) => p.id === item.id)?.variants[0]?.id;
    if (variantId) addItem(item.id, variantId);
  };
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'search') {
      navigation.navigate('Search');
    } else if (tab === 'categories') {
      navigation.navigate('Category');
    } else if (tab === 'orders') {
      navigation.navigate('OrderHistory');
    } else if (tab === 'profile') {
      navigation.navigate('Profile');
    }
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor="#1CA672" />
      <HomeTopBar
        location="Koramangala 5th Block, Bengaluru"
        onSearchPress={() => navigation.navigate('Search')}
        onLocationPress={() => navigation.navigate('LocationSelection')}
        onNotificationsPress={() => navigation.navigate('Notifications')}
        onAvatarPress={() => navigation.navigate('Profile')}
      />

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <CategoryTabs data={categoryTabs} activeId={activeCategory} onChange={setActiveCategory} />

        <ImageCardRow data={featuredPicks} cardWidth={116} cardHeight={175} onItemPress={openFeaturedPick} />

        <Image
          source={banners.topDeals}
          style={{ width: screenWidth, height: fullWidthHeight(960 / 213) }}
          resizeMode="cover"
        />
        <ProductRow data={topDealItems} backgroundColor="#65C6FF" onItemPress={openProduct} onAddPress={handleAddToCart} />

        <SectionHeader title="Grab it before it's gone!" />
        <ProductRow data={essentialProductItems} onItemPress={openProduct} onAddPress={handleAddToCart} />

        <SectionHeader title="Shop by store" />
        <ImageCardRow data={storeCards} cardWidth={116} cardHeight={153} onItemPress={openStore} />

        <SectionHeader title="Munch on these snacks!" />
        <ProductRow data={snackItems} onItemPress={openProduct} onAddPress={handleAddToCart} />

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
        <ProductRow data={rainyItems} onItemPress={openProduct} onAddPress={handleAddToCart} />

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

      <BottomNavBar active={activeTab} onChange={handleTabChange} />
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
