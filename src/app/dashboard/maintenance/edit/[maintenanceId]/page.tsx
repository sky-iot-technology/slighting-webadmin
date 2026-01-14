import WorkOrderViewPage from '@/features/maintenance/components/work-view-page';
import FormCardSkeleton from '@/ui/components/form-card-skeleton';
import PageContainer from '@/ui/components/layout/page-container';
import { Suspense } from 'react';
export const metadata = {
  title: 'Dashboard : Work Order Edit'
};
type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <WorkOrderViewPage isView={false} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
