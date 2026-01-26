import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/ui/components/ui/tabs';
import { useMemo, useState } from 'react';
import { UserTable } from '../profile-tables';
import { UserColumns } from '../profile-tables/columns';
import { WorkTable } from '../work-tables';
import { WorkColumns } from '../work-tables/columns';
import { User } from '@/core/domains/auth/types';
import { useTranslation } from '@/core/domains/language/useTranslation';

export const fakeData = [
  {
    title: 'Đăng nhập thành công',
    content: 'Người dùng đã đăng nhập vào hệ thống.',
    ip: '192.168.1.15',
    time: 'Hôm nay, 07:30'
  },
  {
    title: 'Cập nhật thông tin hồ sơ',
    content: 'Thay đổi email và số điện thoại trong phần hồ sơ.',
    ip: '192.168.1.15',
    time: 'Hôm nay, 08:15'
  },
  {
    title: 'Thêm mới tài khoản nhân viên',
    content: 'Tài khoản nhân viên Nguyễn Văn B được tạo mới.',
    ip: '10.10.13.22',
    time: 'Hôm nay, 09:02'
  },
  {
    title: 'Đăng xuất',
    content: 'Người dùng đã đăng xuất khỏi hệ thống.',
    ip: '192.168.1.15',
    time: 'Hôm nay, 12:45'
  },
  {
    title: 'Đổi mật khẩu',
    content: 'Người dùng đã thay đổi mật khẩu thành công.',
    ip: '172.16.0.21',
    time: 'Hôm nay, 14:20'
  },
  {
    title: 'Xóa tài khoản',
    content: 'Tài khoản thành viên cũ đã bị xóa.',
    ip: '203.113.45.98',
    time: 'Hôm nay, 15:10'
  }
];

export const workData = [
  {
    title: 'Triển khai Microservice mới',
    content: 'Hoàn thành và deploy Department Service lên môi trường dev.',
    ip: '10.1.0.12',
    time: 'Hôm nay, 09:10'
  },
  {
    title: 'Tích hợp NATS JetStream',
    content: 'Thử nghiệm publish/subcribe event giữa các service.',
    ip: '10.1.0.12',
    time: 'Hôm nay, 10:05'
  },
  {
    title: 'Xử lý File Upload',
    content: 'Tích hợp MinIO và kiểm thử API upload nội bộ.',
    ip: '192.168.3.50',
    time: 'Hôm nay, 11:22'
  },
  {
    title: 'Cập nhật gRPC Protocol',
    content: 'Thêm contract cho Maintenance process và regenerate stub.',
    ip: '10.1.0.18',
    time: 'Hôm nay, 13:47'
  },
  {
    title: 'Refactor Domain Layer',
    content: 'Tối ưu DDD cho AuditLog Service và tách Value Object.',
    ip: '172.16.5.10',
    time: 'Hôm nay, 15:30'
  },
  {
    title: 'Deploy lên Production',
    content: 'Sử dụng SSH + Docker Compose để triển khai bản cập nhật.',
    ip: '203.113.21.84',
    time: 'Hôm nay, 17:05'
  }
];

type ProfileProps = {
  user: User;
};

export default function Profile({ user }: ProfileProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'user' | 'work'>('user');

  const userTableMemo = useMemo(() => {
    return (
      <UserTable
        data={fakeData}
        totalItems={fakeData.length}
        columns={UserColumns()}
      />
    );
  }, []);

  const workTableMemo = useMemo(() => {
    return (
      <WorkTable
        data={workData}
        totalItems={workData.length}
        columns={WorkColumns()}
      />
    );
  }, []);

  return (
    <div className='flex w-full flex-col md:h-full md:flex-row'>
      {/* Left panel - User info */}
      <div className='w-full px-4 py-2.5 md:w-[282px] md:py-2.5 md:pr-2.5 md:pl-6'>
        <span className='text-primary text-[20px] font-bold'>
          {t('profile.profile')}
        </span>
        <div className='mt-6 flex flex-col gap-3.5 md:mt-8'>
          <span className='text-[16px] font-bold'>{t('profile.info')}</span>
          <div className='flex flex-col gap-4 pl-1 text-[14px] md:gap-5'>
            <p className='break-words'>
              <span className='font-bold'>{t('profile.name')} </span>
              {user?.first_name} {user?.last_name}
            </p>
            <p>
              <span className='font-bold'>{t('profile.role')}: </span>
              {user?.role}
            </p>
            <p>
              <span className='font-bold'>{t('profile.unit')}: </span> ...
            </p>
            <p>
              <span className='font-bold'>{t('profile.department')}: </span> ...
            </p>
            <p>
              <span className='font-bold'>{t('profile.phone')}: </span>
              {'Nguyễn Văn An'}
            </p>
            <p className='break-all'>
              <span className='font-bold'>{t('profile.email')}: </span>
              {user?.email}
            </p>
            <p className='break-words'>
              <span className='font-bold'>{t('profile.address')}: </span>
              {'Nguyễn Văn An'}
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - Activity history */}
      <div className='flex flex-col px-4 pt-2.5 md:min-h-0 md:flex-1 md:px-0'>
        <span className='text-[20px] font-bold'>
          {t('profile.work_history')}
        </span>

        <div className='mt-5 flex w-full flex-col gap-3.5 md:h-full md:border-l-2 md:pl-2'>
          {/* Tabs - Responsive */}
          <Tabs
            defaultValue='user'
            className='!bg-card-primary w-full rounded-[8px] p-2 shadow-[0_4px_4px_rgba(0,0,0,0.25)] md:max-w-[277px]'
            onValueChange={(v) => setTab(v as any)}
          >
            <TabsList className='flex w-full !bg-transparent text-[12px]'>
              <TabsTrigger
                value='user'
                className='group data-[state=active]:!bg-blue-3 !h-[38px] flex-1 cursor-pointer rounded-[8px] font-bold data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-transparent'
              >
                {t('profile.user')}
              </TabsTrigger>
              <TabsTrigger
                value='work'
                className='group data-[state=active]:!bg-blue-3 !h-[38px] flex-1 cursor-pointer rounded-[8px] font-bold data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-transparent'
              >
                {t('profile.work')}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Table container */}
          <div className='h-[calc(100vh-400px)] min-h-[300px] w-full md:h-[500px] md:min-h-0 md:flex-1'>
            {tab === 'user' ? (
              <div className='flex h-full w-full md:pl-6'>{userTableMemo}</div>
            ) : (
              <div className='flex h-full w-full md:pl-6'>{workTableMemo}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
