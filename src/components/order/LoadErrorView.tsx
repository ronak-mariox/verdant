import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface LoadErrorViewProps {
  message: string;
  onRetry: () => void;
  onBack?: () => void;
}

export function LoadErrorView({ message, onRetry, onBack }: LoadErrorViewProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Try again</Text>
      </Pressable>
      {onBack ? (
        <Pressable style={styles.backLink} onPress={onBack} hitSlop={8}>
          <Text style={styles.backText}>Go back</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  message: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    paddingTop: 6,
  },
  retryButton: {
    marginTop: 20,
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backLink: {
    paddingTop: 16,
  },
  backText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});
