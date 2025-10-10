'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/components/ui/form';
import { Input } from '@/ui/components/ui/input';
import { Button } from '@/ui/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/ui/components/ui/radio-group';
import { Label } from '@/ui/components/ui/label';
import { cn } from '@/lib/utils';
import { CalendarRangePicker } from './calendar-range-picker';
import { TimeBrightnessForm } from './calendar-time-brightness';
import { Calendar } from '@/core/domains/calendars';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { DateRange } from 'react-day-picker';

export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Role name must be at least 2 characters.'
  }),
  type: z.enum(['Theo lịch', 'Khẩn cấp']),
  repeat: z.enum(['Không', 'Hàng ngày', 'Hàng tuần', 'Hàng tháng']).optional(),
  schedules: z
    .array(
      z.object({
        time: z.string(),
        brightness: z.number().min(0).max(100)
      })
    )
    .optional(),
  region: z.string().optional(),
  device: z.string().optional(),
  date: z
    .union([
      z.date(),
      z.custom<DateRange>((val) => {
        if (!val) return true;
        if (typeof val !== 'object') return false;
        const { from, to } = val as DateRange;
        return (
          (from === undefined || from instanceof Date) &&
          (to === undefined || to instanceof Date)
        );
      })
    ])
    .optional()
});

type CalendarFormProps = {
  initialData: Calendar | null;
  pageTitle: string;
  onNext: (data: any) => void;
  onClose?: () => void;
};

export default function CalendarForm({
  initialData,
  pageTitle,
  onNext,
  onClose
}: CalendarFormProps) {
  const defaultValues = {
    name: initialData?.name || '',
    type: 'Theo lịch' as const,
    repeat: 'Không' as const,
    schedules: [{ time: '', brightness: 0 }],
    region: '',
    device: '',
    date: { from: undefined, to: undefined }
  } as z.infer<typeof formSchema>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const { watch } = form;
  const type = watch('type');
  const repeat = watch('repeat');

  const showRepeatAndDate = type === 'Theo lịch';
  const showRange = repeat !== 'Không';

  const onSubmit = (values: any) => onNext(values);

  return (
    <Card className='bg-background mx-auto w-full gap-1.5 border-0 py-0 shadow-none'>
      <CardHeader className='px-0'>
        <CardTitle className='text-primary text-left text-[16px] font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className='px-0'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='region'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel className='text-xs font-bold'>
                    Chọn chi nhánh cha
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                        <SelectValue placeholder='Chọn khu vực' />
                      </SelectTrigger>
                      <SelectContent className='[&_[data-slot=select-item]]:text-xs'>
                        <SelectItem value='hcm'>Hồ Chí Minh</SelectItem>
                        <SelectItem value='hn'>Hà Nội</SelectItem>
                        <SelectItem value='dn'>Đà Nẵng</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='device'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel className='text-xs font-bold'>
                    Chọn nhánh thiết bị
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                        <SelectValue placeholder='Chọn khu vực' />
                      </SelectTrigger>
                      <SelectContent className='[&_[data-slot=select-item]]:text-xs'>
                        <SelectItem value='hcm'>test1</SelectItem>
                        <SelectItem value='hn'>test2</SelectItem>
                        <SelectItem value='dn'>test2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel className='text-xs font-bold'>Tên lịch</FormLabel>
                  <FormControl>
                    <Input
                      className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                      placeholder='Nhập tên lịch'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              //   control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-bold'>Mô tả</FormLabel>
                  <FormControl>
                    <Input
                      className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                      placeholder='Nhập mô tả'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='mb-1 text-xs font-bold'>
                    Loại lịch
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue='schedule'
                      className={cn(
                        `[&_[data-state=checked]]:border-calendar-radio-green [&_[data-state=checked]]:bg-calendar-radio-green [&_[data-state=unchecked]]:border-calendar-radio-gray [&_[data-state=unchecked]]:bg-calendar-radio-gray flex gap-3.5 [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:fill-white [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:stroke-white [&_label]:text-xs`
                      )}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='Theo lịch' id='Theo lịch' />
                        <Label htmlFor='Theo lịch'>Theo lịch</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='Khẩn cấp' id='Khẩn cấp' />
                        <Label htmlFor='Khẩn cấp'>Khẩn cấp</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showRepeatAndDate && (
              <FormField
                control={form.control}
                name='repeat'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='mb-1 text-xs font-bold'>
                      Lặp lại
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue='none'
                        className={cn(
                          `[&_[data-state=checked]]:border-calendar-radio-green [&_[data-state=checked]]:bg-calendar-radio-green [&_[data-state=unchecked]]:border-calendar-radio-gray [&_[data-state=unchecked]]:bg-calendar-radio-gray flex gap-4 [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:fill-white [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:stroke-white [&_label]:text-xs`
                        )}
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='Không' id='Không' />
                          <Label htmlFor='Không'>Không</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='Hàng ngày' id='Hàng ngày' />
                          <Label htmlFor='Hàng ngày'>Hàng ngày</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='Hàng tuần' id='Hàng tuần' />
                          <Label htmlFor='Hàng tuần'>Hàng tuần</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='Hàng tháng' id='Hàng tháng' />
                          <Label htmlFor='Hàng tháng'>Hàng tháng</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showRepeatAndDate && (
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className='flex justify-between'>
                    <FormLabel className='text-xs font-bold'>
                      Ngày áp dụng:
                    </FormLabel>
                    <FormControl>
                      <CalendarRangePicker
                        mode={showRange ? 'range' : 'single'}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name='schedules'
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel className='mb-1 text-xs font-bold'>
                    Thời gian & Độ sáng
                  </FormLabel>
                  <FormControl>
                    <TimeBrightnessForm />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex h-[30px] items-center justify-end gap-1'>
              <Button
                onClick={onClose}
                variant={'outline'}
                type='button'
                className='h-full w-16 rounded-[4px] text-xs'
              >
                Hủy
              </Button>
              <Button
                type='submit'
                className='h-full w-[70px] rounded-[4px] text-xs'
              >
                Tiếp theo
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
