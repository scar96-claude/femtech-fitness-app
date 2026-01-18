import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import * as Haptics from 'expo-haptics';
import { apiClient } from '@/services/api';
import { COLORS } from '@/constants/colors';

interface LogSymptomsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SYMPTOMS = [
  { id: 'energy', label: 'Energy Level', emoji: '⚡' },
  { id: 'mood', label: 'Mood', emoji: '😊' },
  { id: 'bloating', label: 'Bloating', emoji: '🎈' },
  { id: 'cramps', label: 'Cramps', emoji: '😣' },
  { id: 'sleep', label: 'Sleep Quality', emoji: '😴' },
];

export function LogSymptomsModal({ visible, onClose }: LogSymptomsModalProps) {
  const [symptoms, setSymptoms] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRating = (symptomId: string, rating: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSymptoms((prev) => ({ ...prev, [symptomId]: rating }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await apiClient.logSymptoms(symptoms);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSymptoms({});
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to log symptoms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setSymptoms({});
    onClose();
  };

  const allRated = SYMPTOMS.every((s) => symptoms[s.id] !== undefined);

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
          <Text style={styles.headerTitle}>Log Symptoms</Text>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color={COLORS.neutral[500]} />
          </TouchableOpacity>
        </View>

        {success ? (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Check size={40} color="#ffffff" />
            </View>
            <Text style={styles.successTitle}>Symptoms Logged!</Text>
          </View>
        ) : (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.description}>
              How are you feeling today? Rate each from 1 (low) to 5 (high).
            </Text>

            {SYMPTOMS.map((symptom) => (
              <View key={symptom.id} style={styles.symptomSection}>
                <View style={styles.symptomHeader}>
                  <Text style={styles.symptomEmoji}>{symptom.emoji}</Text>
                  <Text style={styles.symptomLabel}>{symptom.label}</Text>
                </View>

                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => handleRating(symptom.id, rating)}
                      style={[
                        styles.ratingButton,
                        symptoms[symptom.id] === rating &&
                          styles.ratingButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.ratingText,
                          symptoms[symptom.id] === rating &&
                            styles.ratingTextActive,
                        ]}
                      >
                        {rating}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            <Button
              title="Save Symptoms"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={!allRated}
              fullWidth
              size="lg"
              style={styles.submitButton}
            />
          </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  description: {
    color: COLORS.neutral[600],
    marginBottom: 24,
  },
  symptomSection: {
    marginBottom: 24,
  },
  symptomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  symptomEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  symptomLabel: {
    color: COLORS.neutral[900],
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
  },
  ratingButton: {
    flex: 1,
    height: 48,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral[100],
  },
  ratingButtonActive: {
    backgroundColor: COLORS.primary[500],
  },
  ratingText: {
    fontWeight: '600',
    color: COLORS.neutral[600],
  },
  ratingTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});
