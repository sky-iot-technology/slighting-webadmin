import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import {
  Attachment,
  createWorkOrderDTO,
  GetWorkOrderParamsDto,
  History,
  WorkOrder,
  WorkOrderHistoryResponse,
  WorkOrderListResponse,
  WorkOrderStatus
} from './types';
import { workorderApi } from './api';
import { toast } from 'sonner';
import { WorkOrderFormSchema } from '@/core/domains/workorders';

export const WORKORDER_QUERY_KEY = 'workorders';

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
    queryKey: [WORKORDER_QUERY_KEY, params],
    queryFn: () => workorderApi.getAll(params),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useCreateWorkOrder = (
  options?: UseMutationOptions<
    void,
    Error,
    { alarmId: string; data: WorkOrderFormSchema }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { alarmId: string; data: WorkOrderFormSchema }
  >({
    ...options,
    mutationFn: async ({ alarmId, data }) => {
      let attachments: Attachment[] = [];
      if (data.admin_attachments?.length) {
        attachments = (
          await workorderApi.uploadAttachments(data.admin_attachments)
        ).map((file) => ({
          file_name: file.name,
          file_url: file.url
        }));
      }

      const payload: createWorkOrderDTO = {
        ...data,
        alarm_id: alarmId,
        source: 'SYSTEM',
        work_order_status: WorkOrderStatus.OPEN,
        admin_attachments: attachments
      };

      return workorderApi.createWorkOrder(payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [WORKORDER_QUERY_KEY] });

      toast.success('Create WorkOrder successfully!');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to create WorkOrder:', error);
      toast.error(error.message || 'Failed to create WorkOrder');
      options?.onError?.(error, variables, context);
    }
  });
};

export const useGetHistoryById = (
  id: string | number,
  options?: Omit<
    UseQueryOptions<
      WorkOrderHistoryResponse,
      Error,
      WorkOrderHistoryResponse,
      readonly [string, string, string | number]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    WorkOrderHistoryResponse,
    Error,
    WorkOrderHistoryResponse,
    readonly [string, string, string | number]
  >({
    queryKey: [WORKORDER_QUERY_KEY, 'history', String(id)],
    queryFn: () => workorderApi.getHistory(String(id)),
    enabled: !!id,
    ...options
  });
};

export const useGetWorkOrderById = (
  id: string | number,
  options?: Omit<
    UseQueryOptions<
      WorkOrder,
      Error,
      WorkOrder,
      readonly [string, string, string | number]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    WorkOrder,
    Error,
    WorkOrder,
    readonly [string, string, string | number]
  >({
    queryKey: [WORKORDER_QUERY_KEY, 'detail', String(id)],
    queryFn: () => workorderApi.getWorkOrder(String(id)),
    enabled: !!id,
    ...options
  });
};
