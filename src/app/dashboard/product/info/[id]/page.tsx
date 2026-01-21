import PageContainer from '@/ui/components/layout/page-container';
import { Suspense } from 'react';
import DeviceDetailsPage from '@/features/products/product-info/device-details-page';
import { Skeleton } from '@/ui/components/ui/skeleton';

export const metadata = {
  title: 'Dashboard: Device Details'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='w-full flex-1 space-y-2'>
        <Suspense
          fallback={
            <div className='space-y-6 p-6'>
              <Skeleton className='h-8 w-64' />
              <Skeleton className='h-96 w-full' />
            </div>
          }
        >
          <DeviceDetailsPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
