import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { useUserStore } from '@/stores/userStore';
import {
  ProgressStats,
  WorkoutHistoryItem,
  PersonalRecord,
  CycleHistoryItem,
  Achievement,
} from '@/types';

interface ProgressData {
  stats: ProgressStats | undefined;
  history: WorkoutHistoryItem[] | undefined;
  records: PersonalRecord[] | undefined;
  cycleHistory: CycleHistoryItem[] | undefined;
  achievements: Achievement[] | undefined;
  isLoading: boolean;
  isReproductive: boolean;
  refetch: () => void;
}

export function useProgress(): ProgressData {
  const { profile } = useUserStore();
  const isReproductive = profile?.demographic === 'reproductive';

  const statsQuery = useQuery({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      const response = await apiClient.getProgressStats();
      return response.data as ProgressStats;
    },
  });

  const historyQuery = useQuery({
    queryKey: ['workout-history'],
    queryFn: async () => {
      const response = await apiClient.getWorkoutHistoryPaginated(20, 0);
      return response.data as WorkoutHistoryItem[];
    },
  });

  const recordsQuery = useQuery({
    queryKey: ['personal-records'],
    queryFn: async () => {
      const response = await apiClient.getPersonalRecords();
      return response.data as PersonalRecord[];
    },
  });

  const cycleQuery = useQuery({
    queryKey: ['cycle-history'],
    queryFn: async () => {
      const response = await apiClient.getCycleHistory();
      return response.data as CycleHistoryItem[];
    },
    enabled: isReproductive,
  });

  const achievementsQuery = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const response = await apiClient.getAchievements();
      return response.data as Achievement[];
    },
  });

  return {
    stats: statsQuery.data,
    history: historyQuery.data,
    records: recordsQuery.data,
    cycleHistory: cycleQuery.data,
    achievements: achievementsQuery.data,
    isLoading: statsQuery.isLoading || historyQuery.isLoading,
    isReproductive,
    refetch: () => {
      statsQuery.refetch();
      historyQuery.refetch();
      recordsQuery.refetch();
      if (isReproductive) {
        cycleQuery.refetch();
      }
      achievementsQuery.refetch();
    },
  };
}
