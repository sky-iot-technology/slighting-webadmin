'use client';

import { useTranslation } from '@/core/domains/language/useTranslation';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/components/ui/avatar';
import { Badge } from '@/ui/components/ui/badge';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/ui/components/ui/card';
import { User, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';

const data = [
  {
    id: 1,
    title: 'Cập nhật firmware hoàn tất cho 23 thiết bị',
    time: '2 giờ trước',
    location: 'Quận 3',
    status: 'Critical',
    statusVariant: 'destructive' as const,
    icon: XCircle
  },
  {
    id: 2,
    title: 'Thêm mới 5 thiết bị thành công',
    time: '5 giờ trước',
    location: 'Quận 1',
    status: 'Success',
    statusVariant: 'secondary' as const,
    icon: CheckCircle
  },
  {
    id: 3,
    title: 'Ngắt kết nối 1 thiết bị bất thường',
    time: '1 ngày trước',
    location: 'Quận 7',
    status: 'Warning',
    statusVariant: 'outline' as const,
    icon: AlertTriangle
  },
  {
    id: 4,
    title: 'Người dùng A đăng nhập từ thiết bị mới',
    time: '2 ngày trước',
    location: 'Quận 5',
    status: 'Info',
    statusVariant: 'default' as const,
    icon: User
  },
  {
    id: 5,
    title: 'Cảnh báo CPU quá tải trên máy chủ 01',
    time: '3 ngày trước',
    location: 'Quận Bình Thạnh',
    status: 'Critical',
    statusVariant: 'destructive' as const,
    icon: AlertTriangle
  },
  {
    id: 6,
    title: 'Hoàn tất backup dữ liệu hệ thống',
    time: '5 ngày trước',
    location: 'Quận 10',
    status: 'Success',
    statusVariant: 'secondary' as const,
    icon: CheckCircle
  }
];

export function RecentAlerts() {
  const { t } = useTranslation();
  return (
    <Card className='!shadow-default h-full gap-1.5 border-none py-3'>
      <CardHeader className='flex items-center gap-3.5 py-2'>
        <Image
          src={'/assets/icons/lastestWarning.svg'}
          alt='warning'
          width={24}
          height={24}
          className='size-6'
        />
        <CardTitle>{t('dashboard.alert')}</CardTitle>
      </CardHeader>
      <div className='max-h-80 space-y-8 overflow-y-auto pr-2'>
        <CardContent className='px-3.5'>
          <div className='space-y-[5px]'>
            {data.map((alert) => {
              const Icon = alert.icon;
              return (
                <div
                  key={alert.id}
                  className='bg-card-success flex items-center rounded-xl px-3 py-2'
                >
                  <Avatar className='h-9 w-9'>
                    <div className='bg-muted flex h-full w-full items-center justify-center rounded-full'>
                      <Icon className='text-muted-foreground h-5 w-5' />
                    </div>
                  </Avatar>
                  <div className='ml-4 flex flex-col gap-0.5'>
                    <p className='text-xs leading-5 font-medium'>
                      {alert.title}
                    </p>
                    <p className='text-muted-foreground flex gap-1 text-[10px]'>
                      <span>{alert.time}</span>
                      <span>•</span>
                      <span>{alert.location}</span>
                    </p>
                  </div>
                  <div className='ml-auto font-medium'>
                    <Badge variant={alert.statusVariant}>{alert.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
