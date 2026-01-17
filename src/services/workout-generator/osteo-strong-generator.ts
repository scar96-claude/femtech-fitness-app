import { PrismaClient } from '@prisma/client';
import { filterByEquipment } from './equipment-filter';
import {
  GenerateWorkoutInput,
  GeneratedWorkout,
  ExerciseBlock,
  WarmupBlock,
  CooldownBlock,
  CardioBlock,
} from './types';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Fixed parameters for the 40-60 demographic (osteo-strong protocol).
 * Optimized for bone density and cortisol management.
 */
const OSTEO_CONFIG = {
  sets: 3,
  reps: 6, // Lower reps, heavier weight
  restSeconds: 150, // 2.5 minutes - full recovery
  targetRpe: 8,
};

/**
 * Required movement patterns in specific order (bone-loading priority).
 * CARRY is included for its axial loading benefits.
 */
const MOVEMENT_PATTERNS = ['SQUAT', 'HINGE', 'PUSH', 'PULL', 'CARRY'] as const;

/**
 * Generates an osteo-strong workout for users aged 40-60.
 * Prioritizes bone density exercises and avoids cortisol spikes.
 *
 * Key differences from cycle-sync:
 * - Never uses HIIT (only SIT or LISS for cardio)
 * - Longer rest periods (150s vs 60-120s)
 * - Prioritizes menopausePriority exercises
 * - Includes impact exercises for bone health
 * - Extended warmup for joint protection
 *
 * @param input - Workout generation input parameters
 * @returns Generated workout plan
 */
export async function generateOsteoStrongWorkout(
  input: GenerateWorkoutInput
): Promise<GeneratedWorkout> {
  // 1. Get all exercises and filter by equipment
  const allExercises = await prisma.exercise.findMany();
  const availableExercises = filterByEquipment(allExercises, input.equipment);

  // 2. Select exercises by movement pattern (bone-loading priority)
  const selectedExercises: ExerciseBlock[] = [];

  for (const pattern of MOVEMENT_PATTERNS) {
    const candidates = availableExercises.filter(
      (e) => e.movementPattern === pattern
    );

    if (candidates.length === 0) continue;

    // PRIORITIZE menopausePriority exercises for bone health
    const prioritized = candidates.filter((e) => e.menopausePriority);
    const pool = prioritized.length > 0 ? prioritized : candidates;

    const selected = pool[Math.floor(Math.random() * pool.length)];

    selectedExercises.push({
      exerciseId: selected.id,
      exerciseName: selected.name,
      movementPattern: selected.movementPattern,
      sets: OSTEO_CONFIG.sets,
      reps: OSTEO_CONFIG.reps,
      restSeconds: OSTEO_CONFIG.restSeconds,
      targetRpe: OSTEO_CONFIG.targetRpe,
      videoUrl: selected.videoUrl || undefined,
      notes:
        pattern === 'SQUAT' || pattern === 'HINGE'
          ? 'Focus on controlled descent. Full range of motion.'
          : undefined,
    });
  }

  // 3. Add IMPACT exercise (critical for bone density)
  const impactExercises = availableExercises.filter(
    (e) =>
      e.name.toLowerCase().includes('heel drop') ||
      e.name.toLowerCase().includes('step up') ||
      e.name.toLowerCase().includes('step-up') ||
      (e.name.toLowerCase().includes('jump') && e.isOsteoSafe) // Only if safe
  );

  if (impactExercises.length > 0) {
    // Prefer heel drops for low-impact bone stimulus
    const impact =
      impactExercises.find((e) =>
        e.name.toLowerCase().includes('heel')
      ) || impactExercises[0];

    selectedExercises.push({
      exerciseId: impact.id,
      exerciseName: impact.name,
      movementPattern: 'IMPACT',
      sets: 3,
      reps: '20',
      restSeconds: 60,
      targetRpe: 5,
      videoUrl: impact.videoUrl || undefined,
      notes: 'Drop heels firmly to create bone-building impact stimulus.',
    });
  }

  // 4. Build cardio block - NEVER HIIT, only SIT or LISS
  let cardio: CardioBlock | undefined = undefined;
  if (input.includeCardio) {
    cardio = {
      type: 'SIT', // Sprint Interval Training
      durationMinutes: 12,
      instructions:
        '20 seconds ALL OUT effort, then 2 minutes complete rest. Repeat 4 times. Use bike or rower (low impact).',
    };
  }

  // 5. Extended warmup (joint protection)
  const warmup: WarmupBlock = {
    durationMinutes: 8, // Longer than cycle-sync
    exercises: [
      { name: 'Cat-Cow', duration: '60s' },
      { name: 'Thoracic Rotations', duration: '30s each side' },
      { name: 'Hip Circles', duration: '30s each direction' },
      { name: 'Ankle Circles', duration: '20s each foot' },
      { name: 'Arm Circles', duration: '30s' },
      { name: 'Bodyweight Squats (slow)', duration: '10 reps' },
      { name: 'Glute Bridges', duration: '10 reps' },
      { name: 'Band Pull-Aparts (if available)', duration: '15 reps' },
    ],
  };

  // 6. Cooldown
  const cooldown: CooldownBlock = {
    durationMinutes: 7,
    exercises: [
      { name: 'Quad Stretch', duration: '45s each leg' },
      { name: 'Hip Flexor Stretch', duration: '45s each side' },
      { name: 'Chest Doorway Stretch', duration: '45s' },
      { name: 'Seated Hamstring Stretch', duration: '60s' },
      { name: 'Neck Rolls', duration: '30s each direction' },
    ],
  };

  // 7. Calculate duration (slower tempo for osteo-strong)
  const mainWorkoutMins = selectedExercises.reduce((acc, ex) => {
    const repsNum = typeof ex.reps === 'number' ? ex.reps : 20;
    const setTime = (ex.sets * repsNum * 4) / 60; // Slower tempo (~4 sec per rep)
    const restTime = (ex.sets * ex.restSeconds) / 60;
    return acc + setTime + restTime;
  }, 0);

  const totalDuration =
    warmup.durationMinutes +
    Math.round(mainWorkoutMins) +
    (cardio?.durationMinutes || 0) +
    cooldown.durationMinutes;

  return {
    userId: input.userId,
    date: new Date().toISOString().split('T')[0],
    protocol: 'osteo_strong',
    dayNumber: 1,
    totalDays: input.frequencyPerWeek,
    warmup,
    mainWorkout: selectedExercises,
    cardio,
    cooldown,
    estimatedDurationMinutes: totalDuration,
  };
}
