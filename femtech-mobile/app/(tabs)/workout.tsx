import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, BackHandler, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useWorkoutStore } from '@/stores/workoutStore';
import { WorkoutHeader } from '@/components/workout/WorkoutHeader';
import { ExerciseDisplay } from '@/components/workout/ExerciseDisplay';
import { SetTracker } from '@/components/workout/SetTracker';
import { WeightInput } from '@/components/workout/WeightInput';
import { RestTimer } from '@/components/workout/RestTimer';
import { RPESlider } from '@/components/workout/RPESlider';
import { ExerciseNotes } from '@/components/workout/ExerciseNotes';
import { WorkoutComplete } from '@/components/workout/WorkoutComplete';
import { ExitWorkoutModal } from '@/components/workout/ExitWorkoutModal';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ActiveWorkout } from '@/types';
import { COLORS } from '@/constants/colors';

// Mock workout for development
const MOCK_WORKOUT: ActiveWorkout = {
  id: '1',
  name: 'Full Body Strength',
  protocol: 'cycle_sync',
  phase: 'follicular',
  estimatedMinutes: 45,
  exercises: [
    {
      id: '1',
      exerciseId: 'ex1',
      name: 'Barbell Back Squat',
      sets: 4,
      reps: 8,
      restSeconds: 90,
      targetRpe: 8,
      movementPattern: 'SQUAT',
      notes: 'Keep chest up, drive through heels.',
    },
    {
      id: '2',
      exerciseId: 'ex2',
      name: 'Romanian Deadlift',
      sets: 3,
      reps: 10,
      restSeconds: 90,
      targetRpe: 7,
      movementPattern: 'HINGE',
      notes: 'Slight knee bend, hinge at hips.',
    },
    {
      id: '3',
      exerciseId: 'ex3',
      name: 'Dumbbell Bench Press',
      sets: 3,
      reps: 10,
      restSeconds: 60,
      targetRpe: 7,
      movementPattern: 'PUSH',
    },
    {
      id: '4',
      exerciseId: 'ex4',
      name: 'Bent Over Row',
      sets: 3,
      reps: 10,
      restSeconds: 60,
      targetRpe: 7,
      movementPattern: 'PULL',
    },
    {
      id: '5',
      exerciseId: 'ex5',
      name: 'Farmer Walk',
      sets: 3,
      reps: '40m',
      restSeconds: 60,
      targetRpe: 6,
      movementPattern: 'CARRY',
    },
  ],
};

export default function WorkoutScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const {
    workout,
    currentExerciseIndex,
    isResting,
    showRpePrompt,
    workoutLog,
    startWorkout,
    completeSet,
    nextExercise,
    previousExercise,
    exitWorkout,
    completeWorkout,
    getCurrentExercise,
    getProgress,
    isExerciseComplete,
  } = useWorkoutStore();

  const [showExitModal, setShowExitModal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);

  // Load workout on mount
  useEffect(() => {
    if (!workout) {
      // In production, fetch workout by ID
      // const fetchedWorkout = await apiClient.getWorkout(params.id);
      startWorkout(MOCK_WORKOUT);
    }
  }, [params.id, workout, startWorkout]);

  // Handle hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (workout && !isComplete) {
          setShowExitModal(true);
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [workout, isComplete])
  );

  const handleCompleteSet = () => {
    const exercise = getCurrentExercise();
    if (!exercise) return;

    completeSet(
      typeof exercise.reps === 'number' ? exercise.reps : 1,
      currentWeight
    );
  };

  const handleRpeSubmit = () => {
    // Check if this was the last exercise
    if (currentExerciseIndex >= (workout?.exercises.length || 0) - 1) {
      // Complete workout
      completeWorkout();
      setIsComplete(true);

      // Save to API
      // apiClient.saveWorkoutLog(log);
    } else {
      nextExercise();
    }
  };

  const handleExit = () => {
    setShowExitModal(false);
    exitWorkout();
    router.back();
  };

  const handleDone = () => {
    exitWorkout();
    router.replace('/(tabs)');
  };

  // No active workout - show start screen
  if (!workout) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyTitle}>No Workout Loaded</Text>
          <Text style={styles.emptySubtitle}>
            Start today's workout from the dashboard
          </Text>
          <Button
            title="Go to Dashboard"
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Workout complete screen
  if (isComplete && workoutLog) {
    return (
      <WorkoutComplete
        workoutLog={workoutLog}
        workoutName={workout.name}
        onDone={handleDone}
      />
    );
  }

  const currentExercise = getCurrentExercise();
  const progress = getProgress();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <WorkoutHeader onExit={() => setShowExitModal(true)} />

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentExercise && (
          <>
            {/* Exercise Display */}
            <ExerciseDisplay exercise={currentExercise} />

            {/* Set Tracker */}
            <SetTracker
              totalSets={currentExercise.sets}
              targetReps={currentExercise.reps}
              onCompleteSet={handleCompleteSet}
            />

            {/* Weight Input */}
            <WeightInput onWeightChange={setCurrentWeight} />

            {/* Exercise Notes */}
            <ExerciseNotes
              notes={currentExercise.notes}
              movementPattern={currentExercise.movementPattern}
            />
          </>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <Button
          title=""
          variant="outline"
          onPress={previousExercise}
          disabled={currentExerciseIndex === 0}
          style={styles.navButton}
        >
          <ChevronLeft
            size={24}
            color={
              currentExerciseIndex === 0
                ? COLORS.neutral[300]
                : COLORS.primary[500]
            }
          />
        </Button>

        <View style={styles.centerButtonContainer}>
          {isExerciseComplete(currentExerciseIndex) ? (
            <Button
              title={
                currentExerciseIndex === workout.exercises.length - 1
                  ? 'Finish Workout'
                  : 'Next Exercise'
              }
              onPress={handleRpeSubmit}
              fullWidth
              size="lg"
            />
          ) : (
            <View style={styles.incompleteMessage}>
              <Text style={styles.incompleteText}>
                Complete all sets to continue
              </Text>
            </View>
          )}
        </View>

        <Button
          title=""
          variant="outline"
          onPress={nextExercise}
          disabled={currentExerciseIndex === workout.exercises.length - 1}
          style={styles.navButton}
        >
          <ChevronRight
            size={24}
            color={
              currentExerciseIndex === workout.exercises.length - 1
                ? COLORS.neutral[300]
                : COLORS.primary[500]
            }
          />
        </Button>
      </View>

      {/* Rest Timer Overlay */}
      {isResting && <RestTimer />}

      {/* RPE Prompt Overlay */}
      {showRpePrompt && <RPESlider onSubmit={handleRpeSubmit} />}

      {/* Exit Confirmation Modal */}
      <ExitWorkoutModal
        visible={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={handleExit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
    marginBottom: 8,
  },
  emptySubtitle: {
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  navButton: {
    width: 56,
    height: 56,
    paddingHorizontal: 0,
  },
  centerButtonContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  incompleteMessage: {
    height: 56,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incompleteText: {
    color: COLORS.neutral[500],
  },
});
