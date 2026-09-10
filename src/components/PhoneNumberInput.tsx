import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CheckCircle, ChevronDown } from '../assets/icons';
import { colors, radius, spacing, typography } from '../theme';

interface PhoneNumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  isValid: boolean;
}

export function PhoneNumberInput({ value, onChangeText, isValid }: PhoneNumberInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.codeSection}>
        <Text style={styles.flag}>🇮🇳</Text>
        <Text style={styles.code}>+91</Text>
        <ChevronDown width={12} height={12} />
      </View>
      <TextInput
        value={value}
        onChangeText={(text) => onChangeText(text.replace(/[^0-9]/g, ''))}
        placeholder="98765 43210"
        placeholderTextColor={colors.text.inputPlaceholder}
        keyboardType="number-pad"
        maxLength={10}
        style={styles.input}
        accessibilityLabel="Mobile number"
      />
      {isValid ? (
        <View style={styles.checkWrap}>
          <CheckCircle width={12} height={12} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    overflow: 'hidden',
  },
  codeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: '100%',
    paddingHorizontal: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border.default,
  },
  flag: {
    fontSize: 18,
  },
  code: {
    ...typography.bodySmall,
    fontFamily: typography.buttonMedium.fontFamily,
    color: colors.text.listItem,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.md,
    fontSize: 17,
    fontFamily: typography.input.fontFamily,
    letterSpacing: 0.68,
    color: colors.text.input,
  },
  checkWrap: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
});
