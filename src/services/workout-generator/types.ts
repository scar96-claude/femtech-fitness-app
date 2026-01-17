// Input types
export type Equipment = 'bodyweight' | 'home_gym' | 'full_gym';
export type Phase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
export type Protocol = 'cycle_sync' | 'osteo_strong';

export interface GenerateWorkoutInput {
  userId: string;
  equipment: Equipment;
  frequencyPerWeek: number; // 2-6
  includeCardio: boolean;
}

// Output types
export interface GeneratedWorkout {
  userId: string;
  date: string; // ISO date
  protocol: Protocol;
  phase?: Phase; // Only for cycle_sync
  dayNumber: number; // e.g., Day 1 of 4
  totalDays: number; // e.g., 4 (frequency)
  warmup: WarmupBlock;
  mainWorkout: ExerciseBlock[];
  cardio?: CardioBlock;
  cooldown: CooldownBlock;
  estimatedDurationMinutes: number;
}

export interface ExerciseBlock {
  exerciseId: string;
  exerciseName: string;
  movementPattern: string;
  sets: number;
  reps: number | string; // string for "30s" or "AMRAP"
  restSeconds: number;
  targetRpe: number;
  notes?: string;
  videoUrl?: string;
}

export interface WarmupBlock {
  durationMinutes: number;
  exercises: {
    name: string;
    duration: string; // "60s" or "10 reps"
  }[];
}

export interface CardioBlock {
  type: 'HIIT' | 'LISS' | 'SIT'; // SIT = Sprint Interval Training
  durationMinutes: number;
  instructions: string;
}

export interface CooldownBlock {
  durationMinutes: number;
  exercises: {
    name: string;
    duration: string;
  }[];
}

// Phase configuration for cycle-sync protocol
export interface PhaseConfig {
  intensity: 'low' | 'moderate' | 'high' | 'peak';
  sets: number;
  reps: number;
  restSeconds: number;
  targetRpe: number;
  cardioType: 'HIIT' | 'LISS';
  allowHIIT: boolean;
}
