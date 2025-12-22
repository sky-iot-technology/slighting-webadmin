import { useGetAlarmById } from '@/core/domains/alarms';
import { useGetDeviceById } from '@/core/domains/devices';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { useGetHistoryById } from '@/core/domains/workorders';
import { findNodeById } from '@/features/calendar/helper';
import { Button } from '@/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { Progress } from '@/ui/components/ui/progress';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { useMemo } from 'react';
import { formatDateTimeString } from '../../helper';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { useGetUsers } from '@/core/domains/users';

type WorkorderHistoryProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function WorkorderHistory({
  id,
  open,
  onOpenChange
}: WorkorderHistoryProps) {
  const { treeData } = useRegionTreeStore();

  const { data: historyData, isLoading: historyLoading } = useGetHistoryById(
    id,
    { enabled: open }
  );

  const historyList = historyData?.histories ?? [];

  const alarmId =
    historyList.length > 0 && historyList[0]?.alarm_id
      ? historyList[0].alarm_id
      : undefined;

  const { data: alarmData, isLoading: alarmLoading } = useGetAlarmById(
    alarmId ?? '',
    { enabled: !!alarmId }
  );

  const { data: usersData, isLoading: usersLoading } = useGetUsers();

  const deviceBranchName = useMemo(() => {
    const parentGroupId = alarmData?.metadata?.parent_group_id;
    return parentGroupId
      ? (findNodeById(treeData, parentGroupId)?.name ?? '---')
      : '---';
  }, [treeData, alarmData]);

  const HistorySkeletonItem = () => {
    return (
      <div className='flex items-stretch gap-3'>
        {/* Timeline icon */}
        <div className='flex flex-col items-center'>
          <Skeleton className='h-6 w-6 rounded-full' />
          <div className='w-[2px] flex-1 bg-gray-200' />
        </div>

        {/* Content box */}
        <div className='flex-1 space-y-2 rounded-[8px] border p-2'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-24' />
            <div className='flex gap-2'>
              <Skeleton className='h-3 w-12' />
              <Skeleton className='h-3 w-10' />
            </div>
          </div>

          <Skeleton className='h-3 w-48' />
          <Skeleton className='h-3 w-32' />
        </div>
      </div>
    );
  };

  const HistorySkeletonList = () => (
    <div className='space-y-3 py-3'>
      <HistorySkeletonItem />
      <HistorySkeletonItem />
      <HistorySkeletonItem />
    </div>
  );

  const COLORS = [
    { bg: 'bg-red-500', icon: '!' },
    { bg: 'bg-yellow-500', icon: '?' },
    { bg: 'bg-green-500', icon: '✓' },
    { bg: 'bg-blue-500', icon: 'i' },
    { bg: 'bg-purple-500', icon: '★' },
    { bg: 'bg-orange-500', icon: '→' }
  ];

  const getRandomStyle = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>Lịch sử giao việc</DialogTitle>
      <DialogDescription className='hidden'>
        Lịch sử giao việc
      </DialogDescription>
      <DialogContent
        className='!w-[90vw] !max-w-[472px] gap-0 !border-none !bg-transparent p-0'
        hideCloseButton
      >
        {historyLoading && alarmLoading && usersLoading ? (
          <>
            {/* Header skeleton */}
            <div className='bg-primary space-y-2 rounded-t-[8px] px-5 py-3 text-white'>
              <Skeleton className='h-4 w-40 bg-white/40' />
              <Skeleton className='h-3 w-56 bg-white/40' />
              <Skeleton className='h-3 w-48 bg-white/40' />

              <Skeleton className='h-3 w-32 bg-white/40' />
              <Skeleton className='h-1.5 w-full bg-white/40' />
            </div>

            {/* Body skeleton */}
            <div className='rounded-b-[8px] bg-white px-4 py-3'>
              <HistorySkeletonList />
            </div>
          </>
        ) : (
          <>
            <div className='bg-primary rounded-t-[8px] px-5 py-3 text-white'>
              <h2 className='pb-3 text-[18px] font-bold'>Đèn không sáng</h2>
              <p className='text-sm'>
                Mã thiết bị: {alarmData?.metadata?.imei ?? '----'}
              </p>
              <p className='mb-3 text-sm'>Chi nhánh: {deviceBranchName}</p>

              <div className='flex justify-between text-sm'>
                <span>Tiến độ hoàn thành</span>
                <span>50%</span>
              </div>

              <Progress
                value={50}
                className='mt-1.5 h-[4px] w-full bg-white/30 [&_[data-slot=progress-indicator]]:bg-white'
              />
            </div>

            <div className='rounded-b-[8px] bg-white'>
              <CustomScrollbar className='max-h-[50dvh] max-w-[100vw] overflow-y-auto px-4 py-2'>
                <div className='space-y-3'>
                  {historyData?.histories.map((data, index) => {
                    const user = usersData?.users.find(
                      (user) => user.id === data.changed_by
                    );
                    const color = getRandomStyle();
                    return (
                      <div key={index} className='flex items-stretch gap-3'>
                        <div className='flex flex-col items-center'>
                          <div
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white ${color.bg}`}
                          >
                            <div className='flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-[10px] leading-none font-bold text-white'>
                              {color.icon}
                            </div>
                          </div>
                          <div className='w-[2px] flex-1 bg-gray-200' />
                        </div>

                        <div className='flex-1 rounded-[8px] border p-2'>
                          <div className='flex items-center justify-between'>
                            <p className='text-foreground text-[16px] font-semibold'>
                              {data.status}
                            </p>
                            <div className='flex items-baseline gap-2'>
                              <p className='text-muted-foreground text-xs'>
                                {formatDateTimeString(data.timestamp as string)}
                              </p>
                            </div>
                          </div>
                          <p className='text-muted-foreground text-sm'>
                            {data.note}
                          </p>
                          <p className='text-muted-foreground text-sm'>
                            Phụ trách:{' '}
                            <span className='text-black'>
                              {user
                                ? `${user.last_name} ${user.first_name}`
                                : `Hệ thống`}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CustomScrollbar>

              <div className='flex justify-end px-4 py-3'>
                <Button
                  variant='outline'
                  className='h-[29px] w-[68px] rounded-[4px]'
                  onClick={() => onOpenChange(!open)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
