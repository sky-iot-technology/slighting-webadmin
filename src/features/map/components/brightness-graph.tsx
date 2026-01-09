'use client';

import * as React from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  ComposedChart,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { useTranslation } from '@/core/domains/language/useTranslation';

export const description = 'An interactive bar chart';

const chartData = [
  { time: '00:00', brightness: 60, status: 'on' },
  { time: '01:00', brightness: 55, status: 'on' },
  { time: '02:00', brightness: 50, status: 'on' },
  { time: '03:00', brightness: 45, status: 'on' },
  { time: '04:00', brightness: 70, status: 'on' },
  { time: '05:00', brightness: 80, status: 'on' },
  { time: '06:00', brightness: 90, status: 'on' },

  { time: '07:00', status: 'off' },
  { time: '08:00', status: 'off' },
  { time: '09:00', status: 'off' },
  { time: '10:00', status: 'off' },
  { time: '11:00', status: 'off' },
  { time: '12:00', status: 'off' },
  { time: '13:00', status: 'off' },
  { time: '14:00', status: 'off' },
  { time: '15:00', status: 'off' },
  { time: '16:00', status: 'off' },
  // { time: "17:00", status: "off" },

  { time: '18:00', brightness: 100, status: 'on' },
  { time: '18:30', brightness: 100, status: 'on' },
  { time: '19:00', brightness: 95, status: 'on' },
  { time: '20:00', brightness: 85, status: 'on' },
  { time: '21:00', brightness: 80, status: 'on' },
  { time: '22:00', brightness: 80, status: 'on' },
  { time: '23:00', brightness: 80, status: 'on' },
  { time: '24:00', brightness: 80, status: 'on' }
];

export function BrightnessGraph() {
  const { t } = useTranslation();
  const CustomLegend = () => (
    <div className='mt-1 flex items-center justify-center gap-7 text-[10px] leading-5'>
      <div className='flex items-center gap-2'>
        <span className='bg-map-control-button-success inline-block h-2.5 w-2.5 rounded-[50%]' />
        <span>{t('map.chart_onl')}</span>
      </div>
      <div className='flex items-center gap-2'>
        <span className='bg-map-control-button-destructive inline-block h-2.5 w-2.5 rounded-[50%]' />
        <span>{t('map.chart_off')}</span>
      </div>
      <div className='flex items-center gap-2'>
        <span className='bg-primary inline-block h-2.5 w-2.5 rounded-[50%]' />
        <span>{t('map.chart_brightness')}</span>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, label, payload }: any) => {
    if (!active || !payload?.length) return null;

    const { brightness, status } = payload[0].payload;
    const statusText =
      status === 'on' ? 'Bật' : status === 'off' ? 'Tắt' : undefined;
    const statusColor =
      status === 'on' ? 'text-map-control-button-success' : 'text-red-500';

    return (
      <div className='rounded-lg bg-[linear-gradient(144deg,var(--map-gradient-start)_21.04%,var(--map-gradient-end)_47.8%)] p-2 text-[8px]'>
        <div className='mb-1 text-[10px] font-medium'>{label}</div>

        {typeof brightness === 'number' && (
          <div className='mb-1'>
            {t('map.chart_brightness')}:{' '}
            <span className='text-blue-600'>{brightness}%</span>
          </div>
        )}

        {statusText && (
          <div>
            {t('map.chart_status')}:{' '}
            <span className={`${statusColor}`}>{statusText}</span>
          </div>
        )}
      </div>
    );
  };

  const ticksX = ['00:00', '06:00', '12:00', '18:00'];

  return (
    <Card className='bg-inherited @container/card gap-1 border-0 !pt-1 shadow-none'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-0 !p-0 sm:flex-row'>
        <div className='gap-0 pr-[5px] pb-[4px] pl-[15px]'>
          <CardTitle className='mt-1 pt-1 text-xs font-bold'>
            {t('map.chart_title')}
          </CardTitle>
        </div>
      </CardHeader>
      <CardHeader className='flex items-center justify-end p-0'>
        <div className='bg-map-button-graph flex h-[18px] w-[51px] items-center justify-center rounded-[4px]'>
          <Button
            size={'sm'}
            className='h-3.5 w-12 rounded-[4px] !bg-[linear-gradient(180deg,var(--map-button-today-start)_0%,var(--map-button-today-end)_100%)] text-[10px]'
          >
            {t('map.chart_day')}
          </Button>
        </div>
      </CardHeader>

      <CardContent className='h-[200px] overflow-y-auto px-2'>
        <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart data={chartData}>
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend
              verticalAlign='bottom'
              align='center'
              content={<CustomLegend />}
            />

            <XAxis
              dataKey='time'
              ticks={ticksX}
              scale='band'
              tickMargin={8}
              className='text-[10px]'
              axisLine={true}
              tickLine={true}
              domain={[0, 'dataMax + 1']}
              padding={{ left: 0, right: 0 }}
            />

            <YAxis
              domain={[0, 105]}
              ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              tickFormatter={(v) => {
                return [10, 30, 50, 70, 90].includes(v) ? '' : `${v}%`;
              }}
              className='text-[10px]'
              width={30}
            />

            {/* Cột độ sáng */}
            <Bar
              dataKey='brightness'
              name='Độ sáng'
              barSize={18}
              radius={[2, 2, 0, 0]}
              className='fill-primary'
            >
              <LabelList
                dataKey='brightness'
                position='top'
                content={(props: any) => {
                  const { x, y, index } = props;
                  if (typeof x === 'number' && typeof y === 'number') {
                    const isOn = chartData[index]?.status === 'on';
                    const color = isOn
                      ? 'fill-map-control-button-success'
                      : 'fill-map-control-button-destructive';
                    return (
                      <circle cx={x + 6} cy={0 + 3} r={3} className={color} />
                    );
                  }
                  return null;
                }}
              />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
