import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Screen, SegmentedTabs, TextField } from '../components';
import { EtaClock, GpsCrosshair, ShieldLock, StoreCheck } from '../assets/icons';
import { colors, radius, shadows, spacing, typography } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'LocationPermission'>;

type Tab = 'auto' | 'manual';

const BENEFITS = [
  {
    icon: <StoreCheck width={24} height={24} />,
    title: 'Nearest store',
    subtitle: 'Connects you to the closest fulfillment hub',
  },
  {
    icon: <EtaClock width={24} height={24} />,
    title: 'Real-time ETA',
    subtitle: 'Precise delivery estimates, updated live',
  },
  {
    icon: <ShieldLock width={24} height={24} />,
    title: 'Private & secure',
    subtitle: 'Location data never stored or shared',
  },
];

export function LocationPermissionScreen({ navigation, route }: Props) {
  const [tab, setTab] = useState<Tab>(route.params?.initialTab ?? 'auto');
  const [form, setForm] = useState({ flat: '', street: '', city: '', pincode: '', landmark: '' });

  const canSave = form.flat.trim() && form.street.trim() && form.city.trim() && form.pincode.trim().length === 6;

  const handleSave = () => {
    if (form.pincode.trim() === '000000') {
      navigation.navigate('LocationNotFound');
      return;
    }
    navigation.navigate('LocationSelection');
  };

  return (
    <Screen scrollable>
      <View style={styles.tabsWrap}>
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          options={[
            { value: 'auto', label: 'Auto Detect' },
            { value: 'manual', label: 'Enter Manually' },
          ]}
        />
      </View>

      {tab === 'auto' ? (
        <View style={styles.autoContent}>
          <LinearGradient
            colors={[...colors.gradients.permissionOrb]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.orbWrap}
          >
            <View style={styles.ring1}>
              <View style={styles.ring2}>
                <View style={styles.ring3}>
                  <View style={styles.ring4}>
                    <View style={styles.pinCircle}>
                      <GpsCrosshair width={30} height={30} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.badge, styles.badgeTopRight]}>
              <Text style={styles.badgeText}>📍 GPS Active</Text>
            </View>
            <View style={[styles.badge, styles.badgeBottomLeft]}>
              <Text style={styles.badgeTextDark}>10 min delivery</Text>
            </View>
          </LinearGradient>

          <Text style={styles.autoHeading}>Enable Location Access</Text>
          <Text style={styles.subheading}>
            We use your location to find the nearest dark store and estimate your delivery time accurately.
          </Text>

          <View style={styles.benefitsList}>
            {BENEFITS.map((benefit) => (
              <View key={benefit.title} style={styles.benefitRow}>
                {benefit.icon}
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitSubtitle}>{benefit.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <Button
              label="Allow Location Access"
              variant="primary"
              onPress={() => navigation.navigate('LocationSelection')}
            />
            <Button
              label="Enter address manually"
              variant="soft"
              style={styles.secondaryAction}
              onPress={() => setTab('manual')}
            />
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.manualHeadingWrap}>
            <Text style={styles.manualHeading}>Enter your address</Text>
            <Text style={styles.manualSubheading}>We&apos;ll find the nearest Verdant store for you.</Text>
          </View>

          <View style={styles.manualContent}>
            <View style={styles.form}>
              <TextField
                label="Flat / House No."
                placeholder="e.g. 12B, Sunrise Apartments"
                value={form.flat}
                onChangeText={(flat) => setForm((f) => ({ ...f, flat }))}
              />
              <TextField
                label="Street / Area"
                placeholder="e.g. MG Road, Indiranagar"
                value={form.street}
                onChangeText={(street) => setForm((f) => ({ ...f, street }))}
              />
              <TextField
                label="City"
                placeholder="e.g. Bengaluru"
                value={form.city}
                onChangeText={(city) => setForm((f) => ({ ...f, city }))}
              />
              <TextField
                label="Pincode"
                placeholder="e.g. 560038"
                keyboardType="number-pad"
                maxLength={6}
                value={form.pincode}
                onChangeText={(pincode) => setForm((f) => ({ ...f, pincode: pincode.replace(/[^0-9]/g, '') }))}
              />
              <TextField
                label="Landmark (optional)"
                placeholder="e.g. Near Apollo Hospital"
                value={form.landmark}
                onChangeText={(landmark) => setForm((f) => ({ ...f, landmark }))}
              />
            </View>

            <Button label="Save & Continue" disabled={!canSave} onPress={handleSave} style={styles.saveButton} />
          </View>
        </View>
      )}
    </Screen>
  );
}

const RING_1 = 200;
const RING_2 = 160;
const RING_3 = 120;
const RING_4 = 80;

const styles = StyleSheet.create({
  tabsWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.xxxl,
  },
  autoContent: {
    paddingHorizontal: spacing.xl,
  },
  orbWrap: {
    height: 240,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 260,
    marginBottom: spacing.huge,
  },
  ring1: {
    width: RING_1,
    height: RING_1,
    borderRadius: RING_1 / 2,
    borderWidth: 1,
    borderColor: 'rgba(52,195,99,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring2: {
    width: RING_2,
    height: RING_2,
    borderRadius: RING_2 / 2,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring3: {
    width: RING_3,
    height: RING_3,
    borderRadius: RING_3 / 2,
    borderWidth: 1,
    borderColor: 'rgba(52,195,99,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring4: {
    width: RING_4,
    height: RING_4,
    borderRadius: RING_4 / 2,
    borderWidth: 1,
    borderColor: 'rgba(52,52,195,0.39)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  badge: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    ...shadows.small,
  },
  badgeTopRight: {
    top: 16,
    right: 16,
  },
  badgeBottomLeft: {
    bottom: 16,
    left: 4,
  },
  badgeText: {
    ...typography.listTitle,
    fontSize: 12,
    color: colors.brand.primary,
  },
  badgeTextDark: {
    ...typography.listTitle,
    fontSize: 12,
    color: colors.text.listItem,
  },
  autoHeading: {
    ...typography.h2,
    color: colors.text.heading,
    textAlign: 'center',
  },
  subheading: {
    ...typography.body,
    color: colors.text.label,
    textAlign: 'center',
    paddingTop: spacing.sm,
  },
  manualHeading: {
    ...typography.h2,
    color: colors.text.heading,
  },
  benefitsList: {
    paddingTop: spacing.xxxl,
    gap: spacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    ...typography.listTitle,
    color: colors.text.heading,
  },
  benefitSubtitle: {
    ...typography.caption,
    color: colors.text.subtle,
    marginTop: 2,
  },
  actions: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  secondaryAction: {
    height: 52,
  },
  manualHeadingWrap: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },
  manualContent: {
    paddingHorizontal: spacing.xl,
  },
  manualSubheading: {
    ...typography.bodySmall,
    color: colors.text.subtle,
    paddingTop: spacing.xs,
  },
  form: {
    gap: spacing.md,
  },
  saveButton: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.xl,
  },
});
