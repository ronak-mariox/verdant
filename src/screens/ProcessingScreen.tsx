import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckSmall, ProcessingIcon } from '../assets/icons/checkout';
import { useCart } from '../context/CartContext';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Processing'>;

const STEPS = ['Verifying payment', 'Confirming order', 'Almost done'];
const STEP_INTERVAL = 700;

export function ProcessingScreen({ navigation }: Props) {
  const { clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spinLoop.start();
    return () => spinLoop.stop();
  }, [spin]);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, STEP_INTERVAL);

    const finishTimer = setTimeout(() => {
      const succeeded = Math.random() > 0.15;
      if (succeeded) {
        clearCart();
        navigation.reset({ index: 0, routes: [{ name: 'OrderConfirmation' }] });
      } else {
        navigation.replace('PaymentFailed');
      }
    }, STEP_INTERVAL * STEPS.length + 400);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(finishTimer);
    };
  }, [clearCart, navigation]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        <Animated.View style={[styles.iconWrap, { transform: [{ rotate }] }]}>
          <ProcessingIcon width={56} height={56} />
        </Animated.View>
        <Text style={styles.title}>Placing your order…</Text>
        <Text style={styles.subtitle}>This will only take a moment</Text>

        <View style={styles.checklist}>
          {STEPS.map((step, index) => {
            const done = index < activeStep;
            const active = index === activeStep;
            return (
              <View key={step} style={styles.checklistRow}>
                <View style={[styles.stepDot, done && styles.stepDotDone, active && styles.stepDotActive]}>
                  {done ? <CheckSmall width={12} height={12} /> : active ? <View style={styles.stepPulse} /> : null}
                </View>
                <Text
                  style={[
                    styles.stepText,
                    done && styles.stepTextDone,
                    active && styles.stepTextActive,
                  ]}
                >
                  {step}
                  {active ? '…' : ''}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingTop: 24,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    paddingTop: 4,
  },
  checklist: {
    alignSelf: 'stretch',
    gap: 16,
    paddingTop: 40,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    borderColor: '#1CA672',
    backgroundColor: '#1CA672',
  },
  stepDotActive: {
    borderColor: '#1CA672',
  },
  stepPulse: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#1CA672',
  },
  stepText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  stepTextDone: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  stepTextActive: {
    color: '#1CA672',
    fontWeight: '700',
  },
});
