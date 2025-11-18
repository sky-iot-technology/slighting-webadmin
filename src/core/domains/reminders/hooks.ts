import type {
  UseQueryOptions,
  UseMutationOptions
} from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { remindersApi } from './api';
import type {
  ReminderListResponseDto,
  Reminder,
  CreateReminderDto,
  UpdateReminderDto
} from './types';

// Query keys
export const REMINDERS_QUERY_KEY = 'reminders';

export const useGetReminders = (
  options?: Omit<
    UseQueryOptions<
      ReminderListResponseDto,
      Error,
      ReminderListResponseDto,
      readonly [string]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    ReminderListResponseDto,
    Error,
    ReminderListResponseDto,
    readonly [string]
  >({
    queryKey: [REMINDERS_QUERY_KEY],
    queryFn: () => remindersApi.getAll(),
    gcTime: 30 * 60 * 1000, // Keep unused data for 30 minutes
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options
  });
};

export const useCreateReminder = (
  options?: UseMutationOptions<Reminder, Error, CreateReminderDto>
) => {
  const queryClient = useQueryClient();

  return useMutation<Reminder, Error, CreateReminderDto>({
    mutationFn: (data) => remindersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REMINDERS_QUERY_KEY] });
    },
    ...options
  });
};

export const useUpdateReminder = (
  options?: UseMutationOptions<
    Reminder,
    Error,
    { id: string | number; data: UpdateReminderDto }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Reminder,
    Error,
    { id: string | number; data: UpdateReminderDto }
  >({
    mutationFn: ({ id, data }) => remindersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REMINDERS_QUERY_KEY] });
    },
    ...options
  });
};

export const useDeleteReminder = (
  options?: UseMutationOptions<void, Error, string | number>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string | number>({
    mutationFn: (id) => remindersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REMINDERS_QUERY_KEY] });
    },
    ...options
  });
};
