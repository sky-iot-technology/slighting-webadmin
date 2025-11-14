import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Bản đồ',
    url: '/dashboard/map',
    icon: 'map',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Quản lý',
    url: '/dashboard/management',
    icon: 'management',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Chi nhánh',
        url: '/dashboard/branch',
        icon: 'branch',
        shortcut: ['m', 'm']
      },
      {
        title: 'Vai trò',
        url: '/dashboard/role',
        icon: 'role',
        shortcut: ['m', 'm']
      }
    ]
  },
  {
    title: 'Quản lý thiết bị',
    url: '/dashboard/product',
    icon: 'deviceMenu',
    shortcut: ['r', 'r'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Quản lý lịch',
    url: '/dashboard/calendar',
    icon: 'calendar',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Quản lý bảo trì',
    url: '/dashboard/maintenance',
    icon: 'maintenance',
    shortcut: ['m', 'm'],
    isActive: false,
    items: []
  },
  {
    title: 'Quản lý tổ chức',
    url: '/dashboard/organization',
    icon: 'organization',
    shortcut: ['m', 'm'],
    isActive: false,
    items: []
  }
  // {
  //   title: 'Account',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: 'billing',
  //   isActive: true
  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/profile',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Login',
  //       shortcut: ['l', 'l'],
  //       url: '/',
  //       icon: 'login'
  //     }
  //   ]
  // },
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // },,
  // {
  //   title: 'Styleguide',
  //   url: '/styleguide',
  //   icon: 'palette',
  //   shortcut: ['s', 's'],
  //   isActive: false,
  //   items: [] // No child items
  // }
];
