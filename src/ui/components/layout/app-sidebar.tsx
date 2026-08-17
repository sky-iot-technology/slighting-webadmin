'use client';
import { navItems } from '@/core/shared/constants/data';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/ui/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '@/ui/components/ui/sidebar';
import { IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/core/domains/language/useTranslation';
import * as React from 'react';
import { Icons } from '../icons';
import { SettingModal } from '@/features/setting/modal/setting';
import { useNavItems } from './useNavItemsBasePermission';
import {
  getFirstAccessibleRoute,
  usePermissionStore
} from '@/core/domains/permissions';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

// Reusable component for the active state SVG background
export function ActiveStateIcon({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
    // <svg
    //   width='34'
    //   height='36'
    //   viewBox='0 0 34 36'
    //   fill='none'
    //   xmlns='http://www.w3.org/2000/svg'
    // >
    //   <path
    //     d='M15 36C9.78439 28.7027 -1.28398e-06 29.3741 -7.97296e-07 18.24C-3.1061e-07 7.10594 8.79889 5.83784 15 -8.30516e-07C26.7638 -3.16304e-07 34 7.10594 34 18.24C34 29.3741 26.7638 36 15 36Z'
    //     fill='#072645'
    //   />
    //   <rect
    //     x='29'
    //     y='6'
    //     width='24'
    //     height='24'
    //     rx='12'
    //     transform='rotate(90 29 6)'
    //     fill='white'
    //   />
    //   <foreignObject x='9' y='9' width='24' height='24'>
    //     {children}
    //   </foreignObject>
    // </svg>
  );
}

// Helper component for rendering icons
function NavIcon({
  icon: Icon,
  isActive,
  size = 20
}: {
  icon: React.ComponentType<{
    color?: string;
    width?: number;
    height?: number;
    className?: string;
  }>;
  isActive: boolean;
  size?: number;
}) {
  if (isActive) {
    return <Icon className='brightness-0 invert' width={size} height={size} />;
  }
  return <Icon className='text-muted-foreground' width={size} height={size} />;
}

// Component for sidebar logo
function SidebarLogo({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  const { ui } = usePermissionStore();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const onClickLogo = () => {
    const nextRoute = getFirstAccessibleRoute(ui);

    if (nextRoute) {
      router.replace(nextRoute);
    } else {
      router.replace('/auth/sign-in');
    }
  };
  return (
    <>
      {isOpen ? (
        <div
          className='flex cursor-pointer flex-row items-center justify-center'
          onClick={onClickLogo}
        >
          <Image
            src={`${isDark ? '/assets/images/logo1.png' : '/assets/images/logo2.png'}`}
            alt='logo'
            width={130}
            height={130}
            className='h-[40px] w-[130px] object-contain'
          />
        </div>
      ) : (
        <div
          className='flex cursor-pointer flex-row items-center justify-center'
          onClick={onClickLogo}
        >
          <Image
            src='/assets/images/logo-sidebar.png'
            alt='logo'
            width={35}
            height={35}
            className='h-[35px] w-[35px] object-contain'
          />
        </div>
      )}
    </>
  );
}

// Component for rendering menu item icon
function MenuItemIcon({
  icon: Icon,
  isActive,
  showActiveState,
  size = 20
}: {
  icon: React.ComponentType<{
    color?: string;
    width?: number;
    height?: number;
    className?: string;
  }>;
  isActive: boolean;
  showActiveState: boolean;
  size?: number;
}) {
  if (!Icon) return null;

  if (isActive && showActiveState) {
    return (
      <ActiveStateIcon>
        <NavIcon icon={Icon} isActive={true} size={size} />
      </ActiveStateIcon>
    );
  }

  return <Icon className='dark:opacity-70' />;
}

// Component for sub-menu item
function SubMenuItem({
  subItem,
  isActive
}: {
  subItem: { title: string; url: string; icon?: string };
  isActive: boolean;
}) {
  const { t } = useTranslation();
  const SubIcon =
    subItem.icon && subItem.icon in Icons
      ? Icons[subItem.icon as keyof typeof Icons]
      : null;
  console.log(subItem);
  if (!SubIcon) {
    return (
      <SidebarMenuSubItem key={subItem.title}>
        <SidebarMenuSubButton asChild isActive={isActive}>
          <Link
            href={subItem.url}
            prefetch={true}
            className='flex items-center gap-2'
          >
            <span className='dark:text-gray-7'>{t(subItem.title as any)}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuSubItem key={subItem.title}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          href={subItem.url}
          prefetch={true}
          className='flex items-center gap-2'
        >
          <MenuItemIcon
            icon={SubIcon}
            isActive={isActive}
            showActiveState={isActive}
          />
          <span className={cn(`${!isActive ? 'dark:text-gray-7' : ''}`)}>
            {t(subItem.title as any)}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuSubItem>
  );
}

// Component for main menu item (non-collapsible)
function MainMenuItem({
  item,
  Icon,
  pathname,
  open
}: {
  item: (typeof navItems)[0];
  Icon: React.ComponentType;
  pathname: string;
  open: boolean;
}) {
  const { t } = useTranslation();
  const isActive = pathname === item.url || pathname.startsWith(item.url + '/');

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        tooltip={t(item.title as any)}
        isActive={isActive}
      >
        <Link href={item.url} prefetch={true}>
          <MenuItemIcon
            icon={Icon}
            isActive={isActive}
            showActiveState={isActive && open}
            size={20}
          />
          <span className={cn(`${!isActive ? 'dark:text-gray-7' : ''}`)}>
            {t(item.title as any)}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function MainMenuItemModal({
  item,
  Icon,
  isActive,
  onClick
}: {
  item: (typeof navItems)[0];
  Icon: React.ComponentType;
  isActive: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={t(item.title as any)}
        isActive={isActive}
        onClick={onClick}
        asChild={false}
      >
        <MenuItemIcon icon={Icon} isActive={isActive} showActiveState={false} />
        <span className='dark:text-gray-7'>{t(item.title as any)}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { open, isMobile } = useSidebar();
  const [openSettingModal, setOpenSettingModal] = React.useState(false);
  const navItemsPermission = useNavItems();
  const { t } = useTranslation();
  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [open]);

  React.useEffect(() => {
    if (pathname && !pathname.startsWith('/dashboard/product')) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('productParams');
      }
    }
  }, [pathname]);

  return (
    <>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <SidebarLogo isOpen={open} />
        </SidebarHeader>
        <SidebarContent className='overflow-x-hidden'>
          <SidebarGroup>
            <SidebarMenu>
              {navItemsPermission.map((item) => {
                const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                // const isActive = pathname === item.url;

                const isActive =
                  pathname === item.url ||
                  item.items?.some((sub) => pathname === sub.url);

                if (item.modal) {
                  return (
                    <MainMenuItemModal
                      key={item.title}
                      item={item}
                      Icon={Icon}
                      isActive={isActive ?? false}
                      onClick={() => {
                        setOpenSettingModal(true);
                      }}
                    />
                  );
                }

                if (item.items && item.items.length > 0) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={!!item.isActive}
                      className='group/collapsible'
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={!!isActive && !open && !isMobile}
                          >
                            <MenuItemIcon
                              icon={Icon}
                              isActive={!!isActive}
                              showActiveState={false}
                            />
                            <span className='dark:text-gray-7 group-data-[collapsible=icon]:hidden'>
                              {t(item.title as any)}
                            </span>
                            <IconChevronRight className='ml-auto !size-[18px] transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90 dark:opacity-70' />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((sub) => (
                              <SubMenuItem
                                key={sub.title}
                                subItem={sub}
                                isActive={pathname === sub.url}
                              />
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <MainMenuItem
                    key={item.title}
                    item={item}
                    Icon={Icon}
                    pathname={pathname}
                    open={open}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className='flex items-center justify-center gap-2'>
            <span className='text-center text-sm text-gray-500'>v1.0.0</span>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SettingModal
        open={openSettingModal}
        onOpenChange={setOpenSettingModal}
      />
    </>
  );
}
