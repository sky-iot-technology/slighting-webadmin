'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { Badge } from '@/ui/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import type { Calendar } from '@/core/domains/calendars/types';
import { Button } from '@/ui/components/ui/button';
import { CalendarRangePicker } from './calendar-range-picker';
import { TimeBrightnessForm } from './calendar-time-brightness';

type CalendarViewDialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  calendar: Calendar | null;
};

export function CalendarViewDialog({
  open,
  onOpenChange,
  calendar
}: CalendarViewDialogProps) {
  if (!calendar) return null;

  const formatDate = (date: string) =>
    format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[417px] rounded-xl p-5.5' hideCloseButton>
        <DialogHeader>
          <DialogTitle className='text-left text-[16px] font-bold'>
            Chi tiết lịch:
            <span className='text-primary ml-2 font-bold'>{calendar.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className='mt-2 space-y-3.5 text-xs font-bold text-black'>
          <div className='flex gap-2'>
            <span className=''>Trạng thái lịch:</span>
            <span className='text-right font-medium'>Đang chạy</span>
          </div>

          <div className='flex gap-2'>
            <span className=''>Chi nhánh cha:</span>
            <span className='text-right font-medium'>HCM</span>
          </div>

          <div className='flex gap-2'>
            <span className=''>Theo nhánh thiết bị:</span>
            <span className='text-right font-medium'>
              line 1, line 2, line 3
            </span>
          </div>

          <div className='flex gap-2'>
            <span className=''>Lặp lại:</span>
            <span className='text-right font-medium'>{calendar.status}</span>
          </div>

          <div className='flex gap-2'>
            <span className=''>Loại lịch:</span>
            <span className='text-right font-medium'>{calendar.type}</span>
          </div>

          <div className='flex items-center gap-2'>
            <span className=''>Ngày áp dụng:</span>
            <CalendarRangePicker
              mode='range'
              value={{
                from: new Date(calendar.startDate),
                to: new Date(calendar.endDate)
              }}
              disabled
            />
          </div>

          <div className='flex flex-col gap-2.5'>
            <span className=''>Thời gian & Độ sáng:</span>
            <TimeBrightnessForm disabled />
          </div>

          <div className='flex flex-col gap-2 pt-1'>
            <span className=''>Thiết bị điều khiển (3) </span>
            <div className='flex flex-col gap-1'>
              {[
                'Thiết bị 963',
                'Thiết bị 963',
                'Thiết bị 963dsddd thiết bị tên rất dài để test'
              ].map((name, i) => (
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
