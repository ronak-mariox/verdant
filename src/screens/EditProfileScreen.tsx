import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackIcon } from '../assets/icons/order';
import { EditProfilePencilIcon } from '../assets/icons/profile';
import { avatar } from '../assets/images/profile';
import { userProfile } from '../data/profile';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'EditProfile'>;

const GENDERS: Array<'Female' | 'Male' | 'Other'> = ['Female', 'Male', 'Other'];

export function EditProfileScreen({ navigation }: Props) {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone.replace('+91 ', ''));
  const [dob, setDob] = useState(userProfile.dob);
  const [gender, setGender] = useState(userProfile.gender);

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
            <View style={styles.avatarWrap}>
              <Image source={avatar} style={styles.avatarImage} />
              <View style={styles.editBadge}>
                <EditProfilePencilIcon width={11} height={11} />
              </View>
            </View>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </View>

          <View style={styles.card}>
            <Field label="FULL NAME" value={name} onChangeText={setName} />
            <Field label="EMAIL ADDRESS" value={email} onChangeText={setEmail} keyboardType="email-address" />

            <View style={styles.field}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <View style={styles.phoneRow}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixFlag}>🇮🇳</Text>
                  <Text style={styles.phonePrefixText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={(t) => setPhone(t.replace(/[^0-9 ]/g, ''))}
                  keyboardType="number-pad"
                  maxLength={11}
                />
              </View>
              <Text style={styles.helperText}>OTP will be sent to verify number changes</Text>
            </View>

            <Field label="DATE OF BIRTH" value={dob} onChangeText={setDob} />

            <View style={styles.field}>
              <Text style={styles.label}>GENDER</Text>
              <View style={styles.genderRow}>
                {GENDERS.map((option) => {
                  const active = option === gender;
                  return (
                    <Pressable
                      key={option}
                      style={[styles.genderChip, active && styles.genderChipActive]}
                      onPress={() => setGender(option)}
                    >
                      <Text style={[styles.genderChipText, active && styles.genderChipTextActive]}>{option}</Text>
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
          <Pressable style={styles.saveButton} onPress={() => navigation.goBack()}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'email-address';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} keyboardType={keyboardType} />
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
  changePhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
    paddingTop: 8,
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
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
