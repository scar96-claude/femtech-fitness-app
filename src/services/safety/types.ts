/**
 * Safety Layer Type Definitions
 * Types for health screening and exercise filtering
 */

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

export interface ScreeningResult {
  pelvicRisk: boolean;
  boneDensityRisk: boolean;
  flaggedQuestions: string[]; // IDs of questions answered YES
}

export interface ExerciseSubstitution {
  originalExerciseId: string;
  originalExerciseName: string;
  reason: string;
  substitutes: {
    exerciseId: string;
    exerciseName: string;
    safetyNote?: string;
  }[];
}

export interface SafetyFilterResult {
  filteredExercises: Exercise[];
  removedCount: number;
  substitutions: ExerciseSubstitution[];
  warnings: string[];
}

export interface UserSafetyProfile {
  pelvicRisk: boolean;
  boneDensityRisk: boolean;
  injuries: InjuryRecord[];
}

export interface InjuryRecord {
  type: string;
  bodyPart: string;
  date: string;
  notes?: string;
}

// Re-export Exercise type for convenience
export interface Exercise {
  id: string;
  name: string;
  movementPattern: string;
  equipmentRequired: string;
  primaryMuscle: string | null;
  videoUrl: string | null;
  isOsteoSafe: boolean;
  isPelvicSafe: boolean;
  menopausePriority: boolean;
  phaseRecommendation: string;
  difficulty: string;
}
