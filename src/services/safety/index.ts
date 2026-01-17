import {
  Exercise,
  ExerciseSubstitution,
  SafetyFilterResult,
  UserSafetyProfile,
} from './types';
import { applyPelvicFilter } from './pelvic-filter';
import { applyBoneDensityFilter } from './bone-density-filter';
import { applyInjuryFilter } from './injury-filter';
import { resolveSubstitutions } from './substitution-engine';

/**
 * Main Safety Filter Service
 *
 * Applies all safety filters to an exercise list based on user's health profile.
 * This is the primary entry point for the safety layer.
 */

/**
 * Apply all safety filters to a list of exercises
 *
 * @param exercises - Array of exercises to filter
 * @param userProfile - User's safety profile with risk flags
 * @returns Filtered exercises, removed count, substitutions, and warnings
 */
export async function applySafetyFilters(
  exercises: Exercise[],
  userProfile: UserSafetyProfile
): Promise<SafetyFilterResult> {
  let filtered = exercises;
  const allSubstitutions: ExerciseSubstitution[] = [];
  const warnings: string[] = [];
  const originalCount = exercises.length;

  // 1. Apply pelvic floor filter
  const pelvicResult = applyPelvicFilter(filtered, userProfile.pelvicRisk);
  filtered = pelvicResult.filtered;
  allSubstitutions.push(...pelvicResult.substitutions);

  if (userProfile.pelvicRisk) {
    warnings.push(
      'High-impact and high-pressure exercises have been removed for pelvic floor safety.'
    );
  }

  // 2. Apply bone density filter
  const boneResult = applyBoneDensityFilter(
    filtered,
    userProfile.boneDensityRisk
  );
  filtered = boneResult.filtered;
  allSubstitutions.push(...boneResult.substitutions);

  if (userProfile.boneDensityRisk) {
    warnings.push(
      'Spinal flexion and loaded rotation exercises have been removed for bone safety.'
    );
  }

  // 3. Apply injury filter
  filtered = applyInjuryFilter(filtered, userProfile.injuries);

  // 4. Resolve substitutions to actual exercise IDs
  const resolvedSubstitutions = await resolveSubstitutions(
    allSubstitutions,
    filtered
  );

  // 5. Check for movement pattern coverage
  const patterns = ['SQUAT', 'HINGE', 'PUSH', 'PULL', 'CARRY', 'CORE'];
  for (const pattern of patterns) {
    const count = filtered.filter((e) => e.movementPattern === pattern).length;
    if (count < 2) {
      warnings.push(
        `Limited ${pattern} exercises available (${count} remaining). Consider equipment upgrade.`
      );
    }
  }

  return {
    filteredExercises: filtered,
    removedCount: originalCount - filtered.length,
    substitutions: resolvedSubstitutions,
    warnings,
  };
}

/**
 * Quick check if a user has any safety restrictions
 *
 * @param userProfile - User's safety profile
 * @returns Whether the user has any safety restrictions
 */
export function hasAnySafetyRestrictions(
  userProfile: UserSafetyProfile
): boolean {
  return (
    userProfile.pelvicRisk ||
    userProfile.boneDensityRisk ||
    (userProfile.injuries && userProfile.injuries.length > 0)
  );
}

/**
 * Get a summary of active safety filters for a user
 *
 * @param userProfile - User's safety profile
 * @returns Array of active filter descriptions
 */
export function getActiveSafetyFilters(
  userProfile: UserSafetyProfile
): string[] {
  const filters: string[] = [];

  if (userProfile.pelvicRisk) {
    filters.push('Pelvic Floor Safety (no high-impact, no high-pressure)');
  }

  if (userProfile.boneDensityRisk) {
    filters.push('Bone Density Safety (no spinal flexion, no loaded rotation)');
  }

  if (userProfile.injuries && userProfile.injuries.length > 0) {
    const bodyParts = userProfile.injuries.map((i) => i.bodyPart).join(', ');
    filters.push(`Injury Protection (${bodyParts})`);
  }

  return filters;
}

// Re-export all types and functions for convenience
export * from './types';
export * from './screening-questions';
export { applyPelvicFilter, isPelvicSafe } from './pelvic-filter';
export {
  applyBoneDensityFilter,
  isOsteoSafe,
  isBoneBuildingExercise,
} from './bone-density-filter';
export { applyInjuryFilter } from './injury-filter';
export {
  resolveSubstitutions,
  findSafeAlternative,
  findMultipleSafeAlternatives,
} from './substitution-engine';
