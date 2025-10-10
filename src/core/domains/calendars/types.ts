import type { BaseEntity, QueryParams } from '@/core/shared/types';

export type CalendarStatus = 'active' | 'inactive' | 'pending';
export type CalendarType = 'Khẩn cấp' | 'Theo lịch';
export type CalendarRepeat = 'Không' | 'Hàng ngày' | 'Hàng tuần' | 'Hàng tháng';
export interface Calendar {
  id: string;
  name: string;
  type: CalendarType;
  repeat: CalendarRepeat;
  time: string;
  status: CalendarStatus;
  startDate: string;
  endDate: string;
  createdDate: string;
  children?: Calendar[];
}

export interface GetCalendarsParamsDto extends QueryParams {
  type?: CalendarType;
  status?: CalendarStatus;
  from?: string;
  to?: string;
}

export interface CreateCalendarDto {
  name: string;
  type: CalendarType;
  time: string;
  startDate: string;
  endDate: string;
}

export interface UpdateCalendarDto extends Partial<CreateCalendarDto> {
  status?: CalendarStatus;
}

export interface CalendarListResponseDto {
  calendars: Calendar[];
  total_calendars: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface CalendarDetailResponseDto {
  calendar: Calendar;
  related_calendars?: Calendar[];
}
