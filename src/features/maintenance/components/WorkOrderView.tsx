'use client';

import { useGetWorkOrderById, WorkOrder } from '@/core/domains/workorders';
import WorkorderForm from './form/workorder-form';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { Button } from '@/ui/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';

type WorkOrderViewProps = {
  data?: WorkOrder;
  isLoading?: boolean;
  isView?: boolean;
  pageTitle: string;
  onBack?: () => void;
};

export default function WorkOrderView({
  data,
  isLoading,
  isView = true,
  pageTitle,
  onBack
}: WorkOrderViewProps) {
  if (isLoading) {
    return (
      <div className='space-y-6 p-6'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-96 w-full' />
      </div>
    );
  }

  if (!data) {
    return (
      <div className='text-muted-foreground flex h-64 items-center justify-center'>
        Không tìm thấy công việc
      </div>
    );
  }

  return (
    <div className='h-full w-full p-3'>
      <div className='flex w-full flex-col bg-white pt-1'>
        <WorkorderForm
          pageTitle={pageTitle}
          initialData={data}
          isView={isView}
          onBack={onBack ?? undefined}
        />
      </div>
    </div>
  );
}
