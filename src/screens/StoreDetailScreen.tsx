import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackWhiteIcon, CartIcon, SearchIcon } from '../assets/icons/store';
import { LoadErrorView } from '../components/order/LoadErrorView';
import { StoreProductCard } from '../components/store/StoreProductCard';
import { useCart } from '../context/CartContext';
import type { StoreProduct } from '../data/store';
import type { AuthStackParamList } from '../navigation/types';
import { api, getErrorMessage } from '../services/api';
import { toStoreProduct } from '../utils/productMappers';
import type { PagedResponse, RawProduct } from '../types/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'StoreDetail'>;

const PAGE_SIZE = 20;

export function StoreDetailScreen({ navigation, route }: Props) {
  const { categoryId, categoryName } = route.params;
  const { width: screenWidth } = useWindowDimensions();
  const { addItem, itemCount } = useCart();
  const cardWidth = (screenWidth - 16 * 2 - 12) / 2;

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (nextPage: number) => {
      const { data } = await api.get<PagedResponse<RawProduct>>('/customer/products', {
        params: { categoryId, page: nextPage, limit: PAGE_SIZE },
      });
      return data;
    },
    [categoryId],
  );

  const loadFirst = useCallback(async () => {
    const data = await fetchPage(1);
    setProducts(data.items.map(toStoreProduct));
    setTotal(data.total ?? data.items.length);
    setTotalPages(data.totalPages ?? 1);
    setPage(1);
    setError(null);
  }, [fetchPage]);

  useEffect(() => {
    setLoading(true);
    loadFirst()
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [loadFirst]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFirst()
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setRefreshing(false));
  }, [loadFirst]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;
    setLoadingMore(true);
    fetchPage(page + 1)
      .then((data) => {
        setProducts((prev) => [...prev, ...data.items.map(toStoreProduct)]);
        setPage(page + 1);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [fetchPage, loading, loadingMore, page, totalPages]);

  const openProduct = (item: StoreProduct) => navigation.navigate('ProductDetail', { productId: item.id });

  const addToCart = (item: StoreProduct) => {
    if (!item.variantId) return;
    addItem(item.id, item.variantId).catch((err) => Alert.alert('Could not add to cart', getErrorMessage(err)));
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor="#1CA672" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackWhiteIcon width={20} height={20} />
          </Pressable>
          <Pressable style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
            <SearchIcon width={18} height={18} />
            <Text style={styles.searchPlaceholder} numberOfLines={1}>
              Search atta, dal & more
            </Text>
          </Pressable>
          <Pressable style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
            <View style={styles.cartIconWrap}>
              <CartIcon width={22} height={22} />
              {itemCount > 0 ? (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{itemCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.cartLabel}>Cart</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator color="#1CA672" size="large" />
        </View>
      ) : error && products.length === 0 ? (
        <LoadErrorView message={error} onRetry={onRefresh} onBack={() => navigation.goBack()} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1CA672" />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <View style={styles.titleWrap}>
              <Text style={styles.title}>{categoryName ?? 'Store'}</Text>
              <Text style={styles.subtitle}>
                {total} {total === 1 ? 'product' : 'products'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.centerWrap}>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptySubtitle}>Products in this category will show up as vendors add them.</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color="#1CA672" />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <StoreProductCard item={item} cardWidth={cardWidth} onPress={() => openProduct(item)} onAdd={() => addToCart(item)} />
          )}
        />
      )}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWrap: {
    paddingVertical: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    paddingTop: 2,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    paddingTop: 6,
  },
  footerLoader: {
    paddingVertical: 16,
  },
});
