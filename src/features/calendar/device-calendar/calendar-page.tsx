'use client';
import { useMemo, useRef } from 'react';
import {
  GetCalendarsParamsDto,
  GetDeivceCalendarsParamsDto,
  ScheduleStatus,
  ScheduleSync
} from '@/core/domains/calendars';
import { useSearchParams } from 'next/navigation';
import { CalendarContent } from './calendar-content';
import { findNodeId } from '../helper';
import { useRegionTreeStore } from '@/core/domains/tree/store';

interface CalendarDeviceProps {
  deviceId: string;
}

export default function CalendarDeivcePage({ deviceId }: CalendarDeviceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const { treeData } = useRegionTreeStore();

  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const priority = searchParams.get('priority');
  const device_sync = searchParams.get('device_sync');
  const status = searchParams.get('status');
  const group = searchParams.get('group');

  const filters: GetDeivceCalendarsParamsDto = {
    page: page ? parseInt(page) : 1,
    limit: pageLimit ? parseInt(pageLimit) : 20,
    start_range: startDate ?? undefined,
    end_range: endDate ?? undefined,
    group: findNodeId(treeData, group ?? '') ?? undefined,
    status: status as ScheduleStatus | undefined,
    device_sync: device_sync as ScheduleSync | undefined,
    ...(search && { name: search })
  };

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
