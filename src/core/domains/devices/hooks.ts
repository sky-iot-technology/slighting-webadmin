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
import { useEffect, useRef } from 'react';
import { JOURNALS_QUERY_KEY } from '../journals';

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
  return useMutation<DeviceExecuteResponse, Error, DeviceTurnOnOffRequest>({
    mutationFn: (data) => devicesApi.turnOnOffLight(data),
    onSuccess: (data, variables, context) => {
      toast.success('Request sent successfully!');
      queryClient.invalidateQueries({
        queryKey: [JOURNALS_QUERY_KEY, String(variables.device_id)]
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to set state light: ', error);
      toast.error(error.message || 'Failed to set state light');
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
  return useMutation<DeviceExecuteResponse, Error, DeviceSetBrightnessRequest>({
    mutationFn: (data) => devicesApi.setBrightness(data),
    onSuccess: (data, variables, context) => {
      toast.success('Request sent successfully!');
      queryClient.invalidateQueries({
        queryKey: [JOURNALS_QUERY_KEY, String(variables.device_id)]
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to set brightness light: ', error);
      toast.error(error.message || 'Failed to set brightness light');
      options?.onError?.(error, variables, context);
    },
    ...options
  });
};

export const useCreateDevice = (
  options?: UseMutationOptions<Device, Error, any>
) => {
  const queryClient = useQueryClient();

  const onSuccessCallback = options?.onSuccess;
  const onErrorCallback = options?.onError;

  return useMutation<Device, Error, any>({
    mutationFn: (deviceData) => devicesApi.createDevice(deviceData),
    onSuccess: (data, variables, context) => {
      toast.success('Device created successfully!');
      queryClient.invalidateQueries({ queryKey: [DEVICES_QUERY_KEY] });
      onSuccessCallback?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || 'Failed to create device');
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

  return useMutation<void, Error, SetDevicesParentGroup>({
    ...options,
    mutationFn: (data) => devicesApi.setDevicesParentGroup(data),
    onSuccess: (data, variables, context) => {
      toast.success('Set devices parent successfully!');

      queryClient.invalidateQueries({
        queryKey: [DEVICES_QUERY_KEY]
      });

      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || 'Failed to set devices parent');
      options?.onError?.(error, variables, context);
    }
  });
};

export const useDeleteDeviceParent = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

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

      toast.success('Delete Device Parent successfully');
      options?.onSuccess?.(data, deleteId, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || 'Failed to delete Group');
      options?.onError?.(error, variables, context);
    }
  });
};

// Hook for getting device count by online status
export const useGetDeviceCount = (
  online?: boolean,
  options?: Omit<
    UseQueryOptions<
      DeviceListResponseDto,
      Error,
      DeviceListResponseDto,
      readonly [string, string, boolean | undefined]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    DeviceListResponseDto,
    Error,
    DeviceListResponseDto,
    readonly [string, string, boolean | undefined]
  >({
    queryKey: [DEVICES_QUERY_KEY, 'count', online],
    queryFn: () =>
      devicesApi.getAll({
        only_total: true,
        metadata: `{ "device_info": { "online": ${online ? 'true' : 'false'} } }`
      }),
    ...options
  });
};

// Hook for syncing devices
export const useSyncDevices = (
  options?: UseMutationOptions<DeviceQueryResponse, Error, DeviceQueryRequest>
) => {
  return useMutation<DeviceQueryResponse, Error, DeviceQueryRequest>({
    mutationFn: (data) => devicesApi.queryDevices(data),
    onSuccess: (data, variables, context) => {
      toast.success('Đồng bộ thiết bị đã được khởi tạo!');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || 'Không thể đồng bộ thiết bị');
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
    { deviceId: string | number; data: Partial<Device> }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Device,
    Error,
    { deviceId: string | number; data: Partial<Device> }
  >({
    mutationFn: ({ deviceId, data }) => devicesApi.updateDevice(deviceId, data),
    onSuccess: (data, variables, context) => {
      toast.success('Cập nhật thiết bị thành công!');
      queryClient.invalidateQueries({
        queryKey: [DEVICES_QUERY_KEY]
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || 'Không thể cập nhật thiết bị');
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

  return useMutation<
    Device,
    Error,
    { deviceId: string | number; tags: string[] }
  >({
    mutationFn: ({ deviceId, tags }) =>
      devicesApi.updateDeviceTags(deviceId, tags),
    onSuccess: (data, variables, context) => {
      toast.success('Xóa thiết bị khỏi nhóm thành công!');
      queryClient.invalidateQueries({
        queryKey: [DEVICES_QUERY_KEY]
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || 'Không thể xóa thiết bị khỏi nhóm');
      options?.onError?.(error, variables, context);
    }
  });
};
