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

export function ErrorStatusPieChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <ChartContainer
      config={chartConfig}
      className='mx-auto aspect-square h-[400px]'
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
  );
}
