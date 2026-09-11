import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomNavBar, type NavTab } from '../components/home/BottomNavBar';
import { CategoryTabs } from '../components/home/CategoryTabs';
import { HomeTopBar } from '../components/home/HomeTopBar';
import { ImageCardRow } from '../components/home/ImageCardRow';
import { ProductRow } from '../components/home/ProductRow';
import { SectionHeader } from '../components/home/SectionHeader';
import {
  banners,
  categoryTabs,
  essentialTiles,
  featuredPicks,
  grabItems,
  promoTiles,
  rainyItems,
  saverItems,
  snackItems,
  storeCards,
  topDeals,
} from '../data/home';
import type { AuthStackParamList } from '../navigation/types';

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

  const fullWidthHeight = (aspect: number) => screenWidth / aspect;
  const paddedWidth = screenWidth - HORIZONTAL_PADDING * 2;
  const paddedHeight = (aspect: number) => paddedWidth / aspect;
  const openProduct = () => navigation.navigate('ProductDetail');
  const openStore = (index: number) =>
    navigation.navigate('StoreDetail', { storeId: `store-${index + 1}`, storeName: STORE_NAMES[index] });
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'search') {
      navigation.navigate('Search');
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
      />

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <CategoryTabs data={categoryTabs} activeId={activeCategory} onChange={setActiveCategory} />

        <ImageCardRow data={featuredPicks} cardWidth={116} cardHeight={175} onItemPress={openProduct} />

        <Image
          source={banners.topDeals}
          style={{ width: screenWidth, height: fullWidthHeight(960 / 213) }}
          resizeMode="cover"
        />
        <ProductRow data={topDeals} backgroundColor="#65C6FF" onItemPress={openProduct} />

        <SectionHeader title="Grab it before it's gone!" />
        <ProductRow data={grabItems} onItemPress={openProduct} />

        <SectionHeader title="Shop by store" />
        <ImageCardRow data={storeCards} cardWidth={116} cardHeight={153} onItemPress={openStore} />

        <SectionHeader title="Munch on these snacks!" />
        <ProductRow data={snackItems} onItemPress={openProduct} />

        <SectionHeader title="Daily essentials" />
        <ImageCardRow data={essentialTiles} cardWidth={83} cardHeight={120} resizeMode="contain" onItemPress={openProduct} />

        <View style={styles.bannerPad}>
          <Image
            source={banners.promo1}
            style={{ width: paddedWidth, height: paddedHeight(949 / 220), borderRadius: 16 }}
            resizeMode="cover"
          />
        </View>
        <ProductRow data={saverItems} backgroundColor="#9AE9DD" onItemPress={openProduct} />

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
        <ProductRow data={rainyItems} onItemPress={openProduct} />

        <View style={styles.footerPad}>
          <Image
            source={banners.footer}
            style={{ width: paddedWidth, height: paddedHeight(880 / 633) }}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

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
});
