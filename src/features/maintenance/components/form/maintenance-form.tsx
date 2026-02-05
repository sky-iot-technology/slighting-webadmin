'use client';
import * as z from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
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
  FormMessage,
  FormSchemaProvider
} from '@/ui/components/ui/form';
import { Button } from '@/ui/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { Input } from '@/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { CalendarRangePicker } from '@/features/calendar/components/calendar-range-picker';
import { FileUpload } from '@/ui/components/input-file';
import Image from 'next/image';
import { useGetUsers, useSearchUsers } from '@/core/domains/users';
import {
  createWorkOrderDTO,
  useCreateWorkOrder,
  workOrderFormSchema,
  WorkOrderStatus
} from '@/core/domains/workorders';
import { normalizeStartEndDate } from '../../helper';
import { useTranslation } from '@/core/domains/language/useTranslation';

type MaintenanceFormProps = {
  alarmId: string;
  pageTitle: string;
  onClose?: () => void;
};

export default function MaintenanceForm({
  alarmId,
  onClose,
  pageTitle
}: MaintenanceFormProps) {
  const defaultValues = {
    work_order_name: '',
    remarks: '',
    department: '',
    assigned_by: '',
    assignee_id: '',

    start_date: '',
    end_date: '',
    admin_attachments: []
  };

  const form = useForm<z.infer<typeof workOrderFormSchema>>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues
  });

  const { t } = useTranslation();

  const { watch, setValue } = form;
  const unit = watch('department');

  const { data: usersData, isLoading: usersLoading } = useSearchUsers(
    { tag: unit },
    { enabled: !!unit }
  );

  const useCreateWork = useCreateWorkOrder({
    onSuccess: () => {
      onClose && onClose();
    }
  });

  const usersOptions = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.map((user) => ({
      value: String(user.id),
      label: `${user.first_name} ${user.last_name}`
    }));
  }, [usersData, usersLoading, unit]);

  const onSubmit = (values: z.infer<typeof workOrderFormSchema>) => {
    if (values.start_date && values.end_date) {
      const { startDate, endDate } = normalizeStartEndDate(
        values.start_date,
        values.end_date
      );

      values.start_date = startDate;
      values.end_date = endDate;
    }
    useCreateWork.mutate({ alarmId: alarmId, data: values });
  };

  return (
    <CustomScrollbar className='max-h-[660px] overflow-y-auto p-5.5'>
      <Card className='mx-auto w-full gap-0 border-0 py-0 shadow-none'>
        <CardHeader className='gap-0 px-0'>
          <CardTitle className='text-primary-text text-left text-[16px] font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className='px-0'>
          <FormSchemaProvider schema={workOrderFormSchema}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=''>
                <FormField
                  control={form.control}
                  name='work_order_name'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        {t('maintenance.work_order_name')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                          placeholder={t('maintenance.enter_work_order_name')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='remarks'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        {t('maintenance.description')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                          placeholder={t('maintenance.enter_description')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 gap-x-3 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='department'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.unit_handling')}
                        </FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                              <SelectValue
                                placeholder={t(
                                  'maintenance.select_unit_handling'
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                            <SelectItem value='team:support'>
                              {t('maintenance.team_support')}
                            </SelectItem>
                            <SelectItem value='team:technical'>
                              {t('maintenance.team_technical')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='assigned_by'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.supervisor')}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                              <SelectValue
                                placeholder={t('maintenance.select_supervisor')}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                            {usersOptions.length > 0
                              ? usersOptions.map((user) => (
                                  <SelectItem
                                    key={user.value}
                                    value={user.value}
                                  >
                                    {user.label}
                                  </SelectItem>
                                ))
                              : null}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='assignee_id'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.executor')}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                              <SelectValue
                                placeholder={t('maintenance.select_executor')}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                            {usersOptions.length > 0
                              ? usersOptions.map((user) => (
                                  <SelectItem
                                    key={user.value}
                                    value={user.value}
                                  >
                                    {user.label}
                                  </SelectItem>
                                ))
                              : null}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='start_date'
                    render={({ field }) => (
                      <FormItem className='order-4 md:order-none'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.expected_start_date')}
                        </FormLabel>
                        <FormControl>
                          <CalendarRangePicker
                            mode='single'
                            className='!w-full !rounded-[4px] text-xs'
                            textClassname='!text-left'
                            onChange={(v) =>
                              field.onChange(v?.from?.toISOString())
                            }
                            disablePastDate={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='end_date'
                    render={({ field }) => (
                      <FormItem className='order-5 md:order-none'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.expected_end_date')}
                        </FormLabel>
                        <FormControl>
                          <CalendarRangePicker
                            mode='single'
                            className='!w-full !rounded-[4px] text-xs'
                            textClassname='!text-left'
                            disablePastDate={true}
                            onChange={(v) =>
                              field.onChange(v?.from?.toISOString())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='order-10 md:order-none md:col-span-2'>
                    <FormField
                      control={form.control}
                      name='admin_attachments'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='!gap-1 text-xs font-bold'>
                            <div className='flex items-center gap-1'>
                              <Image
                                src={'/assets/icons/file.svg'}
                                alt='file'
                                width={20}
                                height={20}
                                className='dark:brightness-0 dark:invert'
                              />
                              {t('maintenance.attachments')}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <FileUpload
                              onChange={(files) => {
                                if (!files) {
                                  field.onChange([]);
                                  return;
                                }

                                field.onChange(Array.from(files));
                              }}
                              multiple
                              accept='.jpg,.png,.pdf,.doc,.docx'
                              maxFiles={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className='flex h-[30px] items-center justify-end gap-4'>
                  <Button
                    onClick={onClose}
                    variant={'outline'}
                    type='button'
                    className='h-full w-16 rounded-[4px] text-xs'
                  >
                    {t('maintenance.cancel')}
                  </Button>
                  <Button
                    type='submit'
                    className='h-full w-[136px] rounded-[4px] text-xs'
                  >
                    {t('maintenance.confirm')}
                  </Button>
                </div>
              </form>
            </Form>
          </FormSchemaProvider>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
