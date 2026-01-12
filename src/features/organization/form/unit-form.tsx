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
import { unitSchema } from '@/core/domains/organizations/schemas';

import { useTranslation } from '@/core/domains/language/useTranslation';

type UnitFormProps = {
  pageTitle: string;
  onClose?: () => void;
};

export default function UnitForm({ onClose, pageTitle }: UnitFormProps) {
  const { t } = useTranslation();
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

  const form = useForm<z.infer<typeof unitSchema>>({
    resolver: zodResolver(unitSchema),
    // defaultValues
    defaultValues: {
      name: '',
      address: '',
      note: ''
    }
  });

  const onSubmit = (values: z.infer<typeof unitSchema>) => {
    console.log(values);
  };

  return (
    <CustomScrollbar className='max-h-[660px] overflow-y-auto px-5 pt-3 pb-5'>
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
                      {t('organization.unit.label.name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder={t('organization.unit.placeholder.name')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold'>
                      {t('organization.unit.label.address')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder={t('organization.unit.placeholder.address')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold'>
                      {t('organization.unit.label.note')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder={t('organization.unit.placeholder.note')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex h-[30px] items-center justify-end gap-4'>
                <Button
                  onClick={onClose}
                  variant={'outline'}
                  type='button'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  {t('organization.button.cancel')}
                </Button>
                <Button
                  type='submit'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  {t('organization.button.save')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
