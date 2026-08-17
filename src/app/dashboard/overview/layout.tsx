'use client';
import PageContainer from '@/ui/components/layout/page-container';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { StatCard } from '../../../features/overview/components/stat-card';
import { useGetOverView } from '@/core/domains/overview/hooks';
import { useCan } from '@/core/domains/permissions';
import { useMemo } from 'react';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';

export default function Overview2({
  simple_stats,
  alert_stats,
  circle_stats
}: {
  simple_stats: React.ReactNode;
  alert_stats: React.ReactNode;
  circle_stats: React.ReactNode;
}) {
  const { t } = useTranslation();
  const canViewDashboard = useCan('dashboard', 'view');

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>{t('navbar.dashboard')}</span>
      </div>
    ),
    [t]
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const { data, isLoading } = useGetOverView({
    enabled: canViewDashboard
  });

  const getValue = (val: number | undefined) => {
    if (isLoading) return '...';
    if (val !== undefined && val !== null) return val.toLocaleString();
    return '-';
  };

  const mappedStats = [
    {
      icon: '/assets/icons/total-device.svg',
      label: t('dashboard.allDevice'),
      value: getValue(data?.device_summary?.total_devices),
      trend: 5.2,
      trendType: 'up' as const,
      shadow: '!shadow-primary dark:!shadow-none',
      bgColor: 'bg-card-primary dark:!bg-card-primary'
    },
    {
      icon: '/assets/icons/online.svg',
      label: t('dashboard.onlineDevice'),
      value: getValue(data?.device_summary?.online_devices),
      trend: 5.2,
      trendType: 'up' as const,
      shadow: '!shadow-success dark:!shadow-none',
      bgColor: 'bg-card-success dark:!bg-card-primary'
    },
    {
      icon: '/assets/icons/offline.svg',
      label: t('dashboard.offlineDevice'),
      value: getValue(data?.device_summary?.offline_devices),
      trend: 1.8,
      trendType: 'down' as const,
      shadow: '!shadow-default dark:!shadow-none',
      bgColor: 'dark:!bg-card-primary'
    },
    {
      icon: '/assets/icons/alert.svg',
      label: t('dashboard.failedDevice'),
      value: getValue(data?.device_summary?.error_devices),
      trend: 5.2,
      trendType: 'down' as const,
      shadow: '!shadow-danger dark:!shadow-none',
      bgColor: 'bg-card-danger dark:!bg-card-primary'
    }
  ];
  return (
    <PageContainer>
      <div className='bg-card flex flex-1 flex-col space-y-2'>
        {isLoading && (
          <div className='text-muted-foreground animate-pulse pt-2 pl-7 text-sm'>
            {t('general.loading')}...
          </div>
        )}
        <div className='my-[9px] mr-[22px] flex items-center justify-end space-y-2'>
          <Select defaultValue='All'>
            <SelectTrigger className='h-[30px] rounded-sm px-2 text-sm leading-[15px] shadow-none'>
              <SelectValue placeholder='Select Device' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Today'>
                {t('dashboard.today' as any)}
              </SelectItem>
              <SelectItem value='This Week'>
                {t('dashboard.this_week' as any)}
              </SelectItem>
              <SelectItem value='This Month'>
                {t('dashboard.this_month' as any)}
              </SelectItem>
              <SelectItem value='This Year'>
                {t('dashboard.this_year' as any)}
              </SelectItem>
              <SelectItem value='All'>{t('dashboard.all' as any)}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='dark:*:data-[slot=card]:bg-card mr-[22px] ml-[28px] grid grid-cols-1 gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          {mappedStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div>{simple_stats}</div>

        <div className='mr-[22px] mb-[26px] ml-[28px] grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='col-span-1'>{circle_stats}</div>
          <div className='col-span-1'>{alert_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
