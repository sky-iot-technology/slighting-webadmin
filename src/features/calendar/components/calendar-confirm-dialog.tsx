'use client';
import { Calendar } from '@/core/domains/calendars';
import { Button } from '@/ui/components/ui/button';
import { CalendarRangePicker } from './calendar-range-picker';
import { formSchema } from './calendar-form';
import { z } from 'zod';

type Props = {
  data: z.infer<typeof formSchema>;
  onBack: () => void;
  onConfirm: () => void;
};

export default function CalendarConfirm({ data, onBack, onConfirm }: Props) {
  console.log(data);
  return (
    <div className='mt-2 space-y-3.5 text-xs font-bold text-black'>
      <h3 className='text-primary text-left text-base font-bold'>
        Xác nhận lịch
      </h3>

      <div className='flex gap-2'>
        <span className=''>Tên lịch:</span>
        <span className='text-right font-medium'>{data.name}</span>
      </div>

      <div className='flex gap-2'>
        <span className=''>Loại lịch:</span>
        <span className='text-right font-medium'>{data.type}</span>
      </div>

      <div className='flex gap-2'>
        <span className=''>Lặp lại:</span>
        <span className='text-right font-medium'>{data.repeat}</span>
      </div>

      <div className='flex items-center gap-5.5'>
        <span className=''>Ngày áp dụng:</span>
        <CalendarRangePicker mode='range' value={data.date} disabled />
      </div>

      <div className='flex flex-col gap-2'>
        <span className=''>Thời gian và độ sáng:</span>
        {data.schedules?.map((item, index) => (
          <div key={index} className='test-sm flex gap-8 font-medium'>
            <span>{index + 1}</span>
            <span>{item.time}</span>
            <span>{item.brightness}%</span>
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
