import { useMemo } from 'react';
import { CyclePhaseInfo } from '@/types';

const CYCLE_PHASES: Record<string, CyclePhaseInfo> = {
  menstrual: {
    name: 'menstrual',
    displayName: 'Menstrual',
    color: '#ef4444',
    description: 'Rest & recover',
    workoutTip: 'Focus on gentle movement. Your body is recovering.',
    dayRange: 'Days 1-5',
  },
  follicular: {
    name: 'follicular',
    displayName: 'Follicular',
    color: '#22c55e',
    description: 'Build & grow',
    workoutTip: 'Energy is rising! Great time for heavy lifts and new PRs.',
    dayRange: 'Days 6-14',
  },
  ovulatory: {
    name: 'ovulatory',
    displayName: 'Ovulatory',
    color: '#f59e0b',
    description: 'Peak power',
    workoutTip: "You're at your strongest. Push for personal records!",
    dayRange: 'Days 15-17',
  },
  luteal: {
    name: 'luteal',
    displayName: 'Luteal',
    color: '#8b5cf6',
    description: 'Maintain & sustain',
    workoutTip: 'Energy may dip. Focus on consistency over intensity.',
    dayRange: 'Days 18-28',
  },
};

function normalizeCycleLength(avgCycleLength: number): number {
  if (!Number.isFinite(avgCycleLength) || avgCycleLength <= 0) {
    return 28;
  }
  return Math.round(avgCycleLength);
}

function differenceInDays(date1: Date, date2: Date): number {
  const diffTime = date1.getTime() - date2.getTime();
  if (diffTime <= 0) {
    return 0;
  }
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function useCyclePhase(lastPeriodDate: string | null, avgCycleLength: number = 28) {
  return useMemo(() => {
    if (!lastPeriodDate) return null;

    const normalizedCycleLength = normalizeCycleLength(avgCycleLength);
    const today = new Date();
    const periodStart = new Date(lastPeriodDate);
    const daysSinceStart = differenceInDays(today, periodStart);
    const cycleDay = (daysSinceStart % normalizedCycleLength) + 1;

    // Scale phases for non-28-day cycles
    const scale = normalizedCycleLength / 28;

    let phase: CyclePhaseInfo;
    let daysUntilNextPhase: number;

    if (cycleDay <= Math.round(5 * scale)) {
      phase = CYCLE_PHASES.menstrual;
      daysUntilNextPhase = Math.round(5 * scale) - cycleDay + 1;
    } else if (cycleDay <= Math.round(14 * scale)) {
      phase = CYCLE_PHASES.follicular;
      daysUntilNextPhase = Math.round(14 * scale) - cycleDay + 1;
    } else if (cycleDay <= Math.round(17 * scale)) {
      phase = CYCLE_PHASES.ovulatory;
      daysUntilNextPhase = Math.round(17 * scale) - cycleDay + 1;
    } else {
      phase = CYCLE_PHASES.luteal;
      daysUntilNextPhase = normalizedCycleLength - cycleDay + 1;
    }

    return {
      phase,
      cycleDay,
      daysUntilNextPhase,
      totalDays: normalizedCycleLength,
      progress: cycleDay / normalizedCycleLength,
    };
  }, [lastPeriodDate, avgCycleLength]);
}

export { CYCLE_PHASES };
