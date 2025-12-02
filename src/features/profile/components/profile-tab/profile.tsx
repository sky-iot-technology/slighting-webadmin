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
  const [tab, setTab] = useState<'user' | 'work'>('user');

  const userTableMemo = useMemo(() => {
    return (
      <UserTable
        data={fakeData}
        totalItems={fakeData.length}
        columns={UserColumns()}
        // onTableReady={setDepartmentTable}
      />
    );
  }, []);

  const workTableMemo = useMemo(() => {
    return (
      <WorkTable
        data={workData}
        totalItems={workData.length}
        columns={WorkColumns()}
        // onTableReady={setDepartmentTable}
      />
    );
  }, []);

  return (
    <>
      <div className='flex h-full w-full pr-2'>
        <div className='w-[282px] py-2.5 pr-2.5 pl-6'>
          <span className='text-primary text-[20px] font-bold'>
            Hồ sơ cá nhân
          </span>
          <div className='mt-8 flex flex-col gap-3.5'>
            <span className='text-[16px] font-bold'>Thông tin</span>
            <div className='flex flex-col gap-5 pl-1 text-[14px]'>
              <p>
                <span className='font-bold'>Họ tên: </span> {user?.first_name}{' '}
                {user?.last_name}
              </p>
              <p>
                <span className='font-bold'>Vai trò: </span> {user?.role}
              </p>
              <p>
                <span className='font-bold'>Đơn vị: </span> ...
              </p>
              <p>
                <span className='font-bold'>Bộ phận: </span> ...
              </p>
              <p>
                <span className='font-bold'>Điện thoại: </span> Nguyễn Văn An
              </p>
              <p>
                <span className='font-bold'>Email: </span> {user?.email}
              </p>
              <p>
                <span className='font-bold'>Địa chỉ: </span> Nguyễn Văn An
              </p>
            </div>
          </div>
        </div>
        <div className='flex min-h-0 flex-1 flex-col pt-2.5'>
          <span className='pl-2 text-[20px] font-bold'>Lịch sử hoạt động</span>
          <div className='mt-5 flex h-full w-full flex-col gap-3.5 border-l-2 pl-2'>
            <Tabs
              defaultValue='user'
              className='!bg-card-primary max-w-[277px] flex-shrink-0 rounded-[8px] p-2 shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:w-auto'
              onValueChange={(v) => setTab(v as any)}
            >
              <TabsList className='flex !bg-transparent text-[12px]'>
                <TabsTrigger
                  value='user'
                  className='group data-[state=active]:bg-primary !h-[38px] !w-[129px] cursor-pointer rounded-[8px] font-bold data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-transparent'
                >
                  Người dùng
                </TabsTrigger>
                <TabsTrigger
                  value='work'
                  className='group data-[state=active]:bg-primary !h-[38px] !w-[129px] cursor-pointer rounded-[8px] font-bold data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-transparent'
                >
                  Công việc
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className='min-h-0 flex-1'>
              {tab === 'user' ? (
                <div className='flex h-full w-full pl-6'>{userTableMemo}</div>
              ) : (
                <div className='flex h-full w-full pl-6'>{workTableMemo}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
