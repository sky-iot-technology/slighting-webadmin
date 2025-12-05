'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Checkbox } from '@/ui/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/components/ui/form';
import { signupSchema, type SignupFormData } from '@/core/domains/auth';
import { useSignup } from '@/core/domains/auth';
import Link from 'next/link';

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const signupMutation = useSignup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate({
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
      agreeToTerms: data.agreeToTerms
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-medium text-gray-700'>
                Tên đăng nhập
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='text'
                  placeholder='Nhập tên đăng nhập'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
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
              <FormLabel className='text-sm font-medium text-gray-700'>
                Mật khẩu
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Nhập mật khẩu'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
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
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-medium text-gray-700'>
                Xác nhận mật khẩu
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Nhập lại mật khẩu'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute inset-y-0 right-0 flex items-center pr-3'
                  >
                    {showConfirmPassword ? (
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
          name='agreeToTerms'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel className='text-sm font-medium text-gray-700'>
                  Tôi đồng ý với{' '}
                  <Link
                    href='/terms'
                    className='text-blue-600 underline hover:text-blue-800'
                  >
                    điều khoản sử dụng
                  </Link>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={signupMutation.isPending}
          className='w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
        >
          {signupMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>

        <div className='text-center text-sm text-gray-600'>
          Đã có tài khoản?{' '}
          <Link
            href='/auth/sign-in'
            className='text-blue-600 underline hover:text-blue-800'
          >
            Đăng nhập ngay
          </Link>
        </div>
      </form>
    </Form>
  );
}
