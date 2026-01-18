import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/onboarding/DatePicker';
import { apiClient } from '@/services/api';
import { COLORS } from '@/constants/colors';

interface LogPeriodModalProps {
  visible: boolean;
  onClose: () => void;
}

export function LogPeriodModal({ visible, onClose }: LogPeriodModalProps) {
  const [date, setDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!date) return;

    setIsLoading(true);
    try {
      await apiClient.logPeriod(date.toISOString());
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to log period:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setDate(new Date());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Log Period Start</Text>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color={COLORS.neutral[500]} />
          </TouchableOpacity>
        </View>

        {success ? (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Check size={40} color="#ffffff" />
            </View>
            <Text style={styles.successTitle}>Period Logged!</Text>
            <Text style={styles.successSubtitle}>
              Your cycle has been updated
            </Text>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.description}>
              When did your period start?
            </Text>

            <DatePicker
              value={date}
              onChange={setDate}
              placeholder="Select date"
              maxDate={new Date()}
            />

            <View style={styles.spacer} />

            <Button
              title="Log Period"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={!date}
              fullWidth
              size="lg"
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#22c55e',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  successSubtitle: {
    color: COLORS.neutral[500],
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  description: {
    color: COLORS.neutral[600],
    marginBottom: 24,
  },
  spacer: {
    flex: 1,
  },
});
