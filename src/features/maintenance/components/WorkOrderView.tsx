'use client';

import { WorkOrder } from '@/core/domains/workorders';
import WorkorderForm from './form/workorder-form';
import { Skeleton } from '@/ui/components/ui/skeleton';

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
      <div className='bg-card flex w-full flex-col pt-1'>
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
