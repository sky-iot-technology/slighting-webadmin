import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import {
  Device,
  DeviceExecuteResponse,
  DeviceListResponseDto,
  DeviceQueryRequest,
  DeviceQueryResponse,
  DeviceRequestResponse,
  DeviceSetBrightnessRequest,
  DeviceTurnOnOffRequest,
  GetDevicesParamsDto,
  SetDevicesParentGroup
} from './types';
import { devicesApi } from './api';
import { toast } from 'sonner';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { useEffect, useRef } from 'react';
import { JOURNALS_QUERY_KEY } from '../journals';
import { useAuthStore } from '../auth';
import { storageApi } from '../storage';

//Query keys
export const DEVICES_QUERY_KEY = 'devices';

// Hook for getting all device
export const useGetDevices = (
  params?: GetDevicesParamsDto,
  options?: Omit<
    UseQueryOptions<
      DeviceListResponseDto,
      Error,
      DeviceListResponseDto,
      readonly [string, GetDevicesParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    DeviceListResponseDto,
    Error,
    DeviceListResponseDto,
    readonly [string, GetDevicesParamsDto?]
  >({
    queryKey: [DEVICES_QUERY_KEY, params],
    queryFn: () => devicesApi.getAll(params),
    ...options
  });
};

// Hook for getting a single device by ID
export const useGetDeviceById = (
  id: string | number,
  options?: Omit<
    UseQueryOptions<
      Device,
      Error,
      Device,
      readonly [string, string, string | number]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    Device,
    Error,
    Device,
    readonly [string, string, string | number]
  >({
    queryKey: [DEVICES_QUERY_KEY, 'detail', id],
    queryFn: () => devicesApi.getById(id),
    enabled: !!id,
    ...options
  });
};

export const useTurnOnOffLight = (
  options?: UseMutationOptions<
    DeviceExecuteResponse,
    Error,
    DeviceTurnOnOffRequest
  >
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation<DeviceExecuteResponse, Error, DeviceTurnOnOffRequest>({
    mutationFn: (data) => devicesApi.turnOnOffLight(data),
    onSuccess: (data, variables, context) => {
      toast.success(t('toast.request_sent_success'));
      queryClient.invalidateQueries({
        queryKey: [JOURNALS_QUERY_KEY, String(variables.device_id)]
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to set state light: ', error);
      toast.error(error.message || t('toast.set_light_failed'));
      options?.onError?.(error, variables, context);
    },
    ...options
  });
};

export const useSetBrightnessLight = (
  options?: UseMutationOptions<
    DeviceExecuteResponse,
    Error,
    DeviceSetBrightnessRequest
  >
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation<DeviceExecuteResponse, Error, DeviceSetBrightnessRequest>({
    mutationFn: (data) => devicesApi.setBrightness(data),
    onSuccess: (data, variables, context) => {
      toast.success(t('toast.request_sent_success'));
      queryClient.invalidateQueries({
        queryKey: [JOURNALS_QUERY_KEY, String(variables.device_id)]
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to set brightness light: ', error);
      toast.error(error.message || t('toast.set_brightness_failed'));
      options?.onError?.(error, variables, context);
    },
    ...options
  });
};

export const useCreateDevice = (
  options?: UseMutationOptions<Device, Error, any>
) => {
  const queryClient = useQueryClient();
  const { domainId } = useAuthStore();
  const { t } = useTranslation();
  const onSuccessCallback = options?.onSuccess;
  const onErrorCallback = options?.onError;

  return useMutation<Device, Error, any>({
    mutationFn: async (deviceData) => {
      if (!domainId) {
        throw new Error('Not authenticated');
      }
      const { avatar, ...rest } = deviceData;
      let product_info = Array.isArray(rest.product_info)
        ? [...rest.product_info]
        : [];

      let uploadedFile: { name: string; url: string } | null = null;

      try {
        if (avatar) {
          uploadedFile = await storageApi.uploadToDomain(domainId, avatar);

          product_info.push({
            name: 'avatar',
            value: uploadedFile.url,
            type: 'string',
            unit: 'avatar'
          });
        }
        const payload = {
          ...rest,
          product_info
        };

        return devicesApi.createDevice(payload);
      } catch (error) {
        if (uploadedFile) {
          await storageApi.deletefile(uploadedFile.url);
        }
        throw error;
      }
    },
    onSuccess: (data, variables, context) => {
      toast.success(t('toast.create_device_success'));
      queryClient.invalidateQueries({ queryKey: [DEVICES_QUERY_KEY] });
      onSuccessCallback?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || t('toast.create_device_failed'));
      onErrorCallback?.(error, variables, context);
    }
  });
};

export const useQueryStatus = (
  requestId: string,
  deviceId?: string,
  onStopped?: (reason: string) => void,
  pollInterval?: number,
  options?: Omit<
    UseQueryOptions<
      DeviceRequestResponse,
      Error,
      DeviceRequestResponse,
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
    DeviceRequestResponse,
    Error,
    DeviceRequestResponse,
    readonly [string, string]
  >({
    queryKey: ['light-request', requestId],
    queryFn: async () => {
      const result = await devicesApi.getRequestById(requestId);
      attempt.current++;

      if (result.status === 'completed') {
        // Use deviceId if provided, otherwise fall back to client_id from response
        const targetDeviceId = deviceId || result.result.client_id;

        result.result.devices.forEach((device) => {
          if (device.status === 'SUCCESS') {
            queryClient.setQueryData<Device>(
              [DEVICES_QUERY_KEY, 'detail', targetDeviceId],
              (old) => {
                if (!old) return old;
                return {
                  ...old,
                  devices: old.devices.map((sub) =>
                    sub.device_id === device.device_id
                      ? {
                          ...sub,
                          last_state: {
                            ...(sub.last_state ?? {}),
                            ...device.state
                          }
                        }
                      : sub
                  )
                };
              }
            );
          }
        });

        if (!hasStopped.current) {
          hasStopped.current = true;
          onStoppedRef.current?.('completed');
        }
      } else if (result.status === 'failed') {
        if (!hasStopped.current) {
          hasStopped.current = true;
          onStoppedRef.current?.('failed');
        }
      }

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

      const status = data.status;
      if (status === 'completed' || status === 'failed') {
        return false;
      }

      if (attempt.current >= MAX_ATTEMPTS) {
        if (!hasStopped.current) {
          hasStopped.current = true;
          onStoppedRef.current?.('timeout');
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

export const useSetParent = (
  options?: UseMutationOptions<void, Error, SetDevicesParentGroup>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, SetDevicesParentGroup>({
    ...options,
    mutationFn: (data) => devicesApi.setDevicesParentGroup(data),
    onSuccess: (data, variables, context) => {
      toast.success(t('toast.set_parent_success'));

      queryClient.invalidateQueries({
        queryKey: [DEVICES_QUERY_KEY]
      });

      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || t('toast.set_parent_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useDeleteDeviceParent = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, string>({
    ...options,
    mutationFn: (id) => devicesApi.deleteDevicesParentGroup(id),
    onSuccess: (data, deleteId, context) => {
      queryClient.removeQueries({
        queryKey: [DEVICES_QUERY_KEY, 'detail', deleteId]
      });

      queryClient.invalidateQueries({
        queryKey: [DEVICES_QUERY_KEY]
      });

      toast.success(t('toast.delete_parent_success'));
      options?.onSuccess?.(data, deleteId, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || t('toast.delete_parent_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

// Hook for getting device count by online status
export const useGetDeviceCount = (
  online?: boolean,
  filters?: Omit<GetDevicesParamsDto, 'only_total' | 'offset' | 'limit'>,
  options?: Omit<
    UseQueryOptions<
      DeviceListResponseDto,
      Error,
      DeviceListResponseDto,
      readonly [
        string,
        string,
        boolean | undefined,
        Omit<GetDevicesParamsDto, 'only_total' | 'offset' | 'limit'> | undefined
      ]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    DeviceListResponseDto,
    Error,
    DeviceListResponseDto,
    readonly [
      string,
      string,
      boolean | undefined,
      Omit<GetDevicesParamsDto, 'only_total' | 'offset' | 'limit'> | undefined
    ]
  >({
    queryKey: [DEVICES_QUERY_KEY, 'count', online, filters],
    queryFn: () =>
      devicesApi.getAll({
        only_total: true,
        ...filters,
        metadata: `{ "device_info": { "online": ${online ? 'true' : 'false'} } }`
      }),
    ...options
  });
};

// Hook for syncing devices
export const useSyncDevices = (
  options?: UseMutationOptions<DeviceQueryResponse, Error, DeviceQueryRequest>
) => {
  const { t } = useTranslation();
  return useMutation<DeviceQueryResponse, Error, DeviceQueryRequest>({
    mutationFn: (data) => devicesApi.queryDevices(data),
    onSuccess: (data, variables, context) => {
      toast.success(t('toast.sync_devices_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || t('toast.sync_devices_failed'));
      options?.onError?.(error, variables, context);
    },
    ...options
  });
};

// Hook for updating a device
export const useUpdateDevice = (
  options?: UseMutationOptions<
    Device,
    Error,
    {
      deviceId: string | number;
      data: Partial<Device> & {
        avatar?: File;
        oldAvatarUrl?: string;
      };
    }
  >
) => {
  const queryClient = useQueryClient();
  const { domainId } = useAuthStore();
  const { t } = useTranslation();
  return useMutation<
    Device,
    Error,
    {
      deviceId: string | number;
      data: Partial<Device> & {
        avatar?: File;
        oldAvatarUrl?: string;
      };
    }
  >({
    mutationFn: async ({ deviceId, data }) => {
      if (!domainId) {
        throw new Error('Invalid domainId');
      }
      const { avatar, oldAvatarUrl, product_info, ...rest } = data;

      let uploadedFile: { url: string } | null = null;

      try {
        if (avatar) {
          uploadedFile = await storageApi.uploadToDomain(domainId, avatar);
        }
        let nextProductInfo = Array.isArray(product_info)
          ? [...product_info]
          : [];
        if (uploadedFile) {
          nextProductInfo = nextProductInfo.filter(
            (p) => p.unit !== 'avatar' && p.name !== 'avatar'
          );
          nextProductInfo.push({
            name: 'avatar',
            unit: 'avatar',
            value: uploadedFile.url,
            type: 'string'
          });
        }

        const updatedDevice = await devicesApi.updateDevice(deviceId, {
          ...rest,
          product_info: nextProductInfo
        });

        if (uploadedFile && oldAvatarUrl) {
          await storageApi.deletefile(oldAvatarUrl);
        }

        return updatedDevice;
      } catch (error) {
        if (uploadedFile) {
          await storageApi.deletefile(uploadedFile.url);
        }
        throw error;
      }
    },
    onSuccess: (data, variables, context) => {
      toast.success(t('toast.update_device_success'));
      queryClient.invalidateQueries({
        queryKey: [DEVICES_QUERY_KEY]
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || t('toast.update_device_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

//Hook for update tag device
export const useUpdateTagDevice = (
  options?: UseMutationOptions<
    Device,
    Error,
    { deviceId: string | number; tags: string[] }
  >
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<
    Device,
    Error,
    { deviceId: string | number; tags: string[] }
  >({
    mutationFn: ({ deviceId, tags }) =>
      devicesApi.updateDeviceTags(deviceId, tags),
    onSuccess: (data, variables, context) => {
      toast.success(t('toast.remove_device_from_group_success'));
      queryClient.invalidateQueries({
        queryKey: [DEVICES_QUERY_KEY]
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || t('toast.remove_device_from_group_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

// Hook for deleting a device
export const useDeleteDevice = (
  options?: UseMutationOptions<void, Error, string | number>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, string | number>({
    ...options,
    mutationFn: (deviceId) => devicesApi.deleteDevice(deviceId),
    onSuccess: (data, deletedId, context) => {
      // Remove the device from the cache
      queryClient.removeQueries({
        queryKey: [DEVICES_QUERY_KEY, 'detail', deletedId]
      });

      // Invalidate devices list to reflect changes
      queryClient.invalidateQueries({
        queryKey: [DEVICES_QUERY_KEY]
      });

      toast.success(t('toast.delete_device_success'));
      options?.onSuccess?.(data, deletedId, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || t('toast.delete_device_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};
