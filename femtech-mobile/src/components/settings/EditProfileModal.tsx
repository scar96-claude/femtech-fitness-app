import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/stores/userStore';
import { COLORS } from '@/constants/colors';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EditProfileModal({ visible, onClose }: EditProfileModalProps) {
  const { profile, updateProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [height, setHeight] = useState(profile?.heightCm?.toString() || '');
  const [weight, setWeight] = useState(profile?.weightKg?.toString() || '');

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        heightCm: parseFloat(height) || undefined,
        weightKg: parseFloat(weight) || undefined,
      });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={COLORS.neutral[500]} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Input
            label="Height (cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="decimal-pad"
            placeholder="165"
          />

          <Input
            label="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder="60"
          />

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              To update your age, health screening answers, or cycle info, please contact support.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isLoading}
            fullWidth
            size="lg"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  infoCard: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
});
