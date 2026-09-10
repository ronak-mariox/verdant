import React from 'react';
import { Image, Linking, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon, ChatIcon, ChevronRightSmallIcon, SearchIcon } from '../assets/icons/order';
import { issueGrid } from '../assets/images/order';
import { supportFaqs } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'SupportHome'>;

export function SupportHomeScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <Text style={styles.headerTitle}>Help &amp; Support</Text>
        </View>
        <View style={styles.searchBar}>
          <SearchIcon width={15} height={15} />
          <Text style={styles.searchPlaceholder}>Search for help topics…</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View>
            <Text style={styles.sectionTitle}>What&apos;s the issue?</Text>
            <Pressable onPress={() => navigation.navigate('ReportIssue')}>
              <Image source={issueGrid} style={styles.issueGridImage} resizeMode="contain" />
            </Pressable>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Frequently asked</Text>
            <View style={styles.faqCard}>
              {supportFaqs.map((faq, index) => (
                <Pressable
                  key={faq}
                  style={[styles.faqRow, index === supportFaqs.length - 1 && styles.faqRowLast]}
                  onPress={() => navigation.navigate('ReportIssue')}
                >
                  <Text style={styles.faqText}>{faq}</Text>
                  <ChevronRightSmallIcon width={16} height={16} />
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Contact us</Text>
            <View style={styles.contactList}>
              <Pressable style={styles.contactCardGreen} onPress={() => navigation.navigate('ReportIssue')}>
                <ChatIcon width={24} height={24} />
                <View style={styles.contactTextWrap}>
                  <Text style={styles.contactTitle}>Chat with us</Text>
                  <Text style={styles.contactSubtitle}>Typically replies in &lt; 2 min</Text>
                </View>
                <Text style={styles.contactLinkGreen}>Start chat</Text>
              </Pressable>
              <Pressable style={styles.contactCardBlue} onPress={() => Linking.openURL('tel:18001234567')}>
                <Text style={styles.contactEmoji}>📞</Text>
                <View style={styles.contactTextWrap}>
                  <Text style={styles.contactTitle}>Call us</Text>
                  <Text style={styles.contactSubtitle}>Available 24×7 · 1800-123-4567</Text>
                </View>
                <Text style={styles.contactLinkBlue}>Call now</Text>
              </Pressable>
              <Pressable style={styles.contactCardPurple} onPress={() => Linking.openURL('mailto:support@verdant.app')}>
                <Text style={styles.contactEmoji}>✉️</Text>
                <View style={styles.contactTextWrap}>
                  <Text style={styles.contactTitle}>Email support</Text>
                  <Text style={styles.contactSubtitle}>Response within 24 hours</Text>
                </View>
                <Text style={styles.contactLinkPurple}>Send email</Text>
              </Pressable>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 44,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: 'rgba(26,26,26,0.5)',
  },
  body: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingBottom: 10,
  },
  issueGridImage: {
    width: '100%',
    height: 168,
    borderRadius: 16,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  faqRowLast: {
    borderBottomWidth: 0,
  },
  faqText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  contactList: {
    gap: 8,
  },
  contactCardGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 24,
    padding: 14,
  },
  contactCardBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 24,
    padding: 14,
  },
  contactCardPurple: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FDF4FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 24,
    padding: 14,
  },
  contactEmoji: {
    fontSize: 22,
    width: 24,
    textAlign: 'center',
  },
  contactTextWrap: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  contactSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    paddingTop: 1,
  },
  contactLinkGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1CA672',
  },
  contactLinkBlue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
  contactLinkPurple: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
});
