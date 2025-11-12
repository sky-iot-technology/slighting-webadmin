import WorkOrderViewPage from '@/features/maintenance/components/work-view-page';

type PageProps = { params: Promise<{ maintenanceId: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    // <PageContainer scrollable>
    //   <div className='flex-1 space-y-4'>
    //     <Suspense fallback={<FormCardSkeleton />}>
    //       <ProductViewPage productId={params.productId} />
    //     </Suspense>
    //   </div>
    // </PageContainer>
    <WorkOrderViewPage workOrderId={params.maintenanceId} />
  );
}
