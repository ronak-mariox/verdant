import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActionRow, Button, Screen } from '../components';
import {
  ChevronRight,
  ChevronRightSmall,
  ClockIcon,
  HomeIcon,
  LocateIcon,
  MapPinFill,
  OfficeIcon,
  MapPinFillAlt,
  PinOutline,
  SearchIcon,
} from '../assets/icons';
import { MapIllustration } from '../assets/images';
import { colors, fontFamily, radius, shadows, spacing, typography } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'LocationSelection'>;

const SAVED_PLACES = [
  { id: 'home', title: 'Home', subtitle: '12, Elm Street, Sector 4, Bengaluru', icon: <HomeIcon width={19} height={19} /> },
  { id: 'office', title: 'Office', subtitle: 'WeWork Galaxy, MG Road, Bengaluru', icon: <OfficeIcon width={20} height={16} /> },
  { id: 'koramangala', title: 'Koramangala', subtitle: '5th Block, Koramangala, Bengaluru', icon: <MapPinFillAlt width={24} height={24} /> },
];

const RECENT_SEARCHES = [
  'Indiranagar 100ft Road, Bengaluru',
  'HSR Layout Sector 2, Bengaluru',
  'Jayanagar 4th Block, Bengaluru',
];

export function LocationSelectionScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const canConfirm = selected !== null;

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
          subtitle="Enable GPS for automatic detection"
          leading={<LocateIcon width={18} height={18} />}
          leadingBackgroundColor={colors.brand.primary}
          trailing={<ChevronRight width={18} height={18} />}
          emphasized={selected === 'current-location'}
          onPress={() => setSelected('current-location')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Saved Places</Text>
        <View style={styles.list}>
          {SAVED_PLACES.map((place) => (
            <ActionRow
              key={place.id}
              title={place.title}
              subtitle={place.subtitle}
              leading={place.icon}
              emphasized={selected === place.id}
              onPress={() => setSelected(place.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Recent Searches</Text>
        <View style={styles.recentList}>
          {RECENT_SEARCHES.map((item) => (
            <View key={item} style={styles.recentRow}>
              <View style={styles.recentIconWrap}>
                <ClockIcon width={16} height={16} />
              </View>
              <Text style={styles.recentText} numberOfLines={1}>
                {item}
              </Text>
              <ChevronRightSmall width={16} height={16} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Confirm Location"
          disabled={!canConfirm}
          onPress={() => navigation.navigate('Login')}
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
  recentList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.light,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },
  recentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.background.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentText: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.text.listItem,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
});
