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
  WorkOrderStatus,
  WorkOrderUpdateForm,
  WorkOrderUpdatePayload
} from './types';
import { workorderApi } from './api';
import { toast } from 'sonner';
import { WorkOrderFormSchema } from '@/core/domains/workorders';
import { useAuthStore } from '../auth';
import { ALARMS_QUERY_KEY } from '../alarms/hooks';

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
  const { domainId, user } = useAuthStore();
  return useMutation<
    void,
    Error,
    { alarmId: string; data: WorkOrderFormSchema }
  >({
    ...options,
    mutationFn: async ({ alarmId, data }) => {
      if (!domainId || !user) {
        throw new Error('Not authenticated');
      }
      let attachments: Attachment[] = [];
      if (data.admin_attachments?.length) {
        attachments = (
          await workorderApi.uploadAttachments(domainId, data.admin_attachments)
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
        admin_attachments: attachments,
        updated_at: new Date().toISOString(),
        updated_by: user.id
      };

      return workorderApi.createWorkOrder(payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [WORKORDER_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ALARMS_QUERY_KEY] });
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

async function processAttachmentUpdate(
  domainId: string,
  data: {
    new?: File[];
    keep?: Attachment[];
    delete?: Attachment[];
  }
) {
  let finalList: Attachment[] = [...(data.keep ?? [])];

  //delete old files
  if (data.delete?.length) {
    await workorderApi.deleteAttachments(
      data.delete.map((file) => file.file_url)
    );
  }

  // 2. UPLOAD new files
  if (data.new?.length) {
    const uploaded = await workorderApi.uploadAttachments(domainId, data.new);
    finalList = [
      ...finalList,
      ...uploaded.map((f) => ({
        file_name: f.name,
        file_url: f.url
      }))
    ];
  }

  return finalList;
}

export const useUpdateWorkOrder = (
  options?: UseMutationOptions<
    WorkOrder,
    Error,
    { workOrderId: string; data: WorkOrderUpdateForm }
  >
) => {
  const queryClient = useQueryClient();
  const { domainId, user } = useAuthStore();
  return useMutation<
    WorkOrder,
    Error,
    { workOrderId: string; data: WorkOrderUpdateForm }
  >({
    ...options,
    mutationFn: async ({ workOrderId, data }) => {
      if (!domainId || !user) {
        throw new Error('Not authenticated');
      }

      let finalAdminAttachments = data.admin_attachments
        ? await processAttachmentUpdate(domainId, data.admin_attachments)
        : undefined;

      let finalAttachments = data.attachments
        ? await processAttachmentUpdate(domainId, data.attachments)
        : undefined;

      const payload: WorkOrderUpdatePayload = {
        ...data,
        admin_attachments: finalAdminAttachments,
        attachments: finalAttachments,
        updated_at: new Date().toISOString(),
        updated_by: user.id
      };
      return workorderApi.updateWorkOrder(String(workOrderId), payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [WORKORDER_QUERY_KEY] });

      toast.success('Update WorkOrder successfully!');
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

async function deleteWorkOrderCascade(id: string, domainId: string) {
  const detail = await workorderApi.getWorkOrder(id);
  const attachment = [
    ...(detail.attachments ?? []),
    ...(detail.admin_attachments ?? [])
  ];

  if (attachment.length) {
    processAttachmentUpdate(domainId, { delete: attachment });
  }

  await workorderApi.deleteWorkOrderById(id);
}

export const useDeleteWorkOrder = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { domainId } = useAuthStore();
  return useMutation<void, Error, string>({
    ...options,
    mutationFn: (id) => {
      if (!domainId) {
        throw new Error('Not authenticated');
      }
      return deleteWorkOrderCascade(id, domainId);
    },
    onSuccess: (data, deleteId, context) => {
      //Remove work order from cache
      queryClient.removeQueries({
        queryKey: [WORKORDER_QUERY_KEY, 'detail', String(deleteId)]
      });

      queryClient.removeQueries({
        queryKey: [WORKORDER_QUERY_KEY, 'history', String(deleteId)]
      });

      queryClient.invalidateQueries({
        queryKey: [WORKORDER_QUERY_KEY]
      });

      toast.success('Work Order deleted successfully');
      options?.onSuccess?.(data, deleteId, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete work order: ', error);
      toast.error(error.message || 'Failed to delete work order');
      options?.onError?.(error, variables, context);
    }
  });
};
