import { Exercise, ExerciseSubstitution } from './types';

/**
 * Pelvic Floor Safety Filter
 *
 * Filters out exercises that may be harmful for users with:
 * - Pelvic organ prolapse
 * - Stress urinary incontinence
 * - Diastasis recti
 * - Recent childbirth (< 12 months)
 *
 * These exercises typically involve:
 * - High impact (jumping, running)
 * - High intra-abdominal pressure
 * - Direct core pressure (crunches, planks)
 */

// Exercises that are NOT safe for pelvic floor issues
// These should have isPelvicSafe = false in the database
const PELVIC_UNSAFE_PATTERNS = [
  'jump',
  'box jump',
  'burpee',
  'running',
  'sprint',
  'skip',
  'hop',
];

const PELVIC_UNSAFE_EXERCISES = [
  'sit-up',
  'sit up',
  'crunch',
  'v-up',
  'v up',
  'leg raise',
  'plank', // Standard plank - modified versions OK
  'dead bug', // Can be modified
];

const HIGH_PRESSURE_EXERCISES = [
  'back squat',
  'front squat',
  'deadlift',
  'heavy',
  'barbell',
];

// Safe substitutions mapping
const PELVIC_SUBSTITUTIONS: Record<string, string[]> = {
  'hip thrust': ['glute bridge', 'single-leg glute bridge'],
  'barbell back squat': ['goblet squat', 'wall squat', 'bodyweight squat'],
  'barbell front squat': ['goblet squat', 'wall squat'],
  deadlift: [
    'romanian deadlift (light)',
    'glute bridge',
    'cable pull-through',
  ],
  'jump squat': ['bodyweight squat', 'slow tempo squat'],
  'box jump': ['step-up', 'box step-up'],
  burpee: ['squat to stand', 'inchworm'],
  plank: ['modified plank (knees)', 'bird dog', 'dead bug (modified)'],
  'sit-up': ['dead bug (modified)', 'pelvic tilts'],
  crunch: ['dead bug (modified)', 'pelvic tilts'],
  running: ['walking', 'cycling', 'swimming'],
};

/**
 * Apply pelvic floor safety filter to exercises
 *
 * @param exercises - Array of exercises to filter
 * @param hasPelvicRisk - Whether user has pelvic floor risk
 * @returns Filtered exercises and substitution suggestions
 */
export function applyPelvicFilter(
  exercises: Exercise[],
  hasPelvicRisk: boolean
): { filtered: Exercise[]; substitutions: ExerciseSubstitution[] } {
  if (!hasPelvicRisk) {
    return { filtered: exercises, substitutions: [] };
  }

  const substitutions: ExerciseSubstitution[] = [];

  const filtered = exercises.filter((exercise) => {
    // First check the database flag
    if (!exercise.isPelvicSafe) {
      // Find substitution
      const subKey = Object.keys(PELVIC_SUBSTITUTIONS).find((key) =>
        exercise.name.toLowerCase().includes(key.toLowerCase())
      );

      if (subKey) {
        substitutions.push({
          originalExerciseId: exercise.id,
          originalExerciseName: exercise.name,
          reason:
            'May increase intra-abdominal pressure or impact pelvic floor',
          substitutes: PELVIC_SUBSTITUTIONS[subKey].map((name) => ({
            exerciseId: '', // Will be resolved later
            exerciseName: name,
            safetyNote: 'Pelvic floor safe alternative',
          })),
        });
      }
      return false;
    }

    return true;
  });

  return { filtered, substitutions };
}

/**
 * Check if an exercise name indicates it's pelvic safe
 * Used as a secondary check beyond the database flag
 *
 * @param exerciseName - Name of the exercise
 * @returns Whether the exercise is considered pelvic safe
 */
export function isPelvicSafe(exerciseName: string): boolean {
  const nameLower = exerciseName.toLowerCase();

  // Check against unsafe patterns
  for (const pattern of PELVIC_UNSAFE_PATTERNS) {
    if (nameLower.includes(pattern)) return false;
  }

  // Check against specific unsafe exercises
  for (const unsafe of PELVIC_UNSAFE_EXERCISES) {
    if (nameLower.includes(unsafe)) return false;
  }

  // Check high-pressure exercises
  for (const highPressure of HIGH_PRESSURE_EXERCISES) {
    if (nameLower.includes(highPressure)) return false;
  }

  return true;
}

/**
 * Get safe alternatives for a pelvic-unsafe exercise
 *
 * @param exerciseName - Name of the unsafe exercise
 * @returns Array of safe alternative exercise names
 */
export function getPelvicSafeAlternatives(exerciseName: string): string[] {
  const nameLower = exerciseName.toLowerCase();

  for (const [key, alternatives] of Object.entries(PELVIC_SUBSTITUTIONS)) {
    if (nameLower.includes(key.toLowerCase())) {
      return alternatives;
    }
  }

  return [];
}
