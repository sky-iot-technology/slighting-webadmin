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
import { useMemo, useState } from 'react';
import {
  convertUserFormToApiPayload,
  userFormSchema,
  UserFormValues
} from '@/core/domains/users';
import { Eye, EyeOff, User } from 'lucide-react';
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
import { useGetRoles } from '@/core/domains/permissions';

type RoleFormProps = {
  pageTitle: string;
  onClose?: () => void;
  // initialData?: UIRoleResponse | null;
  isEditMode?: boolean;
  //id for testing
  userId?: string;
};

export default function UserForm({
  onClose,
  pageTitle,
  // initialData
  isEditMode,
  //test
  userId
}: RoleFormProps) {
  const [selectedParent, setSelectedParent] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);

  //fetch roles from api
  const { data: rolesData, isLoading } = useGetRoles({
    status: 'enabled'
  });

  // Transform roles data into Select options format
  const roleOptions = useMemo(() => {
    if (!rolesData?.['ui-roles']) return [];
    return rolesData['ui-roles'].map((role) => ({
      value: String(role.id),
      label: role.name
    }));
  }, [rolesData]);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      group: '',
      status: 'enabled',

      username: '',
      password: '',
      confirmPassword: '',

      // optional
      phone: '',
      unit: '',
      department: '',
      address: '',
      note: '',
      profile_picture: ''
    }
  });

  const onSubmit = (values: UserFormValues) => {
    const apiPayload = convertUserFormToApiPayload(values);
    console.log(apiPayload);
  };

  return (
    <CustomScrollbar className='max-h-[660px] overflow-y-auto px-5 pt-3 pb-5'>
      <Card className='bg-background mx-auto w-full gap-1.5 border-0 py-0 shadow-none'>
        <CardHeader className='px-0'>
          <CardTitle className='text-primary text-left text-[20px] font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className='px-0'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=''>
              <div className='flex gap-9'>
                <div>
                  <FormField
                    control={form.control}
                    name='profile_picture'
                    render={({ field }) => {
                      const file = field.value;
                      const previewUrl =
                        file instanceof File ? URL.createObjectURL(file) : null;
                      return (
                        <FormItem className='col-span-2'>
                          <FormControl>
                            <div className='relative'>
                              <label className='cursor-pointer'>
                                {previewUrl ? (
                                  <img
                                    src={previewUrl}
                                    alt='Avatar'
                                    className='h-38 w-38 rounded-full border object-cover shadow-sm'
                                  />
                                ) : (
                                  <div className='flex h-38 w-38 items-center justify-center rounded-full border bg-gray-200 text-xs text-gray-500'>
                                    <User width={80} height={80} />
                                  </div>
                                )}

                                <input
                                  type='file'
                                  accept='image/*'
                                  className='hidden'
                                  onChange={(e) =>
                                    field.onChange(e.target.files?.[0] ?? null)
                                  }
                                />
                              </label>

                              {/* Nút xoá ảnh */}
                              {previewUrl && (
                                <button
                                  type='button'
                                  onClick={() => field.onChange(null)}
                                  className='absolute -top-1 -right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white'
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className='flex-1'>
                  <h3 className='pb-2 text-[16px] font-bold'>
                    Thông tin cá nhân
                  </h3>
                  <div className='grid grid-cols-3 gap-x-3'>
                    <FormField
                      control={form.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='!gap-0.5 text-xs font-bold'>
                            Họ <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                              placeholder='Nhập họ'
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
                          <FormLabel className='!gap-0.5 text-xs font-bold'>
                            Tên <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                              placeholder='Nhập tên'
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
                            Số điện thoại
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                              placeholder='Nhập số điện thoại'
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='!gap-0.5 text-xs font-bold'>
                            Email <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                              placeholder='Nhập email'
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
                          <FormLabel className='!gap-0.5 text-xs font-bold'>
                            Vai trò <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isLoading}
                            >
                              <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                                <SelectValue
                                  placeholder={
                                    isLoading ? 'Đang tải...' : 'Chọn vai trò'
                                  }
                                />
                              </SelectTrigger>
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
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='group'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='!gap-0.5 text-xs font-bold'>
                            Chi nhánh <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <TreeProvider
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
                              className='!h-[31px] !w-full !text-xs'
                              buttonClassName='!rounded-[4px]'
                              treeClassName='!w-full !rounded-[4px]'
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
                            Đơn vị
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                                <SelectValue placeholder='Chọn đơn vị' />
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
                      name='department'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs font-bold'>
                            Bộ phận
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                                <SelectValue placeholder='Chọn bộ phận' />
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
                            Địa chỉ
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                              placeholder='Nhập địa chỉ'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='status'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='!gap-0.5 text-xs font-bold'>
                            Trạng thái <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger
                                value={'enabled'}
                                className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'
                              >
                                <SelectValue placeholder='Chọn bộ phận' />
                              </SelectTrigger>
                              <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                                <SelectItem value='enabled'>
                                  Đã kích hoạt
                                </SelectItem>
                                <SelectItem value='disabled'>
                                  Chưa kích hoạt
                                </SelectItem>
                              </SelectContent>
                            </Select>
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
                            Ghi chú
                          </FormLabel>
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
                  </div>

                  <h3 className='pb-2 text-[16px] font-bold'>
                    Thông tin tài khoản
                  </h3>
                  <div className='grid grid-cols-3 gap-x-3'>
                    <FormField
                      control={form.control}
                      name='username'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='!gap-0.5 text-xs font-bold'>
                            Tài khoản <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                              placeholder='Nhập tài khoản'
                              {...field}
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
                          <FormLabel className='justify-between text-xs font-bold'>
                            <span>
                              Mật khẩu
                              <span className='ml-0.5 text-red-500'>*</span>
                            </span>
                            {isEditMode && (
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
                          <FormControl>
                            <div className='relative'>
                              <Input
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Nhập mật khẩu'
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                              />
                              <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute inset-y-0 right-0 flex items-center pr-3'
                              >
                                {showPassword ? (
                                  <EyeOff className='h-3 w-3 text-gray-400' />
                                ) : (
                                  <Eye className='h-3 w-3 text-gray-400' />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {!isEditMode && (
                      <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='!gap-0.5 text-xs font-bold'>
                              Nhập lại mật khẩu{' '}
                              <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Input
                                  {...field}
                                  type={
                                    showConfirmPassword ? 'text' : 'password'
                                  }
                                  placeholder='Nhập lại mật khẩu'
                                  className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                />
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>

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
                  className='h-full w-[91px] rounded-[4px] text-xs'
                >
                  Lưu
                </Button>
              </div>
            </form>
          </Form>
          {isEditMode && userId && (
            <>
              <ChangepassDialog
                open={open}
                onOpenChange={setOpen}
                userId={userId}
              />
            </>
          )}
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
