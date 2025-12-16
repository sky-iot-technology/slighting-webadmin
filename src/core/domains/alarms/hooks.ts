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
  CompletedAlarm,
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
        acknowledged_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: user.id
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

export const useCompletedAlarm = (
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

      const payload: CompletedAlarm = {
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: user.id
      };
      return alarmApi.CompletedAlarm(id, payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [ALARMS_QUERY_KEY] });

      // queryClient.setQueryData(
      //   [ALARMS_QUERY_KEY, 'detail', variables.id], data
      // );

      toast.success('Completed alarm successfully!');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to completed alarm:', error);
      toast.error(error.message || 'Failed to completed alarm');
      options?.onError?.(error, variables, context);
    }
  });
};

export const useGetAlarmById = (
  id: string | number,
  options?: Omit<
    UseQueryOptions<
      Alarm,
      Error,
      Alarm,
      readonly [string, string, string | number]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    Alarm,
    Error,
    Alarm,
    readonly [string, string, string | number]
  >({
    queryKey: [ALARMS_QUERY_KEY, 'detail', String(id)],
    queryFn: () => alarmApi.getAlarmById(String(id)),
    enabled: !!id,
    ...options
  });
};

export const useDeleteAlarm = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    ...options,
    mutationFn: (id) => alarmApi.deleteAlarmById(id),
    onSuccess: (data, deleteId, context) => {
      //Remove alarm from cache
      queryClient.removeQueries({
        queryKey: [ALARMS_QUERY_KEY, 'detail', String(deleteId)]
      });

      queryClient.invalidateQueries({
        queryKey: [ALARMS_QUERY_KEY]
      });

      toast.success('Alarm deleted successfully');
      options?.onSuccess?.(data, deleteId, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete alarm: ', error);
      toast.error(error.message || 'Failed to delete alarm');
      options?.onError?.(error, variables, context);
    }
  });
};

export const useDeleteAlarms = (
  options?: UseMutationOptions<void, Error, string[]>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string[]>({
    ...options,
    mutationFn: (ids) => alarmApi.deleteAlarmByIds(ids),
    onSuccess: (data, ids, context) => {
      //Remove alarm from cache
      ids.forEach((id) => {
        queryClient.removeQueries({
          queryKey: [ALARMS_QUERY_KEY, 'detail', String(id)]
        });
      });

      queryClient.invalidateQueries({
        queryKey: [ALARMS_QUERY_KEY]
      });

      toast.success('Alarms deleted successfully');
      options?.onSuccess?.(data, ids, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete alarms: ', error);
      toast.error(error.message || 'Failed to delete alarms');
      options?.onError?.(error, variables, context);
    }
  });
};
