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
import { useTranslation } from '@/core/domains/language/useTranslation';

export function SignInForm() {
  const { t } = useTranslation();
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
      <Heading title={t('auth.title' as any)} description='' />
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='mt-3.5 mb-3.5'>
              <FormLabel className='text-sm font-medium'>
                {t('auth.label.username' as any)}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='text'
                  placeholder={t('auth.placeholder.username' as any)}
                  className='h-10 rounded-md'
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
            <FormItem className='mt-3.5 mb-3.5'>
              <FormLabel className='text-sm font-medium'>
                {t('auth.label.password' as any)}
              </FormLabel>
              <div className='relative'>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.placeholder.password' as any)}
                    className='h-10 rounded-md'
                  />
                </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='rememberMe'
          render={({ field }) => (
            <FormItem className='mt-3.5 mb-3.5 flex flex-row items-start space-y-0 space-x-0'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel className='text-sm font-medium'>
                  {t('auth.label.remember_me' as any)}
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
          {loginMutation.isPending
            ? t('auth.button.logging_in' as any)
            : t('auth.button.login' as any)}
        </Button>
      </form>
    </Form>
  );
}
