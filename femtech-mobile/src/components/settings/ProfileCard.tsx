import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User, Edit2 } from 'lucide-react-native';
import { useUserStore } from '@/stores/userStore';
import { COLORS } from '@/constants/colors';

interface ProfileCardProps {
  onEdit: () => void;
}

export function ProfileCard({ onEdit }: ProfileCardProps) {
  const { profile } = useUserStore();

  const getAge = () => {
    if (!profile?.dateOfBirth) return null;
    const birth = new Date(profile.dateOfBirth);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  };

  const age = getAge();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <User size={32} color={COLORS.primary[500]} />
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>
              {profile?.email?.split('@')[0] || 'User'}
            </Text>
            <Text style={styles.email}>
              {profile?.email}
            </Text>
            <View style={styles.badges}>
              {age && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{age} years</Text>
                </View>
              )}
              <View style={styles.badgePrimary}>
                <Text style={styles.badgePrimaryText}>
                  {profile?.demographic || 'reproductive'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={onEdit}
            style={styles.editButton}
          >
            <Edit2 size={18} color={COLORS.neutral[600]} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  email: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    marginTop: 8,
  },
  badge: {
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.neutral[600],
  },
  badgePrimary: {
    backgroundColor: COLORS.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePrimaryText: {
    fontSize: 12,
    color: COLORS.primary[700],
    textTransform: 'capitalize',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
