import { Exercise, InjuryRecord } from './types';

/**
 * Injury-Based Exercise Filter
 *
 * Filters out exercises based on user's injury history.
 * Maps body parts to movement patterns and exercises that should be avoided.
 */

// Maps body parts to movement patterns and exercise keywords to avoid
const INJURY_MOVEMENT_MAP: Record<string, string[]> = {
  knee: ['SQUAT', 'lunge', 'jump', 'running', 'leg press', 'leg extension'],
  shoulder: ['PUSH', 'overhead', 'press', 'pull-up', 'lateral raise', 'dip'],
  'lower back': ['HINGE', 'deadlift', 'row', 'squat', 'good morning'],
  hip: ['SQUAT', 'HINGE', 'lunge', 'running', 'hip thrust'],
  ankle: ['jump', 'running', 'skip', 'hop', 'calf', 'step-up'],
  wrist: ['push-up', 'plank', 'front squat', 'clean', 'press'],
  elbow: ['PUSH', 'PULL', 'curl', 'tricep', 'press', 'dip'],
  neck: ['overhead', 'shrug', 'press', 'pull-up'],
};

/**
 * Apply injury-based filter to exercises
 *
 * @param exercises - Array of exercises to filter
 * @param injuries - User's injury history
 * @returns Filtered exercises safe for user's injury profile
 */
export function applyInjuryFilter(
  exercises: Exercise[],
  injuries: InjuryRecord[]
): Exercise[] {
  if (!injuries || injuries.length === 0) {
    return exercises;
  }

  // Get all patterns to avoid based on injuries
  const patternsToAvoid: string[] = [];

  for (const injury of injuries) {
    const bodyPart = injury.bodyPart.toLowerCase();

    for (const [part, patterns] of Object.entries(INJURY_MOVEMENT_MAP)) {
      if (bodyPart.includes(part)) {
        patternsToAvoid.push(...patterns);
      }
    }
  }

  if (patternsToAvoid.length === 0) {
    return exercises;
  }

  // Remove duplicates
  const uniquePatternsToAvoid = [...new Set(patternsToAvoid)];

  return exercises.filter((exercise) => {
    const nameLower = exercise.name.toLowerCase();
    const pattern = exercise.movementPattern;

    // Check if exercise matches any avoided pattern
    for (const avoid of uniquePatternsToAvoid) {
      if (avoid === avoid.toUpperCase()) {
        // It's a movement pattern enum
        if (pattern === avoid) return false;
      } else {
        // It's a name pattern
        if (nameLower.includes(avoid.toLowerCase())) return false;
      }
    }

    return true;
  });
}

/**
 * Get exercises to avoid based on a specific body part injury
 *
 * @param bodyPart - The injured body part
 * @returns Array of patterns/keywords to avoid
 */
export function getExercisesToAvoidForInjury(bodyPart: string): string[] {
  const bodyPartLower = bodyPart.toLowerCase();
  const toAvoid: string[] = [];

  for (const [part, patterns] of Object.entries(INJURY_MOVEMENT_MAP)) {
    if (bodyPartLower.includes(part)) {
      toAvoid.push(...patterns);
    }
  }

  return [...new Set(toAvoid)];
}

/**
 * Check if an exercise is safe for a specific injury
 *
 * @param exercise - The exercise to check
 * @param injury - The injury record
 * @returns Whether the exercise is safe for the injury
 */
export function isExerciseSafeForInjury(
  exercise: Exercise,
  injury: InjuryRecord
): boolean {
  const patternsToAvoid = getExercisesToAvoidForInjury(injury.bodyPart);
  const nameLower = exercise.name.toLowerCase();
  const pattern = exercise.movementPattern;

  for (const avoid of patternsToAvoid) {
    if (avoid === avoid.toUpperCase()) {
      if (pattern === avoid) return false;
    } else {
      if (nameLower.includes(avoid.toLowerCase())) return false;
    }
  }

  return true;
}
