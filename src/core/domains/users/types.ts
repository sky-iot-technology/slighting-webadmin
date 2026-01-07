import { QueryParams } from '@/core/shared';

export enum UserStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  ALL = 'all'
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
  phone?: string;
  unit?: string;
  department?: string;
  roleId?: string;
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
  profile_picture?: string;
  tags?: string[];
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
  status?: 'enabled' | 'disabled' | 'all';
  tag?: string;
  //   only_total?: boolean;
}

export interface CreateUserCredentialsDto extends Credentials {
  secret: string;
}

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  status: UserStatus;
  credentials: CreateUserCredentialsDto;
  email: string;
  metadata?: Metadata;
  profile_picture?: string;
  tags?: string[];
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  metadata?: Metadata;
}

export interface UpdateProfileDto extends Omit<UpdateUserDto, 'role'> {}

export interface ChangePassDto {
  old_secret: string;
  new_secret: string;
}

export interface SearchUsersParamsDto
  extends Omit<
    QueryParams,
    'order' | 'sort' | 'status' | 'search' | 'categories'
  > {
  username?: string;
  first_name?: string;
  last_name?: string;
  tag?: string;
  id?: string;
  order?: string;
  dir?: 'asc' | 'desc';
}
