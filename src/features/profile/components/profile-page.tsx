'use client';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import { LockKeyhole, LogOut, User, UserCog } from 'lucide-react';
import { useMemo, useState } from 'react';
import Profile from './profile-tab/profile';
import PasswordForm from './form/password-form';
import { AlertModal } from '@/ui/components/modal/alert-modal';
import { useAuthStore, useLogout, useUploadAvatar } from '@/core/domains/auth';
import AccountForm from './form/account-form';

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'profile' | 'account' | 'password'>('profile');
  const logoutMutation = useLogout();
  const { user } = useAuthStore();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>Hồ sơ</span>
      </div>
    ),
    []
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const uploadAvatar = useUploadAvatar();

  if (!user) {
    return (
      <Card className='bg-background mx-auto w-full border-0 py-0 shadow-none'>
        <div className='p-6'>Đang tải...</div>
      </Card>
    );
  }

  return (
    <Card className='bg-background mx-auto flex w-full gap-1.5 border-0 py-0 shadow-none'>
      <CardHeader className='px-0'>
        <CardTitle className='text-primary text-left text-[16px] font-bold'></CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4 px-0 md:flex-row md:gap-1.5'>
        <div className='w-full rounded-[4px] bg-white px-[22px] pt-[24px] md:h-[519px] md:w-[378px] md:pt-[44px] md:pb-2.5'>
          <div className='mb-6 flex flex-col items-center gap-4 md:flex-row md:gap-8'>
            <div className='group relative cursor-pointer'>
              <label htmlFor='avatar-upload' className='cursor-pointer'>
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt='Avatar'
                    className='h-[90px] w-[90px] rounded-full border object-cover shadow-sm'
                  />
                ) : (
                  <div className='flex h-[90px] w-[90px] items-center justify-center rounded-full border bg-gray-200 text-xs text-gray-500'>
                    <User width={50} height={50} />
                  </div>
                )}
                <div className='absolute inset-0 hidden items-center justify-center rounded-full bg-black/40 text-xs text-white group-hover:flex'>
                  Đổi ảnh
                </div>
              </label>

              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={async (e) => {
                  console.log('FIRE upload event');
                  const file = e.target.files?.[0];
                  if (!file) return;
                  uploadAvatar.mutate(file);
                }}
              />
            </div>

            <div className='flex flex-col items-center md:items-start'>
              <span className='text-[26px] font-bold'>
                {user.first_name} {user.last_name}
              </span>
              <span className='text-[14px] font-bold'>{user.email}</span>
            </div>
          </div>
          <div className='flex flex-col items-center text-[14px] md:items-start'>
            <button
              type='button'
              onClick={() => setTab('profile')}
              className={`flex h-[31px] w-[186px] cursor-pointer items-center gap-3 rounded-[4px] p-3 font-bold ${tab === 'profile' ? 'bg-primary text-white' : 'hover:bg-accent bg-white text-black'}`}
            >
              <User width={20} height={20} />
              Hồ sơ cá nhân
            </button>

            <button
              type='button'
              onClick={() => setTab('account')}
              className={`flex h-[31px] w-[186px] cursor-pointer items-center gap-3 rounded-[4px] p-3 font-bold ${tab === 'account' ? 'bg-primary text-white' : 'hover:bg-accent bg-white text-black'}`}
            >
              <UserCog width={20} height={20} />
              Tài khoản
            </button>

            <button
              type='button'
              onClick={() => setTab('password')}
              className={`flex h-[31px] w-[186px] cursor-pointer items-center gap-3 rounded-[4px] p-3 font-bold ${tab === 'password' ? 'bg-primary text-white' : 'hover:bg-accent bg-white text-black'}`}
            >
              <LockKeyhole width={20} height={20} />
              Đổi mật khẩu
            </button>

            <button
              type='button'
              onClick={() => setOpen(!open)}
              className={`flex h-[31px] w-[186px] cursor-pointer items-center gap-3 rounded-[4px] p-3 font-bold`}
            >
              <LogOut width={20} height={20} />
              Đăng xuất
            </button>
          </div>
        </div>
        <div className='flex-1 rounded-[4px] bg-white'>
          {tab === 'profile' && <Profile user={user} />}
          {tab === 'account' && <AccountForm initialData={user} />}
          {tab === 'password' && <PasswordForm />}
        </div>
      </CardContent>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleLogout}
        loading={logoutMutation.isPending}
        title='Bạn có chắc chắn đăng xuất không'
        description=''
      />
    </Card>
  );
}
