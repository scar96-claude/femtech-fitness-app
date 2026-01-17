import { PrismaClient } from '@prisma/client';
import { getProtocol } from './demographic-router';
import { generateCycleSyncWorkout } from './cycle-sync-generator';
import { generateOsteoStrongWorkout } from './osteo-strong-generator';
import { GenerateWorkoutInput, GeneratedWorkout } from './types';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Main entry point for workout generation.
 * Routes to the appropriate protocol based on user age and generates
 * a personalized workout plan.
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

  // 2. Route to correct protocol based on age
  const protocol = getProtocol(user.dateOfBirth);

  // 3. Generate workout using appropriate generator
  if (protocol === 'cycle_sync') {
    if (!user.healthMetadata.lastPeriodDate) {
      throw new Error('Cycle sync requires lastPeriodDate in health metadata');
    }
    return generateCycleSyncWorkout(input, {
      dateOfBirth: user.dateOfBirth,
      healthMetadata: {
        lastPeriodDate: user.healthMetadata.lastPeriodDate,
        avgCycleLength: user.healthMetadata.avgCycleLength,
      },
    });
  }

  return generateOsteoStrongWorkout(input);
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
