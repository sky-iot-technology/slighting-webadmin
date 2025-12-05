import { authenticatedApi } from '@/core/shared/api';
import { GetWorkOrderParamsDto, WorkOrderListResponse } from './types';

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
  }
};
