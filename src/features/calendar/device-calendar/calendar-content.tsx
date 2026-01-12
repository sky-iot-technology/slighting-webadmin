import {
  Calendar,
  GetCalendarsParamsDto,
  useGetCalendarsByDevice
} from '@/core/domains/calendars';
import { ColumnDef } from '@tanstack/react-table';
import { memo } from 'react';
import { CalendarTable } from './calendar-device-tables';
import { columns } from './calendar-device-tables/calendar-device-columns';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface CalendarContentProps {
  deviceId: string;
  filters: GetCalendarsParamsDto;
}

export const CalendarContent = memo(function CalendarContent({
  filters,
  deviceId
}: CalendarContentProps) {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetCalendarsByDevice(deviceId, {
    ...filters
  });

  const calendars = data?.schedules ?? [];
  const totalItems = data?.total ?? 0;

  return (
    <CalendarTable
      data={calendars}
      totalItems={totalItems}
      columns={columns(t) as ColumnDef<Calendar, any>[]}
      clientId={deviceId}
      isLoading={isLoading}
      error={error}
    />
  );
});
