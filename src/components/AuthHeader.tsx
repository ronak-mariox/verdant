import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackChevronWhite } from '../assets/icons';
import { colors, radius, spacing, typography } from '../theme';

interface AuthHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  backOpacity?: number;
  iconBackgroundColor?: string;
}

export function AuthHeader({
  icon,
  title,
  subtitle,
  onBack,
  backOpacity = 1,
  iconBackgroundColor = colors.overlay.whiteFaint,
}: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          hitSlop={8}
          style={[styles.backButton, { opacity: backOpacity }]}
        >
          <BackChevronWhite width={20} height={20} />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
      ) : null}

      <View style={styles.iconRow}>
        <View style={[styles.iconBadge, { backgroundColor: iconBackgroundColor }]}>{icon}</View>
      </View>

      <Text style={styles.title}>{title}</Text>
      {subtitle ? <View style={styles.subtitleWrap}>{subtitle}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.brand,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.huge,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  backLabel: {
    ...typography.bodySmallBold,
    color: colors.text.onBrand,
  },
  iconRow: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text.onBrand,
    textAlign: 'center',
    paddingTop: spacing.lg,
  },
  subtitleWrap: {
    paddingTop: spacing.xs,
    alignItems: 'center',
  },
});
