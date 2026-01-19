import { useState } from 'react';
import { View, ScrollView, Text, Alert, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { EditProfileModal } from '@/components/settings/EditProfileModal';
import { COLORS } from '@/constants/colors';
import {
  Dumbbell,
  Calendar,
  Bell,
  Moon,
  Vibrate,
  Ruler,
  Heart,
  Shield,
  HelpCircle,
  FileText,
  Mail,
  LogOut,
  Trash2,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { logout } = useAuthStore();
  const { profile, healthMetadata } = useUserStore();
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Preference states (would come from store in production)
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Contact Support',
              'Please email support@femtech.app to delete your account.'
            );
          },
        },
      ]
    );
  };

  const getEquipmentLabel = () => {
    const labels: Record<string, string> = {
      bodyweight: 'Bodyweight',
      home_gym: 'Home Gym',
      full_gym: 'Full Gym',
    };
    return labels[profile?.activityLevel || 'bodyweight'] || 'Not set';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile Card */}
        <ProfileCard onEdit={() => setShowEditProfile(true)} />

        {/* Workout Preferences */}
        <SettingsSection title="Workout Preferences">
          <SettingsRow
            icon={<Dumbbell size={18} color={COLORS.primary[500]} />}
            label="Equipment"
            value={getEquipmentLabel()}
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Calendar size={18} color={COLORS.success} />}
            label="Frequency"
            value="3 days/week"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Heart size={18} color="#ef4444" />}
            label="Include Cardio"
            value="Yes"
            onPress={() => {}}
            showDivider={false}
          />
        </SettingsSection>

        {/* Health Settings */}
        <SettingsSection title="Health">
          <SettingsRow
            icon={<Shield size={18} color="#8b5cf6" />}
            label="Health Screening"
            value={
              healthMetadata?.pelvicRisk || healthMetadata?.boneDensityRisk
                ? 'Modified'
                : 'Standard'
            }
            onPress={() => {}}
          />
          {profile?.demographic === 'reproductive' && (
            <SettingsRow
              icon={<Moon size={18} color="#f59e0b" />}
              label="Cycle Settings"
              value={`${healthMetadata?.avgCycleLength || 28} day cycle`}
              onPress={() => {}}
              showDivider={false}
            />
          )}
        </SettingsSection>

        {/* App Settings */}
        <SettingsSection title="App Settings">
          <SettingsRow
            icon={<Bell size={18} color={COLORS.primary[500]} />}
            label="Workout Reminders"
            isSwitch
            switchValue={remindersEnabled}
            onSwitchChange={setRemindersEnabled}
          />
          <SettingsRow
            icon={<Vibrate size={18} color={COLORS.neutral[500]} />}
            label="Haptic Feedback"
            isSwitch
            switchValue={hapticEnabled}
            onSwitchChange={setHapticEnabled}
          />
          <SettingsRow
            icon={<Ruler size={18} color={COLORS.neutral[500]} />}
            label="Units"
            value="Metric"
            onPress={() => {}}
            showDivider={false}
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support">
          <SettingsRow
            icon={<HelpCircle size={18} color={COLORS.primary[500]} />}
            label="Help Center"
            onPress={() => Linking.openURL('https://femtech.app/help')}
          />
          <SettingsRow
            icon={<Mail size={18} color={COLORS.primary[500]} />}
            label="Contact Us"
            onPress={() => Linking.openURL('mailto:support@femtech.app')}
          />
          <SettingsRow
            icon={<FileText size={18} color={COLORS.neutral[500]} />}
            label="Privacy Policy"
            onPress={() => Linking.openURL('https://femtech.app/privacy')}
          />
          <SettingsRow
            icon={<FileText size={18} color={COLORS.neutral[500]} />}
            label="Terms of Service"
            onPress={() => Linking.openURL('https://femtech.app/terms')}
            showDivider={false}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account">
          <SettingsRow
            icon={<LogOut size={18} color={COLORS.neutral[600]} />}
            label="Sign Out"
            onPress={handleLogout}
          />
          <SettingsRow
            icon={<Trash2 size={18} color="#ef4444" />}
            label="Delete Account"
            onPress={handleDeleteAccount}
            isDestructive
            showDivider={false}
          />
        </SettingsSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>FemTech Fitness</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
  },
  appInfo: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  appName: {
    fontSize: 14,
    color: COLORS.neutral[400],
  },
  appVersion: {
    fontSize: 12,
    color: COLORS.neutral[300],
    marginTop: 4,
  },
});
