import { WorkOrder } from '@/core/domains/maintenances/types';
import { Button } from '@/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { Progress } from '@/ui/components/ui/progress';

type WorkorderHistoryProps = {
  data: WorkOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function WorkorderHistory({
  data,
  open,
  onOpenChange
}: WorkorderHistoryProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>Thêm Nhiều thiết bị</DialogTitle>
      <DialogDescription className='hidden'>
        Thêm Nhiều thiết bị
      </DialogDescription>
      <DialogContent
        className='!w-[90vw] !max-w-[472px] gap-0 !border-none !bg-transparent p-0'
        hideCloseButton
      >
        <div className='bg-primary rounded-t-[8px] px-5 py-3 text-white'>
          <h2 className='pb-3 text-[18px] font-bold'>Đèn không sáng</h2>
          <p className='text-sm'>Mã thiết bị: 5253367674657</p>
          <p className='mb-3 text-sm'>Chi nhánh: Hồ Chí Minh</p>

          <div className='flex justify-between text-sm'>
            <span>Tiến độ hoàn thành</span>
            <span>50%</span>
          </div>

          <Progress
            value={50}
            className='mt-1.5 h-[4px] w-full bg-white/30 [&_[data-slot=progress-indicator]]:bg-white'
          />
        </div>

        <div className='rounded-b-[8px] bg-white px-4 py-2'>
          <div className='space-y-3'>
            <div className='flex items-stretch gap-3'>
              <div className='flex flex-col items-center'>
                <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-white'>
                  <div className='flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-[10px] leading-none font-bold text-white'>
                    !
                  </div>
                </div>
                <div className='w-[2px] flex-1 bg-gray-200' />
              </div>

              <div className='flex-1 rounded-[8px] border p-2'>
                <div className='flex items-center justify-between'>
                  <p className='text-foreground text-[16px] font-semibold'>
                    Tiếp nhận
                  </p>
                  <div className='flex items-baseline gap-2'>
                    <p className='text-muted-foreground text-xs'>20/07/2025</p>
                    <p className='text-muted-foreground text-xs'>14:00</p>
                  </div>
                </div>
                <p className='text-muted-foreground text-sm'>Yêu cầu bảo trì</p>
                <p className='text-muted-foreground text-sm'>
                  Phụ trách: <span className='text-black'>Hệ thống</span>
                </p>
              </div>
            </div>

            <div className='mt-3 flex items-stretch gap-2'>
              <div className='flex flex-col items-center'>
                <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500 text-white'>
                  <div className='flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-[10px] leading-none font-bold text-white'>
                    ✓
                  </div>
                </div>
                <div className='w-[2px] flex-1 bg-gray-200' />
              </div>

              <div className='flex-1 rounded-[8px] border p-2'>
                <div className='flex items-center justify-between'>
                  <p className='text-foreground text-[16px] font-semibold'>
                    Xác nhận
                  </p>
                  <div className='flex items-baseline gap-2'>
                    <p className='text-muted-foreground text-xs'>20/07/2025</p>
                    <p className='text-muted-foreground text-xs'>14:00</p>
                  </div>
                </div>
                <p className='text-muted-foreground text-sm'>
                  Đã xác nhận và phê duyệt
                </p>
                <p className='text-muted-foreground text-sm'>
                  Phụ trách: <span className='text-black'>Nguyễn D</span>
                </p>
              </div>
            </div>
          </div>

          <div className='flex justify-end pt-3 pb-4'>
            <Button
              variant='outline'
              className='h-[29px] w-[68px] rounded-[4px]'
              onClick={() => onOpenChange(!open)}
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
