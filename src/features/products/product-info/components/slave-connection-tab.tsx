'use client';

import { Device } from '@/core/domains/devices';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/ui/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/ui/components/ui/tabs';
import { DateInput } from '@/ui/components/ui/date-input';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  Link as LinkIcon,
  Search,
  Trash2,
  Eye,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Zap,
  Thermometer,
  Droplets,
  Activity,
  Wifi,
  Clock,
  TrendingUp,
  TrendingDown,
  Flame,
  BarChart3,
  DollarSign,
  Sparkles,
  Settings2
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import ConnectSlaveModal, { SelectedDevice } from './modal/connect-slave-modal';
import {
  CalibrationModal,
  CalibrationSlaveDevice
} from './modal/calibration-modal';
import { cn } from '@/lib/utils';
import { Switch } from '@/ui/components/ui/switch';
import { toast } from 'sonner';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import CustomScrollbar from '@/ui/components/custom-scrollbar';

interface SlaveConnectionTabProps {
  device: Device;
}

interface ConnectedSlave {
  id: string;
  name: string;
  type: string;
  serial_number: string;
  online: boolean;
}

const mockParameters = [
  {
    label: 'Điện áp',
    value: '220.5 V',
    icon: Zap,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
  },
  {
    label: 'Dòng điện',
    value: '0.45 A',
    icon: Activity,
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30'
  },
  {
    label: 'Công suất',
    value: '99.2 W',
    icon: Zap,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
  },
  {
    label: 'Tần số',
    value: '50.0 Hz',
    icon: Activity,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30'
  },
  {
    label: 'Hệ số Cosφ',
    value: '0.98',
    icon: Activity,
    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
  },
  {
    label: 'Nhiệt độ',
    value: '42.5 °C',
    icon: Thermometer,
    color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30'
  },
  {
    label: 'Độ ẩm',
    value: '65.2 %',
    icon: Droplets,
    color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
  },
  {
    label: 'Thời gian chạy',
    value: '142 giờ',
    icon: Clock,
    color: 'text-slate-500 bg-slate-50 dark:bg-slate-900/30'
  },
  {
    label: 'Điện năng',
    value: '12.5 kWh',
    icon: Zap,
    color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30'
  },
  {
    label: 'Tín hiệu sóng',
    value: '-68 dBm',
    icon: Wifi,
    color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/30'
  }
];

