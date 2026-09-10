import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthHeader, Button, OtpInputGroup, Screen } from '../components';
import { AlertX, CheckSmall, InfoDot, InfoIcon, MailIcon } from '../assets/icons';
import { colors, fontFamily, radius, spacing, typography } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'>;

const RESEND_SECONDS = 29;
const OTP_LENGTH = 6;

const TROUBLESHOOT_TIPS = [
  'Check if your number is entered correctly',
  'SMS may take up to 2 minutes to arrive',
  'Check your DND settings — delivery may be blocked',
  'Contact support if the issue persists',
];

function maskPhone(phone: string) {
  if (phone.length < 4) return `+91 ${phone}`;
  return `+91 ${phone.slice(0, 2)}******${phone.slice(-2)}`;
}

export function OtpScreen({ navigation, route }: Props) {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'default' | 'error'>('default');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const isComplete = otp.length === OTP_LENGTH;

  const handleVerify = () => {
    if (otp === '000000') {
      setStatus('error');
      return;
    }
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const handleTryAgain = () => {
    setOtp('');
    setStatus('default');
  };

  const handleRequestNewOtp = () => {
    setOtp('');
    setStatus('default');
    setSecondsLeft(RESEND_SECONDS);
  };

  if (status === 'error') {
    return (
      <Screen edges={['left', 'right']} scrollable>
        <AuthHeader
          onBack={() => setStatus('default')}
          backOpacity={0.7}
          icon={<AlertX width={28} height={28} />}
          title="Incorrect OTP"
          subtitle={
            <Text style={styles.headerSubtitle}>
              {`That code doesn't match. ${maskPhone(phoneNumber)} — please check the SMS.`}
            </Text>
          }
        />

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>Enter the correct OTP</Text>
          <View style={styles.otpWrap}>
            <OtpInputGroup value={otp} onChange={setOtp} status="error" autoFocus />
          </View>

          <Button label="Try Again" variant="dangerSoft" onPress={handleTryAgain} style={styles.stackedButton} />
          <Button
            label="Request New OTP"
            variant="soft"
            onPress={handleRequestNewOtp}
            style={styles.stackedButton}
          />
          <Button
            label="Change mobile number"
            variant="neutral"
            onPress={() => navigation.navigate('Login')}
            style={styles.changeNumberButton}
          />

          <View style={styles.troubleshootCard}>
            <Text style={styles.troubleshootTitle}>Didn&apos;t receive the OTP?</Text>
            {TROUBLESHOOT_TIPS.map((tip) => (
              <View key={tip} style={styles.troubleshootRow}>
                <InfoDot width={16} height={16} />
                <Text style={styles.troubleshootText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['left', 'right']} scrollable>
      <AuthHeader
        onBack={() => navigation.goBack()}
        icon={<MailIcon width={28} height={28} />}
        title="Verify your number"
        subtitle={
          <Text style={styles.headerSubtitleNormal}>
            We sent a 6-digit OTP to <Text style={styles.headerSubtitleBold}>{maskPhone(phoneNumber)}</Text>
          </Text>
        }
      />

      <View style={styles.body}>
        <View style={styles.otpWrap}>
          <OtpInputGroup value={otp} onChange={setOtp} autoFocus />
        </View>

        <Text style={styles.hint}>Tip: enter any 6 digits to verify (000000 = error demo)</Text>

        <View style={styles.resendRow}>
          {secondsLeft > 0 ? (
            <View style={styles.resendLeft}>
              <View style={styles.resendIconWrap}>
                <CheckSmall width={14} height={14} />
              </View>
              <Text style={styles.resendText}>
                Resend in <Text style={styles.resendCount}>{secondsLeft}s</Text>
              </Text>
            </View>
          ) : (
            <Text style={styles.resendNow} onPress={handleRequestNewOtp}>
              Resend OTP
            </Text>
          )}
          <Text style={styles.changeNumber} onPress={() => navigation.navigate('Login')}>
            Change number
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${((RESEND_SECONDS - secondsLeft) / RESEND_SECONDS) * 100}%` },
            ]}
          />
        </View>

        <View style={styles.infoBanner}>
          <InfoIcon width={20} height={20} />
          <Text style={styles.infoText}>
            The OTP is valid for 10 minutes. Do not share it with anyone. Verdant never asks for your OTP.
          </Text>
        </View>

        <Button label="Verify & Continue" disabled={!isComplete} onPress={handleVerify} />
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
  headerSubtitleNormal: {
    ...typography.bodySmallBold,
    color: colors.text.onBrandSubtle,
  },
  headerSubtitleBold: {
    fontFamily: fontFamily.bodySemiBold,
    color: colors.text.onBrand,
  },
  body: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.huge,
  },
  otpWrap: {
    paddingBottom: spacing.md,
  },
  hint: {
    ...typography.caption,
    fontFamily: fontFamily.bodyBold,
    color: colors.text.faint,
    paddingBottom: spacing.xl,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xxxl,
  },
  resendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  resendIconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.background.greenTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    ...typography.bodySmallBold,
    color: colors.text.label,
  },
  resendCount: {
    color: colors.brand.primary,
  },
  resendNow: {
    ...typography.bodySmallBold,
    color: colors.status.success,
  },
  changeNumber: {
    ...typography.bodySmallBold,
    color: colors.text.subtle,
    textDecorationLine: 'underline',
  },
  progressTrack: {
    height: 3,
    borderRadius: radius.full,
    backgroundColor: colors.border.light,
    overflow: 'hidden',
    marginBottom: spacing.xxxl,
  },
  progressFill: {
    height: 3,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
  },
  infoBanner: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.background.greenTint,
    borderWidth: 1,
    borderColor: colors.border.greenStrong,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xxxl,
  },
  infoText: {
    flex: 1,
    ...typography.bodySmallBold,
    color: colors.brand.primary,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    color: colors.text.subtle,
    paddingBottom: spacing.md,
  },
  stackedButton: {
    marginBottom: spacing.md,
  },
  changeNumberButton: {
    height: 52,
    marginBottom: spacing.xxxl,
  },
  troubleshootCard: {
    backgroundColor: colors.background.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  troubleshootTitle: {
    ...typography.listTitle,
    color: colors.text.listItem,
    paddingBottom: spacing.sm,
  },
  troubleshootRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
  },
  troubleshootText: {
    flex: 1,
    ...typography.caption,
    color: colors.text.label,
    lineHeight: 19.5,
  },
});
