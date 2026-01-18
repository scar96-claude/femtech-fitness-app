/**
 * Shared TypeScript types for the FemTech Fitness mobile app
 */

// User types
export interface UserProfile {
  id: string;
  email: string;
  dateOfBirth: string;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: ActivityLevel;
  primaryGoal: PrimaryGoal;
  demographic: Demographic;
}

export type Demographic = 'reproductive' | 'perimenopause';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type PrimaryGoal =
  | 'strength'
  | 'weight_loss'
  | 'endurance'
  | 'flexibility'
  | 'general_fitness';

// Health metadata types
export interface HealthMetadata {
  userId: string;
  pelvicRisk: boolean;
  boneDensityRisk: boolean;
  cycleType: CycleType;
  lastPeriodDate: string | null;
  avgCycleLength: number;
  injuryHistory: InjuryRecord[];
}

export type CycleType = 'regular' | 'irregular' | 'none' | 'unknown';

export interface InjuryRecord {
  type: string;
  bodyPart: string;
  date: string;
  notes?: string;
}

// Cycle types
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface CycleLog {
  id: string;
  userId: string;
  date: string;
  phase: CyclePhase;
  notes?: string;
}

// Exercise types
export interface Exercise {
  id: string;
  name: string;
  movementPattern: MovementPattern;
  equipmentRequired: Equipment;
  primaryMuscle: string | null;
  videoUrl: string | null;
  isOsteoSafe: boolean;
  isPelvicSafe: boolean;
  menopausePriority: boolean;
  phaseRecommendation: string;
  difficulty: Difficulty;
}

export type MovementPattern =
  | 'SQUAT'
  | 'HINGE'
  | 'PUSH'
  | 'PULL'
  | 'CARRY'
  | 'CORE'
  | 'CARDIO';

export type Equipment =
  | 'NONE'
  | 'DUMBBELLS'
  | 'BARBELL'
  | 'MACHINE'
  | 'BANDS'
  | 'KETTLEBELL';

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Workout types
export interface Workout {
  id: string;
  userId: string;
  date: string;
  protocol: WorkoutProtocol;
  phase?: CyclePhase;
  exercises: WorkoutExercise[];
  completedAt?: string;
}

export type WorkoutProtocol = 'cycle_sync' | 'osteo_strong';

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  restSeconds: number;
  targetRpe: number;
}

// Performance logging types
export interface PerformanceLog {
  id: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  rpe: number;
  notes?: string;
}

// Screening types
export interface ScreeningQuestion {
  id: string;
  category: 'pelvic' | 'bone' | 'general';
  question: string;
  triggerFlag: 'pelvicRisk' | 'boneDensityRisk' | null;
  appliesToDemographic: 'all' | 'reproductive' | 'perimenopause';
}

export interface ScreeningResponse {
  questionId: string;
  answer: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Navigation types
export type RootStackParamList = {
  '(auth)/welcome': undefined;
  '(auth)/login': undefined;
  '(auth)/register': undefined;
  '(onboarding)': undefined;
  '(tabs)': undefined;
};
