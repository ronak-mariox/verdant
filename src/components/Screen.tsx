import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors } from '../theme';

interface ScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light' | 'dark';
  scrollable?: boolean;
  edges?: Edge[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  backgroundColor = colors.background.screen,
  statusBarStyle = 'dark',
  scrollable = false,
  edges = ['top', 'bottom', 'left', 'right'],
  contentContainerStyle,
  style,
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor }, style]}>
      <StatusBar
        barStyle={statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, contentContainerStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
