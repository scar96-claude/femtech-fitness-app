import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface ExitWorkoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ExitWorkoutModal({
  visible,
  onCancel,
  onConfirm,
}: ExitWorkoutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={32} color="#f59e0b" />
          </View>

          <Text style={styles.title}>Exit Workout?</Text>
          <Text style={styles.message}>
            Your progress will be saved, but the workout won't be marked as
            complete.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Keep Going</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 8,
  },
  cancelText: {
    color: COLORS.neutral[700],
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    marginLeft: 8,
  },
  confirmText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