export function SlaveConnectionTab({ device }: SlaveConnectionTabProps) {
  const { t } = useTranslation();
  const router = useRouter();

  // Local state to manage connected slaves since there is no API yet
  // We manage the connected devices as full normal devices (STL_SMART)
  const [connectedSlaves, setConnectedSlaves] = useState<ConnectedSlave[]>([]);

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Expanded rows state
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const { catalogues } = useCatalogueStore();
  const catalogueOptions = useMemo(() => {
    return catalogues.map((cat) => ({
      value: cat.type,
      label: cat.name
    }));
  }, [catalogues]);

  // Detail slave modal state
  const [detailSlave, setDetailSlave] = useState<ConnectedSlave | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<'control' | 'stats'>(
    'control'
  );
  const [detailRelays, setDetailRelays] = useState<Record<string, boolean>>({
    relay_1: true,
    relay_2: false
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // States for slave CB details modal statistics
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const thirtyDaysAgoStr = useMemo(
    () =>
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    []
  );

  const [modalStartDate, setModalStartDate] = useState(thirtyDaysAgoStr);
  const [modalEndDate, setModalEndDate] = useState(todayStr);
  const [modalViewMode, setModalViewMode] = useState<'day' | 'month'>('day');
  const [modalUnitPrice, setModalUnitPrice] = useState<number>(2500);
  const [modalActiveChart, setModalActiveChart] = useState<'area' | 'bar'>(
    'area'
  );

  // Sync billing parameters from localStorage on mount and when modal opens
  useEffect(() => {
    const savedPrice = localStorage.getItem('cb_billing_unit_price');
    if (savedPrice) setModalUnitPrice(Number(savedPrice));
  }, [detailSlave]);

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
  const modalDiffDays = useMemo(() => {
    const start = new Date(modalStartDate);
    const end = new Date(modalEndDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  }, [modalStartDate, modalEndDate]);

  // Validation flag for too long date range to protect backend
  const modalIsRangeTooLong = useMemo(() => {
    if (modalViewMode === 'day') {
      return modalDiffDays > 31;
    } else {
      return modalDiffDays > 365;
    }
  }, [modalViewMode, modalDiffDays]);

  // Generate deterministic mock energy consumption based on date range
  const modalChartData = useMemo(() => {
    if (modalIsRangeTooLong) {
      return [];
    }

    const start = new Date(modalStartDate);
    const end = new Date(modalEndDate);

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

      const totalCost = kwh * modalUnitPrice;

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

    if (modalViewMode === 'day') {
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
  }, [
    modalStartDate,
    modalEndDate,
    modalViewMode,
    modalUnitPrice,
    modalIsRangeTooLong
  ]);

  // Aggregate stats
  const modalTotals = useMemo(() => {
    return modalChartData.reduce(
      (acc, curr) => {
        acc.kwh += curr.kwh;
        acc.costBeforeTax += curr.costBeforeTax;
        acc.vat += curr.vat;
        acc.totalCost += curr.totalCost;
        return acc;
      },
      { kwh: 0, costBeforeTax: 0, vat: 0, totalCost: 0 }
    );
  }, [modalChartData]);

  // Peak and average computed values
  const modalPeakKwh = useMemo(
    () =>
      modalChartData.length ? Math.max(...modalChartData.map((d) => d.kwh)) : 0,
    [modalChartData]
  );
  const modalAvgKwh = useMemo(
    () => (modalChartData.length ? modalTotals.kwh / modalChartData.length : 0),
    [modalChartData, modalTotals.kwh]
  );

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

  // Disconnect modal states
  const [slaveToDisconnect, setSlaveToDisconnect] =
    useState<ConnectedSlave | null>(null);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

  // Calibration modal states
  const [calibrationSlave, setCalibrationSlave] =
    useState<CalibrationSlaveDevice | null>(null);

  // Get unique device types from connected slaves for the filter dropdown
  const uniqueTypes = useMemo(() => {
    const types = new Set(connectedSlaves.map((s) => s.type));
    return Array.from(types);
  }, [connectedSlaves]);

  // Filter and search logic
  const filteredSlaves = useMemo(() => {
    return connectedSlaves.filter((slave) => {
      const matchesSearch =
        slave.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slave.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slave.serial_number.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === 'ALL' || slave.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [connectedSlaves, searchQuery, filterType]);

  // Handle connection of new slave devices (STL_SMART)
  const handleConnectSlaves = (newDevices: SelectedDevice[]) => {
    const formattedNewSlaves: ConnectedSlave[] = newDevices.map((d) => ({
      id: String(d.id),
      name: d.name,
      type: d.type,
      serial_number: d.code,
      online: d.online
    }));

    setConnectedSlaves((prev) => {
      // Avoid duplicate connections
      const existingIds = new Set(prev.map((s) => s.id));
      const filteredNew = formattedNewSlaves.filter(
        (s) => !existingIds.has(s.id)
      );
      return [...prev, ...filteredNew];
    });
  };

  // Handle disconnecting a slave
  const handleConfirmDisconnect = () => {
    if (!slaveToDisconnect) return;

    setConnectedSlaves((prev) =>
      prev.filter((s) => s.id !== slaveToDisconnect.id)
    );
    setIsDisconnectModalOpen(false);
    setSlaveToDisconnect(null);
  };

  const handleViewSlave = (slave: ConnectedSlave) => {
    router.push(`/dashboard/product/info/${slave.id}`);
  };

  const openDisconnectConfirm = (slave: ConnectedSlave) => {
    setSlaveToDisconnect(slave);
    setIsDisconnectModalOpen(true);
  };

  return (
    <div className='space-y-4'>
      {/* Search and Action Bar */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 flex-col gap-3 sm:flex-row sm:items-center'>
          {/* Search Input */}
          <div className='relative w-full sm:max-w-xs'>
            <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
            <Input
              placeholder='Tìm kiếm thiết bị con...'
              className='h-9 pl-8 text-xs focus:ring-1 focus:ring-blue-500'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Filter Select */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className='h-9 w-full text-xs sm:max-w-[200px]'>
              <SelectValue placeholder='Lọc theo loại' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL' className='text-xs'>
                Tất cả loại thiết bị
              </SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type} className='text-xs'>
                  {type.split('.').pop() || type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Connect Action Button */}
        <Button
          className='h-9 shrink-0 gap-1.5 bg-[#0859AA] text-xs font-semibold text-white hover:bg-[#064488]'
          onClick={() => setIsConnectModalOpen(true)}
        >
          <LinkIcon className='h-4 w-4' />
          Kết nối thiết bị con
        </Button>
      </div>

      <div className='bg-card overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-800'>
        <Table>
          <TableHeader>
            <TableRow className='border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900'>
              <TableHead className='w-10'></TableHead>
              <TableHead className='py-3 text-xs font-bold text-slate-700 dark:text-slate-300'>
                Tên thiết bị con
              </TableHead>
              <TableHead className='py-3 text-xs font-bold text-slate-700 dark:text-slate-300'>
                Mã thiết bị (Serial Number)
              </TableHead>
              <TableHead className='py-3 text-xs font-bold text-slate-700 dark:text-slate-300'>
                Loại thiết bị
              </TableHead>
              <TableHead className='py-3 text-xs font-bold text-slate-700 dark:text-slate-300'>
                Trạng thái hoạt động
              </TableHead>
              <TableHead className='py-3 pr-6 text-right text-xs font-bold text-slate-700 dark:text-slate-300'>
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSlaves.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-muted-foreground py-8 text-center text-xs'
                >
                  Không tìm thấy thiết bị con nào được kết nối
                </TableCell>
              </TableRow>
            ) : (
              filteredSlaves.map((slave) => {
                const isOnline = slave.online;
                const isExpanded = !!expandedRows[slave.id];

                return (
                  <React.Fragment key={slave.id}>
                    <TableRow className='border-b border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/30'>
                      <TableCell className='w-10 py-3.5'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800'
                          onClick={() => toggleRow(slave.id)}
                        >
                          {isExpanded ? (
                            <ChevronUp className='h-3.5 w-3.5 text-slate-500' />
                          ) : (
                            <ChevronDown className='h-3.5 w-3.5 text-slate-500' />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className='py-3.5 text-xs font-semibold text-slate-800 dark:text-slate-200'>
                        {slave.name}
                      </TableCell>
                      <TableCell className='py-3.5 text-xs text-slate-500'>
                        {slave.serial_number || slave.id}
                      </TableCell>
                      <TableCell className='py-3.5 text-xs text-slate-500'>
                        {catalogueOptions.find(
                          (opt) => opt.value === slave.type
                        )?.label || slave.type}
                      </TableCell>
                      <TableCell className='py-3.5 text-xs'>
                        <div className='flex items-center gap-1.5'>
                          <div
                            className={cn(
                              'h-2 w-2 rounded-full',
                              isOnline ? 'bg-green-500' : 'bg-red-500'
                            )}
                          />
                          <span
                            className={cn(
                              'text-xs font-medium',
                              isOnline ? 'text-green-600' : 'text-red-600'
                            )}
                          >
                            {isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='py-3.5 pr-4 text-right'>
                        <div className='flex items-center justify-end gap-1.5'>
                          <Button
                            variant='ghost'
                            size='icon'
                            title='Xem chi tiết'
                            className='h-7 w-7 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30'
                            onClick={() => {
                              setDetailSlave(slave);
                              setDetailActiveTab('control');
                            }}
                          >
                            <Eye className='h-3.5 w-3.5' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            title='Hiệu chuẩn ADE'
                            className='h-7 w-7 text-purple-600 transition-colors hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/30'
                            onClick={() =>
                              setCalibrationSlave({
                                id: slave.id,
                                name: slave.name,
                                serial_number: slave.serial_number,
                                type: slave.type,
                                online: slave.online
                              })
                            }
                          >
                            <Settings2 className='h-3.5 w-3.5' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            title='Ngắt kết nối'
                            className='h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30'
                            onClick={() => openDisconnectConfirm(slave)}
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className='bg-slate-50/20 hover:bg-transparent dark:bg-slate-900/10'>
                        <TableCell
                          colSpan={6}
                          className='border-b border-slate-100 p-4 dark:border-slate-800'
                        >
                          <div className='space-y-2.5'>
                            <div className='text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500'>
                              Thông số vận hành thời gian thực
                            </div>
                            <div className='grid grid-cols-2 gap-3 sm:grid-cols-5'>
                              {mockParameters.map((param, pIdx) => {
                                const Icon = param.icon;
                                return (
                                  <div
                                    key={pIdx}
                                    className='bg-card border-slate-150 flex items-center gap-2.5 rounded-lg border p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all hover:shadow-sm dark:border-slate-800'
                                  >
                                    <div
                                      className={cn(
                                        'shrink-0 rounded-md p-1.5',
                                        param.color
                                      )}
                                    >
                                      <Icon className='h-3.5 w-3.5' />
                                    </div>
                                    <div className='min-w-0'>
                                      <div className='truncate text-[10px] font-medium text-slate-400 dark:text-slate-500'>
                                        {param.label}
                                      </div>
                                      <div className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                                        {param.value}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Connect Slave Modal Dialog */}
      <ConnectSlaveModal
        open={isConnectModalOpen}
        onOpenChange={setIsConnectModalOpen}
        connectedIds={connectedSlaves.map((s) => s.id)}
        onConnect={handleConnectSlaves}
      />

      {/* Disconnect Confirmation Dialog */}
      <Dialog
        open={isDisconnectModalOpen}
        onOpenChange={setIsDisconnectModalOpen}
      >
        <DialogContent
          className='border-slate-200 sm:max-w-md dark:border-slate-800'
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className='flex flex-row items-start gap-3'>
            <div className='mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50'>
              <AlertTriangle className='h-5 w-5' />
            </div>
            <div className='min-w-0 flex-1 space-y-1'>
              <DialogTitle className='text-md font-bold text-slate-900 dark:text-slate-50'>
                Ngắt kết nối thiết bị con
              </DialogTitle>
              <DialogDescription className='text-xs leading-normal text-slate-500 dark:text-slate-400'>
                Bạn có chắc chắn muốn ngắt kết nối thiết bị{' '}
                <span className='font-bold text-slate-800 dark:text-slate-200'>
                  {slaveToDisconnect?.name}
                </span>{' '}
                khỏi hệ thống tủ trung tâm?
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className='mt-2 flex justify-end gap-3 border-t border-slate-100 pt-3.5 dark:border-slate-800'>
            <Button
              variant='outline'
              onClick={() => {
                setIsDisconnectModalOpen(false);
                setSlaveToDisconnect(null);
              }}
              className='px-4 py-2 text-xs'
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmDisconnect}
              className='rounded bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700'
            >
              Ngắt kết nối
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Slave Detail Modal */}
      <Dialog
        open={!!detailSlave}
        onOpenChange={(open) => !open && setDetailSlave(null)}
      >
        <DialogContent
          className='bg-card flex max-h-[85vh] w-full max-w-[90vw] flex-col overflow-hidden border-slate-200 p-0 sm:max-w-xl dark:border-slate-800'
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <CustomScrollbar className='flex-1 overflow-y-auto p-5 sm:p-6'>
            {detailSlave && (
              <>
                <DialogHeader className='border-b border-slate-100 pb-2 dark:border-slate-800'>
                  <DialogTitle className='text-md flex items-center gap-2 font-bold text-slate-900 dark:text-slate-50'>
                    <Eye className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    Chi tiết thiết bị con (Slave)
                  </DialogTitle>
                  <DialogDescription className='text-xs text-slate-500 dark:text-slate-400'>
                    Xem trạng thái các cổng vào/ra, thông số vận hành và thống
                    kê điện năng của thiết bị con.
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-5 py-4'>
                  {/* Device Info */}
                  <div className='border-slate-150 grid grid-cols-2 gap-3 rounded-lg border bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/40'>
                    <div className='space-y-0.5'>
                      <span className='block text-[10px] font-medium text-slate-400'>
                        Tên thiết bị
                      </span>
                      <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                        {detailSlave.name}
                      </span>
                    </div>
                    <div className='space-y-0.5'>
                      <span className='block text-[10px] font-medium text-slate-400'>
                        Mã Serial
                      </span>
                      <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                        {detailSlave.serial_number || detailSlave.id}
                      </span>
                    </div>
                    <div className='space-y-0.5'>
                      <span className='block text-[10px] font-medium text-slate-400'>
                        Loại thiết bị
                      </span>
                      <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                        {detailSlave.type.split('.').pop()}
                      </span>
                    </div>
                    <div className='space-y-0.5'>
                      <span className='block text-[10px] font-medium text-slate-400'>
                        Trực tuyến
                      </span>
                      <span
                        className={cn(
                          'text-xs font-bold',
                          detailSlave.online ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {detailSlave.online ? 'Trực tuyến' : 'Ngoại tuyến'}
                      </span>
                    </div>
                  </div>

                  {/* Custom CB Layout with Tabs vs Default Sensors/Relays Layout */}
                  {detailSlave.type === 'lms.devices.types.CB' ? (
                    <Tabs
                      value={detailActiveTab}
                      onValueChange={(val) =>
                        setDetailActiveTab(val as 'control' | 'stats')
                      }
                      className='w-full'
                    >
                      <TabsList className='bg-muted/60 grid w-full grid-cols-2 rounded-lg border p-1 dark:border-slate-800'>
                        <TabsTrigger
                          value='control'
                          className='cursor-pointer text-xs font-bold'
                        >
                          Vận hành & Thông số
                        </TabsTrigger>
                        <TabsTrigger
                          value='stats'
                          className='cursor-pointer text-xs font-bold'
                        >
                          Thống kê điện năng
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent
                        value='control'
                        className='space-y-4 pt-4 outline-none'
                      >
                        {/* CB Controls */}
                        <div className='space-y-2.5'>
                          <span className='block text-xs font-bold text-slate-700 dark:text-slate-300'>
                            Điều khiển đóng/ngắt CB
                          </span>
                          <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-slate-800'>
                            <div className='flex min-w-0 flex-col'>
                              <span className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
                                Trạng thái nguồn (CB Switch)
                              </span>
                              <span className='text-[10px] text-slate-400'>
                                Đóng/ngắt dòng điện chính an toàn
                              </span>
                            </div>
                            <Switch
                              checked={detailRelays.relay_1}
                              onCheckedChange={(checked) => {
                                setDetailRelays((prev) => ({
                                  ...prev,
                                  relay_1: checked
                                }));
                                toast.success(
                                  `Đã gửi lệnh ${checked ? 'ĐÓNG (BẬT)' : 'NGẮT (TẮT)'} nguồn CB`
                                );
                              }}
                              className='dark:data-[state=unchecked]:!bg-gray-3 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500'
                              thumbClassName='dark:data-[state=checked]:!bg-black dark:data-[state=unchecked]:!bg-black'
                            />
                          </div>
                        </div>

                        {/* CB Power Parameters */}
                        <div className='space-y-2.5'>
                          <span className='block text-xs font-bold text-slate-700 dark:text-slate-300'>
                            Thông số điện năng đo được
                          </span>
                          <div className='grid grid-cols-2 gap-3'>
                            <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800'>
                              <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                                Điện áp
                              </span>
                              <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                                220.5 V
                              </span>
                            </div>
                            <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800'>
                              <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                                Dòng điện
                              </span>
                              <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                                0.45 A
                              </span>
                            </div>
                            <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800'>
                              <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                                Công suất
                              </span>
                              <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                                99.2 W
                              </span>
                            </div>
                            <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800'>
                              <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                                Tần số
                              </span>
                              <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                                50.0 Hz
                              </span>
                            </div>
                            <div className='bg-card col-span-2 flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800'>
                              <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                                Điện năng tích luỹ
                              </span>
                              <span className='text-primary text-xs font-bold'>
                                12.5 kWh
                              </span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent
                        value='stats'
                        className='space-y-3 pt-3 outline-none'
                      >
                        {/* ── Header micro-badge ── */}
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-1.5'>
                            <div className='rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 shadow shadow-blue-500/30'>
                              <Activity className='h-3 w-3 text-white' />
                            </div>
                            <span className='text-xs font-black tracking-tight text-slate-800 dark:text-white'>
                              Phân tích điện năng
                            </span>
                          </div>
                          <span className='inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400'>
                            <Sparkles className='h-2.5 w-2.5' /> LIVE
                          </span>
                        </div>

                        {/* ── KPI mini cards (2×2) ── */}
                        <div className='grid grid-cols-2 gap-2'>
                          {/* Total kWh */}
                          <div className='group relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-3 shadow'>
                            <div className='absolute -top-4 -right-4 h-16 w-16 rounded-full bg-blue-400 opacity-20 blur-xl' />
                            <div className='relative z-10'>
                              <div className='mb-1 flex items-center justify-between'>
                                <p className='text-[8px] font-bold tracking-[0.12em] text-white/50 uppercase'>
                                  Tổng điện năng
                                </p>
                                <Zap className='h-3 w-3 text-blue-200' />
                              </div>
                              <p className='text-base leading-none font-black text-white'>
                                {modalTotals.kwh.toLocaleString('vi-VN')}
                                <span className='ml-0.5 text-[10px] font-bold text-white/60'>
                                  kWh
                                </span>
                              </p>
                            </div>
                          </div>
                          {/* Total cost */}
                          <div className='group relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-3 shadow'>
                            <div className='absolute -top-4 -right-4 h-16 w-16 rounded-full bg-emerald-400 opacity-20 blur-xl' />
                            <div className='relative z-10'>
                              <div className='mb-1 flex items-center justify-between'>
                                <p className='text-[8px] font-bold tracking-[0.12em] text-white/50 uppercase'>
                                  Tổng tiền điện
                                </p>
                                <DollarSign className='h-3 w-3 text-emerald-200' />
                              </div>
                              <p className='text-[11px] leading-none font-black text-white'>
                                {formatCurrency(modalTotals.totalCost)}
                              </p>
                            </div>
                          </div>
                          {/* Peak */}
                          <div className='group relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-orange-600 via-rose-600 to-pink-600 p-3 shadow'>
                            <div className='absolute -top-4 -right-4 h-16 w-16 rounded-full bg-orange-400 opacity-20 blur-xl' />
                            <div className='relative z-10'>
                              <div className='mb-1 flex items-center justify-between'>
                                <p className='text-[8px] font-bold tracking-[0.12em] text-white/50 uppercase'>
                                  Đỉnh cao nhất
                                </p>
                                <Flame className='h-3 w-3 text-orange-200' />
                              </div>
                              <p className='text-base leading-none font-black text-white'>
                                {modalPeakKwh}
                                <span className='ml-0.5 text-[10px] font-bold text-white/60'>
                                  kWh
                                </span>
                              </p>
                            </div>
                          </div>
                          {/* Average */}
                          <div className='group relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-600 p-3 shadow'>
                            <div className='absolute -top-4 -right-4 h-16 w-16 rounded-full bg-violet-400 opacity-20 blur-xl' />
                            <div className='relative z-10'>
                              <div className='mb-1 flex items-center justify-between'>
                                <p className='text-[8px] font-bold tracking-[0.12em] text-white/50 uppercase'>
                                  Trung bình / kỳ
                                </p>
                                <TrendingUp className='h-3 w-3 text-violet-200' />
                              </div>
                              <p className='text-base leading-none font-black text-white'>
                                {modalAvgKwh.toFixed(1)}
                                <span className='ml-0.5 text-[10px] font-bold text-white/60'>
                                  kWh
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ── Controls bar ── */}
                        <div className='space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/40'>
                          {/* Row 1: View mode + Chart type */}
                          <div className='flex items-center justify-between gap-2'>
                            {/* View mode pills */}
                            <div className='flex h-7 flex-1 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700'>
                              {(['day', 'month'] as const).map((m, i) => (
                                <button
                                  key={m}
                                  onClick={() => setModalViewMode(m)}
                                  className={`flex-1 text-[10px] font-bold transition-all duration-150 ${
                                    modalViewMode === m
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-card text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                  } ${i === 0 ? '' : 'border-l border-slate-200 dark:border-slate-700'}`}
                                >
                                  {m === 'day' ? 'Theo ngày' : 'Theo tháng'}
                                </button>
                              ))}
                            </div>
                            {/* Chart type toggle */}
                            <div className='flex h-7 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700'>
                              <button
                                onClick={() => setModalActiveChart('area')}
                                className={`px-2.5 transition-all duration-150 ${modalActiveChart === 'area' ? 'bg-indigo-600 text-white' : 'bg-card text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                                title='Biểu đồ vùng'
                              >
                                <Activity className='h-3 w-3' />
                              </button>
                              <button
                                onClick={() => setModalActiveChart('bar')}
                                className={`border-l border-slate-200 px-2.5 transition-all duration-150 dark:border-slate-700 ${modalActiveChart === 'bar' ? 'bg-indigo-600 text-white' : 'bg-card text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                                title='Biểu đồ cột'
                              >
                                <BarChart3 className='h-3 w-3' />
                              </button>
                            </div>
                          </div>

                          {/* Row 2: Dates */}
                          <div className='grid grid-cols-2 gap-2'>
                            <div className='space-y-1'>
                              <span className='text-[9px] font-bold tracking-wider text-slate-400 uppercase'>
                                Từ ngày
                              </span>
                              <DateInput
                                value={parseDate(modalStartDate)}
                                onChange={(date) => {
                                  if (date) setModalStartDate(formatDate(date));
                                }}
                                placeholder='Từ ngày'
                              />
                            </div>
                            <div className='space-y-1'>
                              <span className='text-[9px] font-bold tracking-wider text-slate-400 uppercase'>
                                Đến ngày
                              </span>
                              <DateInput
                                value={parseDate(modalEndDate)}
                                onChange={(date) => {
                                  if (date) setModalEndDate(formatDate(date));
                                }}
                                placeholder='Đến ngày'
                              />
                            </div>
                          </div>

                          {/* Row 3: Unit price */}
                          <div className='space-y-1'>
                            <span className='flex items-center gap-1 text-[9px] font-bold tracking-wider text-slate-400 uppercase'>
                              <Settings2 className='h-2.5 w-2.5' /> Đơn giá điện
                              (đ/kWh)
                            </span>
                            <div className='relative flex items-center'>
                              <Input
                                type='number'
                                value={modalUnitPrice}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setModalUnitPrice(val);
                                  localStorage.setItem(
                                    'cb_billing_unit_price',
                                    String(val)
                                  );
                                }}
                                className='h-7 pr-14 text-xs font-bold'
                              />
                              <span className='absolute right-2 text-[9px] font-bold text-slate-400'>
                                đ/kWh
                              </span>
                            </div>
                          </div>

                          {/* Legend hint */}
                          {!modalIsRangeTooLong &&
                            modalChartData.length > 0 && (
                              <div className='flex items-center gap-3 pt-0.5'>
                                <span className='text-[9px] text-slate-400'>
                                  <span className='mr-1 inline-block h-2 w-2 rounded-full bg-orange-500' />
                                  Trên TB
                                </span>
                                <span className='text-[9px] text-slate-400'>
                                  <span className='mr-1 inline-block h-2 w-2 rounded-full bg-blue-500' />
                                  Dưới TB
                                </span>
                                <span className='ml-auto text-[9px] font-semibold text-orange-500'>
                                  TB: {modalAvgKwh.toFixed(1)} kWh
                                </span>
                              </div>
                            )}
                        </div>

                        {/* ── Chart ── */}
                        {modalIsRangeTooLong ? (
                          <div className='flex h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-4 text-center dark:border-amber-900/40 dark:bg-amber-950/10'>
                            <AlertTriangle className='mb-2 h-7 w-7 animate-bounce text-amber-500' />
                            <h4 className='text-[11px] font-bold text-amber-800 dark:text-amber-400'>
                              Khoảng ngày quá dài ({modalDiffDays} ngày)
                            </h4>
                            <p className='mt-0.5 max-w-[200px] text-[9px] leading-normal text-amber-600 dark:text-amber-500'>
                              {modalViewMode === 'day'
                                ? 'Tối đa 31 ngày ở chế độ ngày.'
                                : 'Tối đa 365 ngày ở chế độ tháng.'}
                            </p>
                          </div>
                        ) : (
                          <div className='bg-card overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800'>
                            <div className='h-[200px] w-full p-2'>
                              <ResponsiveContainer width='100%' height='100%'>
                                {modalActiveChart === 'area' ? (
                                  <AreaChart
                                    data={modalChartData}
                                    margin={{
                                      top: 8,
                                      right: 5,
                                      left: -15,
                                      bottom: 0
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id='mAreaGrad'
                                        x1='0'
                                        y1='0'
                                        x2='0'
                                        y2='1'
                                      >
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
                                    </defs>
                                    <CartesianGrid
                                      vertical={false}
                                      strokeDasharray='3 3'
                                      stroke='rgba(0,0,0,0.05)'
                                    />
                                    <XAxis
                                      dataKey='label'
                                      fontSize={8}
                                      tickLine={false}
                                      axisLine={false}
                                      tickMargin={4}
                                    />
                                    <YAxis
                                      fontSize={8}
                                      tickLine={false}
                                      axisLine={false}
                                      tickMargin={4}
                                      width={32}
                                    />
                                    <ReferenceLine
                                      y={modalAvgKwh}
                                      stroke='#f97316'
                                      strokeDasharray='3 2'
                                      strokeWidth={1.5}
                                    />
                                    <RechartsTooltip
                                      cursor={{
                                        fill: '#3b82f6',
                                        opacity: 0.05
                                      }}
                                      content={({ active, payload }) => {
                                        if (
                                          active &&
                                          payload &&
                                          payload.length
                                        ) {
                                          const d = payload[0].payload;
                                          return (
                                            <div className='min-w-[130px] rounded-lg border border-white/10 bg-slate-900/95 p-2 text-[10px] shadow-xl backdrop-blur-md'>
                                              <p className='mb-1 font-bold text-slate-300'>
                                                {d.label}
                                              </p>
                                              <div className='flex justify-between gap-3'>
                                                <span className='text-slate-400'>
                                                  Điện năng
                                                </span>
                                                <span className='font-bold text-blue-300'>
                                                  {d.kwh} kWh
                                                </span>
                                              </div>
                                              <div className='flex justify-between gap-3'>
                                                <span className='text-slate-400'>
                                                  Thành tiền
                                                </span>
                                                <span className='font-bold text-emerald-300'>
                                                  {formatCurrency(d.totalCost)}
                                                </span>
                                              </div>
                                              <div className='mt-1 flex items-center gap-1 border-t border-white/10 pt-1'>
                                                {d.kwh > modalAvgKwh ? (
                                                  <>
                                                    <TrendingUp className='h-2.5 w-2.5 text-orange-400' />
                                                    <span className='text-orange-400'>
                                                      Trên TB
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <TrendingDown className='h-2.5 w-2.5 text-sky-400' />
                                                    <span className='text-sky-400'>
                                                      Dưới TB
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Area
                                      type='monotone'
                                      dataKey='kwh'
                                      stroke='#3b82f6'
                                      strokeWidth={2}
                                      fill='url(#mAreaGrad)'
                                      dot={false}
                                      activeDot={{
                                        r: 4,
                                        fill: '#3b82f6',
                                        stroke: '#fff',
                                        strokeWidth: 1.5
                                      }}
                                    />
                                  </AreaChart>
                                ) : (
                                  <BarChart
                                    data={modalChartData}
                                    margin={{
                                      top: 8,
                                      right: 5,
                                      left: -15,
                                      bottom: 0
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id='mBarUp'
                                        x1='0'
                                        y1='0'
                                        x2='0'
                                        y2='1'
                                      >
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
                                      <linearGradient
                                        id='mBarDown'
                                        x1='0'
                                        y1='0'
                                        x2='0'
                                        y2='1'
                                      >
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
                                      stroke='rgba(0,0,0,0.05)'
                                    />
                                    <XAxis
                                      dataKey='label'
                                      fontSize={8}
                                      tickLine={false}
                                      axisLine={false}
                                      tickMargin={4}
                                    />
                                    <YAxis
                                      fontSize={8}
                                      tickLine={false}
                                      axisLine={false}
                                      tickMargin={4}
                                      width={32}
                                    />
                                    <ReferenceLine
                                      y={modalAvgKwh}
                                      stroke='#f97316'
                                      strokeDasharray='3 2'
                                      strokeWidth={1.5}
                                    />
                                    <RechartsTooltip
                                      cursor={{
                                        fill: '#3b82f6',
                                        opacity: 0.05
                                      }}
                                      content={({ active, payload }) => {
                                        if (
                                          active &&
                                          payload &&
                                          payload.length
                                        ) {
                                          const d = payload[0].payload;
                                          return (
                                            <div className='min-w-[130px] rounded-lg border border-white/10 bg-slate-900/95 p-2 text-[10px] shadow-xl backdrop-blur-md'>
                                              <p className='mb-1 font-bold text-slate-300'>
                                                {d.label}
                                              </p>
                                              <div className='flex justify-between gap-3'>
                                                <span className='text-slate-400'>
                                                  Điện năng
                                                </span>
                                                <span className='font-bold text-blue-300'>
                                                  {d.kwh} kWh
                                                </span>
                                              </div>
                                              <div className='flex justify-between gap-3'>
                                                <span className='text-slate-400'>
                                                  Thành tiền
                                                </span>
                                                <span className='font-bold text-emerald-300'>
                                                  {formatCurrency(d.totalCost)}
                                                </span>
                                              </div>
                                              <div className='mt-1 flex items-center gap-1 border-t border-white/10 pt-1'>
                                                {d.kwh > modalAvgKwh ? (
                                                  <>
                                                    <TrendingUp className='h-2.5 w-2.5 text-orange-400' />
                                                    <span className='text-orange-400'>
                                                      Trên TB
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <TrendingDown className='h-2.5 w-2.5 text-sky-400' />
                                                    <span className='text-sky-400'>
                                                      Dưới TB
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Bar dataKey='kwh' radius={[4, 4, 0, 0]}>
                                      {modalChartData.map((entry, index) => (
                                        <Cell
                                          key={`mc-${index}`}
                                          fill={
                                            entry.kwh > modalAvgKwh
                                              ? 'url(#mBarUp)'
                                              : 'url(#mBarDown)'
                                          }
                                        />
                                      ))}
                                    </Bar>
                                  </BarChart>
                                )}
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <>
                      {/* Outputs Section (Relays Control) */}
                      <div className='space-y-2.5'>
                        <span className='block text-xs font-bold text-slate-700 dark:text-slate-300'>
                          Cổng ra điều khiển (Outputs / Relays)
                        </span>
                        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                          <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-slate-800'>
                            <div className='flex min-w-0 flex-col'>
                              <span className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
                                Relay 1 (Đèn đường)
                              </span>
                              <span className='truncate text-[10px] text-slate-400'>
                                Điều khiển bật/tắt Relay 1
                              </span>
                            </div>
                            <Switch
                              checked={detailRelays.relay_1}
                              onCheckedChange={(checked) => {
                                setDetailRelays((prev) => ({
                                  ...prev,
                                  relay_1: checked
                                }));
                                toast.success(
                                  `Đã gửi lệnh ${checked ? 'BẬT' : 'TẮT'} Relay 1`
                                );
                              }}
                              className='dark:data-[state=unchecked]:!bg-gray-3 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500'
                              thumbClassName='dark:data-[state=checked]:!bg-black dark:data-[state=unchecked]:!bg-black'
                            />
                          </div>
                          <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-slate-800'>
                            <div className='flex min-w-0 flex-col'>
                              <span className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
                                Relay 2 (Báo động)
                              </span>
                              <span className='truncate text-[10px] text-slate-400'>
                                Điều khiển bật/tắt Relay 2
                              </span>
                            </div>
                            <Switch
                              checked={detailRelays.relay_2}
                              onCheckedChange={(checked) => {
                                setDetailRelays((prev) => ({
                                  ...prev,
                                  relay_2: checked
                                }));
                                toast.success(
                                  `Đã gửi lệnh ${checked ? 'BẬT' : 'TẮT'} Relay 2`
                                );
                              }}
                              className='dark:data-[state=unchecked]:!bg-gray-3 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500'
                              thumbClassName='dark:data-[state=checked]:!bg-black dark:data-[state=unchecked]:!bg-black'
                            />
                          </div>
                        </div>
                      </div>

                      {/* Inputs Section (Sensors / Alarms status) */}
                      <div className='space-y-2.5'>
                        <span className='block text-xs font-bold text-slate-700 dark:text-slate-300'>
                          Cổng vào giám sát (Inputs / Sensors)
                        </span>
                        <div className='grid grid-cols-2 gap-3'>
                          <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800'>
                            <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                              Input Báo cháy 1
                            </span>
                            <span className='rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 dark:bg-green-950/20 dark:text-green-400'>
                              Bình thường
                            </span>
                          </div>
                          <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800'>
                            <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                              Input Báo cháy 2
                            </span>
                            <span className='rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 dark:bg-green-950/20 dark:text-green-400'>
                              Bình thường
                            </span>
                          </div>
                          <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800'>
                            <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                              Cảm biến Nhiệt độ
                            </span>
                            <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                              28.5 °C
                            </span>
                          </div>
                          <div className='bg-card flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800'>
                            <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                              Cảm biến Độ ẩm
                            </span>
                            <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
                              62.0 %
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className='flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800'>
                  <Button
                    onClick={() => setDetailSlave(null)}
                    className='h-8 rounded bg-[#0859AA] px-4 py-2 text-xs font-semibold text-white hover:bg-[#064488]'
                  >
                    Đóng
                  </Button>
                </div>
              </>
            )}
          </CustomScrollbar>
        </DialogContent>
      </Dialog>

      {/* Calibration Modal for Slave CB */}
      {calibrationSlave && (
        <CalibrationModal
          open={!!calibrationSlave}
          onOpenChange={(open) => {
            if (!open) setCalibrationSlave(null);
          }}
          slave={calibrationSlave}
        />
      )}
    </div>
  );
}
