import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthHeader, Button, Screen } from '../components';
import { CheckCircle } from '../assets/icons';
import { colors, fontFamily, radius, spacing, typography } from '../theme';
import type { AuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, getFieldErrors } from '../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAccount'>;

function maskPhone(phone: string) {
  if (phone.length < 4) return `+91 ${phone}`;
  return `+91 ${phone.slice(0, 2)}******${phone.slice(-2)}`;
}

export function CreateAccountScreen({ navigation, route }: Props) {
  const { phoneNumber, verifiedPhoneToken } = route.params;
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isValid = name.trim().length >= 2;

  const handleCreateAccount = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});
    try {
      await register(verifiedPhoneToken, name.trim(), email.trim() || undefined);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      setFieldErrors(getFieldErrors(err) ?? {});
      setErrorMessage(getErrorMessage(err, 'Could not create your account. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen edges={['left', 'right']} scrollable>
      <AuthHeader
        onBack={() => navigation.goBack()}
        icon={<CheckCircle width={28} height={28} />}
        title="Create your account"
        subtitle={
          <Text style={styles.headerSubtitle}>
            <Text style={styles.headerSubtitleBold}>{maskPhone(phoneNumber)}</Text> is verified — tell us your name to
            finish setting up
          </Text>
        }
      />

      <View style={styles.body}>
        {errorMessage ? <Text style={styles.errorBanner}>{errorMessage}</Text> : null}

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, fieldErrors.name && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Priya Sharma"
          placeholderTextColor={colors.text.inputPlaceholder}
          autoFocus
          autoCapitalize="words"
          returnKeyType="next"
        />
        {fieldErrors.name ? <Text style={styles.fieldError}>{fieldErrors.name}</Text> : null}

        <Text style={[styles.label, styles.labelSpaced]}>Email Address (optional)</Text>
        <TextInput
          style={[styles.input, fieldErrors.email && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.text.inputPlaceholder}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
        />
        {fieldErrors.email ? <Text style={styles.fieldError}>{fieldErrors.email}</Text> : null}

        <Button
          label="Create Account"
          disabled={!isValid}
          loading={isSubmitting}
          onPress={handleCreateAccount}
          style={styles.submitButton}
        />

        <Text style={styles.legal}>
          By continuing, you agree to our{' '}
          <Text style={styles.legalLink}>Terms of Service</Text> and{' '}
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerSubtitle: {
    ...typography.bodySmallBold,
    color: colors.text.onBrandSubtle,
  },
  headerSubtitleBold: {
    fontFamily: fontFamily.bodySemiBold,
    color: colors.text.onBrand,
  },
  body: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.huge,
  },
  errorBanner: {
    ...typography.bodySmall,
    color: colors.status.errorText,
    backgroundColor: colors.background.redTint,
    borderWidth: 1,
    borderColor: colors.border.red,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.label,
    color: colors.text.label,
    marginBottom: spacing.xxs + 2,
  },
  labelSpaced: {
    marginTop: spacing.xl,
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    ...typography.input,
    color: colors.text.input,
    backgroundColor: colors.background.surface,
  },
  inputError: {
    borderColor: colors.border.red,
  },
  fieldError: {
    ...typography.bodySmall,
    color: colors.status.errorText,
    paddingTop: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.xxxl,
  },
  legal: {
    ...typography.fine,
    color: colors.text.faint,
    textAlign: 'center',
    paddingTop: spacing.lg,
  },
  legalLink: {
    color: colors.text.subtle,
    textDecorationLine: 'underline',
  },
});
