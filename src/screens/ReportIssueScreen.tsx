import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon } from '../assets/icons/order';
import { besan, fortuneThumb, reorderMilk } from '../assets/images/order';
import { historyOrders, issueTypes } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ReportIssue'>;

const ORDER_THUMBS: Record<string, number> = {
  '#BLK240904-7831': fortuneThumb,
  '#BLK240831-2451': besan,
  '#BLK240828-9123': reorderMilk,
};

export function ReportIssueScreen({ navigation }: Props) {
  const selectableOrders = historyOrders.slice(0, 3);
  const [selectedOrder, setSelectedOrder] = useState(selectableOrders[0].id);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Report an Issue</Text>
            <Text style={styles.headerSubtitle}>Select order and issue type</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View>
            <Text style={styles.sectionLabel}>SELECT ORDER</Text>
            <View style={styles.orderList}>
              {selectableOrders.map((order) => {
                const active = order.id === selectedOrder;
                return (
                  <Pressable
                    key={order.id}
                    style={[styles.orderRow, active && styles.orderRowActive]}
                    onPress={() => setSelectedOrder(order.id)}
                  >
                    <View style={styles.orderThumbWrap}>
                      <Image source={ORDER_THUMBS[order.id]} style={styles.orderThumb} resizeMode="contain" />
                    </View>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderId}>{order.id}</Text>
                      <Text style={styles.orderMeta}>
                        {order.date} · {order.itemCount} items · ₹{order.total}
                      </Text>
                    </View>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active ? <View style={styles.radioDot} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={styles.sectionLabel}>WHAT WENT WRONG?</Text>
            <View style={styles.issueGrid}>
              {issueTypes.map((issue) => {
                const active = issue.id === selectedIssue;
                return (
                  <Pressable
                    key={issue.id}
                    style={[styles.issueTile, active && styles.issueTileActive]}
                    onPress={() => setSelectedIssue(issue.id)}
                  >
                    <Text style={[styles.issueTileText, active && styles.issueTileTextActive]}>{issue.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable
            style={[styles.continueButton, !selectedIssue && styles.continueButtonDisabled]}
            disabled={!selectedIssue}
            onPress={() => selectedIssue && navigation.navigate('IssueDetails', { issueType: selectedIssue })}
          >
            <Text style={styles.continueButtonText}>
              {selectedIssue ? 'Continue' : 'Select an issue to continue'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  headerSafe: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  body: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    paddingBottom: 10,
  },
  orderList: {
    gap: 8,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  orderRowActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#1CA672',
  },
  orderThumbWrap: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orderThumb: {
    width: '80%',
    height: '80%',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  orderMeta: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#1CA672',
    backgroundColor: '#1CA672',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  issueTile: {
    width: '48%',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  issueTileActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#1CA672',
  },
  issueTileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  issueTileTextActive: {
    color: '#1CA672',
  },
  footerSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footer: {
    padding: 16,
  },
  continueButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
