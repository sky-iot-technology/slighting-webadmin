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
    title: 'navbar.dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    resourceId: 'dashboard',
    featureId: 'dashboard',
    requiredActions: ['view'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'navbar.map',
    url: '/dashboard/map',
    icon: 'map',
    shortcut: ['p', 'p'],
    isActive: false,
    resourceId: 'map',
    requiredActions: ['view'],
    items: [] // No child items
  },
  {
    title: 'navbar.management',
    url: '/dashboard/management',
    icon: 'management',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'navbar.favorite_groups',
        url: '/dashboard/tag',
        icon: 'love',
        resourceId: 'group',
        featureId: 'group',
        requiredActions: ['view'],
        shortcut: ['m', 'm']
      },
      {
        title: 'navbar.branches',
        url: '/dashboard/branch',
        icon: 'branch',
        resourceId: 'group',
        featureId: 'group',
        requiredActions: ['view'],
        shortcut: ['m', 'm']
      },
      {
        title: 'navbar.roles',
        url: '/dashboard/role',
        icon: 'role',
        resourceId: 'role',
        featureId: 'management',
        requiredActions: ['view'],
        shortcut: ['m', 'm']
      },
      {
        title: 'navbar.users',
        url: '/dashboard/user',
        icon: 'userAgent',
        resourceId: 'users',
        featureId: 'management',
        requiredActions: ['view'],
        shortcut: ['m', 'm']
      }
    ]
  },
  {
    title: 'navbar.device_management',
    url: '/dashboard/product',
    icon: 'deviceMenu',
    shortcut: ['r', 'r'],
    resourceId: 'device',
    featureId: 'device',
    requiredActions: ['view'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'navbar.calendar_management',
    url: '/dashboard/calendar',
    icon: 'calendar',
    shortcut: ['p', 'p'],
    resourceId: 'schedule',
    featureId: 'schedule',
    requiredActions: ['view'],
    isActive: false,
    items: []
  },
  {
    title: 'navbar.maintenance_management',
    url: '/dashboard/maintenance',
    icon: 'maintenance',
    shortcut: ['m', 'm'],
    resourceId: 'alarm',
    featureId: 'alarm',
    requiredActions: ['view'],
    isActive: false,
    items: []
  },
  // {
  //   title: 'navbar.organization_management',
  //   url: '/dashboard/organization',
  //   icon: 'organization',
  //   shortcut: ['m', 'm'],
  //   resourceId: 'department',
  //   requiredActions: ['view'],
  //   isActive: false,
  //   items: []
  // },
  {
    title: 'navbar.firmware_management',
    url: '/dashboard/ota',
    icon: 'firmware',
    shortcut: ['m', 'm'],
    resourceId: 'firmware',
    featureId: 'firmware',
    requiredActions: ['view'],
    isActive: false,
    items: []
  },
  {
    title: 'navbar.settings',
    url: '/dashboard/setting',
    icon: 'setting',
    shortcut: ['m', 'm'],
    featureId: 'setting',
    isActive: false,
    modal: true,
    items: []
  }
];
