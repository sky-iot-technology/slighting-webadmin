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
import { useTranslation } from '@/core/domains/language/useTranslation';

export function SimpleLineChart() {
  const { t } = useTranslation();
  const [chartType, setChartType] = React.useState('area');
  return (
    <Card className='!shadow-simple pb- dark:bg-card-primary @container/card my-4 mr-[22px] ml-[28px] gap-0.5 border-none px-0 py-0'>
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
            {t('dashboard.status')}
          </CardTitle>
        </div>
        <div className='flex items-center space-x-[3px] text-sm leading-[15px]'>
          <Select defaultValue='All'>
            <SelectTrigger className='h-[30px] rounded-sm px-2 shadow-none'>
              <SelectValue placeholder={t('dashboard.select_period' as any)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Today'>
                {t('dashboard.today' as any)}
              </SelectItem>
              <SelectItem value='This Week'>
                {t('dashboard.this_week' as any)}
              </SelectItem>
              <SelectItem value='This Month'>
                {t('dashboard.this_month' as any)}
              </SelectItem>
              <SelectItem value='This Year'>
                {t('dashboard.this_year' as any)}
              </SelectItem>
              <SelectItem value='All'>{t('dashboard.all' as any)}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className='h-[30px] rounded-sm px-2 shadow-none'>
              <SelectValue
                placeholder={t('dashboard.select_chart_type' as any)}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='area'>
                {t('dashboard.area_chart' as any)}
              </SelectItem>
              <SelectItem value='barline'>
                {t('dashboard.bar_line_chart' as any)}
              </SelectItem>
              <SelectItem value='pie'>
                {t('dashboard.pie_chart_option' as any)}
              </SelectItem>
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
