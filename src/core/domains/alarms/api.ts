import {
  AcknowledgedAlarm,
  Alarm,
  AlarmResponse,
  CompletedAlarm,
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
  },

  async CompletedAlarm(id: string, data: CompletedAlarm): Promise<Alarm> {
    try {
      const response = await authenticatedApi.put<Alarm>(`/alarms/${id}`, data);
      return response;
    } catch (error: any) {
      console.error('Acknowledged error:', error.message);
      throw new Error(error);
    }
  },

  async getAlarmById(id: string): Promise<Alarm> {
    try {
      const response = await authenticatedApi.get<Alarm>(`/alarms/${id}`);
      return response;
    } catch (error: any) {
      console.error('Get Alarm By Id error:', error.message);
      throw new Error(error);
    }
  },

  async deleteAlarmById(id: string): Promise<void> {
    try {
      await authenticatedApi.delete<void>(`/alarms/${id}`);
    } catch (error: any) {
      console.error('Delete alarm by id: ', error.message);
      throw new Error(error);
    }
  },

  async deleteAlarmByIds(ids: string[]): Promise<void> {
    try {
      await authenticatedApi.delete<void>(`/alarms`, ids);
    } catch (error: any) {
      console.error('Delete alarm by ids: ', error.message);
      throw new Error(error);
    }
  }
};
