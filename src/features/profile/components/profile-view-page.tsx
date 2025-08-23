'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  profileUpdateSchema,
  type ProfileUpdateFormData
} from '@/core/domains/auth';
import { useUser, useUpdateProfile, useLogout } from '@/core/domains/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProfileViewPage() {
  const user = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const updateProfileMutation = useUpdateProfile();
  const logoutMutation = useLogout();
  const router = useRouter();

  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.first_name + ' ' + user.last_name,
        email: user.email || ''
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileUpdateFormData) => {
    if (user) {
      updateProfileMutation.mutate({
        userId: user.id,
        updates: {
          first_name: data.name.split(' ')[0],
          last_name: data.name.split(' ')[1],
          email: data.email
        }
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      form.reset({
        name: user.first_name + ' ' + user.last_name,
        email: user.email || ''
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>
            Không tìm thấy người dùng
          </h2>
          <p className='text-gray-600'>Vui lòng đăng nhập để xem hồ sơ.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>
              Hồ sơ người dùng
            </CardTitle>
            <CardDescription>
              Quản lý thông tin cá nhân và cài đặt tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {!isEditing ? (
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Tên đăng nhập
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {user.credentials.username}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Họ và tên
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {user.first_name} {user.last_name}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {user.email || 'Chưa cập nhật'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Vai trò
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>Role {user.role}</p>
                </div>
                <div className='flex space-x-4'>
                  <Button onClick={() => setIsEditing(true)}>
                    Chỉnh sửa hồ sơ
                  </Button>
                  <Button variant='destructive' onClick={handleLogout}>
                    Đăng xuất
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm font-medium text-gray-700'>
                          Họ và tên
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Nhập họ và tên'
                            className='w-full'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm font-medium text-gray-700'>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Nhập email'
                            className='w-full'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='flex space-x-4'>
                    <Button
                      type='submit'
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending
                        ? 'Đang cập nhật...'
                        : 'Lưu thay đổi'}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleCancel}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
