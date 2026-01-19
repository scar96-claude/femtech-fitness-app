import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  content: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
