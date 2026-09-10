import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface OtpInputGroupProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  status?: 'default' | 'error';
  autoFocus?: boolean;
}

export function OtpInputGroup({
  length = 6,
  value,
  onChange,
  status = 'default',
  autoFocus = false,
}: OtpInputGroupProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setDigit = (index: number, digit: string) => {
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    onChange(nextDigits.join(''));
  };

  const handleChangeText = (text: string, index: number) => {
    const sanitized = text.replace(/[^0-9]/g, '');

    if (sanitized.length > 1) {
      const pasted = sanitized.slice(0, length - index).split('');
      const nextDigits = [...digits];
      pasted.forEach((d, i) => {
        nextDigits[index + i] = d;
      });
      onChange(nextDigits.join(''));
      const nextIndex = Math.min(index + pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    setDigit(index, sanitized);
    if (sanitized && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigit(index - 1, '');
    }
  };

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          keyboardType="number-pad"
          maxLength={length}
          autoFocus={autoFocus && index === 0}
          style={[styles.box, status === 'error' ? styles.boxError : digit ? styles.boxFilled : null]}
          accessibilityLabel={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  box: {
    flex: 1,
    aspectRatio: 52 / 60,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: typography.input.fontFamily,
    color: colors.text.input,
  },
  boxFilled: {
    borderColor: colors.brand.primary,
  },
  boxError: {
    borderWidth: 2,
    borderColor: colors.border.red,
  },
});
