import {
  Calendar,
  GetCalendarsParamsDto,
  useGetCalendars
} from '@/core/domains/calendars';
import { SelectedRegion } from '@/ui/components/tree-group';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { CalendarTable } from './calendar-tables';
import { memo } from 'react';
import { columns } from './calendar-tables/columns';

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

  return (
    <CalendarTable
      data={calendars}
      totalItems={totalItems}
      columns={columns as ColumnDef<Calendar, any>[]}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      region={selectedRegion ?? null}
      isLoading={isLoading}
      error={error}
    />
  );
});
