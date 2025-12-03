import type {
  UseMutationOptions,
  UseQueryOptions
} from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DashboardOverview } from './type';
import { OverViewApi } from './api';

// Query keys
export const DASHBOARDS_QUERY_KEY = 'overview';

export const useGetOverView = (
  options?: Omit<
    UseQueryOptions<
      DashboardOverview,
      Error,
      DashboardOverview,
      readonly [string]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    DashboardOverview,
    Error,
    DashboardOverview,
    readonly [string]
  >({
    queryKey: [DASHBOARDS_QUERY_KEY],
    queryFn: () => OverViewApi.getAll(),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};
