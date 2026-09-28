import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components';
import { verdantLogo } from '../assets/images';
import { colors, radius, shadows, spacing, typography } from '../theme';
import type { AuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const LOGO_ASPECT_RATIO = 293 / 117;
const MIN_VISIBLE_MS = 1200;
// Upper bound on how long the bar waits for session restore before completing anyway;
// an unreachable backend must not hold the user on the splash screen.
const MAX_WAIT_MS = 4000;

export function SplashScreen({ navigation }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const logoWidth = screenWidth * 0.71;
  const logoHeight = logoWidth / LOGO_ASPECT_RATIO;
  const { isLoading, isAuthenticated } = useAuth();
  const progress = useRef(new Animated.Value(0)).current;
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [maxTimeElapsed, setMaxTimeElapsed] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0.92,
      duration: MIN_VISIBLE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_VISIBLE_MS);
    const maxTimer = setTimeout(() => setMaxTimeElapsed(true), MAX_WAIT_MS);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [progress]);

  const restoreSettled = !isLoading || maxTimeElapsed;

  useEffect(() => {
    if (!restoreSettled || !minTimeElapsed || finished.current) return;
    finished.current = true;
    Animated.timing(progress, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      if (isAuthenticated) navigation.replace('Home');
    });
  }, [restoreSettled, minTimeElapsed, isAuthenticated, navigation, progress]);

  // If restore finishes late (after the bar already completed) and the user is signed in, still go Home.
  useEffect(() => {
    if (finished.current && !isLoading && isAuthenticated) navigation.replace('Home');
  }, [isLoading, isAuthenticated, navigation]);

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

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
          <Animated.View style={[styles.progressFillWrap, { width: progressWidth }]}>
            <LinearGradient
              colors={[...colors.gradients.progressBar]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!restoreSettled}
          onPress={() => navigation.replace(isAuthenticated ? 'Home' : 'LocationPermission')}
          style={({ pressed }) => [
            styles.button,
            shadows.buttonSoft,
            !restoreSettled && styles.buttonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.buttonLabel}>{restoreSettled ? 'Get Started' : 'Loading…'}</Text>
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
  progressFillWrap: {
    height: '100%',
    borderRadius: radius.full,
    overflow: 'hidden',
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
  buttonDisabled: {
    opacity: 0.6,
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
