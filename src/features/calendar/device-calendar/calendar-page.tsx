'use client';
import { useMemo, useRef } from 'react';
import { GetCalendarsParamsDto } from '@/core/domains/calendars';
import { useSearchParams } from 'next/navigation';
import { CalendarContent } from './calendar-content';

interface CalendarDeviceProps {
  deviceId: string;
}

export default function CalendarDeivcePage({ deviceId }: CalendarDeviceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const filters = useMemo<GetCalendarsParamsDto>(
    () => ({
      page: page ? parseInt(page.toString()) : 1,
      limit: pageLimit ? parseInt(pageLimit.toString()) : 20,
      start_range: startDate ?? undefined,
      end_range: endDate ?? undefined,
      ...(search && { name: search })
    }),
    [page, pageLimit, startDate, endDate, search]
  );

  return (
    <div className='h-[calc(100dvh-52px)] w-full px-2.5 pt-[13px]'>
      <div className='h-full w-full rounded-[4px] pb-[7px]'>
        <div className='flex h-full w-full'>
          <div className='flex flex-1 flex-col bg-white' ref={containerRef}>
            <CalendarContent deviceId={deviceId} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}
