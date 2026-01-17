import { differenceInDays } from 'date-fns';
import { Phase, PhaseConfig } from './types';

/**
 * Calculates the current menstrual cycle phase based on last period date.
 * Phases scale proportionally for non-28-day cycles.
 *
 * Standard 28-day cycle phases:
 * - Menstrual: Days 1-5
 * - Follicular: Days 6-14
 * - Ovulatory: Days 15-17
 * - Luteal: Days 18-28
 *
 * @param lastPeriodDate - Date of the last period start
 * @param avgCycleLength - Average cycle length in days (default: 28)
 * @returns Current menstrual phase
 */
export function getCurrentPhase(
  lastPeriodDate: Date,
  avgCycleLength: number = 28
): Phase {
  const today = new Date();
  const daysSinceStart = differenceInDays(today, lastPeriodDate);
  const dayOfCycle = (daysSinceStart % avgCycleLength) + 1; // 1-indexed

  // Scale phases proportionally for non-28-day cycles
  const scale = avgCycleLength / 28;

  if (dayOfCycle <= Math.round(5 * scale)) return 'menstrual';
  if (dayOfCycle <= Math.round(14 * scale)) return 'follicular';
  if (dayOfCycle <= Math.round(17 * scale)) return 'ovulatory';
  return 'luteal';
}

/**
 * Gets the workout configuration for a given menstrual phase.
 * Each phase has specific parameters optimized for hormonal fluctuations.
 *
 * @param phase - Current menstrual phase
 * @returns Phase-specific workout configuration
 */
export function getPhaseConfig(phase: Phase): PhaseConfig {
  const configs: Record<Phase, PhaseConfig> = {
    menstrual: {
      intensity: 'low',
      sets: 2,
      reps: 12,
      restSeconds: 90,
      targetRpe: 5,
      cardioType: 'LISS',
      allowHIIT: false,
    },
    follicular: {
      intensity: 'high',
      sets: 4,
      reps: 8,
      restSeconds: 60,
      targetRpe: 8,
      cardioType: 'HIIT',
      allowHIIT: true,
    },
    ovulatory: {
      intensity: 'peak',
      sets: 4,
      reps: 6,
      restSeconds: 90,
      targetRpe: 9,
      cardioType: 'HIIT',
      allowHIIT: true,
    },
    luteal: {
      intensity: 'moderate',
      sets: 3,
      reps: 10,
      restSeconds: 120,
      targetRpe: 6,
      cardioType: 'LISS',
      allowHIIT: false,
    },
  };
  return configs[phase];
}

/**
 * Gets the day of the current cycle.
 *
 * @param lastPeriodDate - Date of the last period start
 * @param avgCycleLength - Average cycle length in days (default: 28)
 * @returns Current day of cycle (1-indexed)
 */
export function getDayOfCycle(
  lastPeriodDate: Date,
  avgCycleLength: number = 28
): number {
  const today = new Date();
  const daysSinceStart = differenceInDays(today, lastPeriodDate);
  return (daysSinceStart % avgCycleLength) + 1;
}
