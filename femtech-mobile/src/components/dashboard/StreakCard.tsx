import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, TrendingUp, Award } from 'lucide-react-native';

interface StreakCardProps {
  currentStreak: number;
  longestStreak?: number;
  workoutsThisMonth: number;
}

export function StreakCard({
  currentStreak,
  longestStreak = 0,
  workoutsThisMonth,
}: StreakCardProps) {
  const getMessage = () => {
    if (currentStreak === 0) return "Let's start a new streak today!";
    if (currentStreak < 3) return "You're building momentum!";
    if (currentStreak < 7) return 'Great consistency this week!';
    if (currentStreak < 14) return "You're on fire! Keep it up!";
    return 'Incredible dedication! 💪';
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Main Streak */}
        <View style={styles.streakMain}>
          <View style={styles.streakRow}>
            <Flame size={40} color="#ffffff" />
            <Text style={styles.streakNumber}>{currentStreak}</Text>
          </View>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <TrendingUp size={16} color="#ffffff" />
            <Text style={styles.statText}>{workoutsThisMonth} this month</Text>
          </View>

          {longestStreak > 0 && (
            <View style={styles.statRow}>
              <Award size={16} color="#ffffff" />
              <Text style={styles.statText}>Best: {longestStreak} days</Text>
            </View>
          )}
        </View>
      </View>

      {/* Message */}
      <View style={styles.messageCard}>
        <Text style={styles.messageText}>{getMessage()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f59e0b',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakMain: {
    alignItems: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  streakLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 14,
  },
  messageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  messageText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
});
