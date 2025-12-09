import WorkOrderViewPage from '@/features/maintenance/components/work-view-page';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { Suspense } from 'react';

type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <div className='flex-1 space-y-2'>
      <Suspense
        fallback={
          <div className='space-y-6 p-6'>
            <Skeleton className='h-8 w-64' />
            <Skeleton className='h-96 w-full' />
          </div>
        }
      >
        <WorkOrderViewPage />
      </Suspense>
    </div>
  );
}
