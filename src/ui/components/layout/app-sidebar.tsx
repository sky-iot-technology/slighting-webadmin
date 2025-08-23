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
  SidebarGroupLabel,
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
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
export default function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [open]);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        {open ? (
          <div className='flex flex-row items-center justify-center'>
            <Image
              src='/assets/images/logo.png'
              alt='logo'
              width={44}
              height={44}
            />
            <span className='pl-2 text-xl font-bold'>{'Slighting'}</span>
          </div>
        ) : (
          <div className='flex flex-row items-center justify-center'>
            <Image
              src='/assets/images/logo.png'
              alt='logo'
              width={44}
              height={44}
            />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup className='mt-4'>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      {item.icon &&
                        (pathname === item.url && open ? (
                          <svg
                            width='34'
                            height='36'
                            viewBox='0 0 34 36'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M15 36C9.78439 28.7027 -1.28398e-06 29.3741 -7.97296e-07 18.24C-3.1061e-07 7.10594 8.79889 5.83784 15 -8.30516e-07C26.7638 -3.16304e-07 34 7.10594 34 18.24C34 29.3741 26.7638 36 15 36Z'
                              fill='#072645'
                            />
                            <rect
                              x='29'
                              y='6'
                              width='24'
                              height='24'
                              rx='12'
                              transform='rotate(90 29 6)'
                              fill='white'
                            />
                            <foreignObject x='7' y='8' width='24' height='24'>
                              <Icon color='#072645' width={20} height={20} />
                            </foreignObject>
                          </svg>
                        ) : (
                          <Icon />
                        ))}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <span className='text-center text-sm text-gray-500'>v1.0.0</span>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
