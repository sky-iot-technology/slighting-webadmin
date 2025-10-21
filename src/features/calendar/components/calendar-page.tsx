'use client';

import { SelectedRegion } from '@/ui/components/tree-group';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { GetCalendarsParamsDto } from '@/core/domains/calendars';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CalendarTree from './calendar-tree';
import { CalendarContent } from './calendar-content';

export default function CalendarPage() {
  const [treeOpen, setTreeOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(
    null
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const filters: GetCalendarsParamsDto = {
    page: page ? parseInt(page.toString()) : 1,
    limit: pageLimit ? parseInt(pageLimit.toString()) : 20,
    start_range: startDate ?? undefined,
    end_range: endDate ?? undefined,
    ...(search && { name: search })
  };

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
    [pathname, router, selectedRegion?.id]
  );

  return (
    <div className='h-[calc(100dvh-52px)] w-full px-2.5 pt-[13px]'>
      <div className='bg-calender-gray h-full w-full rounded-[4px] pb-[7px]'>
        <div className='flex h-full w-full'>
          {/* Sidebar con (Tree) */}
          <div
            className={`rounded-[1px_1px_4px_4px] bg-white transition-all duration-300 ${treeOpen ? 'w-64' : 'w-0'}`}
          >
            {treeOpen && (
              <div className='flex h-full flex-col pt-1.5 pr-[9px] pl-2'>
                <div className='bg-background mb-2 flex h-[31px] items-center rounded-[6px] px-2'>
                  <Image
                    src={'/assets/icons/search.svg'}
                    alt='search'
                    width={11}
                    height={11}
                    className='text-muted-foreground mr-2 ml-1.5'
                  />

                  <input
                    className='text-foreground placeholder:text-muted-foreground w-full flex-1 bg-transparent text-xs focus:outline-none'
                    placeholder='Tìm kiếm chi nhánh...'
                  />
                </div>

                <CalendarTree
                  selectedRegion={selectedRegion}
                  onRegionChange={handleRegionChange}
                />
              </div>
            )}
          </div>

          <div className='flex flex-1 flex-col bg-white' ref={containerRef}>
            <CalendarContent
              filters={filters}
              selectedRegion={selectedRegion}
              isSidebarOpen={treeOpen}
              onToggleSidebar={() => setTreeOpen(!treeOpen)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
