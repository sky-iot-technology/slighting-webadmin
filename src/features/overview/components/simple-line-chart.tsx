'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { ErrorStatusBarChart } from './ErrorStatusBarChart';
import { ErrorStatusPieChart } from './ErrorStatusPieChart';
import React from 'react';
import { ErrorStatusAreaChart } from './ErrorStatusAreaChart';
import Image from 'next/image';

export function SimpleLineChart() {
  const [chartType, setChartType] = React.useState('area');
  return (
    <Card className='!shadow-simple pb- @container/card my-4 mr-[22px] ml-[28px] gap-0.5 border-none px-0 py-0'>
      <CardHeader className='mt-[12px] mr-[3px] ml-[12px] flex items-center justify-between space-y-0 px-0 py-0 pb-2'>
        <div className='flex items-center space-x-3.5'>
          <Image
            src={'/assets/icons/warning.svg'}
            alt='warning'
            width={24}
            height={24}
            className='size-6'
          />
          <CardTitle className='text-sm leading-5 font-bold'>
            Tình trạng xử lý lỗi trong tuần
          </CardTitle>
        </div>
        <div className='flex items-center space-x-[3px] text-sm leading-[15px]'>
          <Select defaultValue='All'>
            <SelectTrigger className='h-[30px] w-[96px] rounded-sm px-2 shadow-none'>
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
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className='h-[30px] w-[111px] rounded-sm px-2 shadow-none'>
              <SelectValue placeholder='Select Device' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='area'>Area Chart</SelectItem>
              <SelectItem value='barline'>Bar-Line Chart</SelectItem>
              <SelectItem value='pie'>Pie Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className='px-4 py-4 sm:px-4 sm:pt-6'>
        {chartType === 'area' && <ErrorStatusAreaChart />}
        {chartType === 'barline' && <ErrorStatusBarChart />}
        {chartType === 'pie' && <ErrorStatusPieChart />}
      </CardContent>
    </Card>
  );
}
