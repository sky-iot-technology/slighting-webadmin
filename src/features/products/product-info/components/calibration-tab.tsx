'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
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
  ChevronDown,
  ChevronUp,
  Cpu,
  Gauge,
  Sliders,
  Zap,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Device } from '@/core/domains/devices';
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

// ─── Default config values ────────────────────────────────────────────────────

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
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  fields: FieldMeta[];
}

const FIELD_GROUPS: FieldGroup[] = [
  {
    id: 'hardware',
    title: 'Phần cứng & Tỷ lệ biến đổi',
    subtitle: 'Linh kiện cảm biến và cầu phân áp trên thiết bị',
    icon: Cpu,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    fields: [
      {
        key: 'Ri',
        title: 'Điện trở Shunt',
        varName: 'Ri',
        description: 'Điện trở cảm biến dòng điện (mΩ)',
        unit: 'mΩ',
        min: 0
      },
      {
        key: 'Rv',
        title: 'Điện trở phân áp',
        varName: 'Rv',
        description: 'Điện trở cầu phân áp điện áp (kΩ)',
        unit: 'kΩ',
        min: 0
      },
      {
        key: 'CT',
        title: 'Tỷ lệ biến dòng',
        varName: 'CT',
        description: 'Tỷ lệ biến dòng điện (CT ratio)',
        unit: ':1',
        min: 1
      }
    ]
  },
  {
    id: 'fullscale',
    title: 'Giá trị cực đại (Full-Scale)',
    subtitle: 'Ngưỡng điện áp và công suất đếm cực đại',
    icon: Gauge,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    fields: [
      {
        key: 'Vfs_rms',
        title: 'Điện áp RMS cực đại ADC',
        varName: 'Vfs_rms',
        description: 'Điện áp RMS cực đại đầu vào ADC (≈ 0.5V / √2)',
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
        title: 'Full-Scale Active Power',
        varName: 'AWATT_FS_P',
        description: 'Mã công suất đầy tải',
        min: 0
      },
      {
        key: 'REG_FS',
        title: 'Thanh ghi cực đại ADC 24-bit',
        varName: 'REG_FS',
        description: 'Mã số nguyên cực đại ADC',
        min: 0
      }
    ]
  },
  {
    id: 'mode',
    title: 'Thanh ghi chế độ ADE',
    subtitle: 'Chế độ tính toán công suất & xuất xung tần số',
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
        description: 'Cấu hình bật/tắt HPF & kênh ADC',
        isHex: true
      },
      {
        key: 'cfmode',
        title: 'Calibration Frequency Mode',
        varName: 'cfmode',
        description: 'Cấu hình xuất xung tần số CF1/CF2',
        isHex: true
      }
    ]
  },
  {
    id: 'calibration',
    title: 'Hiệu chuẩn Gain & Offset',
    subtitle: 'Bù lệch điểm 0 và hiệu chỉnh tỉ lệ đo áp / dòng',
    icon: Zap,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    fields: [
      {
        key: 'airmsos',
        title: 'Bù lệch dòng RMS (airmsos)',
        varName: 'airmsos',
        description: 'Triệt tiêu nhiễu nền khi không tải (0A)',
        min: -32768,
        max: 32767
      },
      {
        key: 'avrmsos',
        title: 'Bù lệch áp RMS (avrmsos)',
        varName: 'avrmsos',
        description: 'Triệt tiêu nhiễu nền điện áp khi 0V',
        min: -32768,
        max: 32767
      },
      {
        key: 'avgain',
        title: 'Gain điện áp (avgain)',
        varName: 'avgain',
        description: 'Hệ số khuếch đại điện áp',
        isHex: true
      },
      {
        key: 'aigain',
        title: 'Gain dòng điện (aigain)',
        varName: 'aigain',
        description: 'Hệ số khuếch đại dòng điện',
        isHex: true
      }
    ]
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDisplayValue(value: number, meta: FieldMeta): string {
  if (meta.isFloat) {
    return value.toString();
  }

  // Format large integers with thousand separators for readability
  const decStr = value.toLocaleString('vi-VN');

  // For gain and mode registers, show decimal value along with hex in parentheses for clarity
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
  // Strip out formatting commas or parens if user pasted
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

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CalibrationFieldProps {
  meta: FieldMeta;
  value: number;
  originalValue: number;
  isEditing: boolean;
  onChange: (key: keyof AdeCalibrationConfig, value: number) => void;
}

function CalibrationField({
  meta,
  value,
  originalValue,
  isEditing,
  onChange
}: CalibrationFieldProps) {
  const displayVal = toDisplayValue(value, meta);
  const rawEditVal = value.toString();
  const [inputVal, setInputVal] = useState(rawEditVal);
  const [error, setError] = useState('');

  const isDirty = value !== originalValue;

  const handleChange = (raw: string) => {
    setInputVal(raw);
    const parsed = parseInputValue(raw, meta);
    if (parsed === null) {
      setError('Giá trị không hợp lệ');
      return;
    }
    if (meta.min !== undefined && parsed < meta.min) {
      setError(`Tối thiểu: ${meta.min}`);
      return;
    }
    if (meta.max !== undefined && parsed > meta.max) {
      setError(`Tối đa: ${meta.max}`);
      return;
    }
    setError('');
    onChange(meta.key, parsed);
  };

  const syncedInputVal = isEditing ? inputVal : displayVal;

  return (
    <div
      className={cn(
        'group relative rounded-xl border p-4 transition-all duration-200',
        isEditing
          ? 'border-primary/40 bg-primary/5 shadow-sm'
          : 'border-border bg-card hover:border-primary/20 hover:shadow-sm',
        isDirty && !isEditing && 'border-amber-300 dark:border-amber-700'
      )}
    >
      {isDirty && !isEditing && (
        <span className='absolute top-3 right-3 h-2 w-2 rounded-full bg-amber-400' />
      )}

      <div className='mb-2 flex items-start justify-between gap-2'>
        <div className='flex items-center gap-1.5'>
          <Label className='text-foreground text-xs font-bold'>
            {meta.title}
          </Label>
          <span className='text-muted-foreground font-mono text-[10px]'>
            ({meta.varName})
          </span>
        </div>

        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='text-muted-foreground hover:text-foreground h-3.5 w-3.5 shrink-0 cursor-help' />
            </TooltipTrigger>
            <TooltipContent side='top' className='max-w-xs text-xs'>
              {meta.description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isEditing ? (
        <div>
          <Input
            value={syncedInputVal}
            onChange={(e) => handleChange(e.target.value)}
            className={cn(
              'h-8 font-mono text-xs font-semibold',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            placeholder={meta.isHex ? '0x0000' : '0'}
          />
          {error && (
            <p className='text-destructive mt-1 text-[10px]'>{error}</p>
          )}
        </div>
      ) : (
        <div className='flex items-baseline justify-between gap-2'>
          <div className='flex items-baseline gap-1'>
            <span className='text-foreground font-mono text-base font-bold'>
              {displayVal}
            </span>
            {meta.unit && (
              <span className='text-muted-foreground text-xs font-medium'>
                {meta.unit}
              </span>
            )}
          </div>

          {isDirty && (
            <span className='font-mono text-[10px] text-amber-600 dark:text-amber-400'>
              gốc: {toDisplayValue(originalValue, meta)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Group Card ───────────────────────────────────────────────────────────────

interface GroupCardProps {
  group: FieldGroup;
  config: AdeCalibrationConfig;
  originalConfig: AdeCalibrationConfig;
  editingGroup: string | null;
  onToggleEdit: (groupId: string) => void;
  onChange: (key: keyof AdeCalibrationConfig, value: number) => void;
  onResetGroup: (groupId: string) => void;
}

function GroupCard({
  group,
  config,
  originalConfig,
  editingGroup,
  onToggleEdit,
  onChange,
  onResetGroup
}: GroupCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const Icon = group.icon;
  const isEditing = editingGroup === group.id;
  const dirtyCount = group.fields.filter(
    (f) => config[f.key] !== originalConfig[f.key]
  ).length;

  return (
    <Card
      className={cn(
        'overflow-hidden border transition-all duration-200',
        isEditing ? `${group.borderColor} shadow-md` : 'border-border shadow-sm'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between px-5 py-3.5',
          group.bgColor
        )}
      >
        <div className='flex items-center gap-3'>
          <div className={cn('bg-card/60 rounded-lg p-1.5')}>
            <Icon className={cn('h-4 w-4', group.color)} />
          </div>
          <div>
            <h3 className={cn('text-sm font-bold', group.color)}>
              {group.title}
              {dirtyCount > 0 && (
                <Badge
                  variant='outline'
                  className='ml-2 h-4 border-amber-400 bg-amber-50 px-1 text-[9px] text-amber-600'
                >
                  {dirtyCount} thay đổi
                </Badge>
              )}
            </h3>
            <p className='text-muted-foreground text-[11px]'>
              {group.subtitle}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-1.5'>
          {dirtyCount > 0 && !isEditing && (
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/40'
              onClick={() => onResetGroup(group.id)}
            >
              <RotateCcw className='h-3.5 w-3.5' />
            </Button>
          )}

          <Button
            variant={isEditing ? 'default' : 'ghost'}
            size='sm'
            className={cn(
              'h-7 gap-1 px-2.5 text-xs font-semibold',
              isEditing
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : `${group.color} hover:${group.bgColor}`
            )}
            onClick={() => onToggleEdit(group.id)}
          >
            {isEditing ? (
              <>
                <X className='h-3 w-3' /> Hủy
              </>
            ) : (
              <>
                <Edit2 className='h-3 w-3' /> Chỉnh sửa
              </>
            )}
          </Button>

          <Button
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-foreground h-7 w-7'
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? (
              <ChevronDown className='h-3.5 w-3.5' />
            ) : (
              <ChevronUp className='h-3.5 w-3.5' />
            )}
          </Button>
        </div>
      </div>

      {!collapsed && (
        <CardContent className='p-4'>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {group.fields.map((field) => (
              <CalibrationField
                key={field.key}
                meta={field}
                value={config[field.key] as number}
                originalValue={originalConfig[field.key] as number}
                isEditing={isEditing}
                onChange={onChange}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CalibrationTabProps {
  device: Device;
}

export function CalibrationTab({ device }: CalibrationTabProps) {
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
    (key: keyof AdeCalibrationConfig, value: number) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleToggleEdit = (groupId: string) => {
    setEditingGroup((prev) => (prev === groupId ? null : groupId));
  };

  const handleResetGroup = (groupId: string) => {
    const group = FIELD_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    setConfig((prev) => {
      const next = { ...prev };
      group.fields.forEach((f) => {
        (next[f.key] as number) = savedConfig[f.key] as number;
      });
      return next;
    });
  };

  const handleResetAll = () => {
    setConfig({ ...DEFAULT_CONFIG });
    setSavedConfig({ ...DEFAULT_CONFIG });
    setEditingGroup(null);
    toast.success('Đã khôi phục tất cả thông số về mặc định');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setEditingGroup(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSavedConfig({ ...config });
      toast.success('Lưu thông số hiệu chuẩn thành công', {
        description: `Đã cập nhật ${totalDirty} thông số cho thiết bị ${device.name}`
      });
    } catch {
      toast.error('Lưu thất bại', {
        description: 'Không thể kết nối với thiết bị. Vui lòng thử lại.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <div className='rounded-xl bg-[linear-gradient(135deg,#0859AA,#032444)] p-2.5 shadow-sm'>
            <Settings2 className='h-5 w-5 text-white' />
          </div>
          <div>
            <h2 className='text-foreground text-base font-bold'>
              Hiệu chuẩn ADE — {device.name}
            </h2>
            <p className='text-muted-foreground text-xs'>
              Cấu hình thông số phần cứng và hệ số hiệu chuẩn đo lường chip ADE
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 self-start sm:self-auto'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='h-8 gap-1.5 text-xs'
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
                  Toàn bộ thông số hiệu chuẩn sẽ được đặt lại về giá trị mặc
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
                Lưu thay đổi
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

      {/* Alert Banner */}
      {totalDirty > 0 ? (
        <div className='flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 dark:border-amber-700 dark:bg-amber-950/30'>
          <AlertTriangle className='h-4 w-4 shrink-0 text-amber-600' />
          <p className='text-xs font-medium text-amber-800 dark:text-amber-300'>
            Có <strong>{totalDirty}</strong> thông số đã thay đổi chưa lưu. Nhấn{' '}
            <strong>Lưu thay đổi</strong> để áp dụng.
          </p>
        </div>
      ) : (
        <div className='flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 dark:border-emerald-700 dark:bg-emerald-950/30'>
          <CheckCircle2 className='h-4 w-4 shrink-0 text-emerald-600' />
          <p className='text-xs font-medium text-emerald-800 dark:text-emerald-300'>
            Tất cả thông số đang đồng bộ với cấu hình thiết bị.
          </p>
        </div>
      )}

      {/* Field Groups */}
      <div className='space-y-4'>
        {FIELD_GROUPS.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            config={config}
            originalConfig={savedConfig}
            editingGroup={editingGroup}
            onToggleEdit={handleToggleEdit}
            onChange={handleChange}
            onResetGroup={handleResetGroup}
          />
        ))}
      </div>
    </div>
  );
}
