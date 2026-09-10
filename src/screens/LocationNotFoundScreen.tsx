import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActionRow, AuthHeader, Screen } from '../components';
import { ChevronRight, ChevronRightGray, EditPencil, MapPinOff, SearchLocationIcon } from '../assets/icons';
import { notFoundIllustration } from '../assets/images';
import { colors, fontFamily, radius, spacing, typography } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'LocationNotFound'>;

const CITIES = ['Mysuru', 'Pune', 'Hyderabad', 'Chennai', 'Ahmedabad'];

export function LocationNotFoundScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');

  return (
    <Screen edges={['left', 'right']} scrollable>
      <AuthHeader
        onBack={() => navigation.goBack()}
        backOpacity={0.6}
        iconBackgroundColor="rgba(255,255,255,0.1)"
        icon={<MapPinOff width={28} height={28} />}
        title="Not in our zone yet"
        subtitle={
          <Text style={styles.headerSubtitle}>
            Verdant doesn&apos;t deliver to your area right now. We&apos;re expanding fast — you could be
            next.
          </Text>
        }
      />

      <View style={styles.illustrationWrap}>
        <LinearGradient
          colors={[...colors.gradients.notFoundMap]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.illustrationCard}
        >
          <Image source={notFoundIllustration} style={styles.illustrationImage} resizeMode="contain" />
          <View style={styles.illustrationBadge}>
            <Text style={styles.illustrationBadgeText}>📍 Outside coverage area</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.actions}>
        <ActionRow
          title="Try a different location"
          subtitle="Search for a nearby serviceable address"
          leading={<SearchLocationIcon width={20} height={20} />}
          leadingBackgroundColor={colors.brand.primary}
          trailing={<ChevronRight width={18} height={18} />}
          emphasized
          height={68}
          onPress={() => navigation.navigate('LocationSelection')}
        />
        <ActionRow
          title="Enter address manually"
          subtitle="Type your pincode or full address"
          leading={<EditPencil width={20} height={20} />}
          leadingBackgroundColor={colors.background.surfaceMuted}
          trailing={<ChevronRightGray width={18} height={18} />}
          height={68}
          onPress={() => navigation.navigate('LocationPermission', { initialTab: 'manual' })}
        />
      </View>

      <View style={styles.citiesSection}>
        <Text style={styles.sectionLabel}>Launching soon in</Text>
        <View style={styles.cityChips}>
          {CITIES.map((city) => (
            <View key={city} style={styles.cityChip}>
              <Text style={styles.cityChipText}>{city}</Text>
            </View>
          ))}
          <View style={styles.cityChipMore}>
            <Text style={styles.cityChipMoreText}>+ 12 more</Text>
          </View>
        </View>
      </View>

      <View style={styles.earlyAccessWrap}>
        <LinearGradient
          colors={[...colors.gradients.earlyAccess]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.earlyAccessCard}
        >
          <Text style={styles.earlyAccessTitle}>Want early access?</Text>
          <Text style={styles.earlyAccessSubtitle}>
            Drop your email and we&apos;ll notify you the moment Verdant reaches your area.
          </Text>
          <View style={styles.emailRow}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={colors.text.faint}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.emailInput}
            />
            <Pressable
              style={styles.notifyButton}
              onPress={() => Alert.alert('Thanks!', "We'll email you when Verdant reaches your area.")}
            >
              <Text style={styles.notifyButtonText}>Notify Me</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.text.onBrand,
    textAlign: 'center',
  },
  illustrationWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
  },
  illustrationCard: {
    height: 200,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  illustrationBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
  },
  illustrationBadgeText: {
    ...typography.listTitle,
    fontSize: 12,
    color: colors.status.amberStrong,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  citiesSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    color: colors.text.subtle,
    paddingBottom: spacing.md,
  },
  cityChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  cityChip: {
    backgroundColor: colors.background.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  cityChipText: {
    ...typography.bodySmall,
    fontFamily: fontFamily.headingMedium,
    color: colors.text.chip,
  },
  cityChipMore: {
    backgroundColor: colors.background.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    borderStyle: 'dashed',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  cityChipMoreText: {
    ...typography.bodySmall,
    fontFamily: fontFamily.headingMedium,
    color: colors.text.subtle,
  },
  earlyAccessWrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
  },
  earlyAccessCard: {
    borderWidth: 1,
    borderColor: colors.border.greenStrong,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  earlyAccessTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.brand.primary,
  },
  earlyAccessSubtitle: {
    ...typography.bodySmall,
    color: colors.brand.primary,
    paddingTop: spacing.xxs,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 51,
    borderWidth: 1.5,
    borderColor: colors.border.green,
    backgroundColor: colors.background.screen,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  emailInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.md,
    ...typography.bodySmall,
    color: colors.text.input,
  },
  notifyButton: {
    height: '100%',
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  notifyButtonText: {
    ...typography.buttonMedium,
    fontSize: 14,
    color: colors.text.onBrand,
  },
});
