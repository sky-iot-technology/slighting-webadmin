import { authenticatedApi } from '@/core/shared/api';
import {
  createWorkOrderDTO,
  GetWorkOrderParamsDto,
  WorkOrderListResponse
} from './types';
import { usersApi } from '../users';

export const workorderApi = {
  async getAll(params?: GetWorkOrderParamsDto): Promise<WorkOrderListResponse> {
    const response = await authenticatedApi.get<WorkOrderListResponse>(
      `/alarms/work_order`,
      {
        params: {
          dir: 'asc',
          ...params
        }
      }
    );
    return response;
  },

  async createWorkOrder(data: createWorkOrderDTO): Promise<void> {
    try {
      await authenticatedApi.post<void>(`/alarms/work_order`, data);
    } catch (error: any) {
      console.error(error.message);
      throw new Error(`Failed to create Work Order`);
    }
  },
  async uploadAttachments(
    files: File[]
  ): Promise<{ url: string; path: string; name: string }[]> {
    try {
      const result = await Promise.allSettled(
        files.map(async (file) => {
          const res = usersApi.upload(file);
          return res;
        })
      );

      return result
        .filter(
          (
            r
          ): r is PromiseFulfilledResult<{
            url: string;
            path: string;
            name: string;
          }> => r.status === 'fulfilled'
        )
        .map((r) => ({
          name: r.value.name,
          url: r.value.url,
          path: r.value.path
        }));
    } catch (error) {
      throw new Error('Failed to upload attachments');
    }
  }
};
