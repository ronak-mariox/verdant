import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, type ImageResizeMode } from 'react-native';

interface ImageCardRowProps {
  data: number[];
  cardWidth?: number;
  cardHeight?: number;
  resizeMode?: ImageResizeMode;
  onItemPress?: (index: number) => void;
}

export function ImageCardRow({
  data,
  cardWidth = 116,
  cardHeight = 153,
  resizeMode = 'cover',
  onItemPress,
}: ImageCardRowProps) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(_, index) => String(index)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      renderItem={({ item, index }) => (
        <Pressable
          style={[styles.card, { width: cardWidth, height: cardHeight }]}
          onPress={() => onItemPress?.(index)}
        >
          <Image source={item} style={styles.image} resizeMode={resizeMode} />
        </Pressable>
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
    gap: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
