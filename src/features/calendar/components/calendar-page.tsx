'use client';

import { SelectedRegion } from '@/ui/components/tree-group';
import { useCallback, useMemo, useRef, useState } from 'react';
import { GetCalendarsParamsDto } from '@/core/domains/calendars';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CalendarContent } from './calendar-content';
import { CalendarSidebar } from './calendar-sidebar';

export default function CalendarPage() {
  const [treeOpen, setTreeOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

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
      if (selectedRegion?.id === region?.id) {
        setSelectedRegion(null);
        newUrl.searchParams.delete('page');
      } else {
        setSelectedRegion(region);
        newUrl.searchParams.set('page', '1');
      }
      router.push(newUrl.toString());
    },
    [pathname, router, selectedRegion]
  );

  const handleToggleSidebar = useCallback(() => {
    setTreeOpen((prev) => !prev);
  }, []);

  return (
    <div className='h-[calc(100dvh-52px)] w-full px-2.5 pt-[13px]'>
      <div className='bg-calender-gray h-full w-full rounded-[4px] pb-[7px]'>
        <div className='flex h-full w-full'>
          {/* Sidebar con (Tree) */}
          <div
            className={`rounded-[1px_1px_4px_4px] bg-white transition-all duration-300 ${treeOpen ? 'w-64' : 'w-0'}`}
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
