'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Device } from '@/core/domains/devices';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/ui/components/ui/card';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { DateInput } from '@/ui/components/ui/date-input';
import { Tabs, TabsList, TabsTrigger } from '@/ui/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Calendar,
  CreditCard,
  DollarSign,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface AnalysisTabProps {
  device: Device;
}

export function AnalysisTab({ device }: AnalysisTabProps) {
  // Date range state
  const todayStr = new Date().toISOString().split('T')[0];
  const thirtyDaysAgoStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgoStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');

  // Billing parameters state (with local storage persistence)
  const [unitPrice, setUnitPrice] = useState<number>(2500); // 2500 VND/kWh default

  // Load from localStorage on mount
  useEffect(() => {
    const savedPrice = localStorage.getItem('cb_billing_unit_price');
    if (savedPrice) setUnitPrice(Number(savedPrice));
  }, []);

  // Save to localStorage when changed
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setUnitPrice(val);
    localStorage.setItem('cb_billing_unit_price', String(val));
  };

  // Helper date parsing/formatting functions for custom DateInput
  const parseDate = (str: string) => {
    const d = new Date(str);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Calculate days difference
  const diffDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  }, [startDate, endDate]);

  // Validation flag for too long date range to protect backend
  const isRangeTooLong = useMemo(() => {
    if (viewMode === 'day') {
      return diffDays > 31;
    } else {
      return diffDays > 365;
    }
  }, [viewMode, diffDays]);

  // Generate deterministic mock energy consumption based on date range
  const chartData = useMemo(() => {
    if (isRangeTooLong) {
      return [];
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Safety checks
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return [];
    }

    const data: {
      label: string;
      dateKey: string;
      kwh: number;
      costBeforeTax: number;
      vat: number;
      totalCost: number;
    }[] = [];
    const current = new Date(start);

    // Limit generation to max 365 days to avoid browser crash
    let limit = 0;
    while (current <= end && limit < 365) {
      const dateKey = current.toISOString().split('T')[0];

      // Pseudo-random but consistent daily consumption based on day of month/week
      const day = current.getDate();
      const baseVal = 10 + (day % 7) * 3 + (day % 3) * 5;
      const kwh = parseFloat(baseVal.toFixed(1));

      const totalCost = kwh * unitPrice;

      data.push({
        label: dateKey,
        dateKey,
        kwh,
        costBeforeTax: totalCost,
        vat: 0,
        totalCost
      });

      current.setDate(current.getDate() + 1);
      limit++;
    }

    if (viewMode === 'day') {
      return data.map((d) => ({
        ...d,
        label: new Date(d.dateKey).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit'
        })
      }));
    } else {
      // Group by month
      const monthlyGroups: Record<
        string,
        { kwh: number; costBeforeTax: number; vat: number; totalCost: number }
      > = {};

      data.forEach((d) => {
        const monthKey = d.dateKey.substring(0, 7); // YYYY-MM
        if (!monthlyGroups[monthKey]) {
          monthlyGroups[monthKey] = {
            kwh: 0,
            costBeforeTax: 0,
            vat: 0,
            totalCost: 0
          };
        }
        monthlyGroups[monthKey].kwh += d.kwh;
        monthlyGroups[monthKey].costBeforeTax += d.costBeforeTax;
        monthlyGroups[monthKey].vat += d.vat;
        monthlyGroups[monthKey].totalCost += d.totalCost;
      });

      return Object.entries(monthlyGroups).map(([monthKey, vals]) => {
        const [year, month] = monthKey.split('-');
        return {
          label: `Tháng ${month}/${year}`,
          dateKey: monthKey,
          kwh: parseFloat(vals.kwh.toFixed(1)),
          costBeforeTax: Math.round(vals.costBeforeTax),
          vat: 0,
          totalCost: Math.round(vals.totalCost)
        };
      });
    }
  }, [startDate, endDate, viewMode, unitPrice, isRangeTooLong]);

  // Aggregate stats
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => {
        acc.kwh += curr.kwh;
        acc.costBeforeTax += curr.costBeforeTax;
        acc.vat += curr.vat;
        acc.totalCost += curr.totalCost;
        return acc;
      },
      { kwh: 0, costBeforeTax: 0, vat: 0, totalCost: 0 }
    );
  }, [chartData]);

  // Formatter for currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(val);
  };

  // Formatter for displaying date ranges nicely in title
  const formatDateString = (str: string) => {
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className='flex flex-1 flex-col space-y-6 p-2 md:p-6'>
      {/* Settings and Filters Layout */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Billing Configuration Card */}
        <Card className='dark:bg-card shadow-xs'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wider uppercase'>
              <CreditCard className='text-primary h-4 w-4' />
              Cấu hình tính tiền điện
            </CardTitle>
            <CardDescription>
              Cài đặt các thông số áp dụng tính tiền điện tiêu thụ cho CB.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='max-w-md space-y-2'>
              <Label htmlFor='unit-price' className='text-xs font-semibold'>
                Đơn giá điện (VND / kWh)
              </Label>
              <div className='relative flex items-center'>
                <Input
                  id='unit-price'
                  type='number'
                  min='0'
                  step='100'
                  value={unitPrice}
                  onChange={handlePriceChange}
                  className='pr-12'
                />
                <span className='text-muted-foreground absolute right-3 text-xs font-medium'>
                  đ/kWh
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Filter Card */}
        <Card className='dark:bg-card shadow-xs'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wider uppercase'>
              <Calendar className='text-primary h-4 w-4' />
              Lọc khoảng thời gian
            </CardTitle>
            <CardDescription>
              Chọn phạm vi thời gian hiển thị điện năng đo được.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* View Mode Toggle Tabs */}
            <Tabs
              value={viewMode}
              onValueChange={(val) => setViewMode(val as 'day' | 'month')}
              className='w-full'
            >
              <TabsList className='bg-muted/70 grid w-full grid-cols-2 rounded-lg border border-slate-100 p-1 dark:border-slate-800'>
                <TabsTrigger
                  value='day'
                  className='cursor-pointer rounded-md py-1.5 text-xs font-bold'
                >
                  Theo ngày
                </TabsTrigger>
                <TabsTrigger
                  value='month'
                  className='cursor-pointer rounded-md py-1.5 text-xs font-bold'
                >
                  Theo tháng
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='start-date' className='text-xs font-semibold'>
                  Từ ngày
                </Label>
                <DateInput
                  value={parseDate(startDate)}
                  onChange={(date) => {
                    if (date) setStartDate(formatDate(date));
                  }}
                  placeholder='Chọn ngày bắt đầu'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='end-date' className='text-xs font-semibold'>
                  Đến ngày
                </Label>
                <DateInput
                  value={parseDate(endDate)}
                  onChange={(date) => {
                    if (date) setEndDate(formatDate(date));
                  }}
                  placeholder='Chọn ngày kết thúc'
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards section */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {/* Total Energy consumption card */}
        <Card className='border-none bg-gradient-to-tr from-blue-50 to-white shadow-xs dark:from-slate-900 dark:to-slate-950'>
          <CardContent className='flex items-center justify-between p-4'>
            <div className='space-y-1.5'>
              <p className='text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400'>
                Điện năng tiêu thụ
              </p>
              <p className='text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
                {totals.kwh.toLocaleString('vi-VN')} kWh
              </p>
            </div>
            <div className='rounded-full bg-blue-100 p-2.5 dark:bg-blue-900/30'>
              <Zap className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            </div>
          </CardContent>
        </Card>

        {/* Total bill card */}
        <Card className='border-none bg-gradient-to-tr from-emerald-50 to-white shadow-xs dark:from-emerald-950/20 dark:to-slate-950'>
          <CardContent className='flex items-center justify-between p-4'>
            <div className='space-y-1.5'>
              <p className='text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400'>
                Tổng thành tiền điện
              </p>
              <p className='text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
                {formatCurrency(totals.totalCost)}
              </p>
            </div>
            <div className='rounded-full bg-emerald-100 p-2.5 dark:bg-emerald-900/30'>
              <DollarSign className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Electricity consumption Bar Chart */}
      <Card className='dark:bg-card shadow-xs'>
        <CardHeader className='border-b pb-4'>
          <div className='space-y-1'>
            <CardTitle className='text-base font-bold'>
              Biểu đồ Điện năng tiêu thụ (
              {viewMode === 'day' ? 'Theo ngày' : 'Theo tháng'})
            </CardTitle>
            <CardDescription>
              Điện năng đo được từ CB (từ {formatDateString(startDate)} đến{' '}
              {formatDateString(endDate)}).
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          {isRangeTooLong ? (
            <div className='flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50/50 p-6 text-center dark:border-amber-900/40 dark:bg-amber-950/10'>
              <AlertTriangle className='mb-2 h-10 w-10 animate-bounce text-amber-600 dark:text-amber-400' />
              <h4 className='text-sm font-bold text-amber-900 dark:text-amber-400'>
                Khoảng thời gian hiển thị quá lớn ({diffDays} ngày)
              </h4>
              <p className='mt-1 max-w-sm text-xs leading-5 text-amber-700 dark:text-amber-500'>
                {viewMode === 'day'
                  ? 'Để đảm bảo hiệu năng và tránh quá tải hệ thống, chế độ xem "Theo ngày" chỉ hỗ trợ tối đa 31 ngày. Vui lòng rút ngắn khoảng ngày hoặc chuyển sang chế độ "Theo tháng".'
                  : 'Để đảm bảo hiệu năng và tránh quá tải hệ thống, chế độ xem "Theo tháng" chỉ hỗ trợ tối đa 365 ngày (1 năm). Vui lòng rút ngắn khoảng thời gian.'}
              </p>
            </div>
          ) : (
            <div className='h-[350px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id='barGradient'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop
                        offset='0%'
                        stopColor='var(--primary)'
                        stopOpacity={0.95}
                      />
                      <stop
                        offset='100%'
                        stopColor='var(--primary)'
                        stopOpacity={0.25}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray='3 3'
                    stroke='rgba(0,0,0,0.06)'
                  />
                  <XAxis
                    dataKey='label'
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    tickMargin={8}
                    unit=' kWh'
                  />
                  <Tooltip
                    cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className='rounded-lg border border-slate-100 bg-white p-3 shadow-md dark:border-slate-800 dark:bg-slate-900'>
                            <p className='mb-1.5 text-xs font-bold text-slate-800 dark:text-slate-200'>
                              {data.label}
                            </p>
                            <div className='space-y-1 text-xs'>
                              <div className='flex items-center justify-between gap-4'>
                                <span className='text-muted-foreground'>
                                  Điện năng:
                                </span>
                                <span className='text-primary font-bold'>
                                  {data.kwh} kWh
                                </span>
                              </div>
                              <div className='flex items-center justify-between gap-4'>
                                <span className='text-muted-foreground'>
                                  Thành tiền:
                                </span>
                                <span className='font-bold text-emerald-600 dark:text-emerald-400'>
                                  {formatCurrency(data.totalCost)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey='kwh'
                    fill='url(#barGradient)'
                    radius={[4, 4, 0, 0]}
                    name='Điện năng'
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
