import { PrismaClient, Exercise } from '@prisma/client';
import { getCurrentPhase, getPhaseConfig } from './cycle-calculator';
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
 * User data required for cycle-sync workout generation.
 */
interface CycleSyncUserData {
  dateOfBirth: Date;
  healthMetadata: {
    lastPeriodDate: Date;
    avgCycleLength: number;
  };
}

/**
 * Standard movement patterns for a balanced workout.
 */
const MOVEMENT_PATTERNS = ['SQUAT', 'HINGE', 'PUSH', 'PULL', 'CORE'] as const;

/**
 * Maps input phase to database phase recommendation value.
 */
function mapPhaseToDbValue(phase: string): string {
  const mapping: Record<string, string> = {
    menstrual: 'ANY', // No specific phase recommendation for menstrual
    follicular: 'FOLLICULAR',
    ovulatory: 'OVULATORY',
    luteal: 'LUTEAL',
  };
  return mapping[phase] || 'ANY';
}

/**
 * Generates a cycle-sync workout for users aged 20-39.
 * Workout structure adapts to the current menstrual phase.
 *
 * @param input - Workout generation input parameters
 * @param user - User data including health metadata
 * @param preFilteredExercises - Optional pre-filtered exercises (safety-filtered)
 * @returns Generated workout plan
 */
export async function generateCycleSyncWorkout(
  input: GenerateWorkoutInput,
  user: CycleSyncUserData,
  preFilteredExercises?: Exercise[]
): Promise<GeneratedWorkout> {
  // 1. Get current phase and configuration
  const phase = getCurrentPhase(
    user.healthMetadata.lastPeriodDate,
    user.healthMetadata.avgCycleLength
  );
  const config = getPhaseConfig(phase);

  // 2. Get exercises - use pre-filtered if provided, otherwise fetch from DB
  const allExercises = preFilteredExercises || (await prisma.exercise.findMany());
  const availableExercises = filterByEquipment(allExercises, input.equipment);

  // 3. Select exercises by movement pattern
  const selectedExercises: ExerciseBlock[] = [];
  const dbPhase = mapPhaseToDbValue(phase);

  for (const pattern of MOVEMENT_PATTERNS) {
    const candidates = availableExercises.filter(
      (e) => e.movementPattern === pattern
    );

    if (candidates.length === 0) continue;

    // Prefer phase-specific exercises if available
    const phaseSpecific = candidates.filter(
      (e) => e.phaseRecommendation === dbPhase || e.phaseRecommendation === 'ANY'
    );

    const pool = phaseSpecific.length > 0 ? phaseSpecific : candidates;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    selectedExercises.push({
      exerciseId: selected.id,
      exerciseName: selected.name,
      movementPattern: selected.movementPattern,
      sets: config.sets,
      reps: config.reps,
      restSeconds: config.restSeconds,
      targetRpe: config.targetRpe,
      videoUrl: selected.videoUrl || undefined,
    });
  }

  // 4. Build cardio block if requested
  let cardio: CardioBlock | undefined = undefined;
  if (input.includeCardio) {
    if (config.allowHIIT) {
      cardio = {
        type: 'HIIT',
        durationMinutes: 15,
        instructions:
          '30 seconds work, 30 seconds rest. Repeat 15 rounds. Choose: battle ropes, burpees, or bike sprints.',
      };
    } else {
      cardio = {
        type: 'LISS',
        durationMinutes: 20,
        instructions:
          'Steady-state cardio at conversational pace. Choose: incline walking, cycling, or swimming.',
      };
    }
  }

  // 5. Build warmup
  const warmup: WarmupBlock = {
    durationMinutes: 5,
    exercises: [
      { name: 'Arm Circles', duration: '30s' },
      { name: 'Leg Swings', duration: '30s each leg' },
      { name: 'Cat-Cow', duration: '60s' },
      { name: 'Bodyweight Squats', duration: '10 reps' },
      { name: 'Glute Bridges', duration: '10 reps' },
    ],
  };

  // 6. Build cooldown
  const cooldown: CooldownBlock = {
    durationMinutes: 5,
    exercises: [
      { name: 'Quad Stretch', duration: '30s each leg' },
      { name: 'Hamstring Stretch', duration: '30s each leg' },
      { name: 'Pigeon Pose', duration: '45s each side' },
      { name: "Child's Pose", duration: '60s' },
    ],
  };

  // 7. Calculate duration
  const mainWorkoutMins = selectedExercises.reduce((acc, ex) => {
    const repsNum = typeof ex.reps === 'number' ? ex.reps : 10;
    const setTime = (ex.sets * repsNum * 3) / 60; // ~3 sec per rep
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
    protocol: 'cycle_sync',
    phase,
    dayNumber: 1, // Will be set by weekly planner
    totalDays: input.frequencyPerWeek,
    warmup,
    mainWorkout: selectedExercises,
    cardio,
    cooldown,
    estimatedDurationMinutes: totalDuration,
  };
}
