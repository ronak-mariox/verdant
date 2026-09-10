import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  height?: number;
}

export function TextField({ label, containerStyle, height = 52, style, ...inputProps }: TextFieldProps) {
  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.text.inputPlaceholder}
        style={[styles.input, { height }, style]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    color: colors.text.label,
    marginBottom: spacing.xxs + 2,
  },
  input: {
    backgroundColor: colors.background.surface,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
    fontFamily: typography.body.fontFamily,
    color: colors.text.input,
  },
});
