import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radius, shadows, typography } from '../theme';

export type ButtonVariant = 'primary' | 'outline' | 'soft' | 'neutral' | 'dangerSoft';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = variantStyles[variant];
  const textColor = isDisabled ? variantStyle.disabledTextColor : variantStyle.textColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPress={isDisabled ? undefined : onPress}
      hitSlop={4}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        isDisabled ? variantStyle.disabledContainer : variantStyle.container,
        variant === 'primary' && !isDisabled ? shadows.button : null,
        pressed && !isDisabled ? styles.pressed : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.buttonLargeBold,
  },
});

const variantStyles: Record<
  ButtonVariant,
  {
    container: ViewStyle;
    disabledContainer: ViewStyle;
    textColor: string;
    disabledTextColor: string;
  }
> = {
  primary: {
    container: { backgroundColor: colors.brand.primary },
    disabledContainer: { backgroundColor: colors.background.disabled },
    textColor: colors.text.onBrand,
    disabledTextColor: colors.text.disabled,
  },
  outline: {
    container: {
      backgroundColor: colors.background.screen,
      borderWidth: 1,
      borderColor: colors.text.onBrand,
    },
    disabledContainer: {
      backgroundColor: colors.background.screen,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    textColor: colors.text.onBrand,
    disabledTextColor: colors.text.faint,
  },
  soft: {
    container: {
      backgroundColor: colors.background.greenTint,
      borderWidth: 1.5,
      borderColor: colors.border.green,
    },
    disabledContainer: {
      backgroundColor: colors.background.surfaceMuted,
      borderWidth: 1.5,
      borderColor: colors.border.light,
    },
    textColor: colors.status.success,
    disabledTextColor: colors.text.subtle,
  },
  neutral: {
    container: {
      backgroundColor: colors.background.surface,
      borderWidth: 1.5,
      borderColor: colors.border.default,
    },
    disabledContainer: {
      backgroundColor: colors.background.surface,
      borderWidth: 1.5,
      borderColor: colors.border.default,
    },
    textColor: colors.text.label,
    disabledTextColor: colors.text.faint,
  },
  dangerSoft: {
    container: { backgroundColor: colors.background.redSoft },
    disabledContainer: { backgroundColor: colors.background.redSoft },
    textColor: colors.status.error,
    disabledTextColor: colors.status.error,
  },
};
