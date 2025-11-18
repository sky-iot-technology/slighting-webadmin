import { authenticatedApi } from '@/core/shared/api';
import {
  ReminderListResponseDto,
  Reminder,
  CreateReminderDto,
  UpdateReminderDto
} from './types';

export const remindersApi = {
  async getAll(): Promise<ReminderListResponseDto> {
    const response = await authenticatedApi.get<
      Reminder[] | ReminderListResponseDto
    >('/system/reminders');
    // Handle both array and object responses
    if (Array.isArray(response)) {
      return { reminder: response };
    }
    return response;
  },

  async getById(id: string | number): Promise<Reminder> {
    const response = await authenticatedApi.get<Reminder>(
      `/system/reminders/${id}`
    );
    return response;
  },

  async create(data: CreateReminderDto): Promise<Reminder> {
    try {
      const response = await authenticatedApi.post<Reminder>(
        '/system/reminders',
        data
      );
      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể tạo lời nhắc. Vui lòng thử lại.';
      throw new Error(message);
    }
  },

  async update(
    id: string | number,
    data: UpdateReminderDto
  ): Promise<Reminder> {
    try {
      const response = await authenticatedApi.patch<Reminder>(
        `/system/reminders/${id}`,
        data
      );
      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể cập nhật lời nhắc. Vui lòng thử lại.';
      throw new Error(message);
    }
  },

  async delete(id: string | number): Promise<void> {
    try {
      await authenticatedApi.delete(`/system/reminders/${id}`);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể xóa lời nhắc. Vui lòng thử lại.';
      throw new Error(message);
    }
  }
};
