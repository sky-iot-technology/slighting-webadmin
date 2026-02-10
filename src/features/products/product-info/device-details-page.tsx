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
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation';
import { useMemo, useState } from 'react';
import { OverviewTab } from './components/overview-tab';
import { ActivityTab } from './components/activity-tab';
import { AnalysisTab } from './components/analysis-tab';
import { CalendarContent } from '@/features/calendar/device-calendar/calendar-content';
import { GetCalendarsParamsDto } from '@/core/domains/calendars';
import MaintenanceTab from './components/maintenance-tab';
import { useTranslation } from '@/core/domains/language/useTranslation';

export default function DeviceDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab') ?? 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  const deviceId = params?.id as string;

  const { data: device, isLoading, error } = useGetDeviceById(deviceId);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const { pathname } = window.location;
    const newUrl = new URL(pathname, window.location.origin);
    console.log(newUrl.toString());
    router.replace(newUrl.toString());
  };

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
          {t('navbar.deviceInfo')}:{' '}
          <span className='text-primary-text'>
            {device?.name || 'Loading...'}
          </span>
        </span>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [device?.name, t]
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
            <ArrowLeft className='mr-2 h-4 w-4 dark:brightness-0 dark:invert' />
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
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className='will-change-auto'
      >
        <TabsList className='bg-card flex h-auto max-w-[85vw] items-center justify-start overflow-x-auto py-2 shadow-[0px_4px_4px_0px_rgba(0,71,117,0.4)] will-change-auto md:grid md:h-14 md:max-w-none md:auto-cols-max md:grid-flow-col md:overflow-visible'>
          <div className='w-14 shrink-0'>
            <div className='flex items-center justify-center'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowLeft className='h-4 w-4 dark:brightness-0 dark:invert' />
              </Button>
            </div>
          </div>
          <TabsTrigger value='overview' className={tabClassName}>
            {t('products.detail.tabs.overview' as any)}
          </TabsTrigger>
          <TabsTrigger value='activity' className={tabClassName}>
            {t('products.detail.tabs.activity' as any)}
          </TabsTrigger>
          {/* <TabsTrigger value='analytics' className={tabClassName}>
            {t('products.detail.tabs.analytics' as any)}
          </TabsTrigger> */}
          <TabsTrigger value='schedule' className={tabClassName}>
            {t('products.detail.tabs.schedule' as any)}
          </TabsTrigger>
          <TabsTrigger value='maintenance' className={tabClassName}>
            {t('products.detail.tabs.maintenance' as any)}
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
          <div className='flex min-h-[600px] !w-full min-w-0 flex-col'>
            <CalendarContent deviceId={deviceId} filters={calendarFilters} />
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value='maintenance' className='mt-6 flex flex-col'>
          <MaintenanceTab deviceId={deviceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
