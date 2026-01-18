import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/stores/userStore';
import { useDashboard } from '@/hooks/useDashboard';
import { GreetingHeader } from '@/components/dashboard/GreetingHeader';
import { CyclePhaseCard } from '@/components/dashboard/CyclePhaseCard';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { LogPeriodModal } from '@/components/modals/LogPeriodModal';
import { LogSymptomsModal } from '@/components/modals/LogSymptomsModal';
import { COLORS } from '@/constants/colors';

export default function DashboardScreen() {
  const { fetchProfile } = useUserStore();
  const { isLoading, data, cycleInfo, isReproductive, refetch } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showSymptomsModal, setShowSymptomsModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !data) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[500]} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </SafeAreaView>
    );
  }

  // Mock data for development (remove when API is connected)
  const mockData = {
    stats: {
      workoutsThisWeek: 3,
      workoutsThisMonth: 12,
      currentStreak: 5,
      totalWorkouts: 48,
      personalRecords: 7,
    },
    workout: {
      id: '1',
      name: 'Full Body Strength',
      exerciseCount: 6,
      estimatedMinutes: 45,
      focusArea: 'Full Body',
      isRestDay: false,
    },
    weekProgress: {
      completed: 3,
      planned: 4,
      days: [
        { day: 'M', completed: true, isToday: false },
        { day: 'T', completed: true, isToday: false },
        { day: 'W', completed: false, isToday: false },
        { day: 'T', completed: true, isToday: true },
        { day: 'F', completed: false, isToday: false },
        { day: 'S', completed: false, isToday: false },
        { day: 'S', completed: false, isToday: false },
      ],
    },
  };

  const displayData = data || mockData;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Greeting Header */}
        <GreetingHeader
          cyclePhase={cycleInfo?.phase.displayName}
          streak={displayData.stats.currentStreak}
          isReproductive={isReproductive}
        />

        {/* Cycle Phase Card (Reproductive) or Streak Card (Perimenopause) */}
        {isReproductive && cycleInfo ? (
          <CyclePhaseCard
            phase={cycleInfo.phase}
            cycleDay={cycleInfo.cycleDay}
            totalDays={cycleInfo.totalDays}
            daysUntilNextPhase={cycleInfo.daysUntilNextPhase}
          />
        ) : (
          <StreakCard
            currentStreak={displayData.stats.currentStreak}
            workoutsThisMonth={displayData.stats.workoutsThisMonth}
          />
        )}

        {/* Today's Workout */}
        <TodayWorkoutCard
          workout={displayData.workout}
          phaseNote={cycleInfo?.phase.workoutTip}
          isReproductive={isReproductive}
        />

        {/* Weekly Progress */}
        <WeeklyProgress
          completed={displayData.weekProgress.completed}
          planned={displayData.weekProgress.planned}
          days={displayData.weekProgress.days}
        />

        {/* Quick Stats */}
        <QuickStats
          workoutsThisMonth={displayData.stats.workoutsThisMonth}
          personalRecords={displayData.stats.personalRecords}
          currentStreak={displayData.stats.currentStreak}
          cycleDay={cycleInfo?.cycleDay}
          isReproductive={isReproductive}
        />

        {/* Quick Actions */}
        <QuickActions
          isReproductive={isReproductive}
          onLogPeriod={() => setShowPeriodModal(true)}
          onLogSymptoms={() => setShowSymptomsModal(true)}
          onLogSleep={() => console.log('Log sleep')}
          onLogEnergy={() => console.log('Log energy')}
        />

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modals */}
      <LogPeriodModal
        visible={showPeriodModal}
        onClose={() => setShowPeriodModal(false)}
      />
      <LogSymptomsModal
        visible={showSymptomsModal}
        onClose={() => setShowSymptomsModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.neutral[500],
    marginTop: 16,
  },
  bottomPadding: {
    height: 32,
  },
});
