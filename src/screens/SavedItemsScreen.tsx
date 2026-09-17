import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon } from '../assets/icons/order';
import { ProductCard } from '../components/home/ProductCard';
import { useCart } from '../context/CartContext';
import type { ProductItem } from '../data/home';
import type { AuthStackParamList } from '../navigation/types';
import { api } from '../services/api';
import { resolveProductImage } from '../utils/productImage';

type Props = NativeStackScreenProps<AuthStackParamList, 'SavedItems'>;

interface RawVariant {
  id: string;
  label: string;
  mrp: number;
  price: number;
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

export function SavedItemsScreen({ navigation }: Props) {
  const { addItem } = useCart();
  const [rawProducts, setRawProducts] = useState<RawProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      api
        .get<RawProduct[]>('/customer/wishlist')
        .then(({ data }) => setRawProducts(data))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }, []),
  );

  const items = rawProducts.map(toProductItem);

  const openProduct = (item: ProductItem) => navigation.navigate('ProductDetail', { productId: item.id });
  const handleAddToCart = (item: ProductItem) => {
    const variantId = rawProducts.find((p) => p.id === item.id)?.variants[0]?.id;
    if (variantId) addItem(item.id, variantId);
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Saved Items</Text>
            <Text style={styles.headerSubtitle}>{items.length} items in wishlist</Text>
          </View>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View style={styles.emptyWrap}>
          <ActivityIndicator color="#1CA672" />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No saved items yet</Text>
          <Text style={styles.emptySubtitle}>Tap the heart icon on a product to save it here.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridColumnWrapper}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <View style={styles.gridCell}>
              <ProductCard item={item} onPress={() => openProduct(item)} onAdd={() => handleAddToCart(item)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FFFFFF' },
  headerSafe: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: { flex: 1 },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  gridColumnWrapper: {
    gap: 8,
    paddingHorizontal: 16,
  },
  gridContent: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  gridCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});
