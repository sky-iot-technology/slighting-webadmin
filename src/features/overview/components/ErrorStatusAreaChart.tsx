'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/ui/components/ui/chart';
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import React from 'react';
import { delay } from '@/core/shared/constants/mock-api';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
];

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  desktop: {
    label: 'Desktop',
    color: '#ff4d4f'
  },
  mobile: {
    label: 'Mobile',
    color: '#24a4b9'
  }
} satisfies ChartConfig;

export function ErrorStatusAreaChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className='aspect-auto h-[400px] w-full'
    >
      <AreaChart
        data={chartData}
        margin={{
          right: 12,
          left: 12
        }}
      >
        <defs>
          <linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
            <stop
              offset='5%'
              stopColor='var(--color-desktop)'
              stopOpacity={1.0}
            />
            <stop
              offset='95%'
              stopColor='var(--color-desktop)'
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id='fillMobile' x1='0' y1='0' x2='0' y2='1'>
            <stop
              offset='5%'
              stopColor='var(--color-mobile)'
              stopOpacity={0.8}
            />
            <stop
              offset='95%'
              stopColor='var(--color-mobile)'
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray='3 3' />
        <XAxis
          dataKey='month'
          tickLine={false}
          axisLine={true}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} width={30} />
        <Legend />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator='line' />}
        />
        <Area
          dataKey='mobile'
          type='natural'
          fill='url(#fillMobile)'
          stroke='var(--color-mobile)'
          fillOpacity={1}
          stackId='a'
        />
        <Area
          dataKey='desktop'
          type='natural'
          fill='url(#fillDesktop)'
          stroke='var(--color-desktop)'
          fillOpacity={1}
          stackId='a'
        />
      </AreaChart>
    </ChartContainer>
  );
}
