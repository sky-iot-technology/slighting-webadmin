'use client';

import { useGetWorkOrderById } from '@/core/domains/workorders';
import WorkorderForm from './form/workorder-form';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { Button } from '@/ui/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import WorkOrderView from './WorkOrderView';
import { useTranslation } from '@/core/domains/language/useTranslation';

type WorkOrderViewPageProps = {
  isView?: boolean;
};

export default function WorkOrderViewPage({
  isView = true
}: WorkOrderViewPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.maintenanceId as string;
  const { data, isLoading, error } = useGetWorkOrderById(id);

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>
          {t('products.detail.maintenance.title.detail')}:{' '}
          <span className='text-primary'>
            {data?.work_order_name || 'Loading...'}
          </span>
        </span>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.work_order_name]
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

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center p-6'>
        <div className='text-center'>
          <h3 className='text-destructive text-lg font-semibold'>
            Error loading work order
          </h3>
          <p className='text-muted-foreground text-sm'>
            {error?.message || 'Device not found'}
          </p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => router.push('/dashboard/maintenance')}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <WorkOrderView
      data={data}
      isLoading={isLoading}
      isView={isView}
      pageTitle={t('products.detail.maintenance.title.detail')}
    />
  );
}
