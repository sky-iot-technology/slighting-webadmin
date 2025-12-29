'use client';
import { Button } from '@/ui/components/ui/button';
import { z } from 'zod';
import {
  dayofweek,
  PRIORITY_LABELS,
  PRIORITY_LABELS_NUMS,
  RECURRING_LABELS
} from '@/core/domains/calendars/constant';
import { DateRange } from 'react-day-picker';
import { calendarFormSchema } from '@/core/domains/calendars';
import { CalendarRangePicker } from '../calendar-range-picker';
import { TRAIT_UI_MAP } from '@/ui/business/trait/trait';
import { TRAIT_LABELS } from '@/core/domains/catalogues';

type Props = {
  data: z.infer<typeof calendarFormSchema>;
  onBack: () => void;
  onConfirm: () => void;
};

export default function CalendarConfirm({ data, onBack, onConfirm }: Props) {
  return (
    <div className='space-y-3.5 p-5.5 text-xs font-bold text-black'>
      <h3 className='text-primary text-left text-base font-bold'>
        Xác nhận lịch
      </h3>

      <div className='flex gap-2'>
        <span className=''>Tên lịch:</span>
        <span className='text-right font-medium'>{data.name}</span>
      </div>

      <div className='flex gap-2'>
        <span className=''>Loại lịch:</span>
        <span className='text-right font-medium'>
          {PRIORITY_LABELS_NUMS[data.priority]}
        </span>
      </div>

      <div className='flex gap-2'>
        <span className=''>Lặp lại:</span>
        <span className='text-right font-medium'>
          {RECURRING_LABELS[data.recurring]}
        </span>
      </div>

      <div className='flex items-center gap-5.5'>
        <span className=''>Ngày áp dụng:</span>
        <CalendarRangePicker
          mode={data.date.from && data.date.to ? 'range' : 'single'}
          value={
            data.date.from
              ? (data.date as DateRange)
              : { from: new Date(), to: undefined }
          }
          disabled
        />
      </div>

      {data.monthly && data.monthly.length > 0 && (
        <div className='flex items-center gap-5.5'>
          <span className=''>Ngày áp dụng:</span>
          <CalendarRangePicker
            mode={data.date.from && data.date.to ? 'range' : 'single'}
            value={
              data.date.from
                ? (data.date as DateRange)
                : { from: new Date(), to: undefined }
            }
            disabled
          />
        </div>
      )}

      {data.weekly && data.weekly.length > 0 && (
        <div className=''>
          <span>Ngày trong tuần:</span>
          <div className='flex flex-wrap gap-1 pt-1'>
            {data.weekly.map((value) => {
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

      {data.monthly && data.monthly.length > 0 && (
        <div className=''>
          <span>Ngày trong tháng:</span>
          <div className='flex flex-wrap gap-1 pt-1'>
            {data.monthly.map((value) => {
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

      <div className='flex flex-col gap-2'>
        <span className=''>Thời gian và hành động:</span>
        {data.schedules?.map((item, index) => (
          <div key={index} className='flex gap-8 font-medium'>
            <span>{index + 1}</span>
            <span>{item.time}</span>
            {renderAction(item)}
          </div>
        ))}
      </div>

      <div className='flex justify-between gap-2 pt-3'>
        <Button variant='outline' onClick={onBack}>
          Quay lại
        </Button>
        <Button onClick={onConfirm} className='bg-primary text-white'>
          Xác nhận
        </Button>
      </div>
    </div>
  );
}

function renderAction(item: Props['data']['schedules'][number]) {
  const action = item.action;
  if (!action) return <span className='text-muted-foreground'>Chưa chọn</span>;

  const { trait, value } = action;

  if (trait === 'lms.devices.traits.Brightness') {
    const v = typeof value === 'number' ? value : Number(value ?? 0);
    return (
      <span>
        {TRAIT_LABELS[trait] ?? trait}: {v}%
      </span>
    );
  }

  if (trait === 'lms.devices.traits.OnOff') {
    const v = Boolean(value);
    return (
      <span>
        {TRAIT_LABELS[trait] ?? trait}: {v ? 'Bật' : 'Tắt'}
      </span>
    );
  }

  // fallback cho trait mới
  return (
    <span>
      {TRAIT_LABELS[trait] ?? trait}: {String(value)}
    </span>
  );
}
