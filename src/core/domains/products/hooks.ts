import type {
  UseMutationOptions,
  UseQueryOptions
} from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from '@/core/domains/language/useTranslation';

import { productsApi } from './api';
import type {
  GetProductsParamsDto,
  Product,
  ProductDetail,
  ProductListResponseDto,
  UpdateProductDto,
  CreateProductDto
} from './types';
// Using local PRODUCTS_QUERY_KEY instead of imported queryKeys

export const PRODUCTS_QUERY_KEY = 'products';

// Hook for getting all products with params
export const useGetProducts = (
  params?: GetProductsParamsDto,
  options?: Omit<
    UseQueryOptions<
      ProductListResponseDto,
      Error,
      ProductListResponseDto,
      readonly [string, GetProductsParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    ProductListResponseDto,
    Error,
    ProductListResponseDto,
    readonly [string, GetProductsParamsDto?]
  >({
    queryKey: [PRODUCTS_QUERY_KEY, params],
    queryFn: () => productsApi.getAll(params),
    gcTime: 30 * 60 * 1000, // Keep unused data for 30 minutes
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options
  });
};

// Hook for getting products by category
export const useGetProductsByCategory = (
  categoryId: string | number,
  params?: GetProductsParamsDto,
  options?: Omit<
    UseQueryOptions<
      ProductListResponseDto,
      Error,
      ProductListResponseDto,
      readonly [string, string, string | number, GetProductsParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    ProductListResponseDto,
    Error,
    ProductListResponseDto,
    readonly [string, string, string | number, GetProductsParamsDto?]
  >({
    queryKey: [PRODUCTS_QUERY_KEY, 'category', categoryId, params],
    queryFn: () => productsApi.getByCategory(categoryId, params),
    enabled: !!categoryId, // Only run query if categoryId is available
    gcTime: 30 * 60 * 1000, // Keep unused data for 30 minutes
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options
  });
};

// Hook for getting a single product by ID
export const useGetProductById = (
  id: string | number,
  options?: Omit<
    UseQueryOptions<
      ProductDetail,
      Error,
      ProductDetail,
      readonly [string, string, string | number]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    ProductDetail,
    Error,
    ProductDetail,
    readonly [string, string, string | number]
  >({
    queryKey: [PRODUCTS_QUERY_KEY, 'detail', id],
    queryFn: () => productsApi.getDetailById(id),
    enabled: !!id,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

// Hook for creating a new product
export const useCreateProduct = (
  options?: UseMutationOptions<Product, Error, CreateProductDto>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Product, Error, CreateProductDto>({
    mutationFn: (data) => productsApi.create(data),
    onSuccess: (data, variables, context) => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });

      // Add the new product to the cache
      queryClient.setQueryData([PRODUCTS_QUERY_KEY, 'detail', data.id], data);

      toast.success(t('toast.create_product_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to create product:', error);
      toast.error(error.message || t('toast.create_product_failed'));
      options?.onError?.(error, variables, context);
    },
    ...options
  });
};

// Hook for updating a product
export const useUpdateProduct = (
  options?: UseMutationOptions<
    Product,
    Error,
    { id: string | number; data: UpdateProductDto }
  >
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<
    Product,
    Error,
    { id: string | number; data: UpdateProductDto }
  >({
    mutationFn: ({ id, data }) => productsApi.update(id, data),
    onSuccess: (data, variables, context) => {
      // Invalidate all product queries and category queries that might contain this product
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });

      // Update the specific product in cache
      queryClient.setQueryData(
        [PRODUCTS_QUERY_KEY, 'detail', variables.id],
        data
      );

      toast.success(t('toast.update_product_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to update product:', error);
      toast.error(error.message || t('toast.update_product_failed'));
      options?.onError?.(error, variables, context);
    },
    ...options
  });
};

// Hook for deleting a product
export const useDeleteProduct = (
  options?: UseMutationOptions<void, Error, string | number>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, string | number>({
    mutationFn: (id) => productsApi.delete(id),
    onSuccess: (data, deletedId, context) => {
      // Remove the product from the cache
      queryClient.removeQueries({
        queryKey: [PRODUCTS_QUERY_KEY, 'detail', deletedId]
      });

      // Invalidate products list to reflect changes
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY]
      });

      toast.success(t('toast.delete_product_success'));
      options?.onSuccess?.(data, deletedId, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete product:', error);
      toast.error(error.message || t('toast.delete_product_failed'));
      options?.onError?.(error, variables, context);
    },
    ...options
  });
};

// Hook to prefetch products (useful for navigation)
export const usePrefetchProducts = (params?: GetProductsParamsDto) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: [PRODUCTS_QUERY_KEY, params],
      queryFn: () => productsApi.getAll(params),
      staleTime: 5 * 60 * 1000 // 5 minutes
    });
  };
};
