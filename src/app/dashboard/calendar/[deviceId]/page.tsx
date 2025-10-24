'use client';
import { useParams } from 'next/navigation';
import CalendarDeivcePage from '@/features/calendar/device-calendar/calendar-page';

export default function CalendarPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  return <CalendarDeivcePage deviceId={deviceId} />;
}
