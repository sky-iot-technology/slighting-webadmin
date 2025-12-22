import { authenticatedApi } from '@/core/shared/api';
import {
  createWorkOrderDTO,
  GetWorkOrderParamsDto,
  WorkOrder,
  WorkOrderHistoryResponse,
  WorkOrderListResponse,
  WorkOrderUpdatePayload
} from './types';

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
