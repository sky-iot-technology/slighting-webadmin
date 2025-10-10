import { calendars } from '@/features/calendar/components/fake';
import {
  Calendar,
  CalendarDetailResponseDto,
  CalendarListResponseDto,
  CreateCalendarDto,
  GetCalendarsParamsDto,
  UpdateCalendarDto
} from './types';

export const calendarApi = {
  async getAll(
    params?: GetCalendarsParamsDto
  ): Promise<CalendarListResponseDto> {
    let data = [...calendars];

    // 1️⃣ Lọc theo loại & trạng thái
    if (params?.type) data = data.filter((c) => c.type === params.type);
    if (params?.status) data = data.filter((c) => c.status === params.status);

    // 2️⃣ Lọc theo khoảng thời gian
    if (params?.from && params?.to) {
      const from = new Date(params.from);
      const to = new Date(params.to);
      data = data.filter(
        (c) => new Date(c.startDate) >= from && new Date(c.endDate) <= to
      );
    }

    // 3️⃣ Lọc theo từ khóa tìm kiếm (name)
    if (params?.name) {
      const search = params.name.toLowerCase();
      data = data.filter((c) => c.name.toLowerCase().includes(search));
    }

    // 4️⃣ Phân trang (page & limit)
    const page = params?.page ?? 1;
    const limit = params?.limit ?? data.length; // default: tất cả
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginated = data.slice(startIndex, endIndex);

    // 5️⃣ Trả về dữ liệu dạng chuẩn
    return {
      calendars: paginated,
      total_calendars: data.length,
      page,
      limit,
      total_pages: Math.ceil(data.length / limit),
      has_next: endIndex < data.length,
      has_prev: page > 1
    };
  },

  async getById(id: string): Promise<CalendarDetailResponseDto> {
    const calendar = calendars.find((c) => c.id === id);
    if (!calendar) throw new Error('Calendar not found');
    return {
      calendar,
      related_calendars: calendars.filter(
        (c) => c.type === calendar.type && c.id !== calendar.id
      )
    };
  },
  async create(data: CreateCalendarDto): Promise<Calendar> {
    const newCalendar: Calendar = {
      id: String(Date.now()),
      name: data.name,
      type: data.type,
      time: data.time,
      status: 'pending', // default status
      startDate: data.startDate,
      endDate: data.endDate,
      createdDate: new Date().toISOString()
    };
    calendars.push(newCalendar);
    return newCalendar;
  },

  /* ✅ Update calendar */
  async update(id: string, data: UpdateCalendarDto): Promise<Calendar> {
    const index = calendars.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Calendar not found');
    calendars[index] = {
      ...calendars[index],
      ...data
    };
    return calendars[index];
  },

  /* ✅ Delete calendar */
  async delete(id: string): Promise<void> {
    const index = calendars.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Calendar not found');
    calendars.splice(index, 1);
  }
};
