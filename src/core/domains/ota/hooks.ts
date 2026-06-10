import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CreateOtaDTO,
  ExecuteOtaRequest,
  ExecuteOtaResponse,
  GetOtasParamsDto,
  OtaItem,
  OtaListResponseDto,
  OtaProgressResponse,
  UpdateOtaDto
} from './types';
import { otaApi } from './api';
import { OtaFormSchema, OtaUpdateFormSchema } from './schemas';
import { useAuthStore } from '../auth';
import { storageApi } from '../storage';
import { useEffect, useRef } from 'react';
import { DEVICES_QUERY_KEY, devicesApi } from '../devices';
import { useTranslation } from '@/core/domains/language/useTranslation';

//Query keys
export const OTAS_QUERY_KEY = 'otas';

export const useGetListOta = (
  params?: GetOtasParamsDto,
  options?: Omit<
    UseQueryOptions<
      OtaListResponseDto,
      Error,
      OtaListResponseDto,
      readonly [string, GetOtasParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    OtaListResponseDto,
    Error,
    OtaListResponseDto,
    readonly [string, GetOtasParamsDto?]
  >({
    queryKey: [OTAS_QUERY_KEY, params],
    queryFn: () => otaApi.getAll(params),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useGetOta = (
  id?: string,
  options?: Omit<
    UseQueryOptions<
      OtaItem,
      Error,
      OtaItem,
      readonly [string, string, string | number]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    OtaItem,
    Error,
    OtaItem,
    readonly [string, string, string | number]
  >({
    queryKey: [OTAS_QUERY_KEY, 'detail', String(id)],
    queryFn: () => otaApi.getOtaById(String(id)),
    enabled: !!id,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useCreateOta = (
  options?: UseMutationOptions<OtaItem, Error, OtaFormSchema>
) => {
  const queryClient = useQueryClient();
  const { domainId } = useAuthStore();
  const { t } = useTranslation();
  return useMutation<OtaItem, Error, OtaFormSchema>({
    ...options,
    mutationFn: async (data) => {
      if (!domainId) {
        throw new Error('Not authenticated');
      }

      if (!(data.file instanceof File)) {
        throw new Error('File is required');
      }

      const uploadRes = await storageApi.uploadToDomain(domainId, data.file);
      return otaApi.createOta({
        name: data.name,
        category_type: data.category_type,
        version: data.version,
        description: data.description,
        url: uploadRes.url,
        file_name: uploadRes.name,
        file_size: uploadRes.size,
        checksum_algorithm: 'MD5',
        checksum: uploadRes.md5,
        updated_at: new Date().toISOString()
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [OTAS_QUERY_KEY] });

      toast.success(t('toast.create_ota_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to create ota:', error);
      toast.error(error.message || t('toast.create_ota_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useDeleteOta = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, string>({
    ...options,
    mutationFn: async (id) => {
      const detail = await otaApi.getOtaById(id);
      if (detail.url) {
        try {
          await storageApi.deletefile(detail.url);
        } catch (err) {
          throw new Error('Failed to delete OTA file');
        }
      }
      await otaApi.deleteOta(id);
    },
    onSuccess: (data, deleteId, context) => {
      queryClient.removeQueries({
        queryKey: [OTAS_QUERY_KEY, 'detail', String(deleteId)]
      });

      queryClient.invalidateQueries({
        queryKey: [OTAS_QUERY_KEY]
      });

      toast.success(t('toast.delete_ota_success'));
      options?.onSuccess?.(data, deleteId, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete Ota: ', error);
      toast.error(error.message || t('toast.delete_ota_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useUpdateOta = (
  options?: UseMutationOptions<
    OtaItem,
    Error,
    { id: string; data: OtaUpdateFormSchema }
  >
) => {
  const queryClient = useQueryClient();
  const { domainId } = useAuthStore();
  const { t } = useTranslation();
  return useMutation<OtaItem, Error, { id: string; data: OtaUpdateFormSchema }>(
    {
      ...options,
      mutationFn: async ({ id, data }) => {
        if (!domainId) {
          throw new Error('Not authenticated');
        }

        const oldOta = await otaApi.getOtaById(id);
        const oldFileUrl = oldOta.url;

        let uploadRes:
          | { url: string; name: string; size: number; md5: string }
          | undefined;
        if (data.file instanceof File) {
          uploadRes = await storageApi.uploadToDomain(domainId, data.file);
        }
        const updateOta = await otaApi.updateOta(id, {
          name: data.name,
          category_type: data.category_type,
          version: data.version,
          description: data.description,
          updated_at: new Date().toISOString(),
          ...(uploadRes && {
            url: uploadRes.url,
            file_name: uploadRes.name,
            file_size: uploadRes.size,
            checksum_algorithm: 'MD5',
            checksum: uploadRes.md5
          })
        });

        if (uploadRes && oldFileUrl) {
          try {
            await storageApi.deletefile(oldFileUrl);
          } catch (err) {
            console.warn('Failed to delete old OTA file:', err);
          }
        }
        return updateOta;
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [OTAS_QUERY_KEY] });

        toast.success(t('toast.update_ota_success'));
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        console.error('Failed to update Ota:', error);
        toast.error(error.message || t('toast.update_ota_failed'));
        options?.onError?.(error, variables, context);
      }
    }
  );
};

//ExecuteOtaResponse
export const useExcuteOta = (
  options?: UseMutationOptions<ExecuteOtaResponse, Error, ExecuteOtaRequest>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<ExecuteOtaResponse, Error, ExecuteOtaRequest>({
    ...options,
    mutationFn: async (data) => await otaApi.executesManyOta(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [OTAS_QUERY_KEY] });
      toast.success(t('toast.send_ota_request_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to send OTA request:', error);
      toast.error(error.message || t('toast.send_ota_request_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useQueryStatus = (
  requestId: string,
  onStopped?: (reason: string, error?: string) => void,
  pollInterval?: number,
  options?: Omit<
    UseQueryOptions<
      OtaProgressResponse,
      Error,
      OtaProgressResponse,
      readonly [string, string]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const queryClient = useQueryClient();
  const attempt = useRef(0);
  const hasStopped = useRef(false);
  const MAX_ATTEMPTS = 100; // Increased for longer polling
  const pollIntervalRef = useRef(pollInterval || 3000);
  const onStoppedRef = useRef(onStopped);

  const hasSeenProcessing = useRef(false);

  // Update ref when callback changes
  useEffect(() => {
    onStoppedRef.current = onStopped;
  }, [onStopped]);

  useEffect(() => {
    attempt.current = 0;
    hasStopped.current = false;
  }, [requestId]);

  useEffect(() => {
    if (pollInterval) {
      pollIntervalRef.current = pollInterval;
    }
  }, [pollInterval]);

  return useQuery<
    OtaProgressResponse,
    Error,
    OtaProgressResponse,
    readonly [string, string]
  >({
    queryKey: ['ota-request', requestId],
    queryFn: async () => {
      const result = await otaApi.getRequestById(requestId);
      attempt.current++;

      const hasData = result.result != null;
      if (result.status === 'processing' && hasData) {
        hasSeenProcessing.current = true;
      }

      // if (result.status === 'completed') {
      //   if (!hasStopped.current) {
      //     hasStopped.current = true;
      //     onStoppedRef.current?.('completed');
      //   }
      // } else if (result.status === 'failed') {
      //   if (!hasStopped.current) {
      //     hasStopped.current = true;
      //     onStoppedRef.current?.('failed');
      //   }
      // }

      return result;
    },
    enabled: !!requestId,
    refetchInterval: (query) => {
      if (hasStopped.current) {
        return false;
      }

      const data = query.state.data;
      if (!data) {
        return pollIntervalRef.current;
      }

      if (data.status === 'completed' && !hasSeenProcessing.current) {
        return pollIntervalRef.current;
      }

      if (data.status === 'completed' && hasSeenProcessing.current) {
        hasStopped.current = true;
        onStoppedRef.current?.('completed');
        queryClient.invalidateQueries({ queryKey: [DEVICES_QUERY_KEY] });
        return false;
      }

      if (data.status === 'failed') {
        hasStopped.current = true;
        onStoppedRef.current?.('failed', data.error || undefined);
        return false;
      }

      if (attempt.current >= MAX_ATTEMPTS) {
        if (!hasStopped.current) {
          hasStopped.current = true;
          onStoppedRef.current?.('timeout', 'Request timeout');
        }
        return false;
      }

      return pollIntervalRef.current;
    },
    gcTime: 0,
    staleTime: 0,
    ...options
  });
};
