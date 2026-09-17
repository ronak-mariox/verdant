import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { HomePin } from '../../assets/icons/product';
import { featureCod, featureDoorstep, featureNoReturns } from '../../assets/images/product/details';

export interface ProductHighlight {
  label: string;
  value: string;
}

export interface DeliveryAddressSummary {
  label: string;
  text: string;
}

export interface RatingSummary {
  avg: number;
  count: number;
}

const FEATURES = [
  { image: featureDoorstep, label: 'Doorstep\ncancellation' },
  { image: featureNoReturns, label: 'No\nreturns' },
  { image: featureCod, label: 'Cash on\nDelivery' },
];

function ratingQualityLabel(avg: number): string {
  if (avg >= 4.5) return 'Excellent';
  if (avg >= 4) return 'Very Good';
  if (avg >= 3) return 'Good';
  if (avg >= 2) return 'Average';
  return 'Needs Improvement';
}

interface Props {
  highlights: ProductHighlight[];
  address: DeliveryAddressSummary | null;
  rating: RatingSummary;
}

export function ProductDetailsAccordion({ highlights, address, rating }: Props) {
  return (
    <View style={styles.wrap}>
      {highlights.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product highlights</Text>
          <View style={styles.highlightsGrid}>
            {highlights.map((h) => (
              <View key={h.label} style={styles.highlightItem}>
                <Text style={styles.highlightLabel}>{h.label}</Text>
                <Text style={styles.highlightValue}>{h.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery details</Text>
        <View style={styles.deliveryBox}>
          <View style={styles.deliveryAddrRow}>
            <HomePin width={16} height={16} />
            <Text style={styles.deliveryAddrLabel}>{address?.label ?? 'DELIVER TO'}</Text>
            <Text style={styles.deliveryAddrText} numberOfLines={1}>
              {address?.text ?? 'Add a delivery address to see delivery details'}
            </Text>
          </View>
          <View style={styles.deliveryTimeRow}>
            <Text style={styles.deliveryTimeLabel}>Delivery in</Text>
            <Text style={styles.deliveryTimeValue}>10 mins</Text>
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
          {rating.count > 0 ? (
            <View style={styles.ratingsSummary}>
              <Text style={styles.ratingsScore}>{rating.avg.toFixed(1)}</Text>
              <Text style={styles.ratingsGood}>{ratingQualityLabel(rating.avg)}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.ratingsSubtext}>
          {rating.count > 0
            ? `Based on ${rating.count.toLocaleString('en-IN')} rating${rating.count === 1 ? '' : 's'} by Verified Buyers`
            : 'No ratings yet — be the first to receive this product'}
        </Text>
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
