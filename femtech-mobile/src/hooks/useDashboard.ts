import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { useUserStore } from '@/stores/userStore';
import { useCyclePhase } from './useCyclePhase';
import { DashboardData } from '@/types';

export function useDashboard() {
  const { profile, healthMetadata } = useUserStore();

  const dashboardQuery = useQuery<{ data: DashboardData }>({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.getDashboard(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const cycleInfo = useCyclePhase(
    healthMetadata?.lastPeriodDate || null,
    healthMetadata?.avgCycleLength || 28
  );

  const isReproductive = profile?.demographic === 'reproductive';

  return {
    isLoading: dashboardQuery.isLoading,
    error: dashboardQuery.error,
    data: dashboardQuery.data?.data,
    cycleInfo,
    isReproductive,
    refetch: dashboardQuery.refetch,
  };
}
