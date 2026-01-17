import { Exercise, ExerciseSubstitution } from './types';

/**
 * Bone Density Safety Filter
 *
 * Filters out exercises that may be harmful for users with:
 * - Osteopenia
 * - Osteoporosis
 * - History of fragility fractures
 *
 * These exercises typically involve:
 * - Spinal flexion (crunches, toe touches)
 * - Loaded spinal rotation (Russian twists)
 * - Forward bending under load
 */

// Exercises that are NOT safe for osteoporosis/osteopenia
// These should have isOsteoSafe = false in the database
const BONE_UNSAFE_MOVEMENTS = [
  'toe touch',
  'forward fold',
  'sit-up',
  'sit up',
  'crunch',
  'v-up',
  'russian twist',
  'bicycle crunch',
  'rollover',
  'rolling',
];

const SPINAL_FLEXION_EXERCISES = [
  'crunch',
  'sit-up',
  'toe touch',
  'roll up',
  'roll-up',
];

const LOADED_ROTATION_EXERCISES = ['russian twist', 'wood chop', 'rotational'];

// Safe substitutions for bone density issues
const BONE_SUBSTITUTIONS: Record<string, string[]> = {
  'sit-up': ['bird dog', 'dead bug', 'pallof press'],
  crunch: ['bird dog', 'dead bug', 'pallof press'],
  'russian twist': ['pallof press', 'farmer walk', 'suitcase carry'],
  'toe touch': ['standing hamstring stretch (supported)', 'seated stretch'],
  'bicycle crunch': ['bird dog', 'dead bug'],
  'rowing machine': ['lat pulldown', 'seated cable row (upright)'],
  'forward fold': ['standing hamstring stretch (wall supported)'],
};

// Exercises to PRIORITIZE for bone health
const BONE_BUILDING_EXERCISES = [
  'squat',
  'deadlift',
  'overhead press',
  'farmer',
  'carry',
  'step-up',
  'heel drop',
  'lunge',
];

/**
 * Apply bone density safety filter to exercises
 *
 * @param exercises - Array of exercises to filter
 * @param hasBoneDensityRisk - Whether user has bone density risk
 * @returns Filtered exercises and substitution suggestions
 */
export function applyBoneDensityFilter(
  exercises: Exercise[],
  hasBoneDensityRisk: boolean
): { filtered: Exercise[]; substitutions: ExerciseSubstitution[] } {
  if (!hasBoneDensityRisk) {
    return { filtered: exercises, substitutions: [] };
  }

  const substitutions: ExerciseSubstitution[] = [];

  const filtered = exercises.filter((exercise) => {
    // Check the database flag
    if (!exercise.isOsteoSafe) {
      // Find substitution
      const subKey = Object.keys(BONE_SUBSTITUTIONS).find((key) =>
        exercise.name.toLowerCase().includes(key.toLowerCase())
      );

      if (subKey) {
        substitutions.push({
          originalExerciseId: exercise.id,
          originalExerciseName: exercise.name,
          reason:
            'Involves spinal flexion or loaded rotation - risk for vertebral fracture',
          substitutes: BONE_SUBSTITUTIONS[subKey].map((name) => ({
            exerciseId: '',
            exerciseName: name,
            safetyNote: 'Spine-neutral alternative',
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
 * Check if an exercise name indicates it's osteo safe
 * Used as a secondary check beyond the database flag
 *
 * @param exerciseName - Name of the exercise
 * @returns Whether the exercise is considered osteo safe
 */
export function isOsteoSafe(exerciseName: string): boolean {
  const nameLower = exerciseName.toLowerCase();

  // Check against unsafe movements
  for (const unsafe of BONE_UNSAFE_MOVEMENTS) {
    if (nameLower.includes(unsafe)) return false;
  }

  // Check spinal flexion
  for (const flexion of SPINAL_FLEXION_EXERCISES) {
    if (nameLower.includes(flexion)) return false;
  }

  // Check loaded rotation
  for (const rotation of LOADED_ROTATION_EXERCISES) {
    if (nameLower.includes(rotation)) return false;
  }

  return true;
}

/**
 * Check if an exercise is beneficial for bone building
 *
 * @param exerciseName - Name of the exercise
 * @returns Whether the exercise promotes bone health
 */
export function isBoneBuildingExercise(exerciseName: string): boolean {
  const nameLower = exerciseName.toLowerCase();
  return BONE_BUILDING_EXERCISES.some((bb) => nameLower.includes(bb));
}

/**
 * Get safe alternatives for a bone-unsafe exercise
 *
 * @param exerciseName - Name of the unsafe exercise
 * @returns Array of safe alternative exercise names
 */
export function getBoneSafeAlternatives(exerciseName: string): string[] {
  const nameLower = exerciseName.toLowerCase();

  for (const [key, alternatives] of Object.entries(BONE_SUBSTITUTIONS)) {
    if (nameLower.includes(key.toLowerCase())) {
      return alternatives;
    }
  }

  return [];
}
