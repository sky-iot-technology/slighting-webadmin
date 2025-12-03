import { authenticatedApi } from '@/core/shared/api';
import { DashboardOverview } from './type';

export const OverViewApi = {
  async getAll(): Promise<DashboardOverview> {
    try {
      const res = authenticatedApi.get<DashboardOverview>(`/system/dashboard`);
      return res;
    } catch (error: any) {
      console.error('❌ Can not get OverView: ', error.message);
      throw new Error(error.message);
    }
  }
};
