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
  DeviceRequestResponse,
  DeviceSetBrightnessRequest,
  DeviceTurnOnOffRequest,
  GetDevicesParamsDto,
  SetDevicesParentGroup
} from './types';
import { devicesApi } from './api';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

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
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
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
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
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
  return useMutation<DeviceExecuteResponse, Error, DeviceTurnOnOffRequest>({
    mutationFn: (data) => devicesApi.turnOnOffLight(data),
    onSuccess: (data, variables, context) => {
      toast.success('Request sent successfully!');
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
  return useMutation<DeviceExecuteResponse, Error, DeviceSetBrightnessRequest>({
    mutationFn: (data) => devicesApi.setBrightness(data),
    onSuccess: (data, variables, context) => {
      toast.success('Request sent successfully!');
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

export const useQueryStatus = (
  requestId: string,
  // deviceId: string,
  onStopped: (reason: string) => void,
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
  let attempt = useRef(0);
  const MAX_ATTEMPTS = 10;

  useEffect(() => {
    attempt.current = 0;
  }, [requestId]);

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
        const clientId = result.result.client_id;
        result.result.devices.forEach((device) => {
          if (device.status === 'SUCCESS') {
            queryClient.setQueryData<Device>(
              [DEVICES_QUERY_KEY, 'detail', clientId],
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
      }
      return result;
    },
    enabled: !!requestId,
    refetchInterval: (data: any) => {
      const status = data.state.data?.status;
      if (!status) return 500;
      if (status === 'completed' || status === 'failed') {
        attempt.current = 0;
        return false;
      }
      if (attempt.current >= MAX_ATTEMPTS) {
        onStopped?.('timeout');
        return false;
      }
      return 500;
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
      console.error('Failed to set devices parent: ', error);
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
      console.error('Failed to delete Group: ', error);
      toast.error(error.message || 'Failed to delete Group');
      options?.onError?.(error, variables, context);
    }
  });
};
