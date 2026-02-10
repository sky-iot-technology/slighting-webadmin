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
  FormMessage,
  FormSchemaProvider
} from '@/ui/components/ui/form';
import { Button } from '@/ui/components/ui/button';
import { useMemo, useState } from 'react';
import { Input } from '@/ui/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import {
  changenewpassFormSchema,
  useChangePassword
} from '@/core/domains/users';
import { useTranslation } from '@/core/domains/language/useTranslation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';

type PasswordDialogProps = {
  pageTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ChangePassword({
  pageTitle,
  open,
  onOpenChange
}: PasswordDialogProps) {
  const { t } = useTranslation();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof changenewpassFormSchema>>({
    resolver: zodResolver(changenewpassFormSchema),
    defaultValues: {
      oldpassword: '',
      newpassword: '',
      confirmPassword: ''
    }
  });
  const changePassMutation = useChangePassword({
    onSuccess: () => {
      form.reset();
    }
  });
  const onSubmit = (values: z.infer<typeof changenewpassFormSchema>) => {
    changePassMutation.mutate({
      old_secret: values.oldpassword,
      new_secret: values.newpassword
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent
        className='bg-card w-[417px] rounded-xl p-0'
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Card className='bg-card mx-auto h-full w-full gap-1.5 border-0 px-5 py-0 pt-3 pb-5 shadow-none'>
          <CardHeader className='px-0'>
            <CardTitle className='text-primary-text text-left text-[16px] font-bold'>
              {t('profile.changePass')}
            </CardTitle>
          </CardHeader>
          <CardContent className='px-0'>
            <FormSchemaProvider schema={changenewpassFormSchema}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name='oldpassword'
                    render={({ field }) => (
                      <FormItem className=''>
                        <FormLabel className='text-xs font-bold'>
                          {t('profile.oldPassword')}
                        </FormLabel>

                        <div className='relative w-full'>
                          <FormControl>
                            <Input
                              {...field}
                              type={showOldPassword ? 'text' : 'password'}
                              placeholder={t('profile.oldPassword_placeholder')}
                              className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                              autoComplete='newpassword'
                            />
                          </FormControl>
                          <button
                            type='button'
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className='absolute inset-y-0 right-0 flex items-center pr-3'
                          >
                            {showOldPassword ? (
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
                    name='newpassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-bold'>
                          {t('profile.newPassword')}
                        </FormLabel>

                        <div className='relative w-full'>
                          <FormControl>
                            <Input
                              {...field}
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder={t('profile.newPassword_placeholder')}
                              className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
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
                          {t('profile.confirmNewPassword')}
                        </FormLabel>
                        <div className='relative w-full'>
                          <FormControl>
                            <Input
                              {...field}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder={t(
                                'profile.confirmNewPassword_placeholder'
                              )}
                              className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
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

                  <div className='mt-auto flex items-center justify-end'>
                    <Button
                      type='submit'
                      className='h-full w-[70px] rounded-[4px] text-xs'
                    >
                      {t('general.edit')}
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
