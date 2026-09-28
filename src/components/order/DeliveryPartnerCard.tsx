import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { CallIcon, ChatIcon, PartnerStarIcon } from '../../assets/icons/order';
import type { RawDriver } from '../../types/api';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function DeliveryPartnerCard({ driver, onChatPress }: { driver: RawDriver; onChatPress?: () => void }) {
  const vehicle = [driver.vehicleType, driver.vehicleNumber].filter(Boolean).join(' · ');
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials(driver.name) || '?'}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{driver.name}</Text>
        <View style={styles.ratingRow}>
          {driver.rating != null ? (
            <>
              <PartnerStarIcon width={11} height={11} />
              <Text style={styles.ratingValue}>{driver.rating.toFixed(1)}</Text>
            </>
          ) : null}
          {vehicle ? <Text style={styles.ratingTrips}>{driver.rating != null ? `· ${vehicle}` : vehicle}</Text> : null}
        </View>
      </View>
      <View style={styles.actions}>
        {driver.phone ? (
          <Pressable style={styles.callButton} onPress={() => Linking.openURL(`tel:${driver.phone}`)} hitSlop={4}>
            <CallIcon width={16} height={16} />
          </Pressable>
        ) : null}
        <Pressable style={styles.chatButton} onPress={onChatPress} hitSlop={4}>
          <ChatIcon width={16} height={16} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 2,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  ratingTrips: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
