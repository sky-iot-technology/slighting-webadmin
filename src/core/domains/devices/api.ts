import { authenticatedApi } from '@/core/shared/api';
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
  SetDevicesParentGroup
} from './types';

export const devicesApi = {
  async getAll(params?: GetDevicesParamsDto): Promise<DeviceListResponseDto> {
    const { page = 1, limit = 20 } = params ?? {};
    const offset = (page - 1) * limit;
    const response = await authenticatedApi.get<DeviceListResponseDto>(
      `/devices/things`,
      {
        params: {
          offset,
          limit,
          ...params
        }
      }
    );

    return response;
  },

  async getByRegion(group: string): Promise<DeviceListResponseDto> {
    const response = await authenticatedApi.get<DeviceListResponseDto>(
      `/devices/things`,
      {
        params: {
          group
        }
      }
    );

    return response;
  },

  async getById(id: string | number): Promise<Device> {
    try {
      return await authenticatedApi.get<Device>(`/devices/things/${id}`);
    } catch (error) {
      throw new Error(`Product with id ${id} not found`);
    }
  },

  async sendCommand(
    body: DeviceCommandRequest
  ): Promise<DeviceExecuteResponse> {
    try {
      return await authenticatedApi.post<DeviceExecuteResponse>(
        `/devices/things/execute`,
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
        `/devices/things/executes`,
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

  async multiTurnOnOffLight({
    device_ids,
    devices,
    status
  }: MultiDeviceTurnOnOffRequest) {
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
    return this.sendCommands(body as unknown as DeviceCommandRequest);
  },

  async multiSetBrightness({
    device_ids,
    devices,
    brightness
  }: MultiDeviceSetBrightnessRequest) {
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
    return this.sendCommands(body as unknown as DeviceCommandRequest);
  },

  async getRequestById(requestId: string): Promise<DeviceRequestResponse> {
    try {
      return await authenticatedApi.get<DeviceRequestResponse>(
        `/devices/things/request/${requestId}`
      );
    } catch (error) {
      throw new Error(`Request id: ${requestId} not found`);
    }
  },

  async setDevicesParentGroup(data: SetDevicesParentGroup): Promise<void> {
    try {
      await authenticatedApi.post<DeviceRequestResponse>(
        `/devices/things/parent`,
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
        `/devices/things/object`,
        deviceData
      );
    } catch (error) {
      throw error;
    }
  },

  async queryDevices(data: DeviceQueryRequest): Promise<DeviceQueryResponse> {
    try {
      return await authenticatedApi.post<DeviceQueryResponse>(
        `/devices/things/query`,
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
        `/devices/things/${deviceId}`,
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
      await authenticatedApi.delete<void>(`/devices/things/${deviceId}`);
    } catch (error) {
      throw new Error('Failed to delete device');
    }
  }
};
