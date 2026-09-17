import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ProductCard } from './ProductCard';
import type { ProductItem } from '../../data/home';

interface ProductRowProps {
  data: ProductItem[];
  backgroundColor?: string;
  onItemPress?: (item: ProductItem) => void;
  onAddPress?: (item: ProductItem) => void;
}

export function ProductRow({ data, backgroundColor, onItemPress, onAddPress }: ProductRowProps) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      style={backgroundColor ? { backgroundColor } : undefined}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <ProductCard item={item} onPress={() => onItemPress?.(item)} onAdd={() => onAddPress?.(item)} />
      )}
      initialNumToRender={6}
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
});
