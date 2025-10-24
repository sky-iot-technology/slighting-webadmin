import {
  Calendar,
  GetCalendarsParamsDto,
  useGetCalendarsByDevice
} from '@/core/domains/calendars';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { memo } from 'react';
import { CalendarTable } from './calendar-device-tables';
import { columns } from './calendar-device-tables/calendar-device-columns';

interface CalendarContentProps {
  deviceId: string;
  filters: GetCalendarsParamsDto;
}

export const CalendarContent = memo(function CalendarContent({
  filters,
  deviceId
}: CalendarContentProps) {
  const { data, isLoading, error } = useGetCalendarsByDevice(deviceId, {
    ...filters
  });

  const calendars = data?.schedules ?? [];
  const totalItems = data?.total ?? 0;

  if (isLoading) {
    return (
      <div className='space-y-4 p-4'>
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
            Error loading calendars
          </h3>
          <p className='text-muted-foreground text-sm'>
            {error?.message || 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }
  return (
    <CalendarTable
      data={calendars}
      totalItems={totalItems}
      columns={columns as ColumnDef<Calendar, any>[]}
      clientId={deviceId}
    />
  );
});
