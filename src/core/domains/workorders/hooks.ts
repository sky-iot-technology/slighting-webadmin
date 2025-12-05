import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { GetWorkOrderParamsDto, WorkOrderListResponse } from './types';
import { workorderApi } from './api';

export const ALARMS_QUERY_KEY = 'workorders';

export const useGetWorkOrders = (
  params?: GetWorkOrderParamsDto,
  options?: Omit<
    UseQueryOptions<
      WorkOrderListResponse,
      Error,
      WorkOrderListResponse,
      readonly [string, Partial<GetWorkOrderParamsDto>?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    WorkOrderListResponse,
    Error,
    WorkOrderListResponse,
    readonly [string, Partial<GetWorkOrderParamsDto>?]
  >({
    queryKey: [ALARMS_QUERY_KEY, params],
    queryFn: () => workorderApi.getAll(params),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

// export const useAcknowledgedAlarm = (
//   options?: UseMutationOptions<Alarm, Error, { id: string }>
// ) => {
//   const queryClient = useQueryClient();

//   const { user } = useAuthStore();

//   return useMutation<Alarm, Error, { id: string }>({
//     ...options,
//     mutationFn: ({ id }) => {
//       if (!user) {
//         throw new Error('User is not authenticated');
//       }

//       const payload: AcknowledgedAlarm = {
//         status: 'active',
//         acknowledged_by: user?.id,
//         acknowledged_at: new Date().toISOString()
//       };
//       return alarmApi.AcknowledgedAlarm(id, payload);
//     },
//     onSuccess: (data, variables, context) => {
//       queryClient.invalidateQueries({ queryKey: [ALARMS_QUERY_KEY] });

//       // queryClient.setQueryData(
//       //   [ALARMS_QUERY_KEY, 'detail', variables.id], data
//       // );

//       toast.success('Acknowleged alarm successfully!');
//       options?.onSuccess?.(data, variables, context);
//     },
//     onError: (error, variables, context) => {
//       console.error('Failed to acknowleged alarm:', error);
//       toast.error(error.message || 'Failed to acknowleged alarm');
//       options?.onError?.(error, variables, context);
//     }
//   });
// };
