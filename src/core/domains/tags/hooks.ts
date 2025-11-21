import type {
  UseMutationOptions,
  UseQueryOptions
} from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from './api';
import type {
  CreateTagRequest,
  GetTagsParamsDto,
  Tag,
  TagListResponseDto
} from './types';
import { toast } from 'sonner';

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

export const useCreateTag = (
  options?: UseMutationOptions<Tag, Error, CreateTagRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation<Tag, Error, CreateTagRequest>({
    ...options,
    mutationFn: (data) => tagsApi.createTag(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] });

      // Add the new group to the cache
      queryClient.setQueryData([TAGS_QUERY_KEY, 'detail', data.id], data);

      toast.success('Tag created successfully!');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to create tag:', error);
      toast.error(error.message || 'Failed to create tag');
      options?.onError?.(error, variables, context);
    }
  });
};
