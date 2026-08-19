import { authenticatedApi } from '@/core/shared/api';
import { normalizeTraitKey } from '../catalogues/types';
import {
  Device,
  DeviceCommandRequest,
  DeviceExecuteResponse,
  DeviceListResponseDto,
  DeviceQueryRequest,
  DeviceQueryResponse,
  DeviceRequestResponse,
  DeviceSetBrightnessRequest,
  DeviceTurnOnOffRequest,
  DeviceSyncSTLSmartRequest,
  MultiDeviceCommandRequest,
  MultiDeviceSetBrightnessRequest,
  MultiDeviceTurnOnOffRequest,
  MultiDeviceExecuteResponse,
  GetDevicesParamsDto,
  SetDevicesParentGroup,
  CommandError
} from './types';

// Helper to normalize traits on device object
const normalizeDeviceTraits = (device: Device): Device => {
  if (!device) return device;
  return {
    ...device,
    devices: (device.devices || []).map((subDevice) => ({
      ...subDevice,
      traits: (subDevice.traits || []).map(normalizeTraitKey)
    }))
  };
};

export const devicesApi = {
  async getAll(params?: GetDevicesParamsDto): Promise<DeviceListResponseDto> {
    const { page = 1, limit = 20 } = params ?? {};
    const offset = (page - 1) * limit;
    const response = await authenticatedApi.get<DeviceListResponseDto>(
      `/devices/clients`,
      {
        params: {
          offset,
          limit,
          ...params
        }
      }
    );

    if (response && Array.isArray(response.devices)) {
      response.devices = response.devices.map(normalizeDeviceTraits);
    }

    return response;
  },

  async getByRegion(group: string): Promise<DeviceListResponseDto> {
    const response = await authenticatedApi.get<DeviceListResponseDto>(
      `/devices/clients`,
      {
        params: {
          group
        }
      }
    );

    if (response && Array.isArray(response.devices)) {
      response.devices = response.devices.map(normalizeDeviceTraits);
    }

    return response;
  },

  async getById(id: string | number): Promise<Device> {
    try {
      const response = await authenticatedApi.get<Device>(
        `/devices/clients/${id}`
      );
      return normalizeDeviceTraits(response);
    } catch (error) {
      throw new Error(`Product with id ${id} not found`);
    }
  },

  async sendCommand(
    body: DeviceCommandRequest
  ): Promise<DeviceExecuteResponse> {
    try {
      return await authenticatedApi.post<DeviceExecuteResponse>(
        `/devices/clients/execute`,
        body
      );
    } catch (error) {
      throw new Error(`Something wrong`);
    }
  },

  async sendCommands(
    body: DeviceCommandRequest
  ): Promise<DeviceExecuteResponse> {
    try {
      return await authenticatedApi.post<DeviceExecuteResponse>(
        `/devices/clients/executes`,
        body
      );
    } catch (error) {
      throw new Error(`Something wrong`);
    }
  },

  async turnOnOffLight({
    device_id,
    channel_route,
    devices,
    status
  }: DeviceTurnOnOffRequest) {
    const body: DeviceCommandRequest = {
      device_id,
      channel_route,
      command: {
        devices,
        execution: [
          {
            command: 'lms.devices.commands.OnOff',
            params: {
              on: status
            }
          }
        ]
      }
    };
    return this.sendCommand(body);
  },

  async setBrightness({
    device_id,
    channel_route,
    devices,
    brightness
  }: DeviceSetBrightnessRequest) {
    const body: DeviceCommandRequest = {
      device_id,
      channel_route,
      command: {
        devices,
        execution: [
          {
            command: 'lms.devices.commands.BrightnessAbsolute',
            params: {
              brightness
            }
          }
        ]
      }
    };
    return this.sendCommand(body);
  },

  async syncSTLSmartState({
    device_id,
    channel_route,
    devices,
    status,
    brightness
  }: DeviceSyncSTLSmartRequest) {
    const body: DeviceCommandRequest = {
      device_id,
      channel_route,
      command: {
        devices,
        execution: [
          {
            command: 'lms.devices.commands.OnOff',
            params: {
              on: status
            }
          },
          {
            command: 'lms.devices.commands.BrightnessAbsolute',
            params: {
              brightness
            }
          }
        ]
      }
    };
    return this.sendCommand(body);
  },

  async pollMultiDeviceExecution(
    rawResponse: MultiDeviceExecuteResponse
  ): Promise<MultiDeviceExecuteResponse> {
    const { request_ids = [], poll_interval = 2 } = rawResponse;
    if (request_ids.length === 0) return rawResponse;

    const pollIntervalMs = poll_interval * 1000;
    const maxAttempts = 10;
    let attempts = 0;
    const finalErrors: CommandError[] = [];
    const pendingRequests = [...request_ids];

    while (pendingRequests.length > 0 && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      attempts++;

      const checks = pendingRequests.map(async (req) => {
        try {
          const res = await this.getRequestById(req.request_id);
          if (res.status === 'completed') {
            const deviceStatus = res.result?.devices?.[0]?.status || 'SUCCESS';
            return {
              deviceId: req.id,
              completed: true,
              status: deviceStatus === 'SUCCESS' ? 'SUCCESS' : 'ERROR'
            };
          } else if (res.status === 'failed') {
            return {
              deviceId: req.id,
              completed: true,
              status: 'ERROR'
            };
          }
        } catch (error) {
          console.error(`Error polling request ${req.request_id}:`, error);
        }
        return { deviceId: req.id, completed: false };
      });

      const checkResults = await Promise.all(checks);

      checkResults.forEach((c) => {
        if (c && c.completed) {
          finalErrors.push({
            device_id: c.deviceId,
            status: c.status as 'SUCCESS' | 'ERROR'
          });
          const idx = pendingRequests.findIndex((p) => p.id === c.deviceId);
          if (idx > -1) pendingRequests.splice(idx, 1);
        }
      });
    }

    pendingRequests.forEach((req) => {
      finalErrors.push({
        device_id: req.id,
        status: 'ERROR'
      });
    });

    return {
      ...rawResponse,
      command_errors: finalErrors
    };
  },

  async multiTurnOnOffLight({
    device_ids,
    devices,
    status
  }: MultiDeviceTurnOnOffRequest): Promise<MultiDeviceExecuteResponse> {
    const body: MultiDeviceCommandRequest = {
      device_ids,
      command: {
        devices,
        execution: [
          {
            command: 'lms.devices.commands.OnOff',
            params: {
              on: status
            }
          }
        ]
      }
    };
    const rawRes = (await this.sendCommands(
      body as unknown as DeviceCommandRequest
    )) as unknown as MultiDeviceExecuteResponse;
    return this.pollMultiDeviceExecution(rawRes);
  },

  async multiSetBrightness({
    device_ids,
    devices,
    brightness
  }: MultiDeviceSetBrightnessRequest): Promise<MultiDeviceExecuteResponse> {
    const body: MultiDeviceCommandRequest = {
      device_ids,
      command: {
        devices,
        execution: [
          {
            command: 'lms.devices.commands.BrightnessAbsolute',
            params: {
              brightness
            }
          }
        ]
      }
    };
    const rawRes = (await this.sendCommands(
      body as unknown as DeviceCommandRequest
    )) as unknown as MultiDeviceExecuteResponse;
    return this.pollMultiDeviceExecution(rawRes);
  },

  async getRequestById(requestId: string): Promise<DeviceRequestResponse> {
    try {
      return await authenticatedApi.get<DeviceRequestResponse>(
        `/devices/clients/requests/${requestId}`
      );
    } catch (error) {
      throw new Error(`Request id: ${requestId} not found`);
    }
  },

  async setDevicesParentGroup(data: SetDevicesParentGroup): Promise<void> {
    try {
      await authenticatedApi.post<DeviceRequestResponse>(
        `/devices/clients/parent`,
        data
      );
    } catch (error: any) {
      throw new Error(error);
    }
  },

  async deleteDevicesParentGroup(id: string): Promise<void> {
    try {
      await authenticatedApi.delete<void>(`/clients/${id}/parent`);
    } catch (error: any) {
      console.error('❌ deleteDeviceParent error:', error.message);
      throw new Error(error);
    }
  },

  async createDevice(deviceData: any): Promise<Device> {
    try {
      return await authenticatedApi.post<Device>(
        `/devices/clients`,
        deviceData
      );
    } catch (error) {
      throw error;
    }
  },

  async queryDevices(data: DeviceQueryRequest): Promise<DeviceQueryResponse> {
    try {
      return await authenticatedApi.post<DeviceQueryResponse>(
        `/devices/clients/query`,
        data
      );
    } catch (error) {
      throw new Error('Failed to query devices');
    }
  },

  async updateDevice(
    deviceId: string | number,
    data: Partial<Device>
  ): Promise<Device> {
    try {
      return await authenticatedApi.patch<Device>(
        `/devices/clients/${deviceId}`,
        data
      );
    } catch (error) {
      console.error('Failed to update device');
      throw error;
    }
  },

  async updateDeviceTags(
    deviceId: string | number,
    tags: string[]
  ): Promise<Device> {
    try {
      return await authenticatedApi.patch<Device>(`/clients/${deviceId}/tags`, {
        tags
      });
    } catch (error) {
      throw new Error('Failed to update device');
    }
  },

  async deleteDevice(deviceId: string | number): Promise<void> {
    try {
      await authenticatedApi.delete<void>(`/devices/clients/${deviceId}`);
    } catch (error) {
      throw new Error('Failed to delete device');
    }
  }
};
