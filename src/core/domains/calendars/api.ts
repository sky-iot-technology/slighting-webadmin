import { authenticatedApi } from '@/core/shared/api';
import {
  Calendar,
  CalendarDetailResponseDto,
  CalendarListResponseDto,
  GetCalendarsParamsDto,
  ScheduleStatus,
  DeviceType,
  CreateCalendarDto,
  UpdateCalendarDto,
  GetDeivceCalendarsParamsDto
} from './types';

export const calendarApi = {
  async getAll(
    params?: GetCalendarsParamsDto
  ): Promise<CalendarListResponseDto> {
    const { page = 1, limit = 20, ...rest } = params ?? {};
    const offset = (page - 1) * limit;
    const response = await authenticatedApi.get<CalendarListResponseDto>(
      '/schedules',
      {
        params: {
          offset,
          limit,
          ...params
        }
      }
    );
    return response;
  },

  async createCalendar(data: CreateCalendarDto): Promise<Calendar> {
    try {
      const response = await authenticatedApi.post<Calendar>(
        '/schedules',
        data
      );
      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể tạo lịch. Vui lòng thử lại.';
      console.error('❌ createCalendar error:', message);
      throw new Error(message);
    }
  },

  async deleteCalendar(id: string | number): Promise<void> {
    try {
      await authenticatedApi.delete<Calendar>(`/schedules/${id}`);
    } catch (error: any) {
      console.error('delete error:', error.message);
      throw new Error(error);
    }
  },

  async deleteCalendars(ids: (string | number)[]): Promise<void> {
    try {
      await authenticatedApi.delete<Calendar>(`/schedules`, {
        data: { ids }
      });
    } catch (error: any) {
      console.error('delete error:', error.message);
      throw new Error(error);
    }
  },

  async getById(id: string): Promise<Calendar> {
    try {
      const response = await authenticatedApi.get<Calendar>(`/schedules/${id}`);
      return response;
    } catch (error: any) {
      console.error('get calendar by id error:', error.message);
      throw new Error(error);
    }
  },

  async updateCalendar(id: string, data: UpdateCalendarDto): Promise<Calendar> {
    try {
      const response = await authenticatedApi.put<Calendar>(
        `/schedules/${id}`,
        data
      );
      return response;
    } catch (error: any) {
      console.error('update calendar by id error:', error.message);
      throw new Error(error);
    }
  },

  async getListCalendarByDeviceId(
    id: string,
    params?: GetDeivceCalendarsParamsDto
  ) {
    const { page: rawPage = 1, limit: rawLimit = 20, ...rest } = params ?? {};
    const page = Math.max(1, Number(rawPage) || 1);
    const limit = Math.max(1, Number(rawLimit) || 20);
    const offset = (page - 1) * limit;
    const response = await authenticatedApi.get<CalendarListResponseDto>(
      `/devices/${id}/schedules`,
      {
        params: {
          offset,
          limit,
          ...rest
        }
      }
    );
    return response;
  }
};
