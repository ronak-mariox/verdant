import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActionRow, Button, Screen } from '../components';
import {
  ChevronRight,
  HomeIcon,
  LocateIcon,
  MapPinFill,
  OfficeIcon,
  MapPinFillAlt,
  PinOutline,
  SearchIcon,
} from '../assets/icons';
import { PlusAddress } from '../assets/icons/checkout';
import { MapIllustration } from '../assets/images';
import { colors, fontFamily, radius, shadows, spacing, typography } from '../theme';
import type { AuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useCheckout } from '../context/CheckoutContext';
import type { Address } from '../data/checkout';

type Props = NativeStackScreenProps<AuthStackParamList, 'LocationSelection'>;

function addressIcon(type: Address['type']) {
  if (type === 'Home') return <HomeIcon width={19} height={19} />;
  if (type === 'Work') return <OfficeIcon width={20} height={16} />;
  return <MapPinFillAlt width={24} height={24} />;
}

export function LocationSelectionScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const { isAuthenticated } = useAuth();
  const { addressList, isLoadingAddresses, setDefaultAddress } = useCheckout();
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const canConfirm = selected !== null && !confirming;

  const handleConfirm = async () => {
    if (!selected) return;
    if (isAuthenticated && selected !== 'current-location') {
      setConfirming(true);
      try {
        await setDefaultAddress(selected);
        navigation.goBack();
      } finally {
        setConfirming(false);
      }
      return;
    }
    navigation.navigate('Login');
  };

  return (
    <Screen edges={['left', 'right']} scrollable>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerIconBadge}>
            <PinOutline width={20} height={20} />
          </View>
          <View>
            <Text style={styles.headerEyebrow}>DELIVER TO</Text>
            <Text style={styles.headerCaption}>Set your delivery location</Text>
          </View>
        </View>

        <Text style={styles.headerHeading}>Where should we deliver?</Text>
        <Text style={styles.headerSubheading}>
          Get groceries in as little as 10 minutes. Available across 50+ neighbourhoods.
        </Text>

        <View style={styles.searchBox}>
          <SearchIcon width={18} height={18} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search area, street, or landmark…"
            placeholderTextColor={colors.text.onBrandFaint}
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.mapCardWrap}>
        <LinearGradient
          colors={[...colors.gradients.mapCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mapCard}
        >
          <MapIllustration width="100%" height="100%" />
          <View style={styles.marker}>
            <View style={styles.markerPin}>
              <MapPinFill width={16} height={16} />
            </View>
            <View style={styles.markerDot} />
          </View>
          <View style={styles.mapBadge}>
            <Text style={styles.mapBadgeText}>📍 Bengaluru, KA</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.section}>
        <ActionRow
          title="Use current location"
          subtitle="Set your location manually on the map"
          leading={<LocateIcon width={18} height={18} />}
          leadingBackgroundColor={colors.brand.primary}
          trailing={<ChevronRight width={18} height={18} />}
          emphasized={selected === 'current-location'}
          onPress={() => setSelected('current-location')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Saved Places</Text>
        {!isAuthenticated ? (
          <Text style={styles.emptyText}>Log in to see your saved addresses</Text>
        ) : isLoadingAddresses ? (
          <ActivityIndicator color={colors.brand.primary} style={styles.loader} />
        ) : (
          <View style={styles.list}>
            {addressList.map((address) => (
              <ActionRow
                key={address.id}
                title={address.type}
                subtitle={address.line2 || address.line1}
                leading={addressIcon(address.type)}
                emphasized={selected === address.id}
                onPress={() => setSelected(address.id)}
              />
            ))}
            <ActionRow
              title="Add new address"
              leading={<PlusAddress width={16} height={16} />}
              trailing={<ChevronRight width={18} height={18} />}
              onPress={() => navigation.navigate('AddressForm', { mode: 'add' })}
            />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          label="Confirm Location"
          disabled={!canConfirm}
          onPress={handleConfirm}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background.brand,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.xl,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  headerIconBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.overlay.whiteFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEyebrow: {
    ...typography.caption,
    fontFamily: fontFamily.bodyMedium,
    color: colors.text.onBrandFaint,
  },
  headerCaption: {
    ...typography.listTitle,
    color: colors.text.onBrand,
  },
  headerHeading: {
    ...typography.h2,
    color: colors.text.onBrand,
    paddingBottom: spacing.xs,
  },
  headerSubheading: {
    ...typography.bodySmall,
    color: colors.text.onBrandSubtle,
    paddingBottom: spacing.lg,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.overlay.whiteBorder,
    backgroundColor: colors.overlay.whiteFainter,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.text.onBrandFaint,
  },
  mapCardWrap: {
    padding: spacing.xl,
  },
  mapCard: {
    height: 160,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border.green,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  marker: {
    position: 'absolute',
    top: 47,
    left: 163,
    alignItems: 'center',
  },
  markerPin: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
    borderWidth: 4,
    borderColor: colors.background.screen,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
    marginTop: -2,
  },
  mapBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
  },
  mapBadgeText: {
    ...typography.listTitle,
    fontSize: 12,
    color: colors.brand.primary,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    color: colors.text.subtle,
    paddingBottom: spacing.sm,
  },
  list: {
    gap: spacing.xs,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.text.subtle,
  },
  loader: {
    paddingVertical: spacing.md,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
});
