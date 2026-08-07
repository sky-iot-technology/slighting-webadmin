'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/ui/components/ui/dialog';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Badge } from '@/ui/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/ui/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/ui/components/ui/alert-dialog';
import {
  Settings2,
  Info,
  RotateCcw,
  Save,
  Edit2,
  X,
  AlertTriangle,
  Cpu,
  Gauge,
  Sliders,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdeCalibrationConfig {
  Ri: number;
  Rv: number;
  CT: number;
  AWATT_FS_E: number;
  AWATT_FS_P: number;
  REG_FS: number;
  Vfs_rms: number;
  accmode: number;
  lcycmode: number;
  config: number;
  cfmode: number;
  airmsos: number;
  avrmsos: number;
  avgain: number;
  aigain: number;
}

export interface CalibrationSlaveDevice {
  id: string;
  name: string;
  serial_number: string;
  type: string;
  online: boolean;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: AdeCalibrationConfig = {
  Ri: 44,
  Rv: 998,
  CT: 1000,
  AWATT_FS_E: 206900,
  AWATT_FS_P: 4862401,
  REG_FS: 9032007,
  Vfs_rms: 0.3535533906,
  accmode: 0x0a,
  lcycmode: 0x00,
  config: 0x0004,
  cfmode: 0x0300,
  airmsos: -768,
  avrmsos: -2126,
  avgain: 0x3dfc76,
  aigain: 0x38d0d8
};

// ─── Field metadata ───────────────────────────────────────────────────────────

export interface FieldMeta {
  key: keyof AdeCalibrationConfig;
  title: string;
  varName: string;
  description: string;
  unit?: string;
  isHex?: boolean;
  isFloat?: boolean;
  min?: number;
  max?: number;
}

interface FieldGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  fields: FieldMeta[];
}

const FIELD_GROUPS: FieldGroup[] = [
  {
    id: 'hardware',
    title: 'Phần cứng & Tỷ lệ',
    icon: Cpu,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    fields: [
      {
        key: 'Ri',
        title: 'Điện trở Shunt',
        varName: 'Ri',
        description: 'Điện trở cảm biến dòng (mΩ)',
        unit: 'mΩ',
        min: 0
      },
      {
        key: 'Rv',
        title: 'Điện trở phân áp',
        varName: 'Rv',
        description: 'Điện trở cầu phân áp (kΩ)',
        unit: 'kΩ',
        min: 0
      },
      {
        key: 'CT',
        title: 'Tỷ lệ biến dòng',
        varName: 'CT',
        description: 'Tỷ lệ biến dòng CT ratio',
        unit: ':1',
        min: 1
      }
    ]
  },
  {
    id: 'fullscale',
    title: 'Giá trị Full-Scale',
    icon: Gauge,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    fields: [
      {
        key: 'Vfs_rms',
        title: 'Điện áp ADC cực đại',
        varName: 'Vfs_rms',
        description: 'Điện áp RMS cực đại ADC (≈ 0.5V / √2)',
        unit: 'V',
        isFloat: true,
        min: 0,
        max: 1
      },
      {
        key: 'AWATT_FS_E',
        title: 'Full-Scale Energy',
        varName: 'AWATT_FS_E',
        description: 'Mã đếm năng lượng đầy tải',
        min: 0
      },
      {
        key: 'AWATT_FS_P',
        title: 'Full-Scale Power',
        varName: 'AWATT_FS_P',
        description: 'Mã công suất đầy tải',
        min: 0
      },
      {
        key: 'REG_FS',
        title: 'Thanh ghi ADC cực đại',
        varName: 'REG_FS',
        description: 'Mã cực đại thanh ghi 24-bit',
        min: 0
      }
    ]
  },
  {
    id: 'mode',
    title: 'Thanh ghi chế độ ADE',
    icon: Sliders,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    fields: [
      {
        key: 'accmode',
        title: 'Accumulation Mode',
        varName: 'accmode',
        description: 'Chế độ tích lũy năng lượng tác dụng',
        isHex: true
      },
      {
        key: 'lcycmode',
        title: 'Line Cycle Mode',
        varName: 'lcycmode',
        description: 'Chế độ chu kỳ tích lũy sóng AC',
        isHex: true
      },
      {
        key: 'config',
        title: 'Configuration Register',
        varName: 'config',
        description: 'Cấu hình HPF & kênh ADC',
        isHex: true
      },
      {
        key: 'cfmode',
        title: 'CF Frequency Mode',
        varName: 'cfmode',
        description: 'Cấu hình xuất xung tần số CF1/CF2',
        isHex: true
      }
    ]
  },
  {
    id: 'calibration',
    title: 'Hiệu chuẩn Gain & Offset',
    icon: Zap,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    fields: [
      {
        key: 'airmsos',
        title: 'Bù lệch dòng RMS',
        varName: 'airmsos',
        description: 'Bù lệch điểm 0 dòng điện (airmsos)',
        min: -32768,
        max: 32767
      },
      {
        key: 'avrmsos',
        title: 'Bù lệch áp RMS',
        varName: 'avrmsos',
        description: 'Bù lệch điểm 0 điện áp (avrmsos)',
        min: -32768,
        max: 32767
      },
      {
        key: 'avgain',
        title: 'Gain điện áp',
        varName: 'avgain',
        description: 'Hệ số khuếch đại điện áp (avgain)',
        isHex: true
      },
      {
        key: 'aigain',
        title: 'Gain dòng điện',
        varName: 'aigain',
        description: 'Hệ số khuếch đại dòng điện (aigain)',
        isHex: true
      }
    ]
  }
];

// ─── Format Helpers ───────────────────────────────────────────────────────────

function toDisplayValue(value: number, meta: FieldMeta): string {
  if (meta.isFloat) {
    return value.toString();
  }

  const decStr = value.toLocaleString('vi-VN');

  if (meta.key === 'avgain' || meta.key === 'aigain') {
    const hexStr = '0x' + (value >>> 0).toString(16).toUpperCase();
    return `${decStr} (${hexStr})`;
  }

  if (meta.isHex) {
    const hexStr =
      '0x' + (value >>> 0).toString(16).toUpperCase().padStart(4, '0');
    return `${value} (${hexStr})`;
  }

  return decStr;
}

function parseInputValue(raw: string, meta: FieldMeta): number | null {
  const trimmed = raw.trim();
  const cleaned = trimmed.replace(/,/g, '').split(' ')[0];

  if (meta.isFloat) {
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  if (cleaned.startsWith('0x') || cleaned.startsWith('0X')) {
    const hexClean = cleaned.replace(/^0x/i, '');
    const parsed = parseInt(hexClean, 16);
    return isNaN(parsed) ? null : parsed;
  }

  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? null : parsed;
}

// ─── Compact Field Row Component ──────────────────────────────────────────────

interface FieldRowProps {
  meta: FieldMeta;
  value: number;
  savedValue: number;
  isEditing: boolean;
  onChange: (key: keyof AdeCalibrationConfig, val: number) => void;
}

function FieldRow({
  meta,
  value,
  savedValue,
  isEditing,
  onChange
}: FieldRowProps) {
  const displayVal = toDisplayValue(value, meta);
  const rawEditVal = value.toString();
  const [inputVal, setInputVal] = useState(rawEditVal);
  const [error, setError] = useState('');

  const isDirty = value !== savedValue;

  const handleChange = (raw: string) => {
    setInputVal(raw);
    const parsed = parseInputValue(raw, meta);
    if (parsed === null) {
      setError('Không hợp lệ');
      return;
    }
    if (meta.min !== undefined && parsed < meta.min) {
      setError(`Min: ${meta.min}`);
      return;
    }
    if (meta.max !== undefined && parsed > meta.max) {
      setError(`Max: ${meta.max}`);
      return;
    }
    setError('');
    onChange(meta.key, parsed);
  };

  const syncedInputVal = isEditing ? inputVal : displayVal;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-all',
        isEditing
          ? 'border-primary/40 bg-primary/5'
          : 'border-border bg-card hover:bg-muted/40',
        isDirty && 'border-amber-300 dark:border-amber-700'
      )}
    >
      <div className='flex min-w-0 items-center gap-1.5'>
        {isDirty && (
          <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400' />
        )}
        <span className='text-foreground truncate text-xs font-bold'>
          {meta.title}
        </span>
        <span className='text-muted-foreground shrink-0 font-mono text-[10px]'>
          ({meta.varName})
        </span>
      </div>

      <div className='w-36 shrink-0 text-right'>
        {isEditing ? (
          <div>
            <Input
              value={syncedInputVal}
              onChange={(e) => handleChange(e.target.value)}
              className={cn(
                'h-7 text-right font-mono text-xs font-semibold',
                error && 'border-destructive'
              )}
            />
            {error && (
              <p className='text-destructive mt-0.5 text-[9px]'>{error}</p>
            )}
          </div>
        ) : (
          <div className='text-foreground flex items-baseline justify-end gap-1 font-mono text-xs font-bold'>
            <span>{displayVal}</span>
            {meta.unit && (
              <span className='text-muted-foreground text-[10px] font-normal'>
                {meta.unit}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CalibrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slave: CalibrationSlaveDevice;
}

export function CalibrationModal({
  open,
  onOpenChange,
  slave
}: CalibrationModalProps) {
  const [config, setConfig] = useState<AdeCalibrationConfig>({
    ...DEFAULT_CONFIG
  });
  const [savedConfig, setSavedConfig] = useState<AdeCalibrationConfig>({
    ...DEFAULT_CONFIG
  });
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const totalDirty = FIELD_GROUPS.flatMap((g) => g.fields).filter(
    (f) => config[f.key] !== savedConfig[f.key]
  ).length;

  const handleChange = useCallback(
    (key: keyof AdeCalibrationConfig, val: number) => {
      setConfig((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const handleToggleEdit = (groupId: string) => {
    setEditingGroup((prev) => (prev === groupId ? null : groupId));
  };

  const handleResetAll = () => {
    setConfig({ ...DEFAULT_CONFIG });
    setSavedConfig({ ...DEFAULT_CONFIG });
    setEditingGroup(null);
    toast.success('Đã khôi phục về mặc định');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setEditingGroup(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSavedConfig({ ...config });
      toast.success('Lưu thành công', {
        description: `Cập nhật hiệu chuẩn cho ${slave.name}`
      });
    } catch {
      toast.error('Lưu thất bại', {
        description: 'Không thể kết nối với thiết bị. Thử lại sau.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0'>
        {/* Header */}
        <DialogHeader className='border-border border-b px-5 py-3.5'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <div className='rounded-xl bg-[linear-gradient(135deg,#0859AA,#032444)] p-2 shadow-xs'>
                <Settings2 className='h-4 w-4 text-white' />
              </div>
              <div>
                <DialogTitle className='text-sm leading-tight font-bold'>
                  Hiệu chuẩn ADE — {slave.name}
                </DialogTitle>
                <DialogDescription className='mt-0.5 text-[11px]'>
                  Serial:{' '}
                  <span className='font-mono font-medium'>
                    {slave.serial_number || slave.id}
                  </span>
                  {' · '}
                  <span
                    className={cn(
                      'font-medium',
                      slave.online ? 'text-emerald-600' : 'text-red-500'
                    )}
                  >
                    {slave.online ? '● Trực tuyến' : '● Ngoại tuyến'}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Status bar */}
        <div
          className={cn(
            'flex items-center gap-2 px-5 py-2 text-xs font-medium',
            totalDirty > 0
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
          )}
        >
          {totalDirty > 0 ? (
            <>
              <AlertTriangle className='h-3.5 w-3.5 shrink-0' />
              <span>
                <strong>{totalDirty}</strong> thông số thay đổi chưa lưu
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className='h-3.5 w-3.5 shrink-0' />
              <span>Tất cả thông số đang đồng bộ</span>
            </>
          )}
        </div>

        {/* Body */}
        <div className='flex-1 overflow-y-auto px-5 py-3.5'>
          <div className='space-y-4'>
            {FIELD_GROUPS.map((group) => {
              const Icon = group.icon;
              const isEditing = editingGroup === group.id;
              const groupDirty = group.fields.filter(
                (f) => config[f.key] !== savedConfig[f.key]
              ).length;

              return (
                <div key={group.id} className='space-y-1.5'>
                  {/* Group header */}
                  <div
                    className={cn(
                      'flex items-center justify-between rounded-lg px-3 py-1.5',
                      group.bgColor
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      <Icon className={cn('h-3.5 w-3.5', group.color)} />
                      <span className={cn('text-xs font-bold', group.color)}>
                        {group.title}
                      </span>
                      {groupDirty > 0 && (
                        <Badge
                          variant='outline'
                          className='h-4 border-amber-400 px-1 text-[9px] text-amber-600'
                        >
                          {groupDirty}
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant={isEditing ? 'default' : 'ghost'}
                      size='sm'
                      className={cn(
                        'h-6 gap-1 px-2 text-[11px] font-semibold',
                        isEditing
                          ? 'bg-primary text-primary-foreground'
                          : group.color
                      )}
                      onClick={() => handleToggleEdit(group.id)}
                    >
                      {isEditing ? (
                        <>
                          <X className='h-2.5 w-2.5' /> Hủy
                        </>
                      ) : (
                        <>
                          <Edit2 className='h-2.5 w-2.5' /> Sửa
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Rows */}
                  <div className='space-y-1'>
                    {group.fields.map((field) => (
                      <FieldRow
                        key={field.key}
                        meta={field}
                        value={config[field.key] as number}
                        savedValue={savedConfig[field.key] as number}
                        isEditing={isEditing}
                        onChange={handleChange}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className='border-border bg-muted/20 flex items-center justify-between border-t px-5 py-3'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='text-muted-foreground hover:text-foreground h-8 gap-1.5 text-xs'
                disabled={isSaving}
              >
                <RotateCcw className='h-3.5 w-3.5' />
                Mặc định
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className='flex items-center gap-2'>
                  <AlertTriangle className='h-5 w-5 text-amber-500' />
                  Khôi phục về mặc định?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Khôi phục 16 thông số của <strong>{slave.name}</strong> về mặc
                  định ban đầu.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetAll}
                  className='bg-amber-500 text-white hover:bg-amber-600'
                >
                  Khôi phục
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='h-8 text-xs'
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Đóng
            </Button>

            <Button
              size='sm'
              className='h-8 gap-1.5 bg-[linear-gradient(180deg,#0859AA_0%,#032444_100%)] text-xs font-semibold text-white hover:opacity-90'
              onClick={handleSave}
              disabled={isSaving || totalDirty === 0}
            >
              {isSaving ? (
                <>
                  <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className='h-3.5 w-3.5' />
                  Lưu
                  {totalDirty > 0 && (
                    <Badge className='ml-0.5 h-4 bg-white/20 px-1 text-[9px] text-white'>
                      {totalDirty}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
