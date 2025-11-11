'use client';

import { Breadcrumbs } from '../breadcrumbs';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import { UserNav } from './user-nav';
import { useBreadcrumbsContextOptional } from '@/core/shared/context/breadcrumbs-context';

export default function Header() {
  const context = useBreadcrumbsContextOptional();
  const customContent = context?.customContent ?? null;

  return (
    <header className='bg-card flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        {customContent !== null ? customContent : <Breadcrumbs />}
      </div>

      <div className='flex items-center gap-2 px-4'>
        <UserNav />
        <ModeToggle />
      </div>
    </header>
  );
}
