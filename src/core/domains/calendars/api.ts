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
    const { page = 1, limit = 20, ...rest } = params ?? {};
    const offset = (page - 1) * limit;
    const response = await authenticatedApi.get<CalendarListResponseDto>(
      `/devices/${id}/schedules`,
      {
        params: {
          offset,
          limit,
          ...params
        }
      }
    );
    return response;
  }

  // async getById(id: string): Promise<CalendarDetailResponseDto> {
  //   const calendar = calendars.find((c) => c.id === id);
  //   if (!calendar) throw new Error('Calendar not found');
  //   return {
  //     calendar,
  //     related_calendars: calendars.filter(
  //       (c) => c.type === calendar.type && c.id !== calendar.id
  //     )
  //   };
  // },
  // async create(data: CreateCalendarDto): Promise<Calendar> {
  //   const newCalendar: Calendar = {
  //     id: String(Date.now()),
  //     name: data.name,
  //     type: data.type,
  //     time: data.time,
  //     status: 'pending', // default status
  //     startDate: data.startDate,
  //     endDate: data.endDate,
  //     createdDate: new Date().toISOString()
  //   };
  //   calendars.push(newCalendar);
  //   return newCalendar;
  // },

  // /* ✅ Update calendar */
  // async update(id: string, data: UpdateCalendarDto): Promise<Calendar> {
  //   const index = calendars.findIndex((c) => c.id === id);
  //   if (index === -1) throw new Error('Calendar not found');
  //   calendars[index] = {
  //     ...calendars[index],
  //     ...data
  //   };
  //   return calendars[index];
  // },

  // /* ✅ Delete calendar */
  // async delete(id: string): Promise<void> {
  //   const index = calendars.findIndex((c) => c.id === id);
  //   if (index === -1) throw new Error('Calendar not found');
  //   calendars.splice(index, 1);
  // }
};
