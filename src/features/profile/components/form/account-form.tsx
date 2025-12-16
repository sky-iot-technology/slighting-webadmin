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
import { Input } from '@/ui/components/ui/input';
import { User } from '@/core/domains/users';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { updateProfileSchema, useUpdateProfile } from '@/core/domains/auth';

type RoleFormProps = {
  initialData: User;
};

export default function AccountForm({ initialData }: RoleFormProps) {
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: initialData?.first_name ?? '',
      last_name: initialData?.last_name ?? '',
      metadata: {
        about: initialData?.metadata?.about ?? '',
        address: initialData?.metadata?.address ?? '',
        phone: initialData?.metadata?.phone ?? '',
        unit: initialData?.metadata?.unit ?? '',
        department: initialData?.metadata?.department ?? ''
      }
    }
  });

  const updateProfile = useUpdateProfile();

  const onSubmit = (values: z.infer<typeof updateProfileSchema>) => {
    updateProfile.mutate(values as Partial<User>);
  };

  return (
    <Card className='mx-auto h-full w-full gap-1.5 border-0 bg-white px-5 py-0 pt-3 pb-4 shadow-none'>
      <CardHeader className='px-0'>
        <CardTitle className='text-primary text-left text-[20px] font-bold'>
          Tài khoản
        </CardTitle>
      </CardHeader>
      <CardContent className='flex h-full justify-center px-0'>
        <div className='w-full max-w-[820px]'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex h-full flex-col gap-3'
            >
              <div className='grid grid-cols-1 gap-x-3 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='first_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='!gap-0.5 text-xs font-bold'>
                        Họ
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='h-[35px] w-full rounded-[4px] text-xs placeholder:text-xs'
                          placeholder='Nhập họ'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='last_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='!gap-0.5 text-xs font-bold'>
                        Tên
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='h-[35px] w-full rounded-[4px] text-xs placeholder:text-xs'
                          placeholder='Nhập tên'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>Email</FormLabel>
                      <FormControl>
                        <Input
                          className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                          placeholder='Nhập email'
                          {...field}
                          value={initialData.email}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='no'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='!gap-0.5 text-xs font-bold'>
                        Chi nhánh
                      </FormLabel>
                      <FormControl>
                        {/* <TreeMultiSelect
                                                    value={field.value ?? []}
                                                    onChange={field.onChange}
                                                /> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='no'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='!gap-0.5 text-xs font-bold'>
                        Vai trò
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                          {...field}
                          value={initialData.role}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='metadata.phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                          placeholder='Nhập số điện thoại'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='metadata.unit'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Đơn vị
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                            <SelectValue placeholder='Chọn đơn vị' />
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
                  name='metadata.department'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Bộ phận
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                            <SelectValue placeholder='Chọn bộ phận' />
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
                  name='metadata.address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Địa chỉ
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                          placeholder='Nhập địa chỉ'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='metadata.about'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold'>
                        Ghi chú
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                          placeholder='Nhập ghi chú'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mt-auto flex items-center justify-end'>
                <Button
                  type='submit'
                  className='h-[40px] w-[130px] rounded-[8px] text-lg'
                >
                  Cập nhật
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
