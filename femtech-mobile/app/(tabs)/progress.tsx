import { useState } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '@/hooks/useProgress';
import { StatsOverview } from '@/components/progress/StatsOverview';
import { WorkoutHistoryList } from '@/components/progress/WorkoutHistoryList';
import { PersonalRecords } from '@/components/progress/PersonalRecords';
import { CycleHistory } from '@/components/progress/CycleHistory';
import { AchievementBadges } from '@/components/progress/AchievementBadges';
import { COLORS } from '@/constants/colors';
import {
  ProgressStats,
  WorkoutHistoryItem,
  PersonalRecord,
  Achievement,
} from '@/types';

type Tab = 'overview' | 'history' | 'records';

// Mock data for development
const MOCK_STATS: ProgressStats = {
  totalWorkouts: 48,
  totalMinutes: 2160,
  totalWeight: 125000,
  currentStreak: 5,
  longestStreak: 14,
  workoutsThisMonth: 12,
  avgWorkoutsPerWeek: 3.2,
  personalRecordsCount: 7,
};

const MOCK_HISTORY: WorkoutHistoryItem[] = [
  {
    id: '1',
    name: 'Full Body Strength',
    date: '2026-01-18T10:00:00Z',
    duration: 45,
    exerciseCount: 6,
    totalSets: 18,
    totalReps: 144,
    totalWeight: 2340,
    avgRpe: 7.2,
    protocol: 'cycle_sync',
    phase: 'follicular',
  },
  {
    id: '2',
    name: 'Upper Body Push',
    date: '2026-01-16T09:30:00Z',
    duration: 38,
    exerciseCount: 5,
    totalSets: 15,
    totalReps: 120,
    totalWeight: 1850,
    avgRpe: 7.5,
    protocol: 'cycle_sync',
    phase: 'follicular',
  },
  {
    id: '3',
    name: 'Lower Body',
    date: '2026-01-14T11:00:00Z',
    duration: 50,
    exerciseCount: 6,
    totalSets: 20,
    totalReps: 160,
    totalWeight: 3200,
    avgRpe: 8.0,
    protocol: 'cycle_sync',
    phase: 'ovulatory',
  },
];

const MOCK_RECORDS: PersonalRecord[] = [
  {
    exerciseId: '1',
    exerciseName: 'Back Squat',
    weight: 70,
    reps: 5,
    date: '2026-01-14T11:00:00Z',
    previousRecord: { weight: 65, date: '2026-01-07T11:00:00Z' },
  },
  {
    exerciseId: '2',
    exerciseName: 'Deadlift',
    weight: 85,
    reps: 5,
    date: '2026-01-10T10:00:00Z',
  },
  {
    exerciseId: '3',
    exerciseName: 'Bench Press',
    weight: 45,
    reps: 6,
    date: '2026-01-16T09:30:00Z',
  },
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Workout', description: 'Complete your first workout', icon: 'first_workout', unlockedAt: '2026-01-01' },
  { id: '2', title: 'Week Warrior', description: '7 day streak', icon: 'week_streak', unlockedAt: '2026-01-10' },
  { id: '3', title: 'PR Breaker', description: 'Set a personal record', icon: 'pr_breaker', unlockedAt: '2026-01-14' },
  { id: '4', title: 'Month Master', description: '30 day streak', icon: 'month_streak', progress: 5, target: 30 },
  { id: '5', title: 'Century Club', description: '100 workouts', icon: 'consistency', progress: 48, target: 100 },
];

export default function ProgressScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const { stats, history, records, cycleHistory, achievements, isLoading, isReproductive, refetch } = useProgress();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Use mock data for development
  const displayStats = stats || MOCK_STATS;
  const displayHistory = history || MOCK_HISTORY;
  const displayRecords = records || MOCK_RECORDS;
  const displayAchievements = achievements || MOCK_ACHIEVEMENTS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['overview', 'history', 'records'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'overview' && (
          <>
            <StatsOverview stats={displayStats} />
            <AchievementBadges achievements={displayAchievements} />
            <PersonalRecords records={displayRecords} />
            {isReproductive && cycleHistory && (
              <CycleHistory cycles={cycleHistory} />
            )}
          </>
        )}

        {activeTab === 'history' && (
          <WorkoutHistoryList
            workouts={displayHistory}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'records' && (
          <View style={styles.recordsContainer}>
            <Text style={styles.sectionTitle}>All Personal Records</Text>
            {displayRecords.map((record) => (
              <View key={record.exerciseId} style={styles.recordCard}>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordName}>{record.exerciseName}</Text>
                  <Text style={styles.recordDate}>
                    {new Date(record.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.recordValues}>
                  <Text style={styles.recordWeight}>{record.weight} kg</Text>
                  <Text style={styles.recordReps}>× {record.reps} reps</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tab: {
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[200],
  },
  tabActive: {
    backgroundColor: COLORS.primary[500],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.neutral[600],
  },
  tabTextActive: {
    color: '#ffffff',
  },
  recordsContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
    marginBottom: 16,
  },
  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordInfo: {
    flex: 1,
  },
  recordName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  recordDate: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  recordValues: {
    alignItems: 'flex-end',
  },
  recordWeight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary[600],
  },
  recordReps: {
    fontSize: 14,
    color: COLORS.neutral[500],
  },
  bottomSpacer: {
    height: 32,
  },
});
