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
import { Calendar } from '@/core/domains/calendars';
import { MultiSelect } from '@/ui/components/ui/multi-select';
import { calendarFormSchema } from '@/core/domains/calendars';
import { useEffect, useState } from 'react';
import { dayofweek } from '@/core/domains/calendars/constant';
import { mapCalendarToFormData, utcToLocal } from '../helper';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { CalendarRangePicker } from '../components/calendar-range-picker';
import { TimeBrightnessForm } from '../components/calendar-time-brightness';
import { useGetDeviceById } from '@/core/domains/devices';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { TraitKey } from '@/core/domains/catalogues';
import { useTranslation } from '@/core/domains/language/useTranslation';

type CalendarFormProps = {
  initialData: Partial<Calendar> | null;
  pageTitle: string;
  onNext: (data: any) => void;
  onClose?: () => void;
  formData?: z.infer<typeof calendarFormSchema> | null;
};

export default function CalendarDeviceForm({
  initialData,
  formData,
  pageTitle,
  onNext,
  onClose
}: CalendarFormProps) {
  const { t } = useTranslation();
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
  const { catalogues } = useCatalogueStore();
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

  const clientId = initialData?.client_id ?? '';
  const { data } = useGetDeviceById(clientId, {
    enabled: !!clientId
  });

  useEffect(() => {
    if (data?.type) {
      setValue('device_type', data.type);
    }
  }, [data, setValue]);

  const selectedDevice = catalogues.find(
    (d) => d.type === form.watch('device_type')
  );

  return (
    <div className='overflow-hidden rounded-[10px]'>
      <CustomScrollbar className='max-h-[660px] overflow-y-auto p-5.5'>
        <Card className='bg-background mx-auto w-full gap-1.5 border-0 py-0 shadow-none'>
          <CardHeader className='px-0'>
            <CardTitle className='text-primary text-left text-[16px] font-bold'>
              {pageTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className='px-0'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=''>
                <FormField
                  control={form.control}
                  name='ids'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        {t('calendar.select_device_branch' as any)}
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={
                            data?.devices.map((b) => ({
                              value: b.device_id,
                              label: b.name
                            })) ?? []
                          }
                          defaultValue={field.value ?? []}
                          onValueChange={(val) => field.onChange(val)}
                          placeholder={t('calendar.select_device' as any)}
                          resetOnDefaultValueChange={true}
                          className='!min-h-[31px] w-full !rounded-[4px] px-2'
                          popoverClassName='w-[var(--radix-popover-trigger-width)]'
                          textSize='!text-xs'
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
                        {t('calendar.calendar_name' as any)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                          placeholder={t('calendar.enter_calendar_name' as any)}
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
                      <FormLabel className='text-xs font-bold'>
                        {t('calendar.description' as any)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                          placeholder={t('calendar.enter_description' as any)}
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
                        {t('calendar.calendar_type' as any)}
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
                            <Label htmlFor='Theo lịch'>
                              {t('calendar.priority.normal' as any)}
                            </Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='1' id='1' />
                            <Label htmlFor='Khẩn cấp'>
                              {t('calendar.priority.emergency' as any)}
                            </Label>
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
                          {t('calendar.repeat' as any)}
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
                              <Label htmlFor='Không'>
                                {t('calendar.repeat_options.none' as any)}
                              </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <RadioGroupItem value='daily' id='daily' />
                              <Label htmlFor='Hàng ngày'>
                                {t('calendar.repeat_options.daily' as any)}
                              </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <RadioGroupItem value='weekly' id='weekly' />
                              <Label htmlFor='Hàng tuần'>
                                {t('calendar.repeat_options.weekly' as any)}
                              </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <RadioGroupItem value='monthly' id='monthly' />
                              <Label htmlFor='Hàng tháng'>
                                {t('calendar.repeat_options.monthly' as any)}
                              </Label>
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
                              {t('calendar.apply_date' as any)}:
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
                          {t('calendar.select_day_of_week' as any)}
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
                          {t('calendar.select_day_of_month' as any)}
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
                        {t('calendar.time_and_action' as any)}
                      </FormLabel>
                      <FormControl>
                        <TimeBrightnessForm
                          deviceTraits={
                            (selectedDevice?.traits ?? []) as TraitKey[]
                          }
                        />
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
                    {t('calendar.cancel' as any)}
                  </Button>
                  <Button
                    type='submit'
                    className='h-full w-[70px] rounded-[4px] text-xs'
                  >
                    {t('calendar.next' as any)}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </CustomScrollbar>
    </div>
  );
}
