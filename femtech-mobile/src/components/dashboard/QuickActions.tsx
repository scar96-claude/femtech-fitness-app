import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Droplet, Moon, Zap, Brain } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/colors';

interface QuickActionsProps {
  isReproductive: boolean;
  onLogPeriod?: () => void;
  onLogSleep?: () => void;
  onLogEnergy?: () => void;
  onLogSymptoms?: () => void;
}

export function QuickActions({
  isReproductive,
  onLogPeriod,
  onLogSleep,
  onLogEnergy,
  onLogSymptoms,
}: QuickActionsProps) {
  const handlePress = (action: (() => void) | undefined) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action?.();
  };

  const reproductiveActions = [
    {
      label: 'Log Period',
      icon: <Droplet size={22} color="#ef4444" />,
      onPress: onLogPeriod,
      backgroundColor: '#fee2e2',
    },
    {
      label: 'Symptoms',
      icon: <Brain size={22} color="#8b5cf6" />,
      onPress: onLogSymptoms,
      backgroundColor: '#f3e8ff',
    },
  ];

  const perimenopauseActions = [
    {
      label: 'Log Sleep',
      icon: <Moon size={22} color="#6366f1" />,
      onPress: onLogSleep,
      backgroundColor: '#e0e7ff',
    },
    {
      label: 'Energy',
      icon: <Zap size={22} color="#f59e0b" />,
      onPress: onLogEnergy,
      backgroundColor: '#fef3c7',
    },
  ];

  const actions = isReproductive ? reproductiveActions : perimenopauseActions;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>

      <View style={styles.actionsRow}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(action.onPress)}
            activeOpacity={0.7}
            style={[
              styles.actionButton,
              { backgroundColor: action.backgroundColor },
              index === 0 ? styles.actionButtonLeft : styles.actionButtonRight,
            ]}
          >
            <View style={styles.actionContent}>
              {action.icon}
              <Text style={styles.actionLabel}>{action.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  actionButtonLeft: {
    marginRight: 8,
  },
  actionButtonRight: {
    marginLeft: 8,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionLabel: {
    color: COLORS.neutral[700],
    fontWeight: '500',
    marginTop: 8,
  },
});
