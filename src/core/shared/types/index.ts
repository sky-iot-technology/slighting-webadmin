// Common types used across the application

export interface PaginateQuery<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SearchParams {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  categories?: string[];
  tags?: string[];
  status?: string;
  [key: string]: any;
}

export interface QueryParams extends PaginationParams, SearchParams, FilterParams {}

// Base entity interface
export interface BaseEntity {
  id: number | string;
  created_at: string;
  updated_at: string;
}

// User related types
export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  is_active: boolean;
}

// Auth related types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'archived';
export type SortOrder = 'asc' | 'desc';
export type SortField = 'created_at' | 'updated_at' | 'name' | 'price' | 'status';
