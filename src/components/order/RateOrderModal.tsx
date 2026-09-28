import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { api, getErrorMessage } from '../../services/api';

interface RateOrderModalProps {
  visible: boolean;
  orderId: string;
  onClose: () => void;
  onRated: (rating: number) => void;
}

export function RateOrderModal({ visible, orderId, onClose, onRated }: RateOrderModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || submitting) return;
    setSubmitting(true);
    try {
      const trimmed = review.trim();
      // Backend is mid-migration from `stars/reviewText` to `rating/review`; both names are accepted.
      await api.post(`/customer/orders/${orderId}/rate`, {
        rating,
        stars: rating,
        ...(trimmed ? { review: trimmed, reviewText: trimmed } : {}),
      });
      onRated(rating);
      setRating(0);
      setReview('');
      onClose();
    } catch (err) {
      Alert.alert('Could not submit rating', getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>Rate your order</Text>
        <Text style={styles.subtitle}>How was everything?</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setRating(star)} hitSlop={6}>
              <Text style={[styles.star, star <= rating && styles.starActive]}>★</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={review}
          onChangeText={setReview}
          placeholder="Anything you'd like to add? (optional)"
          placeholderTextColor="rgba(26,26,26,0.4)"
          multiline
          maxLength={300}
          style={styles.input}
        />
        <Pressable
          style={[styles.submitButton, (rating === 0 || submitting) && styles.submitButtonDisabled]}
          disabled={rating === 0 || submitting}
          onPress={handleSubmit}
        >
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitText}>Submit rating</Text>}
        </Pressable>
        <Pressable style={styles.cancelLink} onPress={onClose} hitSlop={8}>
          <Text style={styles.cancelText}>Not now</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: '25%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    paddingTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  star: {
    fontSize: 36,
    color: '#E5E7EB',
  },
  starActive: {
    color: '#F59E0B',
  },
  input: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1A1A1A',
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelLink: {
    alignItems: 'center',
    paddingTop: 14,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});
