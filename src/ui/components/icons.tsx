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
  dashboard: (props: any) => (
    <Image
      src={'/assets/icons/dashboard.svg'}
      alt='dashboard'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
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
  maintenance: (props: any) => (
    <Image
      src={'/assets/icons/maintenance.svg'}
      alt='maintenance'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  map: (props: any) => (
    <Image
      src={'/assets/icons/map.svg'}
      alt='map'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  calendar: (props: any) => (
    <Image
      src={'/assets/icons/calendar.svg'}
      alt='calendar'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  management: (props: any) => (
    <Image
      src={'/assets/icons/management.svg'}
      alt='management'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  branch: (props: any) => (
    <Image
      src={'/assets/icons/branch.svg'}
      alt='branch'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  organization: (props: any) => (
    <Image
      src={'/assets/icons/organization.svg'}
      alt='organization'
      width={20}
      height={20}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  role: (props: any) => (
    <Image
      src={'/assets/icons/role.svg'}
      alt='role'
      width={14}
      height={14}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  userAgent: (props: any) => (
    <Image
      src={'/assets/icons/user.svg'}
      alt='user'
      width={17}
      height={24}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  deviceMenu: (props: any) => (
    <Image
      src={'/assets/icons/device-menu.svg'}
      alt='device-menu'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  love: (props: any) => (
    <Image
      src={'/assets/icons/love.svg'}
      alt='love'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  firmware: (props: any) => (
    <Image
      src={'/assets/icons/firmware.svg'}
      alt='firmware'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  setting: (props: any) => (
    <Image
      src={'/assets/icons/setting.svg'}
      alt='setting'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  display: (props: any) => (
    <Image
      src={'/assets/icons/display.svg'}
      alt='display'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  alertSetting: (props: any) => (
    <Image
      src={'/assets/icons/alert-setting.svg'}
      alt='alertSetting'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  shield: (props: any) => (
    <Image
      src={'/assets/icons/shield.svg'}
      alt='shield'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  ),
  system: (props: any) => (
    <Image
      src={'/assets/icons/system.svg'}
      alt='system'
      width={17}
      height={17}
      className={`dark:invert ${props.className || ''}`}
    />
  )
};
