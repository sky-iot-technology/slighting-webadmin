import PageContainer from '@/ui/components/layout/page-container';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { StatCard } from '../../../features/overview/components/stat-card';

const stats = [
  {
    icon: '/assets/icons/total-device.svg',
    label: 'Tổng thiết bị',
    value: '1.247',
    trend: 5.2,
    shadow: '!shadow-primary',
    trendType: 'up' as const,
    bgColor: 'bg-card-primary'
  },
  {
    icon: '/assets/icons/online.svg',
    label: 'Thiết bị Online',
    value: '1.089',
    trend: 5.2,
    shadow: '!shadow-success',
    trendType: 'up' as const,
    bgColor: 'bg-card-success'
  },
  {
    icon: '/assets/icons/offline.svg',
    label: 'Thiết bị Offline',
    value: '1.221',
    trend: 1.8,
    shadow: '!shadow-default',
    trendType: 'down' as const
  },
  {
    icon: '/assets/icons/alert.svg',
    label: 'Cảnh báo lỗi',
    value: '23',
    trend: 5.2,
    shadow: '!shadow-danger',
    trendType: 'down' as const,
    bgColor: 'bg-card-danger'
  }
];

export default function Overview2({
  simple_stats,
  alert_stats,
  circle_stats
}: {
  simple_stats: React.ReactNode;
  alert_stats: React.ReactNode;
  circle_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2 bg-white'>
        <div className='my-[9px] mr-[22px] flex items-center justify-end space-y-2'>
          <Select defaultValue='All'>
            <SelectTrigger className='h-[30px] w-[96px] rounded-sm px-2 text-sm leading-[15px] shadow-none'>
              <SelectValue placeholder='Select Device' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Today'>Today</SelectItem>
              <SelectItem value='This Week'>This Week</SelectItem>
              <SelectItem value='This Month'>This Month</SelectItem>
              <SelectItem value='This Year'>This Year</SelectItem>
              <SelectItem value='All'>All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='dark:*:data-[slot=card]:bg-card mr-[22px] ml-[28px] grid grid-cols-1 gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div>{simple_stats}</div>

        <div className='mr-[22px] ml-[28px] grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='col-span-1'>{circle_stats}</div>
          <div className='col-span-1'>{alert_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
