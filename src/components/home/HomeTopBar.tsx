import React from 'react';
import { Image, type ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BellIcon,
  ChevronDownSmall,
  MicIcon,
  PinSmall,
  SearchIconHome,
} from '../../assets/icons/homescreen';
import { avatar as defaultAvatar } from '../../assets/images/home';

interface HomeTopBarProps {
  location: string;
  avatarSource?: ImageSourcePropType;
  hasUnreadNotifications?: boolean;
  onLocationPress?: () => void;
  onNotificationsPress?: () => void;
  onAvatarPress?: () => void;
  onSearchPress?: () => void;
}

export function HomeTopBar({
  location,
  avatarSource,
  hasUnreadNotifications,
  onLocationPress,
  onNotificationsPress,
  onAvatarPress,
  onSearchPress,
}: HomeTopBarProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.greetingCol}>
          <View style={styles.etaRow}>
            <Text style={styles.eta}>9 mins</Text>
            <View style={styles.expressBadge}>
              <Text style={styles.expressText}>Express</Text>
            </View>
          </View>
          <Pressable style={styles.locationRow} onPress={onLocationPress}>
            <PinSmall width={12} height={12} />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
            <ChevronDownSmall width={12} height={12} />
          </Pressable>
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.iconButton} onPress={onNotificationsPress}>
            <BellIcon width={18} height={18} />
            {hasUnreadNotifications ? <View style={styles.notifDot} /> : null}
          </Pressable>
          <Pressable onPress={onAvatarPress}>
            <Image source={avatarSource ?? defaultAvatar} style={styles.avatar} />
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.searchBox} onPress={onSearchPress}>
        <SearchIconHome width={18} height={18} />
        <Text style={styles.searchPlaceholder}>Search atta, dal & more</Text>
        <MicIcon width={18} height={18} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1CA672',
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingRight: 12,
  },
  greetingCol: {
    flex: 1,
    minWidth: 0,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
  },
  eta: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  expressBadge: {
    backgroundColor: 'rgba(52,195,99,0.25)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  expressText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EBFFF2',
    maxWidth: 220,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: -1,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#1CA672',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#99A1AF',
  },
});
