import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '@/stores/userStore';
import { COLORS } from '@/constants/colors';

interface GreetingHeaderProps {
  cyclePhase?: string;
  streak?: number;
  isReproductive: boolean;
}

export function GreetingHeader({ cyclePhase, streak, isReproductive }: GreetingHeaderProps) {
  const { profile } = useUserStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = profile?.email?.split('@')[0] || 'there';

  const getPhaseBackgroundColor = (phase: string): string => {
    const colors: Record<string, string> = {
      menstrual: '#fee2e2',
      follicular: '#dcfce7',
      ovulatory: '#fef3c7',
      luteal: '#f3e8ff',
    };
    return colors[phase.toLowerCase()] || COLORS.neutral[100];
  };

  const getPhaseTextColor = (phase: string): string => {
    const colors: Record<string, string> = {
      menstrual: '#b91c1c',
      follicular: '#15803d',
      ovulatory: '#b45309',
      luteal: '#7c3aed',
    };
    return colors[phase.toLowerCase()] || COLORS.neutral[700];
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{firstName}</Text>
        </View>

        {/* Badge */}
        {isReproductive && cyclePhase ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: getPhaseBackgroundColor(cyclePhase) },
            ]}
          >
            <Text
              style={[styles.badgeText, { color: getPhaseTextColor(cyclePhase) }]}
            >
              {cyclePhase} Phase
            </Text>
          </View>
        ) : streak && streak > 0 ? (
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>{streak} day streak</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    color: COLORS.neutral[500],
    fontSize: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  streakBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 18,
    marginRight: 4,
  },
  streakText: {
    color: '#b45309',
    fontWeight: '600',
  },
});
