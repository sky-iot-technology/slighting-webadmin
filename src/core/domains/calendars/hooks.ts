import type {
  UseMutationOptions,
  UseQueryOptions
} from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { calendarApi } from './api';
import {
  Calendar,
  CalendarListResponseDto,
  CalendarDetailResponseDto,
  GetCalendarsParamsDto,
  CreateCalendarDto,
  UpdateCalendarDto
} from './types';

// ✅ Local Query Key (avoid collisions)
export const CALENDARS_QUERY_KEY = 'calendars';

/* ----------------------------------------
 🟢 Query Hooks
---------------------------------------- */

// ✅ Get all calendars with optional filters
export const useGetCalendars = (
  params?: GetCalendarsParamsDto,
  options?: Omit<
    UseQueryOptions<
      CalendarListResponseDto,
      Error,
      CalendarListResponseDto,
      readonly [string, GetCalendarsParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    CalendarListResponseDto,
    Error,
    CalendarListResponseDto,
    readonly [string, GetCalendarsParamsDto?]
  >({
    queryKey: [CALENDARS_QUERY_KEY, params],
    queryFn: () => calendarApi.getAll(params),
    gcTime: 30 * 60 * 1000, // Cache 30 mins
    staleTime: 5 * 60 * 1000, // Fresh 5 mins
    ...options
  });
};

// ✅ Get calendar by ID
export const useGetCalendarById = (
  id: string | number,
  options?: Omit<
    UseQueryOptions<
      CalendarDetailResponseDto,
      Error,
      CalendarDetailResponseDto,
      readonly [string, string, string | number]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    CalendarDetailResponseDto,
    Error,
    CalendarDetailResponseDto,
    readonly [string, string, string | number]
  >({
    queryKey: [CALENDARS_QUERY_KEY, 'detail', id],
    queryFn: () => calendarApi.getById(String(id)),
    enabled: !!id,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

/* ----------------------------------------
 🟠 Mutation Hooks
---------------------------------------- */

// ✅ Create new calendar
export const useCreateCalendar = (
  options?: UseMutationOptions<Calendar, Error, CreateCalendarDto>
) => {
  const queryClient = useQueryClient();

  return useMutation<Calendar, Error, CreateCalendarDto>({
    mutationFn: (data) => calendarApi.create(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CALENDARS_QUERY_KEY] });
      queryClient.setQueryData([CALENDARS_QUERY_KEY, 'detail', data.id], data);
      toast.success('Lịch mới đã được tạo thành công!');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('❌ Failed to create calendar:', error);
      toast.error(error.message || 'Tạo lịch thất bại');
      options?.onError?.(error, variables, context);
    },
    ...options
  });
};

// ✅ Update existing calendar
export const useUpdateCalendar = (
  options?: UseMutationOptions<
    Calendar,
    Error,
    { id: string | number; data: UpdateCalendarDto }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Calendar,
    Error,
    { id: string | number; data: UpdateCalendarDto }
  >({
    mutationFn: ({ id, data }) => calendarApi.update(String(id), data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CALENDARS_QUERY_KEY] });
      queryClient.setQueryData(
        [CALENDARS_QUERY_KEY, 'detail', variables.id],
        data
      );
      toast.success('Cập nhật lịch thành công!');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('❌ Failed to update calendar:', error);
      toast.error(error.message || 'Cập nhật lịch thất bại');
      options?.onError?.(error, variables, context);
    },
    ...options
  });
};

// ✅ Delete calendar
export const useDeleteCalendar = (
  options?: UseMutationOptions<void, Error, string | number>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string | number>({
    mutationFn: (id) => calendarApi.delete(String(id)),
    onSuccess: (data, deletedId, context) => {
      queryClient.removeQueries({
        queryKey: [CALENDARS_QUERY_KEY, 'detail', deletedId]
      });
      queryClient.invalidateQueries({ queryKey: [CALENDARS_QUERY_KEY] });
      toast.success('Xóa lịch thành công!');
      options?.onSuccess?.(data, deletedId, context);
    },
    onError: (error, variables, context) => {
      console.error('❌ Failed to delete calendar:', error);
      toast.error(error.message || 'Xóa lịch thất bại');
      options?.onError?.(error, variables, context);
    },
    ...options
  });
};

/* ----------------------------------------
 🔵 Prefetch Hook
---------------------------------------- */
export const usePrefetchCalendars = (params?: GetCalendarsParamsDto) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: [CALENDARS_QUERY_KEY, params],
      queryFn: () => calendarApi.getAll(params),
      staleTime: 5 * 60 * 1000
    });
  };
};
