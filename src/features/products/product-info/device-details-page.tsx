'use client';

import { useGetDeviceById } from '@/core/domains/devices';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { Button } from '@/ui/components/ui/button';
import { Skeleton } from '@/ui/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/ui/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { OverviewTab } from './components/overview-tab';
import { ActivityTab } from './components/activity-tab';
import { AnalysisTab } from './components/analysis-tab';
import { CalendarContent } from '@/features/calendar/device-calendar/calendar-content';
import { GetCalendarsParamsDto } from '@/core/domains/calendars';

export default function DeviceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const deviceId = params?.id as string;

  const { data: device, isLoading, error } = useGetDeviceById(deviceId);

  // Prepare calendar filters
  const calendarFilters: GetCalendarsParamsDto = useMemo(() => {
    const page = searchParams.get('page');
    const pageLimit = searchParams.get('perPage');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const device_sync = searchParams.get('device_sync');
    const search = searchParams.get('name');

    return {
      page: page ? parseInt(page) : 1,
      limit: pageLimit ? parseInt(pageLimit) : 20,
      start_range: startDate ?? undefined,
      end_range: endDate ?? undefined,
      status: status as any,
      device_sync: device_sync as any,
      ...(search && { name: search })
    };
  }, [searchParams]);

  // Memoize the breadcrumb content to prevent infinite re-renders
  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>
          Chi tiết thiết bị:{' '}
          <span className='text-primary'>{device?.name || 'Loading...'}</span>
        </span>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [device?.name]
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  if (isLoading) {
    return (
      <div className='space-y-6 p-6'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-96 w-full' />
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className='flex h-64 items-center justify-center p-6'>
        <div className='text-center'>
          <h3 className='text-destructive text-lg font-semibold'>
            Error loading device
          </h3>
          <p className='text-muted-foreground text-sm'>
            {error?.message || 'Device not found'}
          </p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const tabClassName = `data-[state=active]:bg-[linear-gradient(180deg,#0859AA_0%,#032444_100%)] text-foreground rounded-md px-4 py-1 transition-all data-[state=active]:text-white data-[state=active]:shadow-none font-bold mx-3 cursor-pointer`;

  return (
    <div className='bg-card p-4'>
      {/* Tabs */}
      <Tabs defaultValue='overview' className='will-change-auto'>
        <TabsList className='bg-card grid h-14 auto-cols-max grid-flow-col py-2 shadow-[0px_4px_4px_0px_rgba(0,71,117,0.4)] will-change-auto'>
          <div className='w-14'>
            <div className='flex items-center justify-center'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <TabsTrigger value='overview' className={tabClassName}>
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value='activity' className={tabClassName}>
            Hoạt động
          </TabsTrigger>
          <TabsTrigger value='analytics' className={tabClassName}>
            Phân tích
          </TabsTrigger>
          <TabsTrigger value='schedule' className={tabClassName}>
            Quản lý lịch
          </TabsTrigger>
          <TabsTrigger value='maintenance' className={tabClassName}>
            Vận hành và bảo trì
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='mt-6 space-y-6'>
          <OverviewTab device={device} />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value='activity' className='mt-6'>
          <ActivityTab device={device} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value='analytics' className='mt-6'>
          <AnalysisTab device={device} />
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value='schedule' className='mt-6 flex flex-col'>
          <div className='flex min-h-[500px] w-full flex-col'>
            <CalendarContent deviceId={deviceId} filters={calendarFilters} />
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value='maintenance' className='mt-6'>
          <div className='rounded-lg border p-6'>
            <p className='text-muted-foreground'>
              Nội dung tab Vận hành và bảo trì sẽ được cập nhật sau
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
