import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StepCheckIcon } from '../../assets/icons/order';

const STEPS = ['Order Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'];

interface OrderProgressTrackerProps {
  activeIndex: number;
  color?: string;
}

export function OrderProgressTracker({ activeIndex, color = '#1CA672' }: OrderProgressTrackerProps) {
  const segments = STEPS.length - 1;
  const progressRatio = activeIndex / segments;

  return (
    <View style={styles.wrap}>
      <View style={styles.trackRow}>
        <View style={styles.trackLineBg} />
        <View style={[styles.trackLineFill, { width: `${progressRatio * 100}%`, backgroundColor: color }]} />
        {STEPS.map((_, index) => {
          const done = index < activeIndex;
          const current = index === activeIndex;
          return (
            <View key={index} style={styles.dotSlot}>
              {done ? (
                <View style={[styles.dotCircle, { backgroundColor: color, borderColor: color }]}>
                  <StepCheckIcon width={11} height={11} />
                </View>
              ) : current ? (
                <View
                  style={[
                    styles.dotCircle,
                    styles.dotCircleCurrent,
                    { borderColor: color, shadowColor: color },
                  ]}
                >
                  <View style={[styles.dotCurrentInner, { backgroundColor: color }]} />
                </View>
              ) : (
                <View style={styles.dotCirclePending}>
                  <View style={styles.dotPendingInner} />
                </View>
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.labelRow}>
        {STEPS.map((label, index) => (
          <View key={label} style={styles.labelSlot}>
            <Text style={[styles.labelText, index >= activeIndex + 1 && styles.labelTextPending]}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 4,
  },
  trackRow: {
    flexDirection: 'row',
    height: 28,
  },
  trackLineBg: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    top: 13,
    height: 2,
    backgroundColor: '#E5E7EB',
  },
  trackLineFill: {
    position: 'absolute',
    left: '10%',
    top: 13,
    height: 2,
  },
  dotSlot: {
    flex: 1,
    alignItems: 'center',
  },
  dotCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCircleCurrent: {
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  dotCurrentInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  dotCirclePending: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPendingInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#D1D5DB',
  },
  labelRow: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  labelSlot: {
    flex: 1,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  labelTextPending: {
    fontWeight: '400',
    color: '#9CA3AF',
  },
});
