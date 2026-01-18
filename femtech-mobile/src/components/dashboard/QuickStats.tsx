import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dumbbell, Trophy, Flame, Calendar } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface QuickStatsProps {
  workoutsThisMonth: number;
  personalRecords: number;
  currentStreak: number;
  cycleDay?: number;
  isReproductive: boolean;
}

export function QuickStats({
  workoutsThisMonth,
  personalRecords,
  currentStreak,
  cycleDay,
  isReproductive,
}: QuickStatsProps) {
  const stats = isReproductive
    ? [
        {
          label: 'This Month',
          value: workoutsThisMonth,
          icon: <Dumbbell size={20} color={COLORS.primary[500]} />,
        },
        {
          label: 'PRs',
          value: personalRecords,
          icon: <Trophy size={20} color="#f59e0b" />,
        },
        {
          label: 'Streak',
          value: currentStreak,
          icon: <Flame size={20} color="#ef4444" />,
        },
        {
          label: 'Cycle Day',
          value: cycleDay || '-',
          icon: <Calendar size={20} color="#8b5cf6" />,
        },
      ]
    : [
        {
          label: 'This Month',
          value: workoutsThisMonth,
          icon: <Dumbbell size={20} color={COLORS.primary[500]} />,
        },
        {
          label: 'PRs',
          value: personalRecords,
          icon: <Trophy size={20} color="#f59e0b" />,
        },
        {
          label: 'Streak',
          value: currentStreak,
          icon: <Flame size={20} color="#ef4444" />,
        },
        {
          label: 'Total',
          value: workoutsThisMonth * 4,
          icon: <Calendar size={20} color="#22c55e" />,
        },
      ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statWrapper}>
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              <View style={styles.iconContainer}>{stat.icon}</View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  statWrapper: {
    width: '50%',
    padding: 4,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
  },
  statLabel: {
    color: COLORS.neutral[500],
    fontSize: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
