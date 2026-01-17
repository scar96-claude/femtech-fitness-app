import { PrismaClient } from '@prisma/client';
import { getProtocol } from './demographic-router';
import { generateCycleSyncWorkout } from './cycle-sync-generator';
import { generateOsteoStrongWorkout } from './osteo-strong-generator';
import { GenerateWorkoutInput, GeneratedWorkout } from './types';
import {
  applySafetyFilters,
  UserSafetyProfile,
  InjuryRecord,
} from '../safety';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Main entry point for workout generation.
 * Routes to the appropriate protocol based on user age and generates
 * a personalized workout plan with safety filters applied.
 *
 * @param input - Workout generation parameters
 * @returns Generated workout plan
 * @throws Error if user not found or missing required health metadata
 */
export async function generateWorkout(
  input: GenerateWorkoutInput
): Promise<GeneratedWorkout> {
  // 1. Fetch user with health metadata
  const user = await prisma.userProfile.findUnique({
    where: { id: input.userId },
    include: { healthMetadata: true },
  });

  if (!user) {
    throw new Error(`User not found: ${input.userId}`);
  }

  if (!user.healthMetadata) {
    throw new Error(`Health metadata not found for user: ${input.userId}`);
  }

  // 2. Build safety profile from user's health metadata
  const safetyProfile: UserSafetyProfile = {
    pelvicRisk: user.healthMetadata.pelvicRisk,
    boneDensityRisk: user.healthMetadata.boneDensityRisk,
    injuries: (user.healthMetadata.injuryHistory as InjuryRecord[]) || [],
  };

  // 3. Get all exercises and apply safety filters
  const allExercises = await prisma.exercise.findMany();
  const safetyResult = await applySafetyFilters(allExercises, safetyProfile);

  // Log warnings if any
  if (safetyResult.warnings.length > 0) {
    console.log('Safety warnings:', safetyResult.warnings);
  }

  // 4. Route to correct protocol based on age
  const protocol = getProtocol(user.dateOfBirth);

  // 5. Generate workout using appropriate generator with filtered exercises
  if (protocol === 'cycle_sync') {
    if (!user.healthMetadata.lastPeriodDate) {
      throw new Error('Cycle sync requires lastPeriodDate in health metadata');
    }
    return generateCycleSyncWorkout(
      input,
      {
        dateOfBirth: user.dateOfBirth,
        healthMetadata: {
          lastPeriodDate: user.healthMetadata.lastPeriodDate,
          avgCycleLength: user.healthMetadata.avgCycleLength,
        },
      },
      safetyResult.filteredExercises
    );
  }

  return generateOsteoStrongWorkout(input, safetyResult.filteredExercises);
}

/**
 * Disconnects the Prisma client.
 * Call this when shutting down the application.
 */
export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}

// Re-export types for external use
export * from './types';
export { getProtocol } from './demographic-router';
export { getCurrentPhase, getPhaseConfig } from './cycle-calculator';
export { filterByEquipment } from './equipment-filter';
