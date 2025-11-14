import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { JournalListResponseDto, GetJournalsParamsDto } from './types';
import { journalsApi } from './api';

// Query keys
export const JOURNALS_QUERY_KEY = 'journals';

// Hook for getting journals by entity ID
export const useGetJournalsByEntityId = (
  entityId: string,
  params?: GetJournalsParamsDto,
  options?: Omit<
    UseQueryOptions<
      JournalListResponseDto,
      Error,
      JournalListResponseDto,
      readonly [string, string, GetJournalsParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    JournalListResponseDto,
    Error,
    JournalListResponseDto,
    readonly [string, string, GetJournalsParamsDto?]
  >({
    queryKey: [JOURNALS_QUERY_KEY, entityId, params],
    queryFn: () => journalsApi.getByEntityId(entityId, params),
    enabled: !!entityId,
    ...options
  });
};
