import {
  AcknowledgedAlarm,
  Alarm,
  AlarmResponse,
  GetAlarmsParamsDto
} from './types';
import { authenticatedApi } from '@/core/shared/api';

export const alarmApi = {
  async getAll(params?: GetAlarmsParamsDto): Promise<AlarmResponse> {
    const response = await authenticatedApi.get<AlarmResponse>(`/alarms`, {
      params: {
        dir: 'asc',
        ...params
      }
    });
    return response;
  },

  async AcknowledgedAlarm(id: string, data: AcknowledgedAlarm): Promise<Alarm> {
    try {
      const response = await authenticatedApi.put<Alarm>(`/alarms/${id}`, data);
      return response;
    } catch (error: any) {
      console.error('Acknowledged error:', error.message);
      throw new Error(error);
    }
  }
};
