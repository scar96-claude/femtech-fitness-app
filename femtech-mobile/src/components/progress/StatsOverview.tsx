import { View, Text, StyleSheet } from 'react-native';
import { Dumbbell, Clock, Flame, Trophy } from 'lucide-react-native';
import { ProgressStats } from '@/types';
import { COLORS } from '@/constants/colors';

interface StatsOverviewProps {
  stats: ProgressStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statItems = [
    {
      label: 'Total Workouts',
      value: stats.totalWorkouts,
      icon: <Dumbbell size={20} color={COLORS.primary[500]} />,
      bgColor: COLORS.primary[50],
    },
    {
      label: 'Hours Trained',
      value: Math.round(stats.totalMinutes / 60),
      icon: <Clock size={20} color={COLORS.success} />,
      bgColor: '#dcfce7',
    },
    {
      label: 'Current Streak',
      value: stats.currentStreak,
      suffix: 'days',
      icon: <Flame size={20} color="#f59e0b" />,
      bgColor: '#fef3c7',
    },
    {
      label: 'Personal Records',
      value: stats.personalRecordsCount,
      icon: <Trophy size={20} color="#8b5cf6" />,
      bgColor: '#ede9fe',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {statItems.map((item, index) => (
          <View key={index} style={styles.cardWrapper}>
            <View style={[styles.card, { backgroundColor: item.bgColor }]}>
              <View style={styles.iconRow}>
                {item.icon}
              </View>
              <Text style={styles.value}>
                {item.value}
                {item.suffix && (
                  <Text style={styles.suffix}> {item.suffix}</Text>
                )}
              </Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  cardWrapper: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
  },
  suffix: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.neutral[500],
  },
  label: {
    fontSize: 14,
    color: COLORS.neutral[500],
  },
});
