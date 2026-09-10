import React from 'react';
import { Linking, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  IssueBagIcon,
  IssueCallDotIcon,
  IssueChatIcon,
  IssuePhoneIcon,
  IssueWaitDotIcon,
  IssueWarningIcon,
} from '../assets/icons/order';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrderIssue'>;

const TIMELINE = [
  { icon: 'call' as const, title: 'Rajesh tried calling you 3 times', time: '2:24 PM' },
  { icon: 'wait' as const, title: 'Waiting at your building gate', time: '2:26 PM – 2:31 PM' },
  { icon: 'bag' as const, title: 'Order marked as undeliverable', time: '2:32 PM' },
];

export function OrderIssueScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.headerRow}>
            <View style={styles.headerIconWrap}>
              <IssueWarningIcon width={20} height={20} />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Delivery Attempt Failed</Text>
              <Text style={styles.headerSubtitle}>Rajesh was unable to reach you</Text>
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>What happened?</Text>
          <View style={styles.timelineList}>
            {TIMELINE.map((step, index) => (
              <View key={step.title} style={styles.timelineRow}>
                <View style={styles.timelineIconCol}>
                  {step.icon === 'call' ? (
                    <IssueCallDotIcon width={32} height={32} />
                  ) : step.icon === 'wait' ? (
                    <IssueWaitDotIcon width={32} height={32} />
                  ) : (
                    <View style={styles.bagIconWrap}>
                      <IssueBagIcon width={18} height={18} />
                    </View>
                  )}
                  {index < TIMELINE.length - 1 ? <View style={styles.timelineConnector} /> : null}
                </View>
                <View style={styles.timelineTextWrap}>
                  <Text style={styles.timelineTitle}>{step.title}</Text>
                  <Text style={styles.timelineTime}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>
          <View style={styles.actionsList}>
            <Pressable style={styles.redeliverButton} onPress={() => navigation.navigate('OrderTracking')}>
              <Text style={styles.redeliverButtonText}>I&apos;m available now – Redeliver</Text>
            </Pressable>
            <View style={styles.actionsRow}>
              <Pressable style={styles.callPartnerButton} onPress={() => Linking.openURL('tel:+919876500001')}>
                <IssuePhoneIcon width={13} height={13} />
                <Text style={styles.callPartnerText}>Call Partner</Text>
              </Pressable>
              <Pressable style={styles.rescheduleButton} onPress={() => navigation.navigate('DeliveryOptions')}>
                <Text style={styles.rescheduleText}>Reschedule</Text>
              </Pressable>
            </View>
            <Pressable style={styles.cancelRefundButton} onPress={() => navigation.navigate('CancelOrder')}>
              <Text style={styles.cancelRefundText}>Cancel &amp; Refund</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.supportSection}>
          <View style={styles.supportBanner}>
            <IssueChatIcon width={18} height={18} />
            <View style={styles.supportTextWrap}>
              <Text style={styles.supportTitle}>Support is here to help</Text>
              <Text style={styles.supportSubtitle}>Chat with us — we respond in under 2 min</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  headerSafe: {
    backgroundColor: '#FFF1F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FECDD3',
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#991B1B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#EF4444',
    paddingTop: 2,
  },
  timelineSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  timelineList: {
    paddingTop: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineIconCol: {
    alignItems: 'center',
  },
  bagIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    minHeight: 28,
    backgroundColor: '#F0F0F0',
    marginVertical: 2,
  },
  timelineTextWrap: {
    flex: 1,
    paddingBottom: 16,
    paddingTop: 6,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  timelineTime: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
  actionsSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  actionsList: {
    gap: 12,
    paddingTop: 12,
  },
  redeliverButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  redeliverButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  callPartnerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  callPartnerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  rescheduleButton: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  cancelRefundButton: {
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelRefundText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  supportSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  supportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 12,
  },
  supportTextWrap: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  supportSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    paddingTop: 1,
  },
});
