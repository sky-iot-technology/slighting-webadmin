'use client';

import { Breadcrumbs } from '../breadcrumbs';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import { Translated } from './translated';
import { UserNav } from './user-nav';
import { useBreadcrumbsContextOptional } from '@/core/shared/context/breadcrumbs-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui/components/ui/dropdown-menu';
import { Button } from '@/ui/components/ui/button';
import { useGetDomains, useAuthStore } from '@/core/domains/auth';
import { cookieUtils } from '@/core/shared/utils/cookies';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { ChevronDown, Building, LayoutGrid } from 'lucide-react';

export default function Header() {
  const context = useBreadcrumbsContextOptional();
  const customContent = context?.customContent ?? null;

  const { domainId, setDomainId } = useAuthStore();
  const { data: domains } = useGetDomains();
  const { language } = useTranslation();
  const isVi = language === 'vi';

  const currentDomain = domains?.find((d) => d.id === domainId);
  const currentDomainName = currentDomain
    ? currentDomain.name
    : isVi
      ? 'Chọn Dự Án'
      : 'Select Domain';

  const handleDomainChange = (newDomainId: string) => {
    if (newDomainId === domainId) return;
    cookieUtils.setSelectedDomainId(newDomainId);
    setDomainId(newDomainId);
    window.location.reload();
  };

  const handleBackToSelect = () => {
    window.location.href = '/auth/select-domain';
  };

  return (
    <header className='bg-card flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        {customContent !== null ? customContent : <Breadcrumbs />}
      </div>

      <div className='flex items-center gap-4 px-4'>
        {/* Domain Switcher */}
        {domains && domains.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='border-border bg-background hover:bg-accent hover:text-accent-foreground h-8 gap-1.5 border px-3 shadow-xs'
              >
                <Building className='text-muted-foreground h-3.5 w-3.5' />
                <span className='max-w-[120px] truncate text-xs font-medium'>
                  {currentDomainName}
                </span>
                <ChevronDown className='text-muted-foreground h-3 w-3' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel className='text-muted-foreground text-xs font-normal'>
                {isVi ? 'Chuyển dự án' : 'Switch Domain'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className='max-h-[200px] overflow-y-auto'>
                {domains.map((domain) => (
                  <DropdownMenuItem
                    key={domain.id}
                    onClick={() => handleDomainChange(domain.id)}
                    className={`flex cursor-pointer items-center justify-between text-xs ${
                      domain.id === domainId ? 'bg-accent font-semibold' : ''
                    }`}
                  >
                    <span className='truncate'>{domain.name}</span>
                    {domain.id === domainId && (
                      <span className='bg-primary h-1.5 w-1.5 rounded-full' />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleBackToSelect}
                className='text-primary focus:text-primary flex cursor-pointer items-center gap-1.5 text-xs font-medium'
              >
                <LayoutGrid className='h-3.5 w-3.5' />
                <span>
                  {isVi ? 'Quay lại màn hình chọn' : 'Back to Selection'}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className='flex items-center gap-2'>
          <Translated />
          <UserNav />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
