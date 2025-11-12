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
import { ImageUpload } from '@/ui/components/image-upload';
import { useRouter } from 'next/navigation';

type MaintenanceFormProps = {
  pageTitle: string;
};

export default function WorkorderForm({ pageTitle }: MaintenanceFormProps) {
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
  const router = useRouter();
  const form = useForm<z.infer<typeof maintenanceWorkFormSchema>>({
    resolver: zodResolver(maintenanceWorkFormSchema)
    // defaultValues
  });

  const onSubmit = (values: z.infer<typeof maintenanceWorkFormSchema>) => {
    console.log(values);
  };

  return (
    <div className='mx-auto w-full gap-1.5 border-0 bg-transparent px-2 py-1 shadow-none'>
      <span className='text-[16px] font-bold'>{pageTitle}</span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-2'>
          <div className='flex items-start justify-between gap-8'>
            <Card className='flex-1 gap-1.5 px-[20px] py-2 shadow-none'>
              <CardHeader className='px-0'>
                <CardTitle className='mt-1 text-left text-[16px] font-bold'>
                  Thông tin thiết bị
                </CardTitle>
              </CardHeader>
              <CardContent className='px-0'>
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
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Đơn vị xử lý
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
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Người xử lý
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
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>Mô tả</FormLabel>
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
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
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
                          maxHeight={105}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className='flex-1 gap-1.5 px-[20px] py-2 shadow-none'>
              <CardHeader className='px-0'>
                <CardTitle className='mt-1 text-left text-[16px] font-bold'>
                  Cập nhật tiến độ
                </CardTitle>
              </CardHeader>
              <CardContent className='px-0'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Trạng thái thiết bị
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
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Ghi chú
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

                <div className='flex gap-1.5'>
                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem className='col-span-2'>
                          <FormLabel className='text-xs font-bold'>
                            Ngày bắt đầu
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
                  </div>
                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem className='col-span-2'>
                          <FormLabel className='text-xs font-bold'>
                            Ngày kết thúc
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
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Hình ảnh
                      </FormLabel>
                      <FormControl>
                        <ImageUpload maxHeight={164} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className='flex-1 gap-1.5 px-[20px] py-2 shadow-none'>
              <CardHeader className='px-0'>
                <CardTitle className='mt-1 text-left text-[16px] font-bold'>
                  Xác nhận tiến độ
                </CardTitle>
              </CardHeader>
              <CardContent className='px-0'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Trạng thái xử lý
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
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Ghi chú
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
              </CardContent>
            </Card>
          </div>

          <div className='mt-2 mr-2.5 mb-3.5 flex h-[30px] items-center justify-end gap-4'>
            <Button
              onClick={() => router.push(`/dashboard/maintenance`)}
              variant={'outline'}
              type='button'
              className='h-full w-16 rounded-[4px] text-xs'
            >
              Đóng
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
