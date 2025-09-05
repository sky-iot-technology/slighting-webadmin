'use client';

import * as React from 'react';
import { IconChartPie3, IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/ui/components/ui/chart';
import Image from 'next/image';

const chartData = [
  { browser: 'chrome', visitors: 275, fill: '#93c5fd' }, // blue-300
  { browser: 'safari', visitors: 200, fill: '#c4b5fd' }, // violet-300
  { browser: 'firefox', visitors: 287, fill: '#f9a8d4' }, // pink-300
  { browser: 'edge', visitors: 173, fill: '#6ee7b7' }, // emerald-300
  { browser: 'other', visitors: 190, fill: '#fcd34d' } // amber-300
];

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  chrome: {
    label: 'Chrome',
    color: 'var(--primary)'
  },
  safari: {
    label: 'Safari',
    color: 'var(--primary)'
  },
  firefox: {
    label: 'Firefox',
    color: 'var(--primary)'
  },
  edge: {
    label: 'Edge',
    color: 'var(--primary)'
  },
  other: {
    label: 'Other',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function DeviceTypePieChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className='!shadow-pie-chart @container/card border-none py-3'>
      <CardHeader className='mx-3 px-0'>
        <div className='flex items-center gap-3.5 py-2'>
          <Image
            src={'/assets/icons/distribute.svg'}
            alt='warning'
            width={24}
            height={24}
            className='size-6'
          />
          <CardTitle className='text-sm font-bold'>
            Phân bố thiết bị theo loại
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {chartData.map(({ browser, fill }) => (
                <linearGradient
                  key={browser}
                  id={`fill${browser}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop offset='0%' stopColor={fill} stopOpacity={1} />
                  <stop offset='100%' stopColor={fill} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill: `url(#fill${item.browser})`
              }))}
              dataKey='visitors'
              nameKey='browser'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        {/* <div className="grid grid-cols-2 gap-4 w-full pb-2 justify-items-center">
            {chartData.map((item) => (
                <div key={item.browser} className="flex items-center gap-2">
                    <span
                    className="h-3 w-3 rounded-sm"
                    style={{ background: item.fill }}
                    />
                    <span className="capitalize">{item.browser}</span>
                </div>
            ))}
        </div> */}
        <div className='flex items-center gap-2 leading-none font-medium'>
          Chrome leads with{' '}
          {((chartData[0].visitors / totalVisitors) * 100).toFixed(1)}%{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Based on data from January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
