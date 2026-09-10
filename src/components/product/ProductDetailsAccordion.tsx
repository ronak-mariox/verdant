import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { HomePin, UnlockArrow } from '../../assets/icons/product';
import { couponIcon1, featureCod, featureDoorstep, featureNoReturns } from '../../assets/images/product/details';

const HIGHLIGHTS: { label: string; value: string }[] = [
  { label: 'Pack of', value: '1' },
  { label: 'Brand', value: 'FORTUNE' },
  { label: 'Model Name', value: 'Soya Health Refined' },
  { label: 'Type', value: 'Soyabean Oil' },
  { label: 'Quantity', value: '750 g' },
  { label: 'Used For', value: 'Cooking' },
  { label: 'Processing Type', value: 'Refined' },
  { label: 'FSSAI Number', value: '10013021000661' },
];

const FEATURES = [
  { image: featureDoorstep, label: 'Doorstep\ncancellation' },
  { image: featureNoReturns, label: 'No\nreturns' },
  { image: featureCod, label: 'Cash on\nDelivery' },
];

export function ProductDetailsAccordion() {
  return (
    <View style={styles.wrap}>
      <View style={styles.couponCard}>
        <Text style={styles.couponHeader}>Additional benefits on this purchase</Text>
        <View style={styles.couponRow}>
          <Image source={couponIcon1} style={styles.couponIcon} resizeMode="contain" />
          <Text style={styles.couponText}>Unlock Cosmic Byte coupon • 10% off</Text>
          <UnlockArrow width={24} height={24} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Product highlights</Text>
        <View style={styles.highlightsGrid}>
          {HIGHLIGHTS.map((h) => (
            <View key={h.label} style={styles.highlightItem}>
              <Text style={styles.highlightLabel}>{h.label}</Text>
              <Text style={styles.highlightValue}>{h.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery details</Text>
        <View style={styles.deliveryBox}>
          <View style={styles.deliveryAddrRow}>
            <HomePin width={16} height={16} />
            <Text style={styles.deliveryAddrLabel}>HOME</Text>
            <Text style={styles.deliveryAddrText} numberOfLines={1}>
              I133 Bhima Chowk, Achheja, Royal City Road, Greater Noida
            </Text>
          </View>
          <View style={styles.deliveryTimeRow}>
            <Text style={styles.deliveryTimeLabel}>Delivery in</Text>
            <Text style={styles.deliveryTimeValue}>17 Min</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.featuresRow}>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureItem}>
              <Image source={f.image} style={styles.featureIcon} resizeMode="contain" />
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.ratingsHeader}>
          <Text style={styles.sectionTitle}>Ratings and reviews</Text>
          <View style={styles.ratingsSummary}>
            <Text style={styles.ratingsScore}>4.3</Text>
            <Text style={styles.ratingsGood}>Very Good</Text>
          </View>
        </View>
        <Text style={styles.ratingsSubtext}>based on 15,883 ratings by Verified Buyers</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
    marginTop: 4,
  },
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
  },
  couponHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  couponIcon: {
    width: 16,
    height: 16,
  },
  couponText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333333',
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 12,
  },
  highlightItem: {
    width: '50%',
    paddingBottom: 16,
    paddingRight: 12,
  },
  highlightLabel: {
    fontSize: 12,
    color: '#707070',
  },
  highlightValue: {
    fontSize: 14,
    color: '#333333',
    paddingTop: 2,
  },
  deliveryBox: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  deliveryAddrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DBF9E5',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  deliveryAddrLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  deliveryAddrText: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
  },
  deliveryTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  deliveryTimeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  deliveryTimeValue: {
    fontSize: 11,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#C70255',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  featureItem: {
    alignItems: 'center',
    gap: 6,
  },
  featureIcon: {
    width: 32,
    height: 32,
  },
  featureLabel: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },
  ratingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingsScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1CA672',
  },
  ratingsGood: {
    fontSize: 12,
    color: '#1CA672',
  },
  ratingsSubtext: {
    fontSize: 12,
    color: '#6A7282',
    paddingTop: 4,
  },
});
