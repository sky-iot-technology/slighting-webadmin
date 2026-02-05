'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';

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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changepassFormSchema,
  useChangePasswordByAdmin
} from '@/core/domains/users';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '@/core/domains/language/useTranslation';

type ChangepasssDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
};

export default function ChangepassDialog({
  open,
  onOpenChange,
  userId
}: ChangepasssDialogProps) {
  const { t } = useTranslation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof changepassFormSchema>>({
    resolver: zodResolver(changepassFormSchema),
    defaultValues: {
      newpassword: '',
      confirmPassword: ''
    }
  });

  const changePassMutation = useChangePasswordByAdmin({
    onSuccess: () => {
      if (open) onOpenChange(!open);
    }
  });

  const onSubmit = (values: z.infer<typeof changepassFormSchema>) => {
    changePassMutation.mutate({
      id: userId,
      secret: values.newpassword
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>
        {t('user.change_password_title' as any)}
      </DialogTitle>
      <DialogDescription className='hidden'>
        {t('user.change_password_title' as any)}
      </DialogDescription>
      <DialogContent className='!w-[90vw] !max-w-[417px] rounded-xl p-0'>
        {/* <CustomScrollbar className='max-h-[660px] overflow-y-auto px-5 pt-3 pb-5'> */}
        <Card className='bg-card mx-auto w-full gap-0 border-0 px-5 py-0 pt-3 pb-5 shadow-none'>
          <CardHeader className='gap-0 px-0'>
            <CardTitle className='text-primary-text text-left text-[20px] font-bold'>
              {t('user.change_password_title' as any)}
            </CardTitle>
          </CardHeader>
          <CardContent className='px-0'>
            <FormSchemaProvider schema={changepassFormSchema}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=''>
                  <FormField
                    control={form.control}
                    name='newpassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-bold'>
                          {t('user.new_password' as any)}
                        </FormLabel>

                        <div className='relative'>
                          <FormControl>
                            <Input
                              {...field}
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder={t('user.enter_new_password' as any)}
                              className='!h-[31px] !text-xs'
                              autoComplete='newpassword'
                            />
                          </FormControl>
                          <button
                            type='button'
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className='absolute inset-y-0 right-0 flex items-center pr-3'
                          >
                            {showNewPassword ? (
                              <EyeOff className='h-3 w-3 text-gray-400' />
                            ) : (
                              <Eye className='h-3 w-3 text-gray-400' />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-bold'>
                          {t('user.confirm_new_password' as any)}{' '}
                        </FormLabel>
                        <div className='relative'>
                          <FormControl>
                            <Input
                              {...field}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder={t(
                                'user.re_enter_new_password' as any
                              )}
                              className='!h-[31px] !text-xs'
                              autoComplete='confirmPassword'
                            />
                          </FormControl>
                          <button
                            type='button'
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className='absolute inset-y-0 right-0 flex items-center pr-3'
                          >
                            {showConfirmPassword ? (
                              <EyeOff className='h-3 w-3 text-gray-400' />
                            ) : (
                              <Eye className='h-3 w-3 text-gray-400' />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='flex h-[30px] items-center justify-end gap-4'>
                    <Button
                      onClick={() => onOpenChange(!open)}
                      variant={'outline'}
                      type='button'
                      className='h-full w-16 rounded-[4px] text-xs'
                    >
                      {t('user.cancel' as any)}
                    </Button>
                    <Button
                      type='submit'
                      className='h-full w-[105px] rounded-[4px] text-xs'
                    >
                      {t('user.update' as any)}
                    </Button>
                  </div>
                </form>
              </Form>
            </FormSchemaProvider>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
