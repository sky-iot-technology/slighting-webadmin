import { CalendarTable } from '@/features/calendar/components/calendar-tables';
import { columns } from '@/features/calendar/components/calendar-tables/device-calendar-columns';
import { calendars } from '@/features/calendar/components/fake';

export default function page() {
  return (
    <CalendarTable
      data={calendars}
      totalItems={calendars.length}
      columns={columns}
    />
  );
}
