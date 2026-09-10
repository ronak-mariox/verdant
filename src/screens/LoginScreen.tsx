import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, PhoneNumberInput, Screen } from '../components';
import { AppleLogo, GoogleLogo } from '../assets/icons';
import { loginLogo } from '../assets/images';
import { colors, fontFamily, radius, spacing, typography } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const isValid = phone.length === 10;

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

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Pressable
            style={({ pressed }) => [styles.socialButton, styles.googleButton, pressed && styles.pressed]}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          >
            <GoogleLogo width={20} height={20} />
            <Text style={styles.socialLabel}>Google</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.socialButton, styles.appleButton, pressed && styles.pressed]}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          >
            <AppleLogo width={20} height={20} />
            <Text style={styles.socialLabel}>Apple</Text>
          </Pressable>
        </View>

        <Button
          label="Send OTP"
          disabled={!isValid}
          onPress={() => navigation.navigate('Otp', { phoneNumber: phone })}
        />

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>New to Verdant? </Text>
          <Pressable
            hitSlop={8}
            onPress={() =>
              Alert.alert('Create account', 'Enter your mobile number above and verify via OTP to create your Verdant account.')
            }
          >
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.background.surfaceMuted,
  },
  dividerText: {
    ...typography.caption,
    color: colors.text.subtle,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  socialButton: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  googleButton: {
    backgroundColor: colors.background.redTint,
  },
  appleButton: {
    backgroundColor: colors.background.surfaceAlt,
  },
  pressed: {
    opacity: 0.85,
  },
  socialLabel: {
    ...typography.buttonMedium,
    color: colors.text.buttonNeutral,
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
