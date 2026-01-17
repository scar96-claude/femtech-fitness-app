import { Exercise, ExerciseSubstitution } from './types';

/**
 * Substitution Engine
 *
 * Resolves exercise substitutions by finding actual exercises
 * in the available pool that match the suggested alternatives.
 */

/**
 * Resolve substitution suggestions to actual exercise IDs
 *
 * @param substitutions - Array of substitution suggestions
 * @param availableExercises - Pool of available exercises to search
 * @returns Substitutions with resolved exercise IDs
 */
export async function resolveSubstitutions(
  substitutions: ExerciseSubstitution[],
  availableExercises: Exercise[]
): Promise<ExerciseSubstitution[]> {
  const resolved: ExerciseSubstitution[] = [];

  for (const sub of substitutions) {
    const resolvedSubs = sub.substitutes
      .map((s) => {
        // Try to find the exercise in available exercises
        const match = availableExercises.find((e) =>
          e.name.toLowerCase().includes(s.exerciseName.toLowerCase())
        );

        return {
          exerciseId: match?.id || '',
          exerciseName: match?.name || s.exerciseName,
          safetyNote: s.safetyNote,
        };
      })
      .filter((s) => s.exerciseId !== ''); // Only include found exercises

    resolved.push({
      ...sub,
      substitutes: resolvedSubs,
    });
  }

  return resolved;
}

/**
 * Find a safe alternative for an unsafe exercise
 *
 * @param unsafeExercise - The exercise that needs to be replaced
 * @param availableExercises - Pool of available exercises
 * @param userFlags - User's safety flags
 * @returns A safe alternative exercise or null if none found
 */
export async function findSafeAlternative(
  unsafeExercise: Exercise,
  availableExercises: Exercise[],
  userFlags: { pelvicRisk: boolean; boneDensityRisk: boolean }
): Promise<Exercise | null> {
  // Find exercises with same movement pattern that pass safety filters
  const samePattern = availableExercises.filter(
    (e) =>
      e.movementPattern === unsafeExercise.movementPattern &&
      e.id !== unsafeExercise.id
  );

  // Filter by safety flags
  const safe = samePattern.filter((e) => {
    if (userFlags.pelvicRisk && !e.isPelvicSafe) return false;
    if (userFlags.boneDensityRisk && !e.isOsteoSafe) return false;
    return true;
  });

  if (safe.length === 0) return null;

  // Prefer exercises with lower difficulty if original was advanced
  if (unsafeExercise.difficulty === 'ADVANCED') {
    const easier = safe.filter((e) => e.difficulty !== 'ADVANCED');
    if (easier.length > 0) {
      return easier[Math.floor(Math.random() * easier.length)];
    }
  }

  return safe[Math.floor(Math.random() * safe.length)];
}

/**
 * Find multiple safe alternatives for an exercise
 *
 * @param unsafeExercise - The exercise that needs alternatives
 * @param availableExercises - Pool of available exercises
 * @param userFlags - User's safety flags
 * @param maxAlternatives - Maximum number of alternatives to return
 * @returns Array of safe alternative exercises
 */
export function findMultipleSafeAlternatives(
  unsafeExercise: Exercise,
  availableExercises: Exercise[],
  userFlags: { pelvicRisk: boolean; boneDensityRisk: boolean },
  maxAlternatives: number = 3
): Exercise[] {
  // Find exercises with same movement pattern
  const samePattern = availableExercises.filter(
    (e) =>
      e.movementPattern === unsafeExercise.movementPattern &&
      e.id !== unsafeExercise.id
  );

  // Filter by safety flags
  const safe = samePattern.filter((e) => {
    if (userFlags.pelvicRisk && !e.isPelvicSafe) return false;
    if (userFlags.boneDensityRisk && !e.isOsteoSafe) return false;
    return true;
  });

  // Sort by difficulty (easier first for safety)
  const sorted = safe.sort((a, b) => {
    const difficultyOrder: Record<string, number> = {
      BEGINNER: 0,
      INTERMEDIATE: 1,
      ADVANCED: 2,
    };
    return (
      (difficultyOrder[a.difficulty] || 1) -
      (difficultyOrder[b.difficulty] || 1)
    );
  });

  return sorted.slice(0, maxAlternatives);
}
