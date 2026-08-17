'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/core/domains/language/useTranslation';
import {
  useGetDomains,
  useCreateDomain,
  useUpdateDomain,
  useAuthStore,
  useLogout
} from '@/core/domains/auth';
import { cookieUtils } from '@/core/shared/utils/cookies';
import { Button } from '@/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/ui/components/ui/dialog';
import { ModeToggle } from '@/ui/components/layout/ThemeToggle/theme-toggle';
import { Translated } from '@/ui/components/layout/translated';
import { toast } from 'sonner';
import { Plus, LogOut, Building, Globe, Loader2, Pencil } from 'lucide-react';
import Image from 'next/image';
import { Domain } from '@/core/domains/auth/types';
import { usePermissionStore } from '@/core/domains/permissions';

export default function SelectDomainPage() {
  const { can } = usePermissionStore();
  const { language } = useTranslation();
  const isVi = language === 'vi';
  const router = useRouter();

  const { setDomainId, domainId } = useAuthStore();
  const { data: domains, isLoading, error } = useGetDomains();
  const createDomainMutation = useCreateDomain();
  const updateDomainMutation = useUpdateDomain();
  const logoutMutation = useLogout();

  const [domainName, setDomainName] = useState('');
  const [domainRoute, setDomainRoute] = useState('');
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const canCreateDomain = can('domain', 'create');
  const canUpdateDomain = can('domain', 'update');

  // If there's an error loading domains (e.g. unauthorized), log out
  useEffect(() => {
    if (error) {
      toast.error(
        isVi ? 'Không thể lấy thông tin dự án' : 'Failed to load domains'
      );
    }
  }, [error, isVi]);

  const handleSelectDomain = (domainId: string) => {
    cookieUtils.setSelectedDomainId(domainId);
    setDomainId(domainId);
    toast.success(
      isVi ? 'Đang vào bảng điều khiển...' : 'Entering dashboard...'
    );
    router.push('/dashboard/overview');
  };

  const handleOpenCreateDialog = () => {
    setEditingDomain(null);
    setDomainName('');
    setDomainRoute('');
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (domain: Domain) => {
    setEditingDomain(domain);
    setDomainName(domain.name);
    setDomainRoute(domain.route);
    setIsDialogOpen(true);
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim() || !domainRoute.trim()) {
      toast.error(
        isVi ? 'Vui lòng nhập đầy đủ thông tin' : 'Please fill all fields'
      );
      return;
    }

    // Basic route regex validation (alphanumeric and dashes)
    const routeRegex = /^[a-z0-9-]+$/;
    if (!routeRegex.test(domainRoute)) {
      toast.error(
        isVi
          ? 'Đường dẫn chỉ chứa chữ thường, số và dấu gạch ngang (ví dụ: my-domain-1)'
          : 'Route must only contain lowercase letters, numbers, and dashes (e.g., my-domain-1)'
      );
      return;
    }

    try {
      if (editingDomain) {
        await updateDomainMutation.mutateAsync({
          domainId: editingDomain.id,
          name: domainName,
          route: domainRoute
        });
        toast.success(
          isVi ? 'Cập nhật dự án thành công!' : 'Domain updated successfully!'
        );
      } else {
        await createDomainMutation.mutateAsync({
          name: domainName,
          route: domainRoute
        });
        toast.success(
          isVi ? 'Thêm dự án thành công!' : 'Domain created successfully!'
        );
      }
      setDomainName('');
      setDomainRoute('');
      setEditingDomain(null);
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(
        err.message ||
          (isVi
            ? editingDomain
              ? 'Cập nhật dự án thất bại'
              : 'Thêm dự án thất bại'
            : editingDomain
              ? 'Failed to update domain'
              : 'Failed to create domain')
      );
    }
  };

  const isPending =
    createDomainMutation.isPending || updateDomainMutation.isPending;

  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white from-70% to-blue-300 p-6 dark:from-gray-900 dark:to-blue-900'>
      {/* Top action bar */}
      <div className='absolute top-4 right-4 flex items-center gap-2'>
        <Translated />
        <ModeToggle />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => logoutMutation.mutate()}
          title={isVi ? 'Đăng xuất' : 'Sign Out'}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <LogOut className='h-4 w-4' />
          )}
        </Button>
      </div>

      <div className='flex w-full max-w-4xl flex-col items-center space-y-8'>
        {/* Logo and title */}
        <div className='space-y-3 text-center'>
          <Image
            src='/assets/images/logo2.png'
            alt='logo'
            width={200}
            height={200}
            className='mx-auto'
          />
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {isVi ? 'Chọn Dự Án Hoạt Động' : 'Select Active Domain'}
          </h1>
          <p className='text-muted-foreground mx-auto max-w-md text-sm'>
            {isVi
              ? 'Vui lòng chọn một dự án để bắt đầu quản lý thiết bị, hoặc tạo dự án mới.'
              : 'Please select a domain to manage your devices, or create a new one.'}
          </p>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className='flex flex-col items-center space-y-4 py-12'>
            <Loader2 className='text-primary h-10 w-10 animate-spin' />
            <p className='text-muted-foreground text-sm'>
              {isVi ? 'Đang tải danh sách dự án...' : 'Loading domains...'}
            </p>
          </div>
        ) : (
          <div className='grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Domain Cards */}
            {domains?.map((domain) => {
              const isSelected = domain.id === domainId;
              return (
                <Card
                  key={domain.id}
                  className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden border-2 shadow-md transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'hover:border-primary/50 border-transparent'
                  }`}
                  onClick={() => handleSelectDomain(domain.id)}
                >
                  <CardHeader className='pb-4'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg ${
                            isSelected
                              ? 'bg-primary text-white'
                              : 'group-hover:bg-primary group-hover:text-white'
                          } transition-colors duration-200`}
                        >
                          <Building className='h-5 w-5' />
                        </div>
                        <div>
                          <CardTitle className='text-base font-bold'>
                            {domain.name}
                          </CardTitle>
                          <div className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
                            <Globe className='h-3 w-3' />
                            <span>/{domain.route}</span>
                          </div>
                        </div>
                      </div>

                      {/* Edit Domain Button */}
                      {canUpdateDomain && (
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-muted-foreground hover:text-primary h-8 w-8'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditDialog(domain);
                          }}
                          title={isVi ? 'Chỉnh sửa dự án' : 'Edit Domain'}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    <div className='mt-2 flex items-center justify-between text-xs'>
                      <span className='text-muted-foreground'>Trạng thái:</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                          domain.status === 'enabled'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {domain.status === 'enabled'
                          ? isVi
                            ? 'Kích hoạt'
                            : 'Enabled'
                          : isVi
                            ? 'Vô hiệu hóa'
                            : 'Disabled'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Add Domain Card */}
            {canCreateDomain && (
              <Card
                className='hover:border-primary/50 hover:bg-primary/5 flex min-h-[140px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 text-center shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700'
                onClick={handleOpenCreateDialog}
              >
                <div className='group-hover:text-primary mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'>
                  <Plus className='h-6 w-6' />
                </div>
                <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  {isVi ? 'Thêm dự án mới' : 'Add New Domain'}
                </span>
              </Card>
            )}

            {/* Shared Create / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className='sm:max-w-[425px]'>
                <form onSubmit={handleSaveDomain}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingDomain
                        ? isVi
                          ? 'Chỉnh Sửa Dự Án'
                          : 'Edit Domain'
                        : isVi
                          ? 'Thêm Dự Án Mới'
                          : 'Create New Domain'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingDomain
                        ? isVi
                          ? 'Chỉnh sửa tên dự án và đường dẫn định danh. Nhấn lưu để hoàn tất.'
                          : 'Update the domain name and its unique route slug. Click save when done.'
                        : isVi
                          ? 'Nhập tên dự án và đường dẫn định danh. Nhấn lưu để hoàn tất.'
                          : 'Enter the domain name and its unique route slug. Click save when done.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='name' className='text-right'>
                        {isVi ? 'Tên dự án' : 'Name'}
                      </Label>
                      <Input
                        id='name'
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        placeholder='Ví dụ: Slighting SKT'
                        className='col-span-3'
                        required
                        disabled={isPending}
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='route' className='text-right'>
                        {isVi ? 'Đường dẫn' : 'Route'}
                      </Label>
                      <Input
                        id='route'
                        value={domainRoute}
                        onChange={(e) => setDomainRoute(e.target.value)}
                        placeholder='Ví dụ: lighting-skt'
                        className='col-span-3'
                        required
                        disabled={isPending}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type='button'
                        variant='outline'
                        disabled={isPending}
                      >
                        {isVi ? 'Hủy' : 'Cancel'}
                      </Button>
                    </DialogClose>
                    <Button type='submit' disabled={isPending}>
                      {isPending && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      {isVi ? 'Lưu dự án' : 'Save Domain'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
