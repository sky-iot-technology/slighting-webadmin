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
import { useTranslation } from '@/core/domains/language/useTranslation';

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
  const { t } = useTranslation();

  return useMutation<Tag, Error, CreateTagRequest>({
    ...options,
    mutationFn: (data) => tagsApi.createTag(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] });

      // Add the new group to the cache
      queryClient.setQueryData([TAGS_QUERY_KEY, 'detail', data.id], data);

      toast.success(t('toast.create_tag_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to create tag:', error);
      toast.error(error.message || t('toast.create_tag_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useUpdateTag = (
  options?: UseMutationOptions<Tag, Error, { tagId: string; name: string }>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Tag, Error, { tagId: string; name: string }>({
    ...options,
    mutationFn: ({ tagId, name }) => tagsApi.updateTag(tagId, name),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] });

      queryClient.setQueryData([TAGS_QUERY_KEY, 'detail', data.id], data);

      toast.success(t('toast.update_tag_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to updated tag:', error);
      toast.error(error.message || t('toast.update_tag_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};
