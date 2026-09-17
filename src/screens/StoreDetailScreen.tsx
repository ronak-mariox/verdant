import React from 'react';
import {
  Alert,
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackWhiteIcon, CartIcon, SearchIcon, ViewAllArrowIcon } from '../assets/icons/store';
import { bannerDailyStaples, bannerKitchen } from '../assets/images/store';
import { StoreProductRow } from '../components/store/StoreProductRow';
import { useCart } from '../context/CartContext';
import {
  bigPackSavings,
  brandLogos,
  crossSellTiles,
  dalThumbs,
  giftPackings,
  graviesPurees,
  kitchenTiles,
  littleKirana,
  papadPickles,
  type StoreProduct,
} from '../data/store';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'StoreDetail'>;

export function StoreDetailScreen({ navigation, route }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const { addItem, itemCount } = useCart();
  const storeName = route.params?.storeName ?? 'The Little Kirana';

  const kitchenBannerHeight = (screenWidth * 311) / 800;
  const dailyStaplesHeight = (screenWidth * 177) / 800;
  const tileWidth = (screenWidth - 16 * 2 - 8 * 2) / 3;

  const openProduct = (item: StoreProduct) => {
    navigation.navigate('ProductDetail', { productId: item.id });
  };

  const addToCart = (item: StoreProduct) => {
    // This store's catalog (giftPackings, bigPackSavings, etc.) is still static mock data —
    // there is no per-vendor storefront endpoint yet and no real vendorId flows into this
    // screen from navigation (see HomeScreen's "Shop by store" tiles), so these ids don't
    // correspond to real backend products/variants. Fire the real cart call anyway so the
    // signature matches the new backend-backed addItem, and swallow the inevitable failure
    // quietly rather than leaving an unhandled promise rejection.
    addItem(item.id, item.id).catch(() => {});
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor="#1CA672" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackWhiteIcon width={20} height={20} />
          </Pressable>
          <Pressable style={styles.searchBar} onPress={() => navigation.navigate('Home')}>
            <SearchIcon width={18} height={18} />
            <Text style={styles.searchPlaceholder} numberOfLines={1}>
              Search atta, dal & more
            </Text>
          </Pressable>
          <Pressable style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
            <View style={styles.cartIconWrap}>
              <CartIcon width={22} height={22} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount > 0 ? itemCount : 1}</Text>
              </View>
            </View>
            <Text style={styles.cartLabel}>Cart</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <Text style={styles.storeNameLabel}>{storeName}</Text>

        <Pressable onPress={() => navigation.navigate('Home')}>
          <Image source={bannerKitchen} style={{ width: screenWidth, height: kitchenBannerHeight }} resizeMode="cover" />
        </Pressable>

        <View style={styles.kitchenGrid}>
          {kitchenTiles.map((tile) => (
            <Pressable
              key={tile.id}
              style={[styles.kitchenTile, { width: tileWidth }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Image
                source={tile.image}
                style={[styles.kitchenTileImage, { width: tileWidth, height: tileWidth }]}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>

        <SectionHeader title="Gift Packings" onSeeAll={() => Alert.alert('Gift Packings', 'Browsing all gift packing deals.')} />
        <StoreProductRow data={giftPackings} onItemPress={openProduct} onAddItem={addToCart} />

        <SectionHeader title="Big Pack Big Savings" onSeeAll={() => Alert.alert('Big Pack Big Savings', 'Browsing all bulk-pack deals.')} />
        <StoreProductRow data={bigPackSavings} onItemPress={openProduct} onAddItem={addToCart} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dalRow}>
          {dalThumbs.map((dal) => (
            <Pressable key={dal.id} style={styles.dalItem} onPress={() => navigation.navigate('Home')}>
              <Image source={dal.image} style={styles.dalImage} resizeMode="cover" />
              <Text style={styles.dalLabel} numberOfLines={1}>
                {dal.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title="The Little Kirana" onSeeAll={() => Alert.alert('The Little Kirana', 'Browsing all Little Kirana essentials.')} />
        <StoreProductRow data={littleKirana} onItemPress={openProduct} onAddItem={addToCart} />

        <SectionHeader title="Papad & Pickles" onSeeAll={() => Alert.alert('Papad & Pickles', 'Browsing all papad & pickle deals.')} />
        <StoreProductRow data={papadPickles} onItemPress={openProduct} onAddItem={addToCart} />

        <View style={styles.brandGrid}>
          {brandLogos.map((brand) => (
            <Pressable
              key={brand.id}
              style={[styles.brandTile, { width: tileWidth }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Image
                source={brand.image}
                style={[styles.brandTileImage, { width: tileWidth, height: tileWidth }]}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>

        <SectionHeader title="Gravies & Purees" onSeeAll={() => Alert.alert('Gravies & Purees', 'Browsing all gravies & purees.')} />
        <StoreProductRow data={graviesPurees} onItemPress={openProduct} onAddItem={addToCart} />

        <View style={styles.moreSection}>
          <Text style={styles.moreTitle}>Looking for more?</Text>
          <Text style={styles.moreSubtitle}>See our other stores</Text>
          <View style={styles.crossSellRow}>
            {crossSellTiles.map((tile) => (
              <Pressable
                key={tile.id}
                style={styles.crossSellTile}
                onPress={() => navigation.push('StoreDetail', { storeId: tile.id, storeName: tile.label })}
              >
                <Image source={tile.image} style={styles.crossSellImage} resizeMode="cover" />
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate('Home')}>
          <Image
            source={bannerDailyStaples}
            style={{ width: screenWidth, height: dailyStaplesHeight }}
            resizeMode="cover"
          />
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable style={styles.viewAllButton} onPress={onSeeAll} hitSlop={6}>
        <ViewAllArrowIcon width={16} height={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FFFFFF' },
  headerSafe: {
    backgroundColor: '#1CA672',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 14,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: '#99A1AF',
  },
  cartButton: {
    alignItems: 'center',
  },
  cartIconWrap: {
    width: 24,
    height: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#FD6612',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  cartBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cartLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingTop: 2,
  },
  storeNameLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  kitchenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  kitchenTile: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  kitchenTileImage: {
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  viewAllButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dalRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 14,
  },
  dalItem: {
    alignItems: 'center',
    width: 64,
  },
  dalImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
  },
  dalLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    paddingTop: 6,
    textAlign: 'center',
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  brandTile: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  brandTileImage: {
    borderRadius: 12,
  },
  moreSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  moreTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  moreSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  crossSellRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 14,
  },
  crossSellTile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  crossSellImage: {
    width: '100%',
    height: '100%',
  },
  bottomSpacer: {
    height: 24,
  },
});
