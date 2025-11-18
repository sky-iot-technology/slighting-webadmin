import { QueryParams } from '@/core/shared';

export enum UserStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface Credentials {
  username: string;
}

export interface Metadata {
  about?: string;
  address?: string;
  email?: string;
  phone?: string;
  username?: string;
  role?: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  status: UserStatus;
  role: UserRole;
  credentials: Credentials;
  email: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
  verified_at: string;
  metadata?: Metadata;
  tags?: string[];
  profile_picture?: string;
}

export interface UserListResponseDto {
  users: User[];
  limit: number;
  offset: number;
  total: number;
}

export interface GetUsersParamsDto
  extends Omit<
    QueryParams,
    'order' | 'sort' | 'status' | 'search' | 'categories'
  > {
  status?: 'enabled' | 'disabled';
  //   only_total?: boolean;
}
