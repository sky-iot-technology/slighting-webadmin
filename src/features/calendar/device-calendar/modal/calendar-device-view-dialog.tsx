'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { Button } from '@/ui/components/ui/button';
import {
  dayofweek,
  PRIORITY_LABELS,
  RECURRING_LABELS
} from '@/core/domains/calendars/constant';
import { useGetCalendarById } from '@/core/domains/calendars';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { SubCatalogueDevice } from '@/core/domains/catalogues';
import { useMemo } from 'react';
import { RegionNode } from '@/core/domains/groups';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { CalendarRangePicker } from '../../components/calendar-range-picker';
import { TimeBrightnessForm } from '../../components/calendar-time-brightness';
import { useGetDeviceById } from '@/core/domains/devices';

type CalendarViewDialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  id: string;
};

export function CalendarDeviceViewDialog({
  open,
  onOpenChange,
  id
}: CalendarViewDialogProps) {
  const { treeData } = useRegionTreeStore();
  const { data, isLoading, error } = useGetCalendarById(id ?? '', {
    enabled: !!id
  });
  const { data: deviceData } = useGetDeviceById(data?.client_id ?? '', {
    enabled: !!data?.client_id
  });

  const displayText = useMemo(() => {
    const groupIds = data?.group_ids ?? [];
    if (groupIds.length === 0) return '—';

    const findNodeName = (nodes: RegionNode[], id: string): string | null => {
      for (const node of nodes) {
        if (node.id === id) return node.name;
        if (node.children) {
          const found = findNodeName(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const names = groupIds
      .map((id: string) => findNodeName(treeData, id))
      .filter(Boolean) as string[];

    return names.length > 0 ? names.join(', ') : '—';
  }, [data?.group_ids, treeData]);

  if (!id) return null;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;
  if (!data) return null;

  const allDeviceIds = data.schedules[0].ids;

  const monthly = data.schedules[0].recurring_period.day_of_month;
  const weekly = data.schedules[0].recurring_period.day_of_week;

  const nameLine = allDeviceIds.map((id) => {
    const device = deviceData?.devices.find((d) => d.device_id === id);
    return device ? device.name : null;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[417px] rounded-xl p-5.5' hideCloseButton>
        <DialogHeader>
          <DialogTitle className='text-left text-[16px] font-bold'>
            Chi tiết lịch:
            <span className='text-primary ml-2 font-bold'>{data.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className='mt-2 space-y-3.5 text-xs font-bold text-black'>
          <div className='flex gap-2'>
            <span className=''>Chi nhánh cha:</span>
            <span className='text-right font-medium'>{displayText}</span>
          </div>

          <div className='flex gap-2'>
            <span className=''>Theo nhánh thiết bị:</span>
            <span className='text-right font-medium'>
              {nameLine.filter(Boolean).join(', ')}
            </span>
          </div>

          <div className='flex gap-2'>
            <span className=''>Lặp lại:</span>
            <span className='text-right font-medium'>
              {RECURRING_LABELS[data.schedules[0].recurring]}
            </span>
          </div>

          <div className='flex gap-2'>
            <span className=''>Loại lịch:</span>
            <span className='text-right font-medium'>
              {PRIORITY_LABELS[data.priority]}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <span className=''>Ngày áp dụng:</span>
            <CalendarRangePicker
              mode='range'
              value={{
                from: new Date(
                  data.schedules[0].start_datetime.replace(/Z$/, '')
                ),
                to: new Date(data.schedules[0].end_datetime.replace(/Z$/, ''))
              }}
              disabled
            />
          </div>

          {weekly && weekly.length > 0 && (
            <div className=''>
              <span>Ngày trong tuần:</span>
              <div className='flex flex-wrap gap-1 pt-1'>
                {weekly.map((value: any) => {
                  const label = dayofweek[Number(value)];
                  return (
                    <span
                      key={value}
                      className='bg-muted rounded-[4px] px-2 py-1 text-xs'
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {monthly && monthly.length > 0 && (
            <div className=''>
              <span>Ngày trong tháng:</span>
              <div className='flex flex-wrap gap-1 pt-1'>
                {monthly.map((value: any) => {
                  return (
                    <span
                      key={value}
                      className='bg-muted rounded-[4px] px-2 py-1 text-xs'
                    >
                      {value}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className='flex flex-col gap-2.5'>
            <span className=''>Thời gian & Độ sáng:</span>
            <TimeBrightnessForm disabled schedules={data.schedules} />
          </div>

          <div className='flex flex-col gap-2 pt-1'>
            <span className=''>
              Thiết bị điều khiển ({allDeviceIds.length}){' '}
            </span>
            <div className='flex flex-col gap-1'>
              {allDeviceIds.map((name, i) => (
                <div
                  key={i}
                  className='grid h-6 w-full grid-cols-3 items-center rounded-[4px] border px-2 text-[10px] font-normal'
                >
                  <span className='truncate'>{name}</span>
                  <span className='text-center text-green-600'>Online</span>
                  <span className='cursor-pointer text-right text-blue-500 italic'>
                    Xem chi tiết
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='flex h-[30px] items-center justify-end gap-1'>
            <Button
              onClick={() => onOpenChange && onOpenChange(false)}
              variant={'outline'}
              type='button'
              className='h-full w-16 rounded-[4px] text-xs'
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
