import { authenticatedApi } from '@/core/shared/api';
import {
  Device,
  DeviceCommandRequest,
  DeviceExecuteResponse,
  DeviceListResponseDto,
  DeviceRequestResponse,
  DeviceSetBrightnessRequest,
  DeviceTurnOnOffRequest,
  GetDevicesParamsDto,
  SetDevicesParentGroup
} from './types';

export const devicesApi = {
  async getAll(params?: GetDevicesParamsDto): Promise<DeviceListResponseDto> {
    const { page = 1, limit = 20, ...rest } = params ?? {};
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

  async sendCommands(
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
    return this.sendCommands(body);
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
    return this.sendCommands(body);
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
      throw new Error('Failed to create device');
    }
  }
};
