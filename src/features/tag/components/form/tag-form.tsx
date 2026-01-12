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
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { Input } from '@/ui/components/ui/input';
import { tagFormSchema } from '@/core/domains/tags/schemas';
import { CreateTagRequest, useCreateTag } from '@/core/domains/tags';
import { useTranslation } from '@/core/domains/language/useTranslation';

type TagFormProps = {
  pageTitle: string;
  onClose?: () => void;
};

export default function TagForm({ onClose, pageTitle }: TagFormProps) {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof tagFormSchema>>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const createTag = useCreateTag({
    onSuccess: () => {
      onClose?.();
    }
  });

  const onSubmit = (values: z.infer<typeof tagFormSchema>) => {
    const payload: CreateTagRequest = {
      name: values.name,
      description: values.description,
      alias: `device.tag.${values.name}`,
      resource_type: 'device'
    };
    createTag.mutate(payload);
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
                      {t('tag.group_name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder={t('tag.enter_group_name')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold'>
                      {t('tag.description')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder={t('tag.enter_description')}
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
                  {t('tag.cancel')}
                </Button>
                <Button
                  type='submit'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  {t('tag.add')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
