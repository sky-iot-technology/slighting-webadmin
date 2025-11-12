'use client';

import { Device } from '@/core/domains/devices';
import { StatCard } from '@/features/overview/components/stat-card';
import { SimpleLineChart } from '@/features/overview/components/simple-line-chart';
import { DeviceTypePieChart } from '@/features/overview/components/DeviceTypePieChart';
import { RecentAlerts } from '@/features/overview/components/recent-alerts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { Button } from '@/ui/components/ui/button';
import { Download } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AnalysisTabProps {
  device: Device;
}

const analysisStats = [
  {
    icon: '/assets/icons/total-device.svg',
    label: 'Điện năng tiêu thụ',
    value: '12.5 kWh',
    trend: 8,
    shadow: '!shadow-primary',
    trendType: 'up' as const,
    bgColor: 'bg-card-primary'
  },
  {
    icon: '/assets/icons/online.svg',
    label: 'Độ sáng trung bình',
    value: '85%',
    trend: 0,
    shadow: '!shadow-success',
    trendType: 'up' as const,
    bgColor: 'bg-card-success'
  },
  {
    icon: '/assets/icons/offline.svg',
    label: 'Thời gian hoạt động',
    value: '8.5h',
    trend: 0,
    shadow: '!shadow-default',
    trendType: 'up' as const
  },
  {
    icon: '/assets/icons/alert.svg',
    label: 'Hiệu suất',
    value: '98.2%',
    trend: 0,
    shadow: '!shadow-danger',
    trendType: 'up' as const,
    bgColor: 'bg-card-danger'
  }
];

export function AnalysisTab({ device: _device }: AnalysisTabProps) {
  return (
    <div className='flex flex-1 flex-col space-y-2 bg-white'>
      {/* Time period selector */}
      <div className='my-[9px] mr-[22px] flex items-center justify-end space-y-2'>
        <Select defaultValue='7days'>
          <SelectTrigger className='h-[30px] w-[96px] rounded-sm px-2 text-sm leading-[15px] shadow-none'>
            <SelectValue placeholder='Select period' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='today'>Hôm nay</SelectItem>
            <SelectItem value='7days'>7 ngày</SelectItem>
            <SelectItem value='30days'>30 ngày</SelectItem>
            <SelectItem value='90days'>90 ngày</SelectItem>
            <SelectItem value='all'>Tất cả</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className='dark:*:data-[slot=card]:bg-card mr-[22px] ml-[28px] grid grid-cols-1 gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
        {analysisStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Chart Section */}
      <div className=''>
        <SimpleLineChart />
      </div>

      {/* Bottom Section - Two Columns */}
      <div className='mr-[22px] mb-[26px] ml-[28px] grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='col-span-1'>
          <DeviceTypePieChart />
        </div>
        <div className='col-span-1'>
          <RecentAlerts />
        </div>
      </div>

      {/* Export Report Button */}
      <div className='mr-[22px] mb-[26px] ml-[28px] flex justify-end'>
        <Button className='bg-green-600 hover:bg-green-700'>
          <Download className='mr-2 h-4 w-4' />
          Xuất báo cáo
        </Button>
      </div>
    </div>
  );
}
