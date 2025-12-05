import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import {
  AcknowledgedAlarm,
  Alarm,
  AlarmResponse,
  GetAlarmsParamsDto
} from './types';
import { alarmApi } from './api';
import { toast } from 'sonner';
import { useAuthStore } from '../auth';

export const ALARMS_QUERY_KEY = 'alarms';

export const useGetAlarms = (
  params?: GetAlarmsParamsDto,
  options?: Omit<
    UseQueryOptions<
      AlarmResponse,
      Error,
      AlarmResponse,
      readonly [string, Partial<GetAlarmsParamsDto>?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    AlarmResponse,
    Error,
    AlarmResponse,
    readonly [string, Partial<GetAlarmsParamsDto>?]
  >({
    queryKey: [ALARMS_QUERY_KEY, params],
    queryFn: () => alarmApi.getAll(params),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useAcknowledgedAlarm = (
  options?: UseMutationOptions<Alarm, Error, { id: string }>
) => {
  const queryClient = useQueryClient();

  const { user } = useAuthStore();

  return useMutation<Alarm, Error, { id: string }>({
    ...options,
    mutationFn: ({ id }) => {
      if (!user) {
        throw new Error('User is not authenticated');
      }

      const payload: AcknowledgedAlarm = {
        status: 'active',
        acknowledged_by: user?.id,
        acknowledged_at: new Date().toISOString()
      };
      return alarmApi.AcknowledgedAlarm(id, payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [ALARMS_QUERY_KEY] });

      // queryClient.setQueryData(
      //   [ALARMS_QUERY_KEY, 'detail', variables.id], data
      // );

      toast.success('Acknowleged alarm successfully!');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to acknowleged alarm:', error);
      toast.error(error.message || 'Failed to acknowleged alarm');
      options?.onError?.(error, variables, context);
    }
  });
};
