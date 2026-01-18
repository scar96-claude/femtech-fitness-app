import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

export default function SettingsScreen() {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  const menuItems = [
    { icon: User, label: 'Profile', description: 'Edit your personal info' },
    { icon: Bell, label: 'Notifications', description: 'Manage alerts' },
    { icon: Shield, label: 'Privacy', description: 'Data and security' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get help' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Settings</Text>

        <Card variant="elevated" style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconBox}>
                  <item.icon size={20} color={COLORS.primary[500]} />
                </View>
                <View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={COLORS.neutral[400]} />
            </TouchableOpacity>
          ))}
        </Card>

        <Text style={styles.note}>
          Full settings implementation coming in Phase 4e
        </Text>

        <View style={styles.footer}>
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleLogout}
            fullWidth
          />

          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
    marginBottom: 24,
  },
  menuCard: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.neutral[900],
  },
  menuDescription: {
    fontSize: 12,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  note: {
    fontSize: 12,
    color: COLORS.neutral[400],
    textAlign: 'center',
    marginTop: 24,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 16,
  },
  version: {
    fontSize: 12,
    color: COLORS.neutral[400],
    textAlign: 'center',
    marginTop: 16,
  },
});
