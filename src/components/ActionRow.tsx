import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface ActionRowProps {
  title: string;
  subtitle?: string;
  leading: React.ReactNode;
  leadingBackgroundColor?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  emphasized?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function ActionRow({
  title,
  subtitle,
  leading,
  leadingBackgroundColor,
  trailing,
  onPress,
  emphasized = false,
  height = 60,
  style,
}: ActionRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { height },
        emphasized ? styles.rowEmphasized : styles.rowDefault,
        pressed ? styles.pressed : null,
        style,
      ]}
    >
      <View
        style={[
          styles.leading,
          leadingBackgroundColor ? { backgroundColor: leadingBackgroundColor } : null,
        ]}
      >
        {leading}
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    width: '100%',
  },
  rowDefault: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.light,
  },
  rowEmphasized: {
    backgroundColor: colors.background.greenTint,
    borderColor: colors.border.green,
  },
  pressed: {
    opacity: 0.85,
  },
  leading: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    ...typography.listTitle,
    color: colors.text.heading,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.label,
    marginTop: 2,
  },
});
