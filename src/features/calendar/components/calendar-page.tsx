'use client';
import { RegionNode, useGetGroups } from '@/core/domains/groups';
import { RegionTree, SelectedRegion } from '@/ui/components/tree-group';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { columns } from './calendar-tables/columns';
import { CalendarTable } from './calendar-tables';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, useGetCalendars } from '@/core/domains/calendars';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/ui/components/ui/skeleton';

export const sampleRegions: RegionNode[] = [
  {
    id: 'hcm',
    name: 'Hồ Chí Minh',
    children: [
      {
        id: 'thuduc',
        name: 'Thủ Đức'
      },
      {
        id: 'quan1',
        name: 'Quận 1'
      },
      {
        id: 'govap',
        name: 'Gò Vấp'
      }
    ]
  },
  {
    id: 'hanoi',
    name: 'Hà Nội',
    children: [
      { id: 'caugiay', name: 'Cầu Giấy' },
      { id: 'hoankiem', name: 'Hoàn Kiếm' }
    ]
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    children: [
      { id: 'haichau', name: 'Hải Châu' },
      { id: 'sontra', name: 'Sơn Trà' }
    ]
  },
  {
    id: 'haugiang',
    name: 'Hậu Giang'
  },
  {
    id: 'dongnai',
    name: 'Đồng Nai'
  }
];

export default function CalendarPage() {
  const [treeOpen, setTreeOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const filters = {
    page: page ? parseInt(page.toString()) : undefined,
    limit: pageLimit ? parseInt(pageLimit.toString()) : undefined,
    from: startDate ?? undefined,
    to: endDate ?? undefined,
    ...(search && { name: search })
  };

  const { data, isLoading, error, refetch } = useGetCalendars(filters);

  const calendars = data?.calendars ?? [];
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isLoading, error]);

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-96' />
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-16 w-full' />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <h3 className='text-destructive text-lg font-semibold'>
            Error loading products
          </h3>
          <p className='text-muted-foreground text-sm'>
            {error.message || 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }

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
                <div className='bg-background flex h-[31px] items-center rounded-[6px] pr-2 pl-2'>
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

                <RegionTree
                  renderNode='icon'
                  data={sampleRegions}
                  onSelect={(item) => {}}
                  onToggle={(node) => {
                    console.log('Toggled node:', node);
                  }}
                  selectedId={undefined}
                  width={'100%'}
                  height={height}
                  indent={25}
                  rowHeight={36}
                  overscanCount={1}
                  paddingTop={10}
                />
              </div>
            )}
          </div>

          {/* Main content (Table) */}
          <div className='flex flex-1 flex-col bg-white' ref={containerRef}>
            <CalendarTable
              data={calendars}
              totalItems={data?.total_calendars ?? 0}
              columns={columns as ColumnDef<Calendar, any>[]}
              isSidebarOpen={treeOpen}
              onToggleSidebar={() => setTreeOpen(!treeOpen)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
