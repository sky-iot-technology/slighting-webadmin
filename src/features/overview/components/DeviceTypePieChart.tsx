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
import { useGetOverView } from '@/core/domains/overview/hooks';
import { useTranslation } from '@/core/domains/language/useTranslation';

const colors = [
  '#93c5fd',
  '#c4b5fd',
  '#f9a8d4',
  '#6ee7b7',
  '#fcd34d',
  '#fdba74',
  '#fca5a5'
];

export function DeviceTypePieChart() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetOverView();
  if (!data || !data.device_distribution_by_type) {
    return <div>{t('general.loading')}</div>;
  }

  const chartData = data.device_distribution_by_type.map((item, index) => ({
    name: item.type_name,
    value: item.count,
    fill: colors[index % colors.length]
  }));

  const totalCount = chartData.reduce((acc, cur) => acc + cur.value, 0);

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
            {t('dashboard.piechart')}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={{}} className='mx-auto aspect-square h-[250px]'>
          <PieChart>
            {/* <defs>
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
            </defs> */}
            <ChartTooltip
              cursor={false}
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const { name, value } = payload[0];

                return (
                  <div className='rounded-md bg-white px-2 py-1 text-xs shadow'>
                    <div className='font-semibold'>{name}</div>
                    <div>{value} thiết bị</div>
                  </div>
                );
              }}
            />
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
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
                          {totalCount}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          {t('dashboard.allDevice')}
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
        {/* {!isLoading && (
          <>
            <div className='grid grid-cols-2 gap-4 w-full pb-2'>
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className='flex items-center gap-2'
                >
                  <span
                    className='h-3 w-3 rounded-sm'
                    style={{ background: item.fill }}
                  />
                  <span className='truncate'>{item.name}</span>
                </div>
              ))}
            </div>

            <div className='flex items-center gap-2 leading-none font-medium'>
              Loại phổ biến nhất:{' '}
              {chartData[0].name} ({chartData[0].value})
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground leading-none'>
              Thống kê hiện tại
            </div>
          </>
        )} */}
      </CardFooter>
    </Card>
  );
}
