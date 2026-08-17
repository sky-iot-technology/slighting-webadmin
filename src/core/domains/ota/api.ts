import { authenticatedApi } from '@/core/shared/api';
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

export const otaApi = {
  async getAll(params?: GetOtasParamsDto): Promise<OtaListResponseDto> {
    const response = await authenticatedApi.get<OtaListResponseDto>(
      `/devices/firmwares`,
      {
        params: {
          ...params
        }
      }
    );
    return response;
  },

  async getOtaById(otaId: string): Promise<OtaItem> {
    // try {
    //   const response = await authenticatedApi.get<OtaItem>(`/devices/otas/${otaId}`);
    //   return response;
    // } catch (error: any) {
    //   console.error(`Fail to get Ota by Id`);
    //   throw new Error(`Can't get Ota by Id`)
    // }
    const response = await authenticatedApi.get<OtaItem>(
      `/devices/firmwares/${otaId}`
    );
    return response;
  },

  async createOta(data: CreateOtaDTO): Promise<OtaItem> {
    try {
      const response = await authenticatedApi.post<OtaItem>(
        '/devices/firmwares',
        data
      );
      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể tạo Ota. Vui lòng thử lại.';
      console.error('❌ createOta error:', message);
      throw new Error(message);
    }
  },

  async deleteOta(id: string): Promise<void> {
    try {
      await authenticatedApi.delete<void>(`/devices/firmwares/${id}`);
    } catch (error: any) {
      console.error('❌ deleteOta error:', error.message);
      throw new Error(error.message);
    }
  },

  async updateOta(id: string, data: UpdateOtaDto): Promise<OtaItem> {
    try {
      const response = await authenticatedApi.patch<OtaItem>(
        `/devices/firmwares/${id}`,
        data
      );
      return response;
    } catch (error: any) {
      console.error('❌ updateGroup error:', error.message);
      throw new Error(error.message);
    }
  },

  async executesManyOta(data: ExecuteOtaRequest): Promise<ExecuteOtaResponse> {
    try {
      const response = await authenticatedApi.post<ExecuteOtaResponse>(
        `/devices/clients/executes`,
        data
      );
      return response;
    } catch (error: any) {
      console.error('❌ execute ota error:', error.message);
      console.log(error);
      throw new Error(error.message);
    }
  },

  async getRequestById(requestId: string): Promise<OtaProgressResponse> {
    try {
      return await authenticatedApi.get<OtaProgressResponse>(
        `/devices/clients/request/${requestId}`
      );
    } catch (error) {
      throw new Error(`Request id: ${requestId} not found`);
    }
  }
};
