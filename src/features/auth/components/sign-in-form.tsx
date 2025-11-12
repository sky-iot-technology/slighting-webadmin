'use client';

import { loginSchema, useLogin, type LoginFormData } from '@/core/domains/auth';
import { Button } from '@/ui/components/ui/button';
import { Checkbox } from '@/ui/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/components/ui/form';
import { Heading } from '@/ui/components/ui/heading';
import { Input } from '@/ui/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', rememberMe: false }
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password
    });
  };

  return (
    <Form {...form}>
      <Heading title='Đăng nhập' description='' />
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-medium'>
                Tên đăng nhập
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='text'
                  placeholder='Nhập tên đăng nhập'
                  className='h-13 rounded-full'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-medium'>Mật khẩu</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Nhập mật khẩu'
                    className='h-13 rounded-full'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 flex items-center pr-3'
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-400' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400' />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='rememberMe'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel className='text-sm font-medium'>
                  Ghi nhớ đăng nhập
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={loginMutation.isPending}
          className='w-full rounded-md px-4 py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
        >
          {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
    </Form>
  );
}
