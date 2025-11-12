import WorkorderForm from './form/workorder-form';

type TProductViewPageProps = {
  workOrderId: string;
};

export default async function WorkOrderViewPage({
  workOrderId
}: TProductViewPageProps) {
  //   let workOrder = null;
  let pageTitle = 'Chi tiết';
  return (
    <div className='h-full w-full p-3'>
      <div className={`flex h-fit w-full flex-1 flex-col bg-white pt-1`}>
        <WorkorderForm pageTitle={pageTitle} />
      </div>
    </div>
  );
}
