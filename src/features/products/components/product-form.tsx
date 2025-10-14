'use client';

import { FileUploader } from '@/ui/components/file-uploader';
import { Button } from '@/ui/components/ui/button';
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
import { Input } from '@/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { Textarea } from '@/ui/components/ui/textarea';
import { Product } from '@/core/shared/constants/mock-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DateInput } from '@/ui/components/ui/date-input';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    )
    .optional(),
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.'
  }),
  category: z.string().optional(),
  price: z.number().optional(),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  })
});

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || '',
    category: initialData?.category || '',
    price: initialData?.price || 0,
    description: initialData?.description || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Form submission logic would be implemented here
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-primary text-left text-xl'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                <div>
                  <FormField
                    control={form.control}
                    name='image'
                    render={({ field }) => (
                      <div className='space-y-6'>
                        <FormItem className='w-full'>
                          <FormControl>
                            <FileUploader
                              value={field.value}
                              onValueChange={field.onChange}
                              maxFiles={4}
                              maxSize={4 * 1024 * 1024}
                              // disabled={loading}
                              // progresses={progresses}
                              // pass the onUpload function here for direct upload
                              // onUpload={uploadFiles}
                              // disabled={isUploading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                </div>
                <div className='col-span-3 grid grid-cols-1 md:col-start-2 md:grid-cols-3 md:gap-4'>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã thiết bị</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Mã thiết bị'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='price'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên thiết bị</FormLabel>
                          <FormControl>
                            <Input
                              className='h-9 rounded-sm'
                              placeholder='Tên thiết bị'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại thiết bị</FormLabel>

                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value![field.value!.length - 1]}
                          >
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Loại thiết bị' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='beauty'>
                                Beauty Products
                              </SelectItem>
                              <SelectItem value='electronics'>
                                Electronics
                              </SelectItem>
                              <SelectItem value='clothing'>Clothing</SelectItem>
                              <SelectItem value='home'>
                                Home & Garden
                              </SelectItem>
                              <SelectItem value='sports'>
                                Sports & Outdoors
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nhóm yêu thích</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value![field.value!.length - 1]}
                          >
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Chọn nhóm thiết bị' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='beauty'>
                                Beauty Products
                              </SelectItem>
                              <SelectItem value='electronics'>
                                Electronics
                              </SelectItem>
                              <SelectItem value='clothing'>Clothing</SelectItem>
                              <SelectItem value='home'>
                                Home & Garden
                              </SelectItem>
                              <SelectItem value='sports'>
                                Sports & Outdoors
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid w-full grid-cols-1 gap-3 md:col-span-2 md:col-start-2 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kinh độ & Vĩ độ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Kinh độ'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <div className='md:h-3.5'></div>
                          <FormControl>
                            <Input
                              placeholder='Vĩ độ'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <div className='md:h-3.5'></div>
                      <Button variant={'default'} className='bg-cyan-1'>
                        Vị trí bản đồ
                      </Button>
                      <div className='md:h-4'></div>
                    </FormItem>
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chi nhánh</FormLabel>

                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value![field.value!.length - 1]}
                          >
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Chi nhánh' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='beauty'>
                                Beauty Products
                              </SelectItem>
                              <SelectItem value='electronics'>
                                Electronics
                              </SelectItem>
                              <SelectItem value='clothing'>Clothing</SelectItem>
                              <SelectItem value='home'>
                                Home & Garden
                              </SelectItem>
                              <SelectItem value='sports'>
                                Sports & Outdoors
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Địa chỉ'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Ghi chú'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full md:col-span-3'>
                    <CardTitle className='text-md text-left text-black'>
                      {'Thông tin sản phẩm'}
                    </CardTitle>
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serial</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Nhập số serial thiết bị'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='date'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày lắp đặt</FormLabel>
                          <FormControl>
                            <DateInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder='Chọn ngày lắp đặt'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='date'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày áp dụng bảo hành</FormLabel>
                          <FormControl>
                            <DateInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder='Chọn ngày bảo hành'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nhà sản xuất</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Nhà sản xuất'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='date'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày hết hạn bảo hành</FormLabel>
                          <FormControl>
                            <DateInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder='Chọn ngày hết hạn bảo hành'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className='flex flex-row justify-end gap-3'>
                <Button variant={'outline'}>Huỷ</Button>
                <Button type='submit'>Lưu</Button>
              </div>
            </form>
          </Form>
        </FormSchemaProvider>
      </CardContent>
    </Card>
  );
}
