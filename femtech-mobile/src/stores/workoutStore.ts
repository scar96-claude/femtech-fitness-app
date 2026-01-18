import { create } from 'zustand';
import {
  ActiveWorkout,
  ActiveWorkoutExercise,
  SetLog,
  ExerciseLog,
  WorkoutLog,
} from '@/types';

interface WorkoutState {
  // Active workout data
  workout: ActiveWorkout | null;
  currentExerciseIndex: number;

  // Logging state
  workoutLog: WorkoutLog | null;
  currentSetIndex: number;

  // UI state
  isResting: boolean;
  restTimeRemaining: number;
  isPaused: boolean;
  showRpePrompt: boolean;

  // Actions
  startWorkout: (workout: ActiveWorkout) => void;
  completeSet: (reps: number, weightKg: number | null) => void;
  skipRest: () => void;
  setRestTime: (seconds: number) => void;
  decrementRestTime: () => void;
  finishRest: () => void;
  setRpe: (rpe: number) => void;
  nextExercise: () => void;
  previousExercise: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  completeWorkout: () => WorkoutLog;
  exitWorkout: () => void;

  // Getters
  getCurrentExercise: () => ActiveWorkoutExercise | null;
  getProgress: () => { current: number; total: number; percentage: number };
  getExerciseLog: (exerciseId: string) => ExerciseLog | undefined;
  isExerciseComplete: (exerciseIndex: number) => boolean;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workout: null,
  currentExerciseIndex: 0,
  workoutLog: null,
  currentSetIndex: 0,
  isResting: false,
  restTimeRemaining: 0,
  isPaused: false,
  showRpePrompt: false,

  startWorkout: (workout) => {
    const workoutLog: WorkoutLog = {
      workoutId: workout.id,
      startTime: new Date(),
      exercises: workout.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        sets: [],
        rpe: null,
      })),
      completed: false,
    };

    set({
      workout,
      currentExerciseIndex: 0,
      workoutLog,
      currentSetIndex: 0,
      isResting: false,
      restTimeRemaining: 0,
      isPaused: false,
      showRpePrompt: false,
    });
  },

  completeSet: (reps, weightKg) => {
    const { workout, currentExerciseIndex, currentSetIndex, workoutLog } = get();
    if (!workout || !workoutLog) return;

    const exercise = workout.exercises[currentExerciseIndex];
    const setLog: SetLog = {
      setNumber: currentSetIndex + 1,
      reps,
      weightKg,
      completed: true,
      timestamp: new Date(),
    };

    // Update workout log
    const updatedExercises = [...workoutLog.exercises];
    updatedExercises[currentExerciseIndex].sets.push(setLog);

    const isLastSet = currentSetIndex + 1 >= exercise.sets;

    set({
      workoutLog: { ...workoutLog, exercises: updatedExercises },
      currentSetIndex: isLastSet ? currentSetIndex : currentSetIndex + 1,
      isResting: !isLastSet,
      restTimeRemaining: isLastSet ? 0 : exercise.restSeconds,
      showRpePrompt: isLastSet,
    });
  },

  skipRest: () => {
    set({ isResting: false, restTimeRemaining: 0 });
  },

  setRestTime: (seconds) => {
    set({ restTimeRemaining: seconds });
  },

  decrementRestTime: () => {
    const { restTimeRemaining } = get();
    if (restTimeRemaining > 0) {
      set({ restTimeRemaining: restTimeRemaining - 1 });
    } else {
      set({ isResting: false });
    }
  },

  finishRest: () => {
    set({ isResting: false, restTimeRemaining: 0 });
  },

  setRpe: (rpe) => {
    const { workoutLog, currentExerciseIndex } = get();
    if (!workoutLog) return;

    const updatedExercises = [...workoutLog.exercises];
    updatedExercises[currentExerciseIndex].rpe = rpe;

    set({
      workoutLog: { ...workoutLog, exercises: updatedExercises },
      showRpePrompt: false,
    });
  },

  nextExercise: () => {
    const { workout, currentExerciseIndex } = get();
    if (!workout) return;

    if (currentExerciseIndex < workout.exercises.length - 1) {
      set({
        currentExerciseIndex: currentExerciseIndex + 1,
        currentSetIndex: 0,
        isResting: false,
        restTimeRemaining: 0,
        showRpePrompt: false,
      });
    }
  },

  previousExercise: () => {
    const { currentExerciseIndex } = get();
    if (currentExerciseIndex > 0) {
      set({
        currentExerciseIndex: currentExerciseIndex - 1,
        currentSetIndex: 0,
        isResting: false,
        restTimeRemaining: 0,
        showRpePrompt: false,
      });
    }
  },

  pauseWorkout: () => set({ isPaused: true }),
  resumeWorkout: () => set({ isPaused: false }),

  completeWorkout: () => {
    const { workoutLog } = get();
    if (!workoutLog) throw new Error('No active workout');

    const completedLog: WorkoutLog = {
      ...workoutLog,
      endTime: new Date(),
      totalDuration: Math.round(
        (new Date().getTime() - workoutLog.startTime.getTime()) / 1000 / 60
      ),
      completed: true,
    };

    set({ workoutLog: completedLog });
    return completedLog;
  },

  exitWorkout: () => {
    set({
      workout: null,
      currentExerciseIndex: 0,
      workoutLog: null,
      currentSetIndex: 0,
      isResting: false,
      restTimeRemaining: 0,
      isPaused: false,
      showRpePrompt: false,
    });
  },

  getCurrentExercise: () => {
    const { workout, currentExerciseIndex } = get();
    return workout?.exercises[currentExerciseIndex] || null;
  },

  getProgress: () => {
    const { workout, currentExerciseIndex } = get();
    if (!workout) return { current: 0, total: 0, percentage: 0 };

    const total = workout.exercises.length;
    const current = currentExerciseIndex + 1;
    const percentage = (current / total) * 100;

    return { current, total, percentage };
  },

  getExerciseLog: (exerciseId) => {
    const { workoutLog } = get();
    return workoutLog?.exercises.find((e) => e.exerciseId === exerciseId);
  },

  isExerciseComplete: (exerciseIndex) => {
    const { workout, workoutLog } = get();
    if (!workout || !workoutLog) return false;

    const exercise = workout.exercises[exerciseIndex];
    const log = workoutLog.exercises[exerciseIndex];

    return log.sets.length >= exercise.sets;
  },
}));
