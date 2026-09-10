import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export function Toggle({ value, onValueChange }: { value: boolean; onValueChange: (next: boolean) => void }) {
  return (
    <Pressable
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
    >
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: '#1CA672',
  },
  trackOff: {
    backgroundColor: '#E5E7EB',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  thumbOff: {
    alignSelf: 'flex-start',
  },
});
