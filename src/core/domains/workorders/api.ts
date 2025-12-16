import { authenticatedApi } from '@/core/shared/api';
import {
  createWorkOrderDTO,
  GetWorkOrderParamsDto,
  WorkOrder,
  WorkOrderHistoryResponse,
  WorkOrderListResponse,
  WorkOrderUpdatePayload
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

  async updateWorkOrder(
    id: string,
    data: WorkOrderUpdatePayload
  ): Promise<WorkOrder> {
    try {
      const response = await authenticatedApi.put<WorkOrder>(
        `/alarms/work_order/${id}`,
        data
      );
      return response;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(`Failed to update Work Order`);
    }
  },
  async uploadToDomain(
    domainId: string,
    file: File
  ): Promise<{ url: string; path: string; name: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await authenticatedApi.post<{
        url: string;
        path: string;
        name: string;
      }>(`/d/upload?domain=${domainId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response;
    } catch (error) {
      throw new Error('Failed to upload avatar user');
    }
  },
  async uploadAttachments(
    domainId: string,
    files: File[]
  ): Promise<{ url: string; path: string; name: string }[]> {
    try {
      const result = await Promise.allSettled(
        files.map(async (file) => {
          const res = this.uploadToDomain(domainId, file);
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
  },
  async deleteAttachments(
    urls: string[]
  ): Promise<{ path: string; success: boolean }[]> {
    try {
      const results = await Promise.allSettled(
        urls.map(async (url) => {
          await usersApi.deleteAvatar(url);
          return { url, success: true };
        })
      );

      return results.map((r, i) => ({
        path: urls[i],
        success: r.status === 'fulfilled'
      }));
    } catch (error) {
      throw new Error('Failed to delete attachments');
    }
  },
  async getHistory(id: string): Promise<WorkOrderHistoryResponse> {
    try {
      const response = await authenticatedApi.get<WorkOrderHistoryResponse>(
        `/alarms/work_order/${id}/histories`
      );
      return response;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(`Failed to get Work Order history`);
    }
  },
  async getWorkOrder(id: string): Promise<WorkOrder> {
    try {
      const response = await authenticatedApi.get<WorkOrder>(
        `/alarms/work_order/${id}`
      );
      return response;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(`Failed to get Work Order`);
    }
  },
  async deleteWorkOrderById(id: string): Promise<void> {
    try {
      await authenticatedApi.delete<void>(`/alarms/work_order/${id}`);
    } catch (error: any) {
      console.error('Delete work order by id: ', error.message);
      throw new Error(error);
    }
  }
};
