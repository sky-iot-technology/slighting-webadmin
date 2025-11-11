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
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { SubCatalogueDevice } from '@/core/domains/catalogues';
import { MultiSelect } from '@/ui/components/ui/multi-select';
import { calendarFormSchema } from '@/core/domains/calendars';
import { useEffect } from 'react';
import { dayofweek } from '@/core/domains/calendars/constant';
import { mapCalendarToFormData } from '../helper';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { TreeMultiSelect } from './tree/calendar-multi-tree';

type CalendarFormProps = {
  initialData: Partial<Calendar> | null;
  pageTitle: string;
  onNext: (data: any) => void;
  onClose?: () => void;
  formData?: z.infer<typeof calendarFormSchema> | null;
  isEditMode?: boolean;
};

export default function CalendarForm({
  initialData,
  formData,
  pageTitle,
  onNext,
  onClose,
  isEditMode
}: CalendarFormProps) {
  const { catalogues } = useCatalogueStore();

  const defaultValues =
    formData ??
    ((initialData
      ? mapCalendarToFormData(initialData)
      : {
          name: '',
          description: '',
          priority: 2,
          recurring: 'none',
          group_ids: [],
          date: { from: undefined, to: undefined },
          schedules: [{ time: '', actionType: null }]
        }) as z.infer<typeof calendarFormSchema>);

  const form = useForm<z.infer<typeof calendarFormSchema>>({
    resolver: zodResolver(calendarFormSchema),
    defaultValues
  });

  const { watch, setValue } = form;
  const type = watch('priority');
  const repeat = watch('recurring');

  const showRepeatAndDate = type === 2;
  const showRange = repeat !== 'none';

  useEffect(() => {
    if (type === 1) {
      setValue('recurring', 'none');
      setValue('weekly', []);
      setValue('monthly', []);
    }
  }, [type, setValue]);

  useEffect(() => {
    if (repeat === 'weekly') {
      setValue('monthly', []);
    } else if (repeat === 'monthly') {
      setValue('weekly', []);
    } else if (repeat === 'none' || repeat === 'daily') {
      setValue('weekly', []);
      setValue('monthly', []);
    }
  }, [repeat, setValue]);

  const onSubmit = (values: z.infer<typeof calendarFormSchema>) => {
    onNext(values);
  };

  const selectedDevice = catalogues.find(
    (d) => d.type === form.watch('device_type')
  );
  const branches = Object.entries(selectedDevice?.attributes ?? {})
    .filter(
      ([key, value]) =>
        key !== 'icon' && typeof value === 'object' && value !== null
    )
    .map(([_, value]) => value as SubCatalogueDevice);

  return (
    <CustomScrollbar className='h-full flex-1 overflow-y-auto p-5.5 sm:p-6'>
      <Card className='bg-background mx-auto w-full gap-1.5 border-0 py-0 shadow-none'>
        <CardHeader className='px-0'>
          <CardTitle className='text-primary text-left text-[16px] font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className='px-0'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=''>
              {(!initialData?.group_ids?.length || isEditMode) && (
                <FormField
                  control={form.control}
                  name='group_ids'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Chọn chi nhánh cha
                      </FormLabel>
                      <FormControl>
                        <TreeMultiSelect
                          value={field.value ?? []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='device_type'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel className='text-xs font-bold'>
                      Loại thiết bị
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                          <SelectValue placeholder='Chọn loại thiết bị' />
                        </SelectTrigger>
                        <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                          {catalogues.map((c, index) => (
                            <SelectItem key={index} value={c.type}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='ids'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel className='text-xs font-bold'>
                      Chọn nhánh thiết bị
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={
                          branches?.map((b) => ({
                            value: b.device_id,
                            label: b.name
                          })) ?? []
                        }
                        defaultValue={field.value ?? []}
                        onValueChange={(val) => field.onChange(val)}
                        placeholder='Chọn thiết bị'
                        resetOnDefaultValueChange={true}
                        className='!min-h-[31px] w-full !rounded-[4px] px-2 text-xs'
                        popoverClassName='w-[var(--radix-popover-trigger-width)]'
                        itemClassName='text-xs'
                        autoSize={true}
                        hideSelectAll
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel className='text-xs font-bold'>
                      Tên lịch
                    </FormLabel>
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
                control={form.control}
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
                name='priority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='mb-1 text-xs font-bold'>
                      Loại lịch
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={String(field.value)}
                        defaultValue='2'
                        className={cn(
                          `[&_[data-state=checked]]:border-calendar-radio-green [&_[data-state=checked]]:bg-calendar-radio-green [&_[data-state=unchecked]]:border-calendar-radio-gray [&_[data-state=unchecked]]:bg-calendar-radio-gray flex gap-3.5 [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:fill-white [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:stroke-white [&_label]:text-xs`
                        )}
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='2' id='2' />
                          <Label htmlFor='Theo lịch'>Theo lịch</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='1' id='1' />
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
                  name='recurring'
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
                            <RadioGroupItem value='none' id='none' />
                            <Label htmlFor='Không'>Không</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='daily' id='daily' />
                            <Label htmlFor='Hàng ngày'>Hàng ngày</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='weekly' id='weekly' />
                            <Label htmlFor='Hàng tuần'>Hàng tuần</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='monthly' id='monthly' />
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
                  render={({ field }) => {
                    return (
                      <FormItem className='flex flex-col'>
                        <div className='flex justify-between'>
                          <FormLabel className='text-xs font-bold'>
                            Ngày áp dụng:
                          </FormLabel>
                          <FormControl>
                            <CalendarRangePicker
                              mode={showRange ? 'range' : 'single'}
                              value={
                                field.value
                                  ? {
                                      from: field.value?.from,
                                      to: field.value?.to
                                    }
                                  : undefined
                              }
                              onChange={(v) => field.onChange(v)}
                              disablePastDate={true}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}

              {repeat === 'weekly' && (
                <FormField
                  control={form.control}
                  name='weekly'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Chọn ngày trong tuần
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={
                            dayofweek.map((d, index) => ({
                              value: String(index),
                              label: d
                            })) ?? []
                          }
                          defaultValue={field.value ?? []}
                          onValueChange={(val) => field.onChange(val)}
                          placeholder='Chọn ngày'
                          resetOnDefaultValueChange={true}
                          className='!min-h-[31px] w-full !rounded-[4px] px-2 text-xs'
                          popoverClassName='w-[var(--radix-popover-trigger-width)]'
                          itemClassName='text-xs'
                          autoSize={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {repeat === 'monthly' && (
                <FormField
                  control={form.control}
                  name='monthly'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Chọn ngày trong tháng
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={Array.from({ length: 31 }, (_, index) => ({
                            value: String(index + 1),
                            label: String(index + 1)
                          }))}
                          defaultValue={field.value ?? []}
                          onValueChange={(val) => field.onChange(val)}
                          placeholder='Chọn ngày'
                          resetOnDefaultValueChange={true}
                          className='!min-h-[31px] w-full !rounded-[4px] px-2 text-xs'
                          popoverClassName='w-[var(--radix-popover-trigger-width)] !overscroll-contain'
                          itemClassName='text-xs'
                          autoSize={false}
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
                  <FormItem>
                    <FormLabel className='text-xs font-bold'>
                      Thời gian & Hành động
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
    </CustomScrollbar>
  );
}
