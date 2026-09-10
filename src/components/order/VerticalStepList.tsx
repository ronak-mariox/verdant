import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StepCheckIcon } from '../../assets/icons/order';

export interface VerticalStep {
  title: string;
  subtitle: string;
  status: 'done' | 'current' | 'pending';
  badge?: string;
}

interface VerticalStepListProps {
  steps: VerticalStep[];
  accentColor?: string;
}

export function VerticalStepList({ steps, accentColor = '#1CA672' }: VerticalStepListProps) {
  return (
    <View>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <View key={step.title} style={styles.row}>
            <View style={styles.iconCol}>
              {step.status === 'done' ? (
                <View style={[styles.dot, { backgroundColor: accentColor, borderColor: accentColor }]}>
                  <StepCheckIcon width={11} height={11} />
                </View>
              ) : step.status === 'current' ? (
                <View
                  style={[
                    styles.dot,
                    styles.dotCurrent,
                    { borderColor: accentColor, shadowColor: accentColor },
                  ]}
                >
                  <View style={[styles.dotCurrentInner, { backgroundColor: accentColor }]} />
                </View>
              ) : (
                <View style={styles.dotPending}>
                  <View style={styles.dotPendingInner} />
                </View>
              )}
              {!isLast ? (
                <View
                  style={[
                    styles.connector,
                    step.status === 'pending'
                      ? styles.connectorPending
                      : { backgroundColor: accentColor },
                  ]}
                />
              ) : null}
            </View>
            <View style={[styles.textCol, !isLast && styles.textColSpaced]}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.title,
                    step.status === 'pending' && styles.titlePending,
                  ]}
                >
                  {step.title}
                </Text>
                {step.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{step.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.subtitle}>{step.subtitle}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  iconCol: {
    alignItems: 'center',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrent: {
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
  dotPending: {
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
  connector: {
    width: 2,
    flex: 1,
    minHeight: 32,
    backgroundColor: '#1CA672',
    marginVertical: 2,
  },
  connectorPending: {
    backgroundColor: '#E5E7EB',
  },
  textCol: {
    flex: 1,
    paddingTop: 4,
  },
  textColSpaced: {
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  titlePending: {
    fontWeight: '400',
    color: '#9CA3AF',
  },
  subtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  badge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
  },
});
