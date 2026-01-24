import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/colors';

interface WeightInputProps {
  previousWeight?: number;
  onWeightChange: (weight: number | null) => void;
}

export function WeightInput({ previousWeight, onWeightChange }: WeightInputProps) {
  const [weight, setWeight] = useState<string>(previousWeight?.toString() || '');
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');

  useEffect(() => {
    const numWeight = parseFloat(weight);
    onWeightChange(isNaN(numWeight) ? null : numWeight);
  }, [weight, onWeightChange]);

  const adjustWeight = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const current = parseFloat(weight) || 0;
    const newWeight = Math.max(0, current + delta);
    setWeight(newWeight.toString());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Weight (optional)</Text>

        {/* Unit Toggle */}
        <View style={styles.unitToggle}>
          <TouchableOpacity
            onPress={() => setUnit('kg')}
            style={[styles.unitButton, unit === 'kg' && styles.unitButtonActive]}
          >
            <Text
              style={[
                styles.unitText,
                unit === 'kg' && styles.unitTextActive,
              ]}
            >
              kg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUnit('lb')}
            style={[styles.unitButton, unit === 'lb' && styles.unitButtonActive]}
          >
            <Text
              style={[
                styles.unitText,
                unit === 'lb' && styles.unitTextActive,
              ]}
            >
              lb
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputRow}>
        {/* Decrease Button */}
        <TouchableOpacity
          onPress={() => adjustWeight(unit === 'kg' ? -2.5 : -5)}
          style={styles.adjustButton}
        >
          <Minus size={24} color={COLORS.neutral[600]} />
        </TouchableOpacity>

        {/* Weight Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={COLORS.neutral[400]}
            style={styles.input}
          />
        </View>

        {/* Increase Button */}
        <TouchableOpacity
          onPress={() => adjustWeight(unit === 'kg' ? 2.5 : 5)}
          style={styles.adjustButton}
        >
          <Plus size={24} color={COLORS.neutral[600]} />
        </TouchableOpacity>
      </View>

      {/* Previous Weight Hint */}
      {previousWeight && (
        <TouchableOpacity
          onPress={() => setWeight(previousWeight.toString())}
          style={styles.hintButton}
        >
          <Text style={styles.hintText}>
            Last time: {previousWeight} {unit} (tap to use)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: COLORS.neutral[500],
    fontWeight: '500',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
    padding: 4,
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unitButtonActive: {
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  unitText: {
    color: COLORS.neutral[500],
  },
  unitTextActive: {
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustButton: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
  },
  hintButton: {
    marginTop: 8,
  },
  hintText: {
    color: COLORS.primary[500],
    textAlign: 'center',
  },
});
