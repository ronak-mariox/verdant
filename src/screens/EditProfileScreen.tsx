import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary, type Asset } from 'react-native-image-picker';
import { BackIcon } from '../assets/icons/order';
import { EditProfilePencilIcon } from '../assets/icons/profile';
import { avatar as defaultAvatar } from '../assets/images/profile';
import type { AuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { api, API_ORIGIN, getErrorMessage, getFieldErrors } from '../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'EditProfile'>;

type GenderValue = 'female' | 'male' | 'other';

const GENDER_OPTIONS: Array<{ label: string; value: GenderValue }> = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Other', value: 'other' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DEFAULT_DOB = new Date(2000, 0, 1);

function parseIsoDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return null;
  const [, y, m, d] = match;
  return new Date(Number(y), Number(m) - 1, Number(d));
}

function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function isGenderValue(value: string | null | undefined): value is GenderValue {
  return value === 'female' || value === 'male' || value === 'other';
}

export function EditProfileScreen({ navigation }: Props) {
  const { user, updateProfile, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [dob, setDob] = useState<Date | null>(parseIsoDate(user?.dob));
  const [gender, setGender] = useState<GenderValue | null>(isGenderValue(user?.gender) ? user!.gender as GenderValue : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const phoneDisplay = user?.phone ?? '';
  const avatarSource = useMemo(
    () => (user?.avatarUrl ? { uri: `${API_ORIGIN}${user.avatarUrl}` } : defaultAvatar),
    [user?.avatarUrl],
  );

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'dismissed') {
      return;
    }
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const uploadAvatar = async (asset: Asset) => {
    if (!asset.uri) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: asset.uri,
        name: asset.fileName ?? `avatar-${Date.now()}.jpg`,
        type: asset.type ?? 'image/jpeg',
      } as unknown as Blob);

      await api.post('/customer/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await refreshUser();
    } catch (err) {
      Alert.alert('Upload failed', getErrorMessage(err, 'Could not upload photo. Please try again.'));
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleChangePhoto = () => {
    if (avatarUploading) return;
    Alert.alert('Change photo', 'Choose a source', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const result = await launchCamera({ mediaType: 'photo', quality: 0.8, includeBase64: false });
          const asset = result.assets?.[0];
          if (asset) await uploadAvatar(asset);
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8, includeBase64: false });
          const asset = result.assets?.[0];
          if (asset) await uploadAvatar(asset);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setErrorMessage(null);
    setFieldErrors({});
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        ...(dob ? { dob: formatIsoDate(dob) } : {}),
        ...(gender ? { gender } : {}),
      });
      navigation.goBack();
    } catch (err) {
      const fields = getFieldErrors(err);
      if (fields) {
        setFieldErrors(fields);
      }
      setErrorMessage(getErrorMessage(err, 'Could not save changes. Please try again.'));
    } finally {
      setSaving(false);
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
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <Text style={styles.headerSubtitle}>Update your personal information</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.avatarSection}>
            <Pressable style={styles.avatarWrap} onPress={handleChangePhoto} disabled={avatarUploading}>
              <Image source={avatarSource} style={styles.avatarImage} />
              <View style={styles.editBadge}>
                <EditProfilePencilIcon width={11} height={11} />
              </View>
              {avatarUploading ? (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              ) : null}
            </Pressable>
            <Pressable onPress={handleChangePhoto} disabled={avatarUploading} hitSlop={8}>
              <Text style={styles.changePhotoText}>{avatarUploading ? 'Uploading…' : 'Change photo'}</Text>
            </Pressable>
          </View>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <Field label="FULL NAME" value={name} onChangeText={setName} error={fieldErrors.name} />
            <Field
              label="EMAIL ADDRESS"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={fieldErrors.email}
            />

            <View style={styles.field}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <View style={styles.phoneRow}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixFlag}>🇮🇳</Text>
                  <Text style={styles.phonePrefixText}>+91</Text>
                </View>
                <View style={[styles.phoneInput, styles.phoneInputReadonly]}>
                  <Text style={styles.phoneInputText}>{phoneDisplay}</Text>
                </View>
              </View>
              <Text style={styles.helperText}>Contact support to change your registered number</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>DATE OF BIRTH</Text>
              <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text style={dob ? styles.dateValueText : styles.dateValuePlaceholder}>
                  {dob ? formatDisplayDate(dob) : 'Select date of birth'}
                </Text>
              </Pressable>
              {fieldErrors.dob ? <Text style={styles.fieldErrorText}>{fieldErrors.dob}</Text> : null}
              {showDatePicker ? (
                <View style={styles.datePickerWrap}>
                  <DateTimePicker
                    value={dob ?? DEFAULT_DOB}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                  />
                  {Platform.OS === 'ios' ? (
                    <Pressable style={styles.dateDoneButton} onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.dateDoneText}>Done</Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>GENDER</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((option) => {
                  const active = option.value === gender;
                  return (
                    <Pressable
                      key={option.value}
                      style={[styles.genderChip, active && styles.genderChipActive]}
                      onPress={() => setGender(option.value)}
                    >
                      <Text style={[styles.genderChipText, active && styles.genderChipTextActive]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <Pressable
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'email-address';
  error?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} keyboardType={keyboardType} />
      {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
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
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  avatarWrap: {
    width: 76,
    height: 76,
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1CA672',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 38,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
    paddingTop: 8,
  },
  errorBanner: {
    marginTop: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
  },
  errorBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  fieldErrorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
    paddingTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 24,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  field: {
    paddingTop: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    paddingBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1A1A1A',
    justifyContent: 'center',
  },
  dateValueText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  dateValuePlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  datePickerWrap: {
    marginTop: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  dateDoneButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  dateDoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1CA672',
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  phonePrefixFlag: {
    fontSize: 14,
  },
  phonePrefixText: {
    fontSize: 14,
    color: '#374151',
  },
  phoneInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1A1A1A',
  },
  phoneInputReadonly: {
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  phoneInputText: {
    fontSize: 14,
    color: '#6B7280',
  },
  helperText: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 4,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderChip: {
    flex: 1,
    height: 42,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#1CA672',
  },
  genderChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  genderChipTextActive: {
    fontWeight: '700',
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
  saveButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1CA672',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
