import { authenticatedApi } from '@/core/shared/api';
import { JournalListResponseDto, GetJournalsParamsDto } from './types';

export const journalsApi = {
  async getByEntityId(
    entityId: string,
    params?: GetJournalsParamsDto
  ): Promise<JournalListResponseDto> {
    const { limit = 10, offset = 0, operation, ...rest } = params ?? {};

    const queryParams: Record<string, any> = {
      with_attributes: params?.with_attributes ?? true,
      with_metadata: params?.with_metadata ?? true,
      limit,
      offset,
      ...rest
    };

    // Only add operation param if specified
    if (operation) {
      queryParams.operation = operation;
    }

    const response = await authenticatedApi.get<JournalListResponseDto>(
      `/journal/client/${entityId}`,
      {
        params: queryParams
      }
    );

    return response;
  }
};
