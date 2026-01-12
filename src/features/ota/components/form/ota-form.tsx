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
import { Input } from '@/ui/components/ui/input';
import { Button } from '@/ui/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/ui/components/ui/radio-group';
import { Label } from '@/ui/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useEffect, useMemo } from 'react';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { OtaItem, useCreateOta, useUpdateOta } from '@/core/domains/ota';
import {
  OtaFormSchema,
  otaFormSchema,
  otaUpdateSchema
} from '@/core/domains/ota/schemas';
import { FileUpload } from '@/ui/components/input-file';
import { useTranslation } from '@/core/domains/language/useTranslation';

type OtaFormProps = {
  initialData: Partial<OtaItem> | null;
  pageTitle: string;
  onClose?: () => void;
};

export default function OtaForm({
  initialData,
  pageTitle,
  onClose
}: OtaFormProps) {
  const { t } = useTranslation();
  const { catalogues } = useCatalogueStore();

  const schema = initialData ? otaUpdateSchema : otaFormSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      category_type: initialData?.category_type || '',
      version: initialData?.version || '',
      description: initialData?.description || ''
    }
  });

  const existingFile = initialData?.file_name
    ? {
        name: initialData.file_name,
        size: initialData.file_size,
        url: initialData.url
      }
    : null;

  const { mutate: createOta, isPending } = useCreateOta({
    onSuccess: () => {
      onClose?.();
    }
  });

  const { mutate: updateOta, isPending: isUpdatePending } = useUpdateOta({
    onSuccess: () => {
      onClose?.();
    }
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (initialData) {
      updateOta({
        id: String(initialData.id),
        data: values as z.infer<typeof otaUpdateSchema>
      });
    } else {
      createOta(values as z.infer<typeof otaFormSchema>);
    }
  };

  const typeOptions = useMemo(() => {
    return catalogues.map((catalogue) => ({
      label: catalogue.name,
      value: catalogue.type
    }));
  }, [catalogues]);

  return (
    <CustomScrollbar className='h-full flex-1 overflow-y-auto p-5.5 sm:p-6'>
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
                      {t('ota.label.name' as any)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder={t('ota.placeholder.name' as any)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category_type'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel className='text-xs font-bold'>
                      {t('ota.label.category' as any)}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                          <SelectValue
                            placeholder={t('ota.placeholder.category' as any)}
                          />
                        </SelectTrigger>
                        <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                          {typeOptions.map((c, index) => (
                            <SelectItem key={index} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='version'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold'>
                      {t('ota.label.version' as any)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder={t('ota.placeholder.version' as any)}
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
                      {t('ota.label.description' as any)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder={t('ota.placeholder.description' as any)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='file'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold'>
                      {t('ota.label.file' as any)}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        multiple={false}
                        accept='.hex,.bin,.zip,.rar'
                        maxHeight={105}
                        maxFiles={1}
                        onChange={(files) => {
                          field.onChange(files?.[0]);
                        }}
                      />
                    </FormControl>
                    {existingFile && (
                      <div className='bg-muted mt-2 rounded-[4px] border px-3 py-2 text-xs'>
                        <div className='flex items-center justify-between gap-2'>
                          <div className='truncate'>
                            <span className='font-medium'>
                              {existingFile.name}
                            </span>
                            <span className='text-muted-foreground ml-2'>
                              {existingFile?.size
                                ? `(${(existingFile.size / 1024).toFixed(1)} KB)`
                                : ''}
                            </span>
                          </div>

                          <a
                            href={existingFile.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-primary hover:underline'
                          >
                            {t('ota.button.download' as any)}
                          </a>
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex h-[30px] items-center justify-end gap-2'>
                <Button
                  onClick={onClose}
                  variant={'outline'}
                  type='button'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  {t('ota.button.cancel' as any)}
                </Button>
                <Button
                  type='submit'
                  className='h-full w-[70px] rounded-[4px] text-xs'
                  disabled={isPending || isUpdatePending}
                >
                  {isPending || isUpdatePending
                    ? t('ota.button.saving' as any)
                    : t('ota.button.save' as any)}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
