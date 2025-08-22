import type { BaseEntity, QueryParams } from '@/core/shared/types';

// Product types
export interface Product extends BaseEntity {
  photo_url: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  stock_quantity: number;
  sku: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ProductDetail extends Product {
  specifications?: Record<string, any>;
  images: string[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  related_products?: Product[];
}

export interface ProductVariant {
  id: number;
  name: string;
  value: string;
  price_adjustment?: number;
  stock_quantity: number;
}

export interface ProductReview {
  id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

// API DTOs
export interface GetProductsParamsDto extends QueryParams {
  category?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  featured?: boolean;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock_quantity: number;
  sku: string;
  photo_url?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  status?: 'active' | 'inactive' | 'draft';
}

// Response types
export interface ProductListResponseDto {
  products: Product[];
  total_products: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ProductDetailResponseDto {
  product: ProductDetail;
  related_products: Product[];
}

// Mock data types for backward compatibility
export interface MockProductResponse {
  products: Product[];
  total_products: number;
}
