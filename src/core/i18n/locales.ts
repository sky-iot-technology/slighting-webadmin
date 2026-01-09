// export const translations = {
//     vi: {
//         // navbar
//         dashboard: 'Trang chủ',
//         map: 'Bản đồ',
//         management: 'Quản lý',
//         favorite_groups: 'Nhóm yêu thích',
//         branches: 'Chi nhánh',
//         roles: 'Vai trò',
//         users: 'Người dùng',
//         device_management: 'Quản lý thiết bị',
//         calendar_management: 'Quản lý lịch',
//         maintenance_management: 'Quản lý bảo trì',
//         organization_management: 'Quản lý tổ chức',
//         firmware_management: 'Quản lý Firmware',
//         settings: 'Cài đặt',
//         sign_out: 'Đăng xuất',
//         profile: 'Hồ sơ',

//         //General
//         loading: 'Đang tải...',

//         // Auth
//         login_success: 'Đăng nhập thành công!',
//         login_failed: 'Đăng nhập thất bại',

//         //Profile

//         // Map
//         no_devices: 'Không có thiết bị trong khu vực này',

//         // Common Actions
//         save: 'Lưu',
//         cancel: 'Hủy',
//         delete: 'Xóa',
//         edit: 'Sửa',
//         create: 'Tạo mới',
//         search: 'Tìm kiếm',

//         //setting
//         appearance: 'Giao diện',
//         notification: 'Thông báo',
//         security: 'Bảo mật',
//         system: 'Hệ thống',
//     },
//     en: {
//         // navbar
//         dashboard: 'Dashboard',
//         map: 'Map',
//         management: 'Management',
//         favorite_groups: 'Favorite Groups',
//         branches: 'Branches',
//         roles: 'Roles',
//         users: 'Users',
//         device_management: 'Device Management',
//         calendar_management: 'Calendar Management',
//         maintenance_management: 'Maintenance Management',
//         organization_management: 'Organization Management',
//         firmware_management: 'Firmware Management',
//         settings: 'Settings',
//         sign_out: 'Sign Out',
//         profile: 'Profile',

//         //General
//         loading: 'Loading...',

//         // Auth
//         login_success: 'Login successful!',
//         login_failed: 'Login failed',

//         // Map
//         no_devices: 'No devices in this area',

//         // Common Actions
//         save: 'Save',
//         cancel: 'Cancel',
//         delete: 'Delete',
//         edit: 'Edit',
//         create: 'Create',
//         search: 'Search',

//         //setting
//         appearance: 'Appearance',
//         notification: 'Notification',
//         security: 'Security',
//         system: 'System',
//     }
// };

// export type LanguageKey = keyof typeof translations.vi;

import { vi } from './vi';
import { en } from './en';

export const translations = {
  vi,
  en
} as const;

export type Language = keyof typeof translations;

type TranslationTree = typeof vi;

/**
 * navbar.dashboard | profile.title | auth.login_success
 */
type DotNestedKeys<T> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}.${DotNestedKeys<T[K]>}`
    : `${K}`;
}[keyof T & string];

export type LanguageKey = DotNestedKeys<TranslationTree>;
