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
import { Button } from '@/ui/components/ui/button';
import { useMemo, useState } from 'react';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { Input } from '@/ui/components/ui/input';
import { maintenanceWorkFormSchema } from '@/core/domains/maintenances/schemas';
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

type MaintenanceFormProps = {
  pageTitle: string;
  onClose?: () => void;
};

export default function MaintenanceForm({
  onClose,
  pageTitle
}: MaintenanceFormProps) {
  //   const defaultValues = useMemo(() => {
  //     return (
  //       formData ??
  //       ((initialData
  //         ? {
  //             name: initialData.name ?? '',
  //             description: initialData.description ?? '',
  //             parent_id: initialData.parent_id ?? '',
  //             metadata: {
  //               lat: initialData.metadata?.lat ?? undefined,
  //               long: initialData.metadata?.long ?? undefined
  //             }
  //           }
  //         : {
  //             name: '',
  //             description: '',
  //             parent_id: '',
  //             metadata: { lat: undefined, long: undefined }
  //           }) as z.infer<typeof branchFormSchema>)
  //     );
  //   }, [formData, initialData]);

  const form = useForm<z.infer<typeof maintenanceWorkFormSchema>>({
    resolver: zodResolver(maintenanceWorkFormSchema)
    // defaultValues
  });

  const onSubmit = (values: z.infer<typeof maintenanceWorkFormSchema>) => {
    console.log(values);
  };

  return (
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
                name='name'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel className='text-xs font-bold'>
                      Tên công việc
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder='Nhập tên công việc'
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

              <div className='grid grid-cols-1 gap-x-3 md:grid-cols-2'>
                {/* Hàng 1 */}
                <FormField
                  control={form.control}
                  name='handlingUnit'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Đơn vị xử lý
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                            <SelectValue placeholder='Chọn đơn vị xử lý' />
                          </SelectTrigger>
                          <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                            <SelectItem value='test'>test</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='supervisor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Người giám sát
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                            <SelectValue placeholder='Chọn người giám sát' />
                          </SelectTrigger>
                          <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                            <SelectItem value='test'>test</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='executors'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Người thực hiện
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                            <SelectValue placeholder='Chọn người thực hiện' />
                          </SelectTrigger>
                          <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                            <SelectItem value='test'>test</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='expectedStartDate'
                  render={() => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Ngày bắt đầu dự kiến
                      </FormLabel>
                      <FormControl>
                        <CalendarRangePicker
                          mode='single'
                          className='!w-full !rounded-[4px] text-xs'
                          textClassname='!text-left'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='expectedMethod'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Phương án xử lý dự kiến
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='!h-[31px] w-full !rounded-[4px] text-xs placeholder:text-xs'
                          placeholder='Nhập phương án'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='expectedEndDate'
                  render={() => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Ngày hoàn thành dự kiến
                      </FormLabel>
                      <FormControl>
                        <CalendarRangePicker
                          mode='single'
                          className='!w-full !rounded-[4px] text-xs'
                          textClassname='!text-left'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='md:col-span-2'>
                  <FormField
                    control={form.control}
                    name='attachments'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='!gap-1 text-xs font-bold'>
                          <Image
                            src={'/assets/icons/file.svg'}
                            alt='file'
                            width={20}
                            height={20}
                          />
                          Tập tin đính kèm
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                            // value={field.value}
                            onChange={field.onChange}
                            multiple
                            accept='.jpg,.png,.pdf,.doc,.docx'
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
                  Hủy
                </Button>
                <Button
                  type='submit'
                  className='h-full w-[136px] rounded-[4px] text-xs'
                >
                  Xác nhận
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
