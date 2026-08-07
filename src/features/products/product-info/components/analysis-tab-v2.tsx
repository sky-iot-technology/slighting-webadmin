'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Device } from '@/core/domains/devices';
import { Input } from '@/ui/components/ui/input';
import { DateInput } from '@/ui/components/ui/date-input';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  Zap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Settings2,
  AlertTriangle,
  Activity,
  BarChart3,
  Flame,
  Sparkles
} from 'lucide-react';

interface AnalysisTabV2Props {
  device: Device;
}

// ─── Animated counter hook (Safe & Optimized) ─────────────────────────────────
function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const lastValRef = useRef(0);

  useEffect(() => {
    const validTarget = Number.isFinite(target) ? target : 0;
    if (validTarget === 0) {
      setValue(0);
      lastValRef.current = 0;
      return;
    }

    let start: number | null = null;
    let rafId: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const nextVal = Math.round(validTarget * ease);

      if (nextVal !== lastValRef.current) {
        lastValRef.current = nextVal;
        setValue(nextVal);
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [target, duration]);

  return value;
}

// ─── Quick preset buttons ─────────────────────────────────────────────────────
const PRESETS = [
  { label: '7N', days: 7 },
  { label: '14N', days: 14 },
  { label: '30N', days: 30 }
];

export function AnalysisTabV2({ device }: AnalysisTabV2Props) {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const thirtyDaysAgoStr = useMemo(
    () =>
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    []
  );

  const [startDate, setStartDate] = useState(thirtyDaysAgoStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
  const [unitPrice, setUnitPrice] = useState<number>(2500);
  const [activeChart, setActiveChart] = useState<'area' | 'bar'>('area');

  // localStorage sync
  useEffect(() => {
    const saved = localStorage.getItem('cb_billing_unit_price');
    if (saved) setUnitPrice(Number(saved));
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setUnitPrice(val);
    localStorage.setItem('cb_billing_unit_price', String(val));
  };

  const parseDate = (str: string) => {
    const d = new Date(str);
    return isNaN(d.getTime()) ? new Date() : d;
  };
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const applyPreset = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000);
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
    setViewMode('day');
  };

  const diffDays = useMemo(() => {
    const s = new Date(startDate),
      e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return 0;
    return Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1;
  }, [startDate, endDate]);

  const isRangeTooLong = useMemo(
    () => (viewMode === 'day' ? diffDays > 31 : diffDays > 365),
    [viewMode, diffDays]
  );

  // ─── Chart data generation ──────────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (isRangeTooLong) return [];
    const s = new Date(startDate),
      e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return [];

    const raw: {
      label: string;
      dateKey: string;
      kwh: number;
      totalCost: number;
    }[] = [];
    const cur = new Date(s);
    let limit = 0;
    while (cur <= e && limit < 365) {
      const dateKey = cur.toISOString().split('T')[0];
      const day = cur.getDate();
      const kwh = parseFloat((10 + (day % 7) * 3 + (day % 3) * 5).toFixed(1));
      raw.push({
        label: dateKey,
        dateKey,
        kwh,
        totalCost: Math.round(kwh * unitPrice)
      });
      cur.setDate(cur.getDate() + 1);
      limit++;
    }

    if (viewMode === 'day') {
      return raw.map((d) => ({
        ...d,
        label: new Date(d.dateKey).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit'
        })
      }));
    }

    // Group by month
    const groups: Record<string, { kwh: number; totalCost: number }> = {};
    raw.forEach((d) => {
      const mk = d.dateKey.substring(0, 7);
      if (!groups[mk]) groups[mk] = { kwh: 0, totalCost: 0 };
      groups[mk].kwh += d.kwh;
      groups[mk].totalCost += d.totalCost;
    });
    return Object.entries(groups).map(([mk, v]) => {
      const [year, month] = mk.split('-');
      return {
        label: `T${month}/${year}`,
        dateKey: mk,
        kwh: parseFloat(v.kwh.toFixed(1)),
        totalCost: Math.round(v.totalCost)
      };
    });
  }, [startDate, endDate, viewMode, unitPrice, isRangeTooLong]);

  const totals = useMemo(
    () =>
      chartData.reduce(
        (a, c) => ({
          kwh: a.kwh + c.kwh,
          totalCost: a.totalCost + c.totalCost
        }),
        { kwh: 0, totalCost: 0 }
      ),
    [chartData]
  );

  // Peak / average
  const peakKwh = useMemo(
    () => (chartData.length ? Math.max(...chartData.map((d) => d.kwh)) : 0),
    [chartData]
  );
  const avgKwh = useMemo(
    () => (chartData.length ? totals.kwh / chartData.length : 0),
    [chartData, totals]
  );

  // Animated KPI counters
  const animKwh = useCountUp(Math.round(totals.kwh));
  const animCost = useCountUp(totals.totalCost);
  const animPeak = useCountUp(Math.round(peakKwh));
  const animAvg = useCountUp(Math.round(avgKwh));

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(val);

  const formatDateLabel = (str: string) => {
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Color per bar based on value vs average
  const getBarColor = (kwh: number) => (kwh > avgKwh ? '#f97316' : '#3b82f6');

  // ─── Custom tooltip ─────────────────────────────────────────────────────────
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className='min-w-[160px] rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md'>
        <p className='mb-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase'>
          {d.label}
        </p>
        <div className='space-y-1.5'>
          <div className='flex items-center justify-between gap-6'>
            <span className='flex items-center gap-1.5 text-xs text-slate-400'>
              <Zap className='h-3 w-3 text-blue-400' />
              Điện năng
            </span>
            <span className='text-xs font-bold text-blue-300'>{d.kwh} kWh</span>
          </div>
          <div className='flex items-center justify-between gap-6'>
            <span className='flex items-center gap-1.5 text-xs text-slate-400'>
              <DollarSign className='h-3 w-3 text-emerald-400' />
              Thành tiền
            </span>
            <span className='text-xs font-bold text-emerald-300'>
              {formatCurrency(d.totalCost)}
            </span>
          </div>
          <div className='mt-1 border-t border-white/10 pt-1'>
            <div className='flex items-center gap-1 text-[10px]'>
              {d.kwh > avgKwh ? (
                <>
                  <TrendingUp className='h-3 w-3 text-orange-400' />
                  <span className='text-orange-400'>Trên TB</span>
                </>
              ) : (
                <>
                  <TrendingDown className='h-3 w-3 text-sky-400' />
                  <span className='text-sky-400'>Dưới TB</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── KPI card ───────────────────────────────────────────────────────────────
  const KPICard = ({
    icon: Icon,
    label,
    value,
    sub,
    gradient,
    iconColor,
    ring
  }: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    sub?: string;
    gradient: string;
    iconColor: string;
    ring: string;
  }) => (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 ${gradient} group border border-white/5 shadow-lg transition-all duration-300 hover:scale-[1.02]`}
    >
      {/* Glow orb */}
      <div
        className={`absolute -top-6 -right-6 h-24 w-24 rounded-full ${ring} opacity-20 blur-2xl transition-opacity group-hover:opacity-35`}
      />
      <div className='relative z-10 flex items-start justify-between'>
        <div className='space-y-1'>
          <p className='text-[10px] font-bold tracking-[0.15em] text-white/50 uppercase'>
            {label}
          </p>
          <p className='text-2xl leading-none font-black text-white'>{value}</p>
          {sub && <p className='mt-0.5 text-[11px] text-white/40'>{sub}</p>}
        </div>
        <div
          className={`rounded-xl p-2.5 ${iconColor} bg-white/10 backdrop-blur-sm`}
        >
          <Icon className='h-5 w-5' />
        </div>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col space-y-6 p-2 md:p-6'>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <div className='rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 p-2 shadow-lg shadow-blue-500/30'>
            <Activity className='h-4 w-4 text-white' />
          </div>
          <div>
            <h2 className='text-base font-black tracking-tight text-slate-900 dark:text-white'>
              Phân tích Điện năng
            </h2>
            <p className='text-muted-foreground text-[11px]'>
              {device.name} · {formatDateLabel(startDate)} –{' '}
              {formatDateLabel(endDate)}
            </p>
          </div>
          <div className='ml-auto'>
            <span className='inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400'>
              <Sparkles className='h-3 w-3' /> LIVE DATA
            </span>
          </div>
        </div>
      </div>

      {/* ── Controls bar ────────────────────────────────────────────── */}
      <div className='bg-card rounded-2xl border border-slate-200 p-4 shadow-sm dark:border-slate-800'>
        <div className='flex flex-wrap items-end gap-4'>
          {/* Date range */}
          <div className='flex min-w-0 flex-1 flex-wrap items-end gap-3'>
            <div className='min-w-[140px] space-y-1.5'>
              <label className='text-muted-foreground flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase'>
                <Calendar className='h-3 w-3' /> Từ ngày
              </label>
              <DateInput
                value={parseDate(startDate)}
                onChange={(d) => {
                  if (d) setStartDate(formatDate(d));
                }}
                placeholder='Từ ngày'
              />
            </div>
            <div className='min-w-[140px] space-y-1.5'>
              <label className='text-muted-foreground flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase'>
                <Calendar className='h-3 w-3' /> Đến ngày
              </label>
              <DateInput
                value={parseDate(endDate)}
                onChange={(d) => {
                  if (d) setEndDate(formatDate(d));
                }}
                placeholder='Đến ngày'
              />
            </div>

            {/* Quick presets */}
            <div className='flex gap-1 pb-0.5'>
              {PRESETS.map((p) => (
                <button
                  key={p.days}
                  onClick={() => applyPreset(p.days)}
                  className='h-9 rounded-lg border border-slate-200 px-3 text-[11px] font-bold text-slate-600 transition-all duration-150 hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-slate-700 dark:text-slate-400'
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* View mode + unit price */}
          <div className='flex items-end gap-3'>
            {/* View mode pills */}
            <div className='space-y-1.5'>
              <label className='text-muted-foreground block text-[10px] font-bold tracking-wider uppercase'>
                Chế độ
              </label>
              <div className='flex h-9 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700'>
                {(['day', 'month'] as const).map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`px-3 text-[11px] font-bold transition-all duration-150 ${
                      viewMode === m
                        ? 'bg-blue-600 text-white'
                        : 'bg-card text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    } ${i === 0 ? '' : 'border-l border-slate-200 dark:border-slate-700'}`}
                  >
                    {m === 'day' ? 'Ngày' : 'Tháng'}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart type toggle */}
            <div className='space-y-1.5'>
              <label className='text-muted-foreground block text-[10px] font-bold tracking-wider uppercase'>
                Biểu đồ
              </label>
              <div className='flex h-9 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700'>
                <button
                  onClick={() => setActiveChart('area')}
                  className={`px-3 transition-all duration-150 ${activeChart === 'area' ? 'bg-indigo-600 text-white' : 'bg-card text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                >
                  <Activity className='h-3.5 w-3.5' />
                </button>
                <button
                  onClick={() => setActiveChart('bar')}
                  className={`border-l border-slate-200 px-3 transition-all duration-150 dark:border-slate-700 ${activeChart === 'bar' ? 'bg-indigo-600 text-white' : 'bg-card text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                >
                  <BarChart3 className='h-3.5 w-3.5' />
                </button>
              </div>
            </div>

            {/* Unit price */}
            <div className='space-y-1.5'>
              <label className='text-muted-foreground flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase'>
                <Settings2 className='h-3 w-3' /> Đơn giá
              </label>
              <div className='relative flex h-9 items-center'>
                <Input
                  type='number'
                  min='0'
                  step='100'
                  value={unitPrice}
                  onChange={handlePriceChange}
                  className='h-9 w-[130px] pr-14 text-xs font-bold'
                />
                <span className='text-muted-foreground absolute right-3 text-[10px] font-bold'>
                  đ/kWh
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────── */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <KPICard
          icon={Zap}
          label='Tổng điện năng'
          value={
            <>
              {animKwh.toLocaleString('vi-VN')}
              <span className='ml-1 text-base font-bold text-white/60'>
                kWh
              </span>
            </>
          }
          sub={`${diffDays} ngày đo lường`}
          gradient='bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600'
          iconColor='text-blue-200'
          ring='bg-blue-400'
        />
        <KPICard
          icon={DollarSign}
          label='Tổng thành tiền'
          value={formatCurrency(animCost)}
          sub={`@ ${unitPrice.toLocaleString('vi-VN')} đ/kWh`}
          gradient='bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600'
          iconColor='text-emerald-200'
          ring='bg-emerald-400'
        />
        <KPICard
          icon={Flame}
          label='Đỉnh tiêu thụ'
          value={
            <>
              {animPeak}
              <span className='ml-1 text-base font-bold text-white/60'>
                kWh
              </span>
            </>
          }
          sub='Ngày tiêu thụ cao nhất'
          gradient='bg-gradient-to-br from-orange-600 via-rose-600 to-pink-600'
          iconColor='text-orange-200'
          ring='bg-orange-400'
        />
        <KPICard
          icon={TrendingUp}
          label='Trung bình / ngày'
          value={
            <>
              {animAvg}
              <span className='ml-1 text-base font-bold text-white/60'>
                kWh
              </span>
            </>
          }
          sub='Mức tiêu thụ trung bình'
          gradient='bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-600'
          iconColor='text-violet-200'
          ring='bg-violet-400'
        />
      </div>

      {/* ── Main Chart ──────────────────────────────────────────────── */}
      <div className='bg-card overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800'>
        {/* Chart header */}
        <div className='flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800'>
          <div>
            <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
              Biểu đồ Điện năng tiêu thụ
            </h3>
            <p className='text-muted-foreground mt-0.5 text-[11px]'>
              {viewMode === 'day'
                ? 'Phân tích theo ngày'
                : 'Phân tích theo tháng'}{' '}
              · <span className='font-semibold text-orange-500'>cam</span> =
              trên TB, <span className='font-semibold text-blue-500'>xanh</span>{' '}
              = dưới TB
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 dark:border-blue-900/40 dark:bg-blue-950/30'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-blue-500' />
              <span className='text-[10px] font-bold text-blue-600 dark:text-blue-400'>
                {chartData.length} điểm dữ liệu
              </span>
            </div>
          </div>
        </div>

        <div className='p-6'>
          {isRangeTooLong ? (
            <div className='flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-6 text-center dark:border-amber-900/40 dark:bg-amber-950/10'>
              <AlertTriangle className='mb-3 h-10 w-10 animate-bounce text-amber-500' />
              <h4 className='text-sm font-bold text-amber-800 dark:text-amber-400'>
                Khoảng thời gian quá lớn ({diffDays} ngày)
              </h4>
              <p className='mt-1 max-w-sm text-xs leading-5 text-amber-600 dark:text-amber-500'>
                {viewMode === 'day'
                  ? 'Chế độ "Theo ngày" hỗ trợ tối đa 31 ngày. Hãy rút ngắn hoặc chuyển sang chế độ "Tháng".'
                  : 'Chế độ "Theo tháng" hỗ trợ tối đa 365 ngày. Hãy rút ngắn khoảng thời gian.'}
              </p>
            </div>
          ) : (
            <div className='h-[340px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                {activeChart === 'area' ? (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id='areaGrad' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='0%'
                          stopColor='#3b82f6'
                          stopOpacity={0.4}
                        />
                        <stop
                          offset='100%'
                          stopColor='#3b82f6'
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                      <linearGradient
                        id='areaGrad2'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='0%'
                          stopColor='#10b981'
                          stopOpacity={0.3}
                        />
                        <stop
                          offset='100%'
                          stopColor='#10b981'
                          stopOpacity={0.02}
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
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                      y={avgKwh}
                      stroke='#f97316'
                      strokeDasharray='4 3'
                      strokeWidth={1.5}
                      label={{
                        value: 'TB',
                        position: 'right',
                        fontSize: 10,
                        fill: '#f97316'
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='kwh'
                      stroke='#3b82f6'
                      strokeWidth={2.5}
                      fill='url(#areaGrad)'
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: '#3b82f6',
                        stroke: '#fff',
                        strokeWidth: 2
                      }}
                    />
                  </AreaChart>
                ) : (
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id='barUp' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='0%'
                          stopColor='#f97316'
                          stopOpacity={0.95}
                        />
                        <stop
                          offset='100%'
                          stopColor='#f97316'
                          stopOpacity={0.5}
                        />
                      </linearGradient>
                      <linearGradient id='barDown' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='0%'
                          stopColor='#3b82f6'
                          stopOpacity={0.95}
                        />
                        <stop
                          offset='100%'
                          stopColor='#3b82f6'
                          stopOpacity={0.5}
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
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                      y={avgKwh}
                      stroke='#f97316'
                      strokeDasharray='4 3'
                      strokeWidth={1.5}
                      label={{
                        value: 'TB',
                        position: 'right',
                        fontSize: 10,
                        fill: '#f97316'
                      }}
                    />
                    <Bar dataKey='kwh' radius={[5, 5, 0, 0]} name='Điện năng'>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.kwh > avgKwh ? 'url(#barUp)' : 'url(#barDown)'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ── Summary mini-table ──────────────────────────────────────── */}
      {!isRangeTooLong && chartData.length > 0 && (
        <div className='bg-card overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800'>
          <div className='border-b border-slate-100 px-6 py-3 dark:border-slate-800'>
            <h3 className='text-muted-foreground text-xs font-bold tracking-wider uppercase'>
              Tóm tắt dữ liệu
            </h3>
          </div>
          <div className='grid grid-cols-2 divide-x divide-slate-100 md:grid-cols-4 dark:divide-slate-800'>
            {[
              {
                label: 'Tổng kWh',
                value: `${totals.kwh.toLocaleString('vi-VN')} kWh`,
                color: 'text-blue-600 dark:text-blue-400'
              },
              {
                label: 'Tổng tiền',
                value: formatCurrency(totals.totalCost),
                color: 'text-emerald-600 dark:text-emerald-400'
              },
              {
                label: 'Đỉnh cao nhất',
                value: `${peakKwh} kWh`,
                color: 'text-orange-600 dark:text-orange-400'
              },
              {
                label: 'Trung bình / kỳ',
                value: `${avgKwh.toFixed(1)} kWh`,
                color: 'text-violet-600 dark:text-violet-400'
              }
            ].map(({ label, value, color }) => (
              <div key={label} className='px-6 py-4 text-center'>
                <p className='text-muted-foreground text-[10px] font-bold tracking-wider uppercase'>
                  {label}
                </p>
                <p className={`mt-1 text-sm font-extrabold ${color}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
