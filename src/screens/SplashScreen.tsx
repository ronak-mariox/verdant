import React from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components';
import { verdantLogo } from '../assets/images';
import { colors, radius, shadows, spacing, typography } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const LOGO_ASPECT_RATIO = 293 / 117;

export function SplashScreen({ navigation }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const logoWidth = screenWidth * 0.71;
  const logoHeight = logoWidth / LOGO_ASPECT_RATIO;

  return (
    <Screen backgroundColor={colors.brand.primary} statusBarStyle="light">
      <View style={styles.decorCircleTop} />
      <View style={styles.decorCircleLeft} />
      <View style={styles.decorCircleBottom} />

      <View style={styles.logoWrap} pointerEvents="none">
        <Image
          source={verdantLogo}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[...colors.gradients.progressBar]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressFill}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.replace('LocationPermission')}
          style={({ pressed }) => [styles.button, shadows.buttonSoft, pressed && styles.pressed]}
        >
          <Text style={styles.buttonLabel}>Get Started</Text>
        </Pressable>

        <Text style={styles.terms}>By continuing, you agree to our Terms &amp; Privacy Policy</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  decorCircleTop: {
    position: 'absolute',
    top: -96,
    left: 190,
    width: 320,
    height: 320,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
    opacity: 0.05,
  },
  decorCircleLeft: {
    position: 'absolute',
    top: 128,
    left: -64,
    width: 200,
    height: 200,
    borderRadius: radius.full,
    backgroundColor: colors.brand.gradientEnd,
    opacity: 0.05,
  },
  decorCircleBottom: {
    position: 'absolute',
    top: 696,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
    opacity: 0.15,
  },
  logoWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.huge,
    paddingBottom: 64,
    gap: spacing.xxxl,
  },
  progressTrack: {
    height: 3,
    borderRadius: radius.full,
    backgroundColor: colors.overlay.whiteFaint,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    width: '72%',
    borderRadius: radius.full,
  },
  button: {
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.text.onBrand,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    ...typography.buttonLarge,
    color: colors.text.onBrand,
  },
  terms: {
    ...typography.caption,
    color: colors.text.onBrandSubtle,
    textAlign: 'center',
  },
});
