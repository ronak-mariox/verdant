import React from 'react';
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { StoreProductCard } from './StoreProductCard';
import type { StoreProduct } from '../../data/store';

interface StoreProductRowProps {
  data: StoreProduct[];
  onItemPress?: (item: StoreProduct) => void;
  onAddItem?: (item: StoreProduct) => void;
}

export function StoreProductRow({ data, onItemPress, onAddItem }: StoreProductRowProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth * 0.8;

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      snapToInterval={cardWidth + 12}
      decelerationRate="fast"
      renderItem={({ item }) => (
        <StoreProductCard
          item={item}
          cardWidth={cardWidth}
          onPress={() => onItemPress?.(item)}
          onAdd={() => onAddItem?.(item)}
        />
      )}
      initialNumToRender={3}
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 12,
  },
});
