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
import RolePermissionUI from '../role-permission-select';
import {
  CreateRoleInput,
  UIRoleResponse,
  UpdateRoleInput
} from '@/core/domains/permissions/types';
import {
  roleSchema,
  toBackendPayload,
  useCreateRole,
  useUpdateRole
} from '@/core/domains/permissions';
import { useMemo } from 'react';
import { permissionArrayToMap } from '../../helper';
import { useTranslation } from '@/core/domains/language/useTranslation';

type RoleFormProps = {
  pageTitle: string;
  onClose?: () => void;
  initialData?: UIRoleResponse | null;
  isViewOnly?: boolean;
};

export default function RoleForm({
  onClose,
  pageTitle,
  initialData,
  isViewOnly = false
}: RoleFormProps) {
  const { t } = useTranslation();
  const defaultValues = useMemo(() => {
    return (
      initialData
        ? {
            name: initialData.name ?? '',
            note: initialData.description ?? '',
            permission: permissionArrayToMap(initialData.permission.ui)
          }
        : {
            name: '',
            note: '',
            permission: {}
          }
    ) as z.infer<typeof roleSchema>;
  }, [initialData]);

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues
  });

  const createRole = useCreateRole({
    onSuccess: () => {
      if (onClose) onClose();
    }
  });
  const updateRole = useUpdateRole({
    onSuccess: () => {
      if (onClose) onClose();
    }
  });
  const onSubmit = (values: z.infer<typeof roleSchema>) => {
    const backendPer = toBackendPayload(values.permission);
    let base = {
      name: values.name,
      label: values.name.toLowerCase().replace(/\s+/g, '-'),
      description: values.note ?? '',
      permission: backendPer
    };
    if (initialData) {
      updateRole.mutate({
        id: initialData.id,
        data: base
      });
    } else {
      createRole.mutate({
        ...base,
        status: 'enabled'
      });
    }
  };

  return (
    <CustomScrollbar className='bg-card !h-full max-h-[660px] overflow-y-auto px-5 pt-3 pb-5 lg:max-h-full'>
      <Card className='bg-card mx-auto !h-full w-full gap-0 border-0 py-0 shadow-none'>
        <CardHeader className='gap-0 px-0'>
          <CardTitle className='text-primary-text text-left text-[16px] font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className='h-full px-0'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex !h-full flex-col'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel className='text-xs font-bold'>
                      {t('role.form.label.name' as any)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder={t('role.form.placeholder.name' as any)}
                        {...field}
                        disabled={isViewOnly}
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
                  <FormItem className='mt-0'>
                    <FormLabel className='text-xs font-bold'>
                      {t('role.form.label.note' as any)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder={t('role.form.placeholder.note' as any)}
                        {...field}
                        disabled={isViewOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='permission'
                render={({ field }) => (
                  <FormItem className='mt-0 flex h-full flex-1 flex-col'>
                    <FormLabel className='text-xs font-bold'>
                      {t('role.form.label.permission' as any)}
                    </FormLabel>
                    {/* <FormControl> */}
                    <RolePermissionUI
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isViewOnly}
                    />
                    {/* </FormControl> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='mt-auto flex h-[30px] justify-end gap-4'>
                <Button
                  onClick={onClose}
                  variant={'outline'}
                  type='button'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  {t('role.form.button.cancel' as any)}
                </Button>
                {!isViewOnly && (
                  <Button
                    type='submit'
                    className='h-full w-16 rounded-[4px] text-xs'
                  >
                    {t('role.form.button.save' as any)}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
