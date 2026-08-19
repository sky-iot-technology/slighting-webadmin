'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/components/ui/table';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { Input } from '@/ui/components/ui/input';
import {
  useGetScheduleHistory,
  useGetCalendarById,
  SubSchedule
} from '@/core/domains/calendars';
import {
  useCatalogueStore,
  getTraitByCommand,
  getDynamicValueFromParams
} from '@/core/domains/catalogues';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { format } from 'date-fns';
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Power,
  PowerOff,
  Sun,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface ScheduleHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleId: string;
  scheduleName?: string;
}

export function ScheduleHistoryDialog({
  open,
  onOpenChange,
  scheduleId,
  scheduleName
}: ScheduleHistoryDialogProps) {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'SUCCESS' | 'FAILED'
  >('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchDescriptors = useCatalogueStore((state) => state.fetchDescriptors);

  useEffect(() => {
    if (open) {
      fetchDescriptors();
    }
  }, [open, fetchDescriptors]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  // Get executions history
  const { data: historyData, isLoading: isHistoryLoading } =
    useGetScheduleHistory(
      scheduleId,
      { limit: 100 },
      { enabled: open && !!scheduleId }
    );

  // Get parent calendar detail to match cron_job_id with sub-schedules
  const { data: calendarData, isLoading: isCalendarLoading } =
    useGetCalendarById(scheduleId, { enabled: open && !!scheduleId });

  const executions = historyData?.executions ?? [];

  // Map sub-schedules by ID
  const subScheduleMap = useMemo(() => {
    const map = new Map<string | number, SubSchedule>();
    if (calendarData?.schedules) {
      calendarData.schedules.forEach((sub) => {
        if (sub.id !== undefined && sub.id !== null) {
          map.set(sub.id, sub);
          map.set(String(sub.id), sub);
        }
      });
    }
    return map;
  }, [calendarData]);

  const isLoading = isHistoryLoading || isCalendarLoading;

  const formatExecutedAt = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy HH:mm:ss');
    } catch {
      return dateStr;
    }
  };

  // Helper to render action badge for sub-schedule
  const renderActionBadge = (sub?: SubSchedule) => {
    if (!sub) {
      return (
        <span className='text-muted-foreground text-xs italic'>
          Không tìm thấy cấu hình
        </span>
      );
    }

    const command = sub.payload?.command || '';
    const params = sub.payload?.params || {};
    const lowerCmd = command.toLowerCase();

    // Check OnOff trait / commands
    if (
      lowerCmd.includes('onoff') ||
      lowerCmd.includes('switch') ||
      'on' in params ||
      'state' in params ||
      'power' in params ||
      lowerCmd.includes('turnon') ||
      lowerCmd.includes('turnoff')
    ) {
      const isOn =
        params.on === true ||
        params.on === 'true' ||
        params.state === 'ON' ||
        params.power === 'ON' ||
        lowerCmd.includes('turnon');

      if (isOn) {
        return (
          <Badge
            variant='outline'
            className='gap-1 border-emerald-300 bg-emerald-50 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
          >
            <Power className='h-3 w-3 text-emerald-600 dark:text-emerald-400' />
            Bật (ON)
          </Badge>
        );
      }
      return (
        <Badge
          variant='outline'
          className='gap-1 border-slate-300 bg-slate-100 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
        >
          <PowerOff className='h-3 w-3 text-slate-500' />
          Tắt (OFF)
        </Badge>
      );
    }

    // Check Brightness trait / commands
    if (
      lowerCmd.includes('brightness') ||
      'brightness' in params ||
      'level' in params ||
      'dim' in params
    ) {
      const level = params.brightness ?? params.level ?? params.dim;
      const displayVal =
        level !== undefined
          ? typeof level === 'string' && level.endsWith('%')
            ? level
            : `${level}%`
          : 'N/A';

      return (
        <Badge
          variant='outline'
          className='gap-1 border-amber-300 bg-amber-50 text-[11px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
        >
          <Sun className='h-3 w-3 text-amber-600 dark:text-amber-400' />
          Độ sáng: {displayVal}
        </Badge>
      );
    }

    // Trait lookup from descriptors store
    const trait = command ? getTraitByCommand(command) : undefined;
    if (trait) {
      const value = getDynamicValueFromParams(trait, params);
      if (trait === 'lms.devices.traits.OnOff') {
        return value ? (
          <Badge
            variant='outline'
            className='gap-1 border-emerald-300 bg-emerald-50 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
          >
            <Power className='h-3 w-3 text-emerald-600 dark:text-emerald-400' />
            Bật (ON)
          </Badge>
        ) : (
          <Badge
            variant='outline'
            className='gap-1 border-slate-300 bg-slate-100 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
          >
            <PowerOff className='h-3 w-3 text-slate-500' />
            Tắt (OFF)
          </Badge>
        );
      }
      if (trait === 'lms.devices.traits.Brightness') {
        return (
          <Badge
            variant='outline'
            className='gap-1 border-amber-300 bg-amber-50 text-[11px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
          >
            <Sun className='h-3 w-3 text-amber-600 dark:text-amber-400' />
            Độ sáng: {value ?? 0}%
          </Badge>
        );
      }
    }

    // Generic fallback for custom parameters
    const paramKeys = Object.keys(params);
    if (paramKeys.length > 0) {
      const summary = paramKeys.map((k) => `${k}: ${params[k]}`).join(', ');
      return (
        <Badge
          variant='outline'
          className='border-blue-200 bg-blue-50 font-mono text-[11px] text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
        >
          {command ? `${command.split('.').pop()} (${summary})` : summary}
        </Badge>
      );
    }

    return (
      <span className='text-muted-foreground font-mono text-xs'>
        {command || '—'}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const isSuccess = status === 'SUCCESS';
    const isFailed = status === 'FAILED';

    if (isSuccess) {
      return (
        <Badge
          variant='outline'
          className='gap-1.5 border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
        >
          <CheckCircle2 className='h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400' />
          SUCCESS
        </Badge>
      );
    }
    if (isFailed) {
      return (
        <Badge
          variant='outline'
          className='gap-1.5 border-red-200 bg-red-50 px-2.5 py-0.5 font-medium text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400'
        >
          <XCircle className='h-3.5 w-3.5 text-red-600 dark:text-red-400' />
          FAILED
        </Badge>
      );
    }
    return (
      <Badge
        variant='outline'
        className='gap-1.5 border-slate-200 bg-slate-50 px-2.5 py-0.5 font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
      >
        <Clock className='h-3.5 w-3.5 text-slate-500' />
        {status || 'UNKNOWN'}
      </Badge>
    );
  };

  // Filter executions
  const filteredExecutions = useMemo(() => {
    return executions.filter((item) => {
      // Status filter
      if (statusFilter === 'SUCCESS' && item.status !== 'SUCCESS') return false;
      if (statusFilter === 'FAILED' && item.status !== 'FAILED') return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchedSub = subScheduleMap.get(item.cron_job_id);

      const cronJobIdMatch = String(item.cron_job_id).includes(q);
      const executionIdMatch = String(item.execution_id).includes(q);
      const statusMatch = item.status.toLowerCase().includes(q);
      const dateMatch = formatExecutedAt(item.executed_at)
        .toLowerCase()
        .includes(q);
      const subTimeMatch = matchedSub?.time?.toLowerCase().includes(q) ?? false;
      const subCommandMatch =
        matchedSub?.payload?.command?.toLowerCase().includes(q) ?? false;

      return (
        cronJobIdMatch ||
        executionIdMatch ||
        statusMatch ||
        dateMatch ||
        subTimeMatch ||
        subCommandMatch
      );
    });
  }, [executions, statusFilter, searchQuery, subScheduleMap]);

  // Pagination calculation
  const totalPages = Math.max(
    1,
    Math.ceil(filteredExecutions.length / pageSize)
  );
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(filteredExecutions.length, startIndex + pageSize);
  const paginatedExecutions = useMemo(() => {
    return filteredExecutions.slice(startIndex, endIndex);
  }, [filteredExecutions, startIndex, endIndex]);

  // Statistics
  const totalCount = executions.length;
  const successCount = useMemo(
    () => executions.filter((e) => e.status === 'SUCCESS').length,
    [executions]
  );
  const failedCount = useMemo(
    () => executions.filter((e) => e.status === 'FAILED').length,
    [executions]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] w-[95vw] max-w-5xl flex-col gap-4 overflow-hidden p-4 sm:p-6 md:max-w-6xl'>
        {/* Header */}
        <DialogHeader className='flex flex-col justify-between space-y-2 border-b pb-3 sm:flex-row sm:items-center sm:space-y-0'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'>
              <History className='h-5 w-5' />
            </div>
            <div>
              <DialogTitle className='flex flex-wrap items-center gap-2 text-base font-bold sm:text-lg'>
                <span>Lịch sử thực thi</span>
                {scheduleName && (
                  <span className='text-primary font-bold'>
                    "{scheduleName}"
                  </span>
                )}
              </DialogTitle>
              <div className='text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2 text-xs'>
                <span>Mã lịch:</span>
                <Badge
                  variant='secondary'
                  className='px-2 py-0 font-mono text-[11px] font-medium'
                >
                  {scheduleId}
                </Badge>
                {calendarData?.schedules && (
                  <span className='text-slate-400'>
                    • {calendarData.schedules.length} lịch con (Cron Job)
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Stats & Search Toolbar */}
        <div className='bg-muted/30 flex flex-col items-stretch justify-between gap-3 rounded-lg border p-2.5 md:flex-row md:items-center'>
          <div className='flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:gap-2 md:pb-0'>
            <button
              type='button'
              onClick={() => setStatusFilter('ALL')}
              className={`shrink-0 rounded-md px-3 py-1.5 font-medium transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-background text-foreground border shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tất cả ({totalCount})
            </button>
            <button
              type='button'
              onClick={() => setStatusFilter('SUCCESS')}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
                statusFilter === 'SUCCESS'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckCircle2 className='h-3.5 w-3.5 text-emerald-600' />
              Thành công ({successCount})
            </button>
            <button
              type='button'
              onClick={() => setStatusFilter('FAILED')}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
                statusFilter === 'FAILED'
                  ? 'border border-red-200 bg-red-50 text-red-700 shadow-xs dark:border-red-800 dark:bg-red-950/60 dark:text-red-300'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <XCircle className='h-3.5 w-3.5 text-red-600' />
              Thất bại ({failedCount})
            </button>
          </div>

          <div className='relative w-full md:w-72'>
            <Search className='text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2' />
            <Input
              placeholder='Tìm Cron ID, giờ, hành động...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='bg-background h-8 pl-8 text-xs'
            />
          </div>
        </div>

        {/* Content Table Container */}
        <div className='min-h-[280px] flex-1 overflow-y-auto pr-1'>
          {isLoading ? (
            <div className='space-y-2 py-2'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          ) : filteredExecutions.length === 0 ? (
            <div className='text-muted-foreground flex flex-col items-center justify-center space-y-2 py-12 text-center'>
              <AlertCircle className='h-10 w-10 stroke-[1.5] text-slate-400' />
              <p className='text-sm font-medium'>
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Không tìm thấy kết quả phù hợp'
                  : 'Chưa có nhật ký thực thi nào'}
              </p>
              <p className='max-w-sm text-xs text-slate-400'>
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.'
                  : 'Lịch này chưa phát sinh lần kích hoạt nào.'}
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto rounded-lg border shadow-xs'>
              <Table className='w-full min-w-[750px]'>
                <TableHeader className='bg-muted/60'>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead className='w-[130px] text-xs font-semibold'>
                      Trạng thái
                    </TableHead>
                    <TableHead className='w-[120px] text-xs font-semibold'>
                      Cron Job ID
                    </TableHead>
                    <TableHead className='w-[110px] text-xs font-semibold'>
                      Giờ cài đặt
                    </TableHead>
                    <TableHead className='min-w-[160px] text-xs font-semibold'>
                      Hành động (Action)
                    </TableHead>
                    <TableHead className='w-[180px] text-xs font-semibold'>
                      Thời gian thực thi
                    </TableHead>
                    <TableHead className='w-[110px] text-right text-xs font-semibold'>
                      Execution ID
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedExecutions.map((item) => {
                    const matchedSub = subScheduleMap.get(item.cron_job_id);

                    return (
                      <TableRow
                        key={
                          item.execution_id ||
                          `${item.cron_job_id}-${item.executed_at}`
                        }
                        className='hover:bg-muted/40 transition-colors'
                      >
                        <TableCell className='py-2.5'>
                          {getStatusBadge(item.status)}
                        </TableCell>

                        {/* Cron Job ID compared with Schedule */}
                        <TableCell className='py-2.5 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300'>
                          <Badge
                            variant='outline'
                            className='border-slate-200 bg-slate-50 font-mono text-[11px] dark:border-slate-800 dark:bg-slate-900'
                          >
                            #{item.cron_job_id}
                          </Badge>
                        </TableCell>

                        {/* Scheduled Time from matched sub-schedule */}
                        <TableCell className='py-2.5 text-xs font-medium'>
                          {matchedSub?.time ? (
                            <div className='flex items-center gap-1.5 text-slate-700 dark:text-slate-300'>
                              <Clock className='text-primary h-3.5 w-3.5' />
                              <span className='font-semibold'>
                                {matchedSub.time}
                              </span>
                            </div>
                          ) : (
                            <span className='text-muted-foreground text-xs italic'>
                              —
                            </span>
                          )}
                        </TableCell>

                        {/* Action derived from sub-schedule payload */}
                        <TableCell className='py-2.5'>
                          {renderActionBadge(matchedSub)}
                        </TableCell>

                        {/* Executed At timestamp */}
                        <TableCell className='py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400'>
                          {formatExecutedAt(item.executed_at)}
                        </TableCell>

                        {/* Execution ID */}
                        <TableCell className='text-muted-foreground py-2.5 text-right font-mono text-xs'>
                          #{item.execution_id}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Responsive Pagination Footer */}
        {!isLoading && filteredExecutions.length > 0 && (
          <div className='text-muted-foreground flex flex-col items-center justify-between gap-3 border-t pt-3 text-xs sm:flex-row'>
            <div className='flex items-center gap-2 text-xs'>
              <span>Hiển thị</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  setPageSize(Number(val));
                  setPage(1);
                }}
              >
                <SelectTrigger className='h-7 w-[70px] text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                  <SelectItem value='100'>100</SelectItem>
                </SelectContent>
              </Select>
              <span>
                từ <strong className='text-foreground'>{startIndex + 1}</strong>{' '}
                đến <strong className='text-foreground'>{endIndex}</strong> /{' '}
                <strong className='text-foreground'>
                  {filteredExecutions.length}
                </strong>{' '}
                bản ghi
              </span>
            </div>

            <div className='flex items-center gap-1.5'>
              <span className='text-foreground mr-2 text-xs font-medium'>
                Trang {page} / {totalPages}
              </span>

              <Button
                variant='outline'
                size='icon'
                className='h-7 w-7'
                onClick={() => setPage(1)}
                disabled={page === 1}
                title='Trang đầu'
              >
                <ChevronsLeft className='h-3.5 w-3.5' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-7 w-7'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                title='Trang trước'
              >
                <ChevronLeft className='h-3.5 w-3.5' />
              </Button>

              <Button
                variant='outline'
                size='icon'
                className='h-7 w-7'
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                title='Trang sau'
              >
                <ChevronRight className='h-3.5 w-3.5' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-7 w-7'
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                title='Trang cuối'
              >
                <ChevronsRight className='h-3.5 w-3.5' />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
