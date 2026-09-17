import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, PhoneNumberInput, Screen } from '../components';
import { loginLogo } from '../assets/images';
import { colors, fontFamily, radius, spacing, typography } from '../theme';
import type { AuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { requestOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isValid = phone.length === 10;

  const handleSendOtp = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await requestOtp(phone);
      // Dev-only convenience: the backend echoes the generated OTP outside production so
      // testers don't need real SMS delivery. Never present in a production API response.
      const devOtp = __DEV__ ? result.devOtp : undefined;
      navigation.navigate('Otp', { phoneNumber: phone, devOtp });
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Could not send OTP. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen edges={['left', 'right']} scrollable>
      <View style={styles.header}>
        <Image source={loginLogo} style={styles.logo} resizeMode="contain" />
        <View style={styles.decorCircle} />
        <View style={styles.headerCurve} />
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>Login with your mobile number to continue.</Text>

        <Text style={styles.label}>Mobile Number</Text>
        <PhoneNumberInput value={phone} onChangeText={setPhone} isValid={isValid} />
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Button
          label="Send OTP"
          disabled={!isValid}
          loading={isSubmitting}
          onPress={handleSendOtp}
          style={styles.sendButton}
        />

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>New to Verdant? </Text>
          <Pressable hitSlop={8} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Create account</Text>
          </Pressable>
        </View>

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
  header: {
    height: 280,
    backgroundColor: colors.background.brand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 215,
    height: 86,
  },
  decorCircle: {
    position: 'absolute',
    top: -80,
    left: 214,
    width: 280,
    height: 280,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
    opacity: 0.1,
  },
  headerCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: colors.background.screen,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.huge,
  },
  heading: {
    ...typography.h2,
    color: colors.text.heading,
    paddingBottom: spacing.xxs + 2,
  },
  subheading: {
    ...typography.body,
    color: colors.text.subtle,
    paddingBottom: spacing.xxxl,
  },
  label: {
    ...typography.label,
    color: colors.text.label,
    marginBottom: spacing.xxs + 2,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.status.errorText,
    paddingTop: spacing.xs,
  },
  sendButton: {
    marginTop: spacing.xxxl,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  signupText: {
    ...typography.bodySmall,
    color: colors.text.subtle,
  },
  signupLink: {
    ...typography.bodySmall,
    fontFamily: fontFamily.bodySemiBold,
    color: colors.brand.primary,
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
