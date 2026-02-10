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
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { Input } from '@/ui/components/ui/input';
import { useMemo, useState } from 'react';
import {
  convertUserFormToApiPayload,
  CreateUserDto,
  updateUserSchema,
  useCreateUser,
  User,
  userFormSchema,
  UserFormValues,
  useUpdateUser
} from '@/core/domains/users';
import { Eye, EyeOff, User as UserPic } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { TreeProvider } from '@/ui/business/tree/TreeProvider';
import Image from 'next/image';
import ChangepassDialog from './changepass-form';
import { useCan, useGetRoles } from '@/core/domains/permissions';
import { MultiSelect } from '@/ui/components/ui/multi-select';
import { useTranslation } from '@/core/domains/language/useTranslation';

type RoleFormProps = {
  pageTitle: string;
  onClose?: () => void;
  initialData?: User | null;
  isView?: boolean;
};

export default function UserForm({
  onClose,
  pageTitle,
  initialData,
  isView
}: RoleFormProps) {
  const { t } = useTranslation();
  const [selectedParent, setSelectedParent] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);

  //checkrole
  const canViewRole = useCan('role', 'view');
  //fetch roles from api
  const { data: rolesData, isLoading } = useGetRoles(
    {
      status: 'enabled'
    },
    {
      enabled: canViewRole
    }
  );

  // Transform roles data into Select options format
  const roleOptions = useMemo(() => {
    if (!rolesData?.['ui-roles']) return [];
    return rolesData['ui-roles'].map((role) => ({
      value: String(role.id),
      label: role.name
    }));
  }, [rolesData]);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(!!initialData ? updateUserSchema : userFormSchema),
    defaultValues: {
      firstName: initialData?.first_name || '',
      lastName: initialData?.last_name || '',
      email: initialData?.email || '',
      role: initialData?.metadata?.roleId || '',
      group: '',

      username: initialData?.credentials.username || '',
      password: '',
      confirmPassword: '',

      // optional
      phone: initialData?.metadata?.phone || '',
      unit: initialData?.tags || [],
      department: initialData?.metadata?.department || '',
      address: initialData?.metadata?.address || '',
      note: initialData?.metadata?.about || ''
    },
    disabled: isView
  });

  const createUser = useCreateUser({
    onSuccess: () => {
      onClose?.();
    }
  });

  const updateUser = useUpdateUser({
    onSuccess: () => {
      onClose?.();
    }
  });

  const onSubmit = (values: UserFormValues) => {
    const apiPayload = convertUserFormToApiPayload(values, !!initialData);
    if (initialData) {
      updateUser.mutate({ id: String(initialData.id), data: apiPayload });
    } else {
      createUser.mutate(apiPayload as CreateUserDto);
    }
  };

  return (
    <CustomScrollbar className='bg-card max-h-[660px] overflow-y-auto px-5 pt-3 pb-5'>
      <Card className='bg-card mx-auto w-full gap-1.5 border-0 py-0 shadow-none'>
        <CardHeader className='px-0'>
          <CardTitle className='text-primary-text text-left text-[20px] font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className='px-0'>
          <FormSchemaProvider
            schema={!!initialData ? updateUserSchema : userFormSchema}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=''>
                <div className='flex gap-9'>
                  <div className='hidden flex-shrink-0 md:block'>
                    {initialData?.profile_picture ? (
                      <img
                        src={initialData.profile_picture}
                        alt='Avatar'
                        className='h-38 w-38 rounded-full border object-cover shadow-sm'
                      />
                    ) : (
                      <div className='flex h-38 w-38 items-center justify-center rounded-full border bg-gray-200 text-xs text-gray-500'>
                        <UserPic width={80} height={80} />
                      </div>
                    )}
                  </div>

                  <div className='flex-1'>
                    <h3 className='pb-2 text-[16px] font-bold'>
                      {t('user.personal_info' as any)}
                    </h3>
                    <div className='grid grid-cols-2 gap-x-3 md:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.first_name' as any)}{' '}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_first_name' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.last_name' as any)}{' '}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_last_name' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.phone' as any)}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_phone' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='email'
                        disabled={!!initialData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.email' as any)}{' '}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_email' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='role'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.role_label' as any)}{' '}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isLoading || isView}
                            >
                              <FormControl>
                                <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                                  <SelectValue
                                    placeholder={
                                      isLoading
                                        ? t('user.loading' as any)
                                        : t('user.select_role' as any)
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                                {roleOptions.length > 0
                                  ? roleOptions.map((role) => (
                                      <SelectItem
                                        key={role.value}
                                        value={role.value}
                                      >
                                        {role.label}
                                      </SelectItem>
                                    ))
                                  : null}
                                {/* <SelectItem key={'user'} value={'user'}>
                                  User
                                </SelectItem>
                                <SelectItem key={'admin'} value={'admin'}>
                                  Admin
                                </SelectItem> */}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='group'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.branch_label' as any)}{' '}
                            </FormLabel>
                            <FormControl>
                              <TreeProvider
                                disabled={isView}
                                onRegionChange={(region) => {
                                  field.onChange(region?.id ?? '');
                                  setSelectedParent(
                                    region
                                      ? { id: region.id, name: region.name }
                                      : null
                                  );
                                }}
                                selectedRegion={
                                  selectedParent
                                    ? {
                                        id: selectedParent.id,
                                        name: selectedParent.name
                                      }
                                    : undefined
                                }
                                className='dark:bg-input/30 !h-[31px] !w-full !text-xs'
                                buttonClassName='!rounded-[4px] dark:disabled:bg-gray-5 dark:hover:bg-input/50'
                                insideClassName='dark:bg-action'
                                treeClassName='!w-full !rounded-[4px]'
                                showSelectAll={true}
                                closeOnClickOutside={true}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='unit'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.unit_label' as any)}
                            </FormLabel>
                            <FormControl>
                              {/* <MultiSelect
                              options={
                                [{ value: 'team:support', label: 'Team Support' },
                                { value: 'team:technical', label: 'Team Technical' }
                                ]
                              }
                              defaultValue={field.value ?? []}
                              onValueChange={(val) => field.onChange(val)}
                              placeholder='Chọn đơn vị xử lý'
                              resetOnDefaultValueChange={true}
                              className='!min-h-[31px] !h-auto !rounded-[4px] px-2'
                              popoverClassName='w-[var(--radix-popover-trigger-width)]'
                              autoSize={true}
                              textSize='!text-xs'
                              hideSelectAll
                              disabled={isView}
                            /> */}
                              <MultiSelect
                                options={[
                                  {
                                    value: 'team:support',
                                    label: 'Team Support'
                                  },
                                  {
                                    value: 'team:technical',
                                    label: 'Team Technical'
                                  }
                                ]}
                                defaultValue={field.value ?? []}
                                onValueChange={field.onChange}
                                placeholder={t('user.select_unit' as any)}
                                resetOnDefaultValueChange
                                singleLine
                                className='dark:bg-input/30 dark:disabled:bg-gray-5 flex h-auto !min-h-[31px] !w-full !max-w-full !min-w-0 gap-1 !rounded-[4px]'
                                popoverClassName='
                                w-[var(--radix-popover-trigger-width)]
                                max-w-[95vw]
                                sm:max-w-none
                              '
                                autoSize
                                textSize='!text-xs'
                                hideSelectAll
                                hideXIcon={true}
                                disabled={isView}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='department'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.department_label' as any)}
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isView}
                              >
                                <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                                  <SelectValue
                                    placeholder={t(
                                      'user.select_department' as any
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                                  <SelectItem value='test'>test</SelectItem>
                                </SelectContent>
                              </Select>
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
                              {t('user.address' as any)}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_address' as any)}
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
                              {t('user.note' as any)}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_note' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <h3 className='pt-2.5 pb-2 text-[16px] font-bold'>
                      {t('user.account_info' as any)}
                    </h3>
                    <div className='grid grid-cols-2 gap-x-3 md:grid-cols-3'>
                      <FormField
                        control={form.control}
                        disabled={!!initialData}
                        name='username'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.username' as any)}{' '}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_username' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {!initialData ? (
                        <>
                          <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='justify-between text-xs font-bold'>
                                  <span>{t('user.password' as any)}</span>
                                  {initialData && (
                                    <>
                                      <Image
                                        src={'/assets/icons/edit.svg'}
                                        alt='edit'
                                        width={12}
                                        height={12}
                                        className='cursor-pointer'
                                        onClick={() => setOpen(!open)}
                                      />
                                    </>
                                  )}
                                </FormLabel>

                                <div className='relative'>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type={showPassword ? 'text' : 'password'}
                                      placeholder={t(
                                        'user.enter_password' as any
                                      )}
                                      className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                    />
                                  </FormControl>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className='absolute inset-y-0 right-0 flex items-center pr-3'
                                  >
                                    {showPassword ? (
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
                                  {t('user.confirm_password' as any)}{' '}
                                </FormLabel>

                                <div className='relative'>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type={
                                        showConfirmPassword
                                          ? 'text'
                                          : 'password'
                                      }
                                      placeholder={t(
                                        'user.re_enter_password' as any
                                      )}
                                      className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                    />
                                  </FormControl>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      setShowConfirmPassword(
                                        !showConfirmPassword
                                      )
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
                        </>
                      ) : !isView ? (
                        <div className='flex items-center'>
                          <Button
                            type='button'
                            className='mt-6 h-[31px] rounded-[4px] border-1 text-xs'
                            variant={'ghost'}
                            onClick={() => setOpen(!open)}
                          >
                            {t('user.reset_password' as any)}
                          </Button>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>

                <div className='mt-3 flex h-[30px] items-center justify-end gap-4'>
                  <Button
                    onClick={onClose}
                    variant={'outline'}
                    type='button'
                    className='h-full w-16 rounded-[4px] text-xs'
                  >
                    {isView ? t('user.close' as any) : t('user.cancel' as any)}
                  </Button>
                  {!isView && (
                    <Button
                      type='submit'
                      className='h-full w-[91px] rounded-[4px] text-xs'
                    >
                      {t('user.save' as any)}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
            {initialData && (
              <>
                <ChangepassDialog
                  open={open}
                  onOpenChange={setOpen}
                  userId={initialData.id}
                />
              </>
            )}
          </FormSchemaProvider>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
