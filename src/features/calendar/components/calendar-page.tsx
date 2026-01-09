'use client';

import { SelectedRegion } from '@/ui/components/tree-group';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GetCalendarsParamsDto } from '@/core/domains/calendars';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CalendarContent } from './calendar-content';
import { CalendarSidebar } from './calendar-sidebar';
import { cn } from '@/lib/utils';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { useTranslation } from '@/core/domains/language/useTranslation';

export default function CalendarPage() {
  const { t } = useTranslation();

  const [treeOpen, setTreeOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState('');

  const { treeData } = useRegionTreeStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>
          {t('navbar.calendar_management')}
        </span>
      </div>
    ),
    [t]
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const filters = useMemo<GetCalendarsParamsDto>(
    () => ({
      page: page ? parseInt(page.toString()) : 1,
      limit: pageLimit ? parseInt(pageLimit.toString()) : 10,
      start_range: startDate ?? undefined,
      end_range: endDate ?? undefined,
      ...(search && { name: search })
    }),
    [page, pageLimit, startDate, endDate, search]
  );

  const handleRegionChange = useCallback(
    (region: SelectedRegion) => {
      const newUrl = new URL(pathname, window.location.origin);
      setSelectedRegion(region);
      newUrl.searchParams.set('page', '1');
      router.push(newUrl.toString());
    },
    [pathname, router, selectedRegion]
  );

  const handleToggleSidebar = useCallback(() => {
    setTreeOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (treeData?.length && !selectedRegion) {
      setSelectedRegion({
        id: treeData[0].id,
        name: treeData[0].name
      });
    }
  }, [treeData, selectedRegion]);

  return (
    <div className='h-[calc(100dvh-52px)] w-full px-2.5 pt-[13px]'>
      <div className='bg-calender-gray h-full w-full rounded-[4px] pb-[7px]'>
        <div className='flex h-full w-full'>
          <div
            className={cn(
              'bg-white transition-all duration-300 ease-in-out',
              'overflow-hidden rounded-[1px_1px_4px_4px]',
              'fixed inset-y-0 left-0 z-50 w-64 -translate-x-full md:static md:z-auto md:translate-x-0',
              'md:w-64 md:overflow-visible',
              treeOpen && 'translate-x-0 md:w-64',
              !treeOpen && 'md:w-0'
            )}
          >
            {treeOpen && (
              <CalendarSidebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
              />
            )}
          </div>

          {treeOpen && (
            <div
              className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden'
              onClick={() => setTreeOpen(false)}
            />
          )}

          <div className='flex flex-1 flex-col bg-white' ref={containerRef}>
            <CalendarContent
              filters={filters}
              selectedRegion={selectedRegion}
              isSidebarOpen={treeOpen}
              onToggleSidebar={handleToggleSidebar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
