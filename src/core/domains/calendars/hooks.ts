import type {
  UseMutationOptions,
  UseQueryOptions
} from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from '@/core/domains/language/useTranslation';

import { calendarApi } from './api';
import {
  Calendar,
  CalendarListResponseDto,
  GetCalendarsParamsDto,
  CreateCalendarDto,
  UpdateCalendarDto,
  GetDeivceCalendarsParamsDto
} from './types';
import { useMemo } from 'react';

export const CALENDARS_QUERY_KEY = 'calendars';
export const DEVICE_CALENDARS_QUERY_KEY = 'device-calendars';

export const useGetCalendars = (
  params?: GetCalendarsParamsDto,
  options?: Omit<
    UseQueryOptions<
      CalendarListResponseDto,
      Error,
      CalendarListResponseDto,
      readonly [string, Partial<GetCalendarsParamsDto>?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKeyParams = useMemo(() => {
    if (!params) return undefined;

    const { groups, name, page, limit, start_range, end_range } = params;
    return { groups, name, page, limit, start_range, end_range };
  }, [params]);
  return useQuery<
    CalendarListResponseDto,
    Error,
    CalendarListResponseDto,
    readonly [string, Partial<GetCalendarsParamsDto>?]
  >({
    queryKey: [CALENDARS_QUERY_KEY, queryKeyParams],
    queryFn: () => calendarApi.getAll(params),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useCreateCalendars = (
  options?: UseMutationOptions<Calendar, Error, CreateCalendarDto>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Calendar, Error, CreateCalendarDto>({
    ...options,
    mutationFn: (data) => calendarApi.createCalendar(data),
    onSuccess: (data, variables, context) => {
      console.log('✅ onSuccess in useCreateProduct');
      queryClient.invalidateQueries({ queryKey: [CALENDARS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [DEVICE_CALENDARS_QUERY_KEY] });

      // Add the new calendar to the cache
      queryClient.setQueryData([CALENDARS_QUERY_KEY, 'detail', data.id], data);

      toast.success(t('toast.create_calendar_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to create calendar:', error);
      toast.error(error.message || t('toast.create_calendar_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useDeleteCalendars = (
  options?: UseMutationOptions<void, Error, string | number>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, string | number>({
    ...options,
    mutationFn: (id) => calendarApi.deleteCalendar(id),
    onSuccess: (data, deleteId, context) => {
      //Remove calendar from cache
      queryClient.removeQueries({
        queryKey: [CALENDARS_QUERY_KEY, 'detail', deleteId]
      });

      queryClient.invalidateQueries({
        queryKey: [CALENDARS_QUERY_KEY]
      });

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === DEVICE_CALENDARS_QUERY_KEY
      });

      toast.success(t('toast.delete_calendar_success'));
      options?.onSuccess?.(data, deleteId, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete calendar: ', error);
      toast.error(error.message || t('toast.delete_calendar_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useDeleteMultiCalendars = (
  options?: UseMutationOptions<void, Error, (string | number)[]>
) => {
  const queryClient = useQueryClient();
  const { t, tTime } = useTranslation();

  return useMutation<void, Error, (string | number)[]>({
    ...options,
    mutationFn: (ids) => calendarApi.deleteCalendars(ids),
    onSuccess: (data, deletedIds, context) => {
      deletedIds.forEach((id) => {
        queryClient.removeQueries({
          queryKey: [CALENDARS_QUERY_KEY, 'detail', id]
        });
      });

      queryClient.invalidateQueries({ queryKey: [CALENDARS_QUERY_KEY] });

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === DEVICE_CALENDARS_QUERY_KEY
      });

      toast.success(
        deletedIds.length > 1
          ? tTime('toast.delete_multi_calendar_success', {
              count: deletedIds.length
            })
          : t('toast.delete_multi_calendar_success_single')
      );

      options?.onSuccess?.(data, deletedIds, context);
    },
    onError: (error, variables, context) => {
      console.error('❌ Delete calendars failed:', error);
      toast.error(error.message || t('toast.delete_multi_calendar_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useGetCalendarById = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      Calendar,
      Error,
      Calendar,
      readonly [string, string, string]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<Calendar, Error, Calendar, readonly [string, string, string]>(
    {
      queryKey: [CALENDARS_QUERY_KEY, 'detail', id],
      queryFn: () => calendarApi.getById(id),
      enabled: !!id,
      gcTime: 30 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      ...options
    }
  );
};

export const useUpdateCalendar = (
  options?: UseMutationOptions<
    Calendar,
    Error,
    { id: string; data: UpdateCalendarDto }
  >
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Calendar, Error, { id: string; data: UpdateCalendarDto }>({
    ...options,
    mutationFn: ({ id, data }) => calendarApi.updateCalendar(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CALENDARS_QUERY_KEY] });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === DEVICE_CALENDARS_QUERY_KEY
      });

      queryClient.setQueryData(
        [CALENDARS_QUERY_KEY, 'detail', variables.id],
        data
      );

      toast.success(t('toast.update_calendar_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to update calendar:', error);
      toast.error(error.message || t('toast.update_calendar_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useGetCalendarsByDevice = (
  deviceId: string,
  params?: GetDeivceCalendarsParamsDto,
  options?: Omit<
    UseQueryOptions<
      CalendarListResponseDto,
      Error,
      CalendarListResponseDto,
      readonly [string, string, Partial<GetDeivceCalendarsParamsDto>?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKeyParams = useMemo(() => {
    if (!params) return undefined;
    const { page, limit, ...rest } = params;
    return { page, limit, ...rest };
  }, [params]);

  return useQuery<
    CalendarListResponseDto,
    Error,
    CalendarListResponseDto,
    readonly [string, string, Partial<GetDeivceCalendarsParamsDto>?]
  >({
    queryKey: [DEVICE_CALENDARS_QUERY_KEY, deviceId, queryKeyParams],
    queryFn: () => calendarApi.getListCalendarByDeviceId(deviceId, params),
    enabled: !!deviceId,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};
