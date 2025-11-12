import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCommand,
  IconCreditCard,
  IconFile,
  IconFileText,
  IconHelpCircle,
  IconPhoto,
  IconDeviceLaptop,
  IconLayoutDashboard,
  IconLoader2,
  IconLogin,
  IconProps,
  IconShoppingBag,
  IconMoon,
  IconDotsVertical,
  IconPizza,
  IconPlus,
  IconSettings,
  IconSun,
  IconTrash,
  IconBrandTwitter,
  IconUser,
  IconUserCircle,
  IconUserEdit,
  IconUserX,
  IconX,
  IconLayoutKanban,
  IconBrandGithub,
  IconPalette,
  IconShieldCheck
} from '@tabler/icons-react';
import Image from 'next/image';

export type Icon = React.ComponentType<IconProps>;

export const Icons = {
  dashboard: IconLayoutDashboard,
  logo: IconCommand,
  login: IconLogin,
  close: IconX,
  product: IconShoppingBag,
  spinner: IconLoader2,
  kanban: IconLayoutKanban,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  trash: IconTrash,
  employee: IconUserX,
  post: IconFileText,
  page: IconFile,
  userPen: IconUserEdit,
  user2: IconUserCircle,
  media: IconPhoto,
  settings: IconSettings,
  billing: IconCreditCard,
  ellipsis: IconDotsVertical,
  add: IconPlus,
  warning: IconAlertTriangle,
  user: IconUser,
  arrowRight: IconArrowRight,
  help: IconHelpCircle,
  pizza: IconPizza,
  sun: IconSun,
  moon: IconMoon,
  laptop: IconDeviceLaptop,
  github: IconBrandGithub,
  twitter: IconBrandTwitter,
  check: IconCheck,
  palette: IconPalette,
  maintenance: () => (
    <Image
      src={'/assets/icons/maintenance.svg'}
      alt='maintenance'
      width={17}
      height={17}
      className='dark:invert'
    />
  ),
  map: () => (
    <Image
      src={'/assets/icons/map.svg'}
      alt='map'
      width={17}
      height={17}
      className='dark:invert'
    />
  ),
  calendar: () => (
    <Image
      src={'/assets/icons/calendar.svg'}
      alt='calendar'
      width={17}
      height={17}
      className='dark:invert'
    />
  ),
  management: () => (
    <Image
      src={'/assets/icons/management.svg'}
      alt='management'
      width={17}
      height={17}
      className='dark:invert'
    />
  ),
  branch: () => (
    <Image
      src={'/assets/icons/branch.svg'}
      alt='branch'
      width={17}
      height={17}
      className='dark:invert'
    />
  ),
  organization: () => (
    <Image
      src={'/assets/icons/organization.svg'}
      alt='organization'
      width={20}
      height={20}
      className='dark:invert'
    />
  ),
  role: () => (
    <Image
      src={'/assets/icons/role.svg'}
      alt='role'
      width={14}
      height={14}
      className='dark:invert'
    />
  )
};
