import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon } from '../assets/icons/order';
import { LoadErrorView } from '../components/order/LoadErrorView';
import { SUPPORT_EMAIL, issueTypes } from '../data/orders';
import type { AuthStackParamList } from '../navigation/types';
import { api, getErrorMessage } from '../services/api';
import type { RawOrder } from '../types/api';
import { resolveProductImage } from '../utils/productImage';

type Props = NativeStackScreenProps<AuthStackParamList, 'IssueDetails'>;

export function IssueDetailsScreen({ navigation, route }: Props) {
  const { orderId, orderNumber } = route.params;
  const issueType = issueTypes.find((i) => i.id === route.params.issueType) ?? issueTypes[issueTypes.length - 1];
  const [order, setOrder] = useState<RawOrder | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const loadOrder = useCallback(() => {
    setLoadError(null);
    api
      .get<RawOrder>(`/customer/orders/${orderId}`)
      .then(({ data }) => setOrder(data))
      .catch((err) => setLoadError(getErrorMessage(err, 'Could not load this order.')));
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleSubmit = async () => {
    const item = order?.items.find((i) => i.variantId === selectedItemId);
    const subject = `Issue with order ${orderNumber}: ${issueType.title}`;
    const body = [
      `Order: ${orderNumber}`,
      `Issue: ${issueType.title}`,
      item ? `Item: ${item.name} (${item.variantLabel})` : null,
      '',
      description.trim(),
    ]
      .filter((line) => line !== null)
      .join('\n');
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      await Linking.openURL(url);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch {
      Alert.alert('No email app found', `Please email ${SUPPORT_EMAIL} and mention order ${orderNumber}.`);
    }
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon width={17} height={17} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Issue Details</Text>
            <Text style={styles.headerSubtitle}>
              {issueType.title} · {orderNumber}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{issueType.title}</Text>
            </View>
            <Text style={styles.tagFrom}>from order {orderNumber}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Which item was affected?</Text>
            {loadError ? (
              <LoadErrorView message={loadError} onRetry={loadOrder} />
            ) : !order ? (
              <ActivityIndicator color="#1CA672" />
            ) : (
              order.items.map((item, index) => {
                const active = item.variantId === selectedItemId;
                return (
                  <Pressable
                    key={`${item.productId}-${item.variantId}`}
                    style={[styles.itemRow, index === order.items.length - 1 && styles.itemRowLast]}
                    onPress={() => setSelectedItemId(active ? null : item.variantId)}
                  >
                    <View style={styles.itemImageWrap}>
                      <Image source={resolveProductImage(item.imageUrl)} style={styles.itemImage} resizeMode="contain" />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemSubtitle}>
                        {item.variantLabel} · ₹{item.price}
                      </Text>
                    </View>
                    <View style={[styles.checkbox, active && styles.checkboxActive]}>
                      {active ? <View style={styles.checkboxDot} /> : null}
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Describe the issue</Text>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Tell us what happened"
              placeholderTextColor="rgba(26,26,26,0.5)"
              value={description}
              onChangeText={setDescription}
              maxLength={500}
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          <Text style={styles.itemSubtitle}>
            Submitting opens your email app with these details addressed to {SUPPORT_EMAIL}.
          </Text>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Email support</Text>
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
    gap: 12,
    paddingBottom: 32,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagEmoji: {
    fontSize: 18,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
  tagFrom: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemImageWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '80%',
    height: '80%',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    borderColor: '#1CA672',
    backgroundColor: '#1CA672',
  },
  checkboxDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 100,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
    fontSize: 13,
    color: '#1A1A1A',
    textAlignVertical: 'top',
    marginTop: 8,
  },
  charCount: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'right',
    paddingTop: 4,
  },
  photoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionalText: {
    fontWeight: '400',
    color: '#9CA3AF',
  },
  photoUpload: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 24,
    marginTop: 8,
  },
  photoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  photoSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  resolutionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
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
  footerSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footer: {
    padding: 16,
  },
  submitButton: {
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
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
