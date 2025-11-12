import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { tagsApi } from './api';
import type { GetTagsParamsDto, TagListResponseDto } from './types';

// Query keys
export const TAGS_QUERY_KEY = 'tags';

export const useGetTags = (
  params?: GetTagsParamsDto,
  options?: Omit<
    UseQueryOptions<
      TagListResponseDto,
      Error,
      TagListResponseDto,
      readonly [string, GetTagsParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    TagListResponseDto,
    Error,
    TagListResponseDto,
    readonly [string, GetTagsParamsDto?]
  >({
    queryKey: [TAGS_QUERY_KEY, params],
    queryFn: () => tagsApi.getAll(params),
    gcTime: 30 * 60 * 1000, // Keep unused data for 30 minutes
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options
  });
};
