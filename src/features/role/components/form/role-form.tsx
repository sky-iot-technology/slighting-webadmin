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
import { roleSchema } from '@/core/domains/role/schemas';
import RolePermissionUI from '../role-permission-select';
import {
  CreateRoleInput,
  UIRoleResponse
} from '@/core/domains/permissions/types';
import { toBackendPayload, useCreateRole } from '@/core/domains/permissions';
import { useMemo } from 'react';

type RoleFormProps = {
  pageTitle: string;
  onClose?: () => void;
  initialData?: UIRoleResponse | null;
};

export default function RoleForm({
  onClose,
  pageTitle,
  initialData
}: RoleFormProps) {
  const defaultValues = useMemo(() => {
    return (
      initialData
        ? {
            name: initialData.name ?? '',
            description: initialData.description ?? '',
            permission: initialData.permission.ui
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
  const onSubmit = (values: z.infer<typeof roleSchema>) => {
    const backendPer = toBackendPayload(values.permission);
    const payload: CreateRoleInput = {
      name: values.name,
      label: values.name.toLowerCase().replace(/\s+/g, '-'),
      description: values.note ?? '',
      status: 'enabled',
      permission: backendPer
    };
    createRole.mutate(payload);
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
                      Tên vai trò
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder='Nhập tên đơn vị'
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
                    <FormLabel className='text-xs font-bold'>Ghi chú</FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder='Nhập ghi chú'
                        {...field}
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
                  <FormItem>
                    <FormLabel className='text-xs font-bold'>
                      Phân quyền
                    </FormLabel>
                    {/* <FormControl> */}
                    <RolePermissionUI
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {/* </FormControl> */}
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
                  Hủy
                </Button>
                <Button
                  type='submit'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  Lưu
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
