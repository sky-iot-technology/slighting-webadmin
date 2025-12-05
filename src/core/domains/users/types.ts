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
  role: UserRole;
  credentials: CreateUserCredentialsDto;
  email: string;
  metadata?: Metadata;
  profile_picture?: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  metadata?: Metadata;
}

export interface UpdateProfileDto extends Omit<UpdateUserDto, 'role'> {}
export interface UpdateRoleDto extends Pick<UpdateUserDto, 'role'> {}

export interface ChangePassDto {
  old_secret: string;
  new_secret: string;
}
