import {
  Calendar,
  GetCalendarsParamsDto,
  useGetCalendars
} from '@/core/domains/calendars';
import { SelectedRegion } from '@/ui/components/tree-group';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { CalendarTable } from './calendar-tables';
import { columns } from './calendar-tables/columns';
import { memo } from 'react';

interface CalendarContentProps {
  filters: GetCalendarsParamsDto;
  selectedRegion: SelectedRegion | null;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const CalendarContent = memo(function CalendarContent({
  filters,
  selectedRegion,
  isSidebarOpen,
  onToggleSidebar
}: CalendarContentProps) {
  const { data, isLoading, error } = useGetCalendars({
    ...filters,
    groups: selectedRegion?.id
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
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      region={selectedRegion ?? null}
    />
  );
});
