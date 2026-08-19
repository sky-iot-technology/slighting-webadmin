'use client';

import {
  Device,
  SubDevice,
  useSyncDevices,
  useTurnOnOffLight,
  useSetBrightnessLight,
  useSyncSTLSmartState,
  devicesApi
} from '@/core/domains/devices';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetJournalsByEntityId,
  OPERATION_LABELS,
  COMMAND_LABELS,
  Journal
} from '@/core/domains/journals';
import { Button } from '@/ui/components/ui/button';
import { Switch } from '@/ui/components/ui/switch';
import { Slider } from '@/ui/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/ui/components/ui/pagination';
import {
  Wrench,
  RefreshCw,
  Settings,
  Activity,
  Flame,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { RequestWatcher } from '@/features/map/components/RequestWatcher';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { format } from 'date-fns';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { useCan } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { Input } from '@/ui/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/ui/components/ui/dialog';

interface ActivityTabProps {
  device: Device;
}

export function ActivityTab({ device }: ActivityTabProps) {
  const { t } = useTranslation();
  const canControl = useCan('device', 'control');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [requests, setRequests] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const [alarmSettingsModalOpen, setAlarmSettingsModalOpen] = useState(false);
  const [fireAlarmTimeout, setFireAlarmTimeout] = useState<number>(60);
  const [inputsConfig, setInputsConfig] = useState<
    Record<
      string,
      { enable: boolean; logic_level: number; trigger_time: number }
    >
  >({
    alarm_input_1: { enable: true, logic_level: 0, trigger_time: 1000 },
    alarm_input_2: { enable: true, logic_level: 0, trigger_time: 1000 },
    detect_input_1: { enable: true, logic_level: 0, trigger_time: 1000 },
    detect_input_2: { enable: true, logic_level: 0, trigger_time: 1000 }
  });

  // Load configuration from device/subDevices if available
  useEffect(() => {
    if (!device) return;

    const devAny = device as any;
    let timeout =
      devAny.last_state?.fire_alarm_timeout ||
      devAny.attributes?.fire_alarm_timeout?.t;

    const deviceList = device.devices ?? [];

    if (timeout === undefined) {
      const configSubDev = deviceList.find(
        (sd) => sd.last_state && 'fire_alarm_timeout' in sd.last_state
      );
      if (configSubDev?.last_state) {
        timeout = configSubDev.last_state.fire_alarm_timeout;
      }
    }

    setFireAlarmTimeout(Number(timeout ?? 60));

    const inputKeys = [
      'alarm_input_1',
      'alarm_input_2',
      'detect_input_1',
      'detect_input_2'
    ];
    const newConfig = { ...inputsConfig };
    let hasUpdates = false;

    inputKeys.forEach((key) => {
      const subDev = deviceList.find(
        (d) =>
          d.device_id.endsWith(key) ||
          d.device_id === key ||
          d.name?.toLowerCase().includes(key.replace('_', ' '))
      );
      if (subDev) {
        const state = subDev.last_state;
        newConfig[key] = {
          enable: state?.enable !== undefined ? !!state.enable : true,
          logic_level:
            state?.logic_level !== undefined ? Number(state.logic_level) : 0,
          trigger_time:
            state?.trigger_time !== undefined
              ? Number(state.trigger_time)
              : 1000
        };
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      setInputsConfig(newConfig);
    }
  }, [device]);

  // Mutation for saving fire alarm configuration
  const { mutate: saveConfig, isPending: isSavingConfig } = useMutation({
    mutationFn: (body: any) => devicesApi.sendCommand(body),
    onSuccess: (data) => {
      toast.success(
        t('toast.request_sent_success' as any) ||
          'Gửi yêu cầu cấu hình thành công!'
      );
      setAlarmSettingsModalOpen(false);

      if (data?.request_id) {
        setRequests((prev) => ({
          ...prev,
          general_config: data.request_id
        }));
        setPending((p) => ({ ...p, general_config: true }));
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Lưu cấu hình thất bại!');
    }
  });

  const handleSaveConfig = () => {
    const execution = [
      {
        command: 'lms.devices.commands.ConfigureFireAlarm',
        params: {
          fire_alarm_timeout: fireAlarmTimeout,
          inputs: Object.entries(inputsConfig).map(([key, config]) => ({
            name: key,
            enable: config.enable,
            logic_level: config.logic_level,
            trigger_time: config.trigger_time
          }))
        }
      }
    ];

    saveConfig({
      device_id: String(device.id),
      channel_route: device.ctrl_channel_id,
      command: {
        devices: [String(device.id)],
        execution
      }
    } as any);
  };

  const [syncPending, setSyncPending] = useState(false);
  const [switchState, setSwitchState] = useState<Record<string, boolean>>({});
  const [brightnessMap, setBrightnessMap] = useState<Record<string, number>>(
    {}
  );
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
    undefined
  );
  const [syncRequestId, setSyncRequestId] = useState<string | undefined>(
    undefined
  );
  const [syncPollInterval, setSyncPollInterval] = useState<number | undefined>(
    undefined
  );
  const { mutate: toggleDevice } = useTurnOnOffLight();
  const { mutate: setBrightness } = useSetBrightnessLight();
  const { mutate: syncSTLSmartState } = useSyncSTLSmartState();
  const { mutate: syncDevices } = useSyncDevices();

  // Fetch activity history (journals) - fetch all operations
  const { data: journalsData, isLoading: isLoadingJournals } =
    useGetJournalsByEntityId(String(device.id), {
      with_attributes: true,
      with_metadata: true,
      limit: 10,
      offset: 0,
      operation: 'client.execute'
    });

  // Get all sub-devices from the device
  const subDevices = useMemo(() => device.devices ?? [], [device]);

  // Filter devices by type
  const switchDevices = useMemo(
    () =>
      subDevices.filter(
        (d) => d.type === 'lms.devices.types.SWITCH'
      ) as SubDevice[],
    [subDevices]
  );

  const lightDevices = useMemo(
    () =>
      subDevices.filter(
        (d) => d.type === 'lms.devices.types.LIGHT'
      ) as SubDevice[],
    [subDevices]
  );

  const isAlarmDevice = useMemo(
    () => device.type === 'lms.devices.types.FIRE_ALARM',
    [device.type]
  );

  // Initialize switch states from device data (for both SWITCH and LIGHT devices)
  useEffect(() => {
    const newSwitchState: Record<string, boolean> = {};
    const newBrightnessMap: Record<string, number> = {};

    [...switchDevices, ...lightDevices].forEach((device) => {
      const id = device.device_id;

      if (pending[id]) return;

      const isOn =
        (device.last_state as any)?.['lms.devices.traits.OnOff']?.on ??
        device.last_state?.on;
      newSwitchState[id] = !!isOn;

      if (device.type === 'lms.devices.types.LIGHT') {
        const rawBrightness = device.last_state?.brightness;
        newBrightnessMap[id] =
          typeof rawBrightness === 'number'
            ? rawBrightness
            : Number(rawBrightness) || 0;
      }
    });

    setSwitchState((prev) => ({ ...prev, ...newSwitchState }));
    setBrightnessMap((prev) => ({ ...prev, ...newBrightnessMap }));
  }, [lightDevices, switchDevices, pending]);
  // Initialize brightness map from device data
  useEffect(() => {
    const newBrightnessMap = Object.fromEntries(
      lightDevices.map((d) => [
        d.device_id,
        (d.last_state?.brightness as number | undefined) ?? 0
      ])
    ) as Record<string, number>;
    setBrightnessMap((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(newBrightnessMap)) {
        return newBrightnessMap;
      }
      return prev;
    });
  }, [lightDevices]);

  // Combine all devices for display
  // Note: DON'T include sensor devices because they don't have on/off or brightness
  const allDevices = useMemo(
    () => [...switchDevices, ...lightDevices],
    [switchDevices, lightDevices]
  );

  // Format activity history from journals
  const activityHistory = useMemo(() => {
    if (!journalsData?.journals) return [];

    return journalsData.journals.map((journal: Journal) => {
      // Get operation label
      const operationLabel =
        t(OPERATION_LABELS[journal.operation] as any) || journal.operation;

      // Get execution commands (only for operations that have execution)
      const executions = journal.attributes?.execution || [];
      const executionLabels =
        executions.length > 0
          ? executions
              .map((exec) => {
                const commandLabel =
                  t(COMMAND_LABELS[exec.command] as any) || exec.command;
                const params = exec.params || {};

                // Format params based on command
                let paramText = '';
                if (exec.command === 'lms.devices.commands.OnOff') {
                  paramText =
                    params.on !== undefined
                      ? params.on
                        ? t('journals.on')
                        : t('journals.off')
                      : '';
                } else if (
                  exec.command === 'lms.devices.commands.BrightnessAbsolute'
                ) {
                  paramText =
                    params.brightness !== undefined
                      ? `${params.brightness}%`
                      : '';
                } else if (exec.command === 'lms.devices.commands.Ota') {
                  paramText = '';
                } else if (Object.keys(params).length > 0) {
                  paramText = Object.entries(params)
                    .map(([key, value]) => {
                      // Format boolean values
                      if (typeof value === 'boolean') {
                        return `${key}: ${value ? 'Bật' : 'Tắt'}`;
                      }
                      return `${key}: ${value}`;
                    })
                    .join(', ');
                }

                return paramText
                  ? `${commandLabel} - ${paramText}`
                  : commandLabel;
              })
              .join(', ')
          : undefined;

      const deviceIds = journal.attributes?.children_clients || [];
      const deviceNames =
        deviceIds.length > 0
          ? deviceIds
              .map((deviceId) => {
                const subDevice = subDevices.find(
                  (d) => d.device_id === deviceId
                );
                return subDevice?.name || deviceId;
              })
              .join(', ')
          : undefined;

      // Format timestamp
      const timestamp = journal.occurred_at
        ? format(new Date(journal.occurred_at), 'dd/MM/yyyy HH:mm:ss')
        : '';

      return {
        id:
          journal.attributes?.request_id ||
          journal.occurred_at ||
          Math.random().toString(),
        operation: operationLabel,
        execution: executionLabels,
        devices: deviceNames,
        timestamp
      };
    });
  }, [journalsData, subDevices, t]);

  // Get icon for operation type based on operation label
  const getOperationIcon = (operationLabel: string) => {
    if (operationLabel.includes('Điều khiển')) return Settings;
    if (operationLabel.includes('Đồng bộ') || operationLabel.includes('Query'))
      return RefreshCw;
    if (operationLabel.includes('lịch')) return Activity;
    return Wrench;
  };

  const totalDevices = allDevices.length;

  // Paginated devices
  const paginatedDevices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return allDevices.slice(start, end);
  }, [allDevices, currentPage, pageSize]);

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalDevices);
  const totalPages = Math.ceil(totalDevices / pageSize);

  const isOnline = device.device_info?.online ?? false;

  const handleToggleDevice = useCallback(
    (deviceId: string, status: boolean) => {
      setPending((p) => ({ ...p, [deviceId]: true }));

      const isSTLSmart = device.type === 'lms.devices.types.STL_SMART';

      if (isSTLSmart) {
        const brightness = status ? 100 : 0;
        setBrightnessMap((prev) => ({
          ...prev,
          [deviceId]: brightness
        }));

        syncSTLSmartState(
          {
            device_id: String(device.id),
            channel_route: device.ctrl_channel_id,
            devices: [deviceId],
            status,
            brightness
          },
          {
            onSuccess: (data) => {
              setRequests((prev) => ({
                ...prev,
                [deviceId]: data.request_id
              }));
              setSwitchState((prev) => ({
                ...prev,
                [deviceId]: status
              }));
            },
            onError: () => {
              setPending((p) => ({ ...p, [deviceId]: false }));
            }
          }
        );
        return;
      }

      toggleDevice(
        {
          device_id: String(device.id),
          channel_route: device.ctrl_channel_id,
          devices: [deviceId],
          status
        },
        {
          onSuccess: (data) => {
            setRequests((prev) => ({
              ...prev,
              [deviceId]: data.request_id
            }));
            setSwitchState((prev) => ({
              ...prev,
              [deviceId]: status
            }));
            // setPending((p) => ({ ...p, [deviceId]: false }));
          },
          onError: () => {
            setPending((p) => ({ ...p, [deviceId]: false }));
          }
        }
      );
    },
    [
      syncSTLSmartState,
      toggleDevice,
      device.id,
      device.ctrl_channel_id,
      device.type
    ]
  );

  const handleBrightnessChange = useCallback(
    (deviceId: string, brightness: number) => {
      if (!isOnline) return;

      setBrightness(
        {
          device_id: String(device.id),
          channel_route: device.ctrl_channel_id,
          devices: [deviceId],
          brightness
        },
        {
          onSuccess: (data) => {
            setRequests((prev) => ({
              ...prev,
              [deviceId]: data.request_id
            }));
            // If brightness > 0, turn on the light
            if (brightness > 0) {
              setSwitchState((prev) => ({
                ...prev,
                [deviceId]: true
              }));
            }
          },
          onError: () => {
            // Rollback brightness on error
            const currentBrightness =
              brightnessMap[deviceId] ??
              (lightDevices.find((d) => d.device_id === deviceId)?.last_state
                ?.brightness as number | undefined) ??
              0;
            setBrightnessMap((prev) => ({
              ...prev,
              [deviceId]: currentBrightness
            }));
          }
        }
      );
    },
    [
      setBrightness,
      device.id,
      device.ctrl_channel_id,
      isOnline,
      brightnessMap,
      lightDevices
    ]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleSyncDevices = () => {
    const children_ids: string[] =
      selectedDeviceId === undefined
        ? allDevices.map((d) => d.device_id)
        : [selectedDeviceId];

    syncDevices(
      {
        device_id: String(device.id),
        children_ids,
        channel_route: device.ctrl_channel_id
      },
      {
        onSuccess: (data) => {
          // Store request_id and poll_interval to start polling
          setSyncPending(true);
          setSyncRequestId(data.request_id);
          setSyncPollInterval(data.poll_interval * 1000); // Convert to milliseconds
        }
      }
    );
  };

  const handleSyncStopped = (reason: string) => {
    if (reason === 'completed') {
      // Device state is already updated via useQueryStatus
      // The component will re-render automatically when device prop updates
    }
    setSyncPending(false);
    setSyncRequestId(undefined);
    setSyncPollInterval(undefined);
  };

  return (
    <>
      <div className='flex items-center justify-center gap-2 sm:justify-end'>
        <div className='w-50'>
          <Select
            value={selectedDeviceId ?? '__all__'}
            onValueChange={(value) => {
              setSelectedDeviceId(
                value === '' || value === '__all__' ? undefined : value
              );
            }}
          >
            <SelectTrigger className='!h-[30px] w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='__all__'>
                {t('products.detail.activity.select_all' as any)}
              </SelectItem>
              {allDevices.map((subDevice) => (
                <SelectItem
                  key={subDevice.device_id}
                  value={subDevice.device_id}
                >
                  {subDevice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isAlarmDevice && (
          <Button
            variant='outline'
            className='!h-[30px] bg-[#0859AA] hover:bg-[#064488]'
            onClick={() => setAlarmSettingsModalOpen(true)}
            title='Cài đặt thông số báo cháy chung'
          >
            <Settings className='mr-2 h-4 w-4' />
            Cài đặt
          </Button>
        )}
        <Button
          className='!h-[30px] bg-[#0859AA] hover:bg-[#064488]'
          onClick={handleSyncDevices}
        >
          <RefreshCw className='mr-1 h-4 w-4' />
          {t('products.detail.activity.sync' as any)}
        </Button>
      </div>
      <div className='mt-4 flex flex-col items-stretch lg:flex-row'>
        {/* Left Section - Device List and Actions (2/3 width) */}

        <div className='flex-[2]'>
          <div className='bg-card rounded-tr-lg border-t'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50'>
                  <TableHead className='font-bold'>
                    {t('products.detail.activity.table.device' as any)}
                  </TableHead>
                  <TableHead className='font-bold'>
                    {t('products.detail.activity.table.status' as any)}
                  </TableHead>
                  <TableHead className='font-bold'>
                    {t('products.detail.activity.table.action' as any)}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDevices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className='text-muted-foreground text-center'
                    >
                      {t('products.detail.activity.table.empty' as any)}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDevices.map((subDevice, index) => {
                    const isSwitch =
                      subDevice.type === 'lms.devices.types.SWITCH';
                    const isLight =
                      subDevice.type === 'lms.devices.types.LIGHT';
                    const isSensor =
                      subDevice.type === 'lms.devices.types.SENSOR';
                    const currentState =
                      switchState[subDevice.device_id] ?? false;
                    const isPending =
                      (pending[subDevice.device_id] || syncPending) ?? false;
                    const brightness =
                      brightnessMap[subDevice.device_id] ??
                      (subDevice.last_state?.brightness as
                        | number
                        | undefined) ??
                      0;

                    return (
                      <TableRow
                        key={subDevice.device_id}
                        className={cn('transition-colors')}
                      >
                        <TableCell className='font-medium'>
                          {subDevice.name}
                        </TableCell>
                        <TableCell>
                          {isSwitch ? (
                            <span
                              className={cn(
                                'font-medium',
                                currentState ? 'text-green-600' : 'text-red-600'
                              )}
                            >
                              {currentState
                                ? t('products.detail.activity.status.on' as any)
                                : t(
                                    'products.detail.activity.status.off' as any
                                  )}
                            </span>
                          ) : isLight ? (
                            <div className='space-y-2'>
                              <span
                                className={cn(
                                  'font-medium',
                                  currentState
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                )}
                              >
                                {currentState
                                  ? t(
                                      'products.detail.activity.status.on' as any
                                    )
                                  : t(
                                      'products.detail.activity.status.off' as any
                                    )}
                                <span className='px-2'>{`  _ `}</span>
                                {`${brightness}%`}
                              </span>
                            </div>
                          ) : (
                            <span className='text-muted-foreground'>-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-4'>
                            {isSwitch ? (
                              <Switch
                                checked={currentState}
                                disabled={!canControl || !isOnline || isPending}
                                onCheckedChange={(checked) =>
                                  handleToggleDevice(
                                    subDevice.device_id,
                                    checked
                                  )
                                }
                                className='dark:data-[state=unchecked]:!bg-gray-3 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500'
                                thumbClassName='dark:data-[state=checked]:!bg-black dark:data-[state=unchecked]:!bg-black !translate-y-[-0.5px]'
                              />
                            ) : isLight ? (
                              <div className='flex max-w-xs flex-1 flex-col items-center gap-3 sm:flex-row'>
                                <Switch
                                  checked={currentState}
                                  disabled={
                                    !canControl || !isOnline || isPending
                                  }
                                  onCheckedChange={(checked) =>
                                    handleToggleDevice(
                                      subDevice.device_id,
                                      checked
                                    )
                                  }
                                  className='dark:data-[state=unchecked]:!bg-gray-3 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500'
                                  thumbClassName='dark:data-[state=checked]:!bg-black dark:data-[state=unchecked]:!bg-black !translate-y-[-0.5px]'
                                />
                                <div className='flex w-full'>
                                  <Slider
                                    value={[brightness]}
                                    onValueChange={([val]) => {
                                      setBrightnessMap((prev) => ({
                                        ...prev,
                                        [subDevice.device_id]: val
                                      }));
                                    }}
                                    onValueCommit={([val]) => {
                                      handleBrightnessChange(
                                        subDevice.device_id,
                                        val
                                      );
                                    }}
                                    min={0}
                                    max={100}
                                    step={1}
                                    disabled={
                                      !canControl || !isOnline || isPending
                                    }
                                    className='dark:[&_[data-slot=slider-thumb]]:!bg-map-range-slider-active dark:[&_[data-slot=slider-thumb]]:border-map-range-slider-active [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active cursor-pointer self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-3 [&_[data-slot=slider-thumb]]:!w-3 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px]'
                                  />
                                  <span className='min-w-[3rem] text-right text-sm font-medium'>
                                    {brightness}%
                                  </span>
                                </div>
                              </div>
                            ) : isSensor ? (
                              <div className='text-muted-foreground text-sm'></div>
                            ) : (
                              <span className='text-muted-foreground'>-</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {/* <div className='flex items-center justify-between pt-6'>
            <div className='text-muted-foreground text-sm'>
              {startIndex} - {endIndex} {t('general.start_end')} {totalDevices}
            </div>
            <div className='flex items-center gap-4'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem className='cursor-pointer'>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      className={cn(
                        'cursor-pointer',
                        currentPage === 1 && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(page as number)}
                          isActive={currentPage === page}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem className='cursor-pointer'>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      className={cn(
                        'cursor-pointer',
                        currentPage === totalPages &&
                        'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div> */}
        </div>

        {/* Right Section - Activity History (1/3 width) */}
        <div className='min-w-0 flex-1 space-y-4 sm:max-w-full sm:rounded-bl-lg sm:border-b sm:border-l'>
          <div className='bg-card h-auto p-3'>
            <h3 className='mb-4 text-lg font-bold'>
              {t('products.detail.activity.history.title' as any)}
            </h3>
            <div className='max-h-[500px] overflow-y-auto'>
              {isLoadingJournals ? (
                <div className='space-y-3'>
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className='h-20 w-full' />
                  ))}
                </div>
              ) : activityHistory.length === 0 ? (
                <div className='text-muted-foreground py-8 text-center text-sm'>
                  {t('products.detail.activity.history.empty' as any)}
                </div>
              ) : (
                <div className='space-y-2'>
                  {activityHistory.map((activity) => {
                    const IconComponent = getOperationIcon(activity.operation);
                    return (
                      <div
                        key={activity.id}
                        className='dark:bg-card-primary rounded-md bg-blue-50 px-3 py-2'
                      >
                        <div className='flex items-center gap-2'>
                          <IconComponent className='h-3.5 w-3.5 shrink-0 text-orange-500' />
                          <div className='min-w-0 flex-1 space-y-0.5'>
                            <div className='flex flex-col items-start gap-2 text-sm sm:flex-row sm:items-center'>
                              <span className='block truncate font-medium'>
                                {activity.devices}
                              </span>
                              {activity.operation && (
                                <span className='shrink-0'>
                                  • {activity.operation}
                                </span>
                              )}
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2 text-xs'>
                                {activity.execution && (
                                  <span className='block truncate'>
                                    {activity.execution}
                                  </span>
                                )}
                              </div>
                              <span className='text-muted-foreground text-xs'>
                                {activity.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Request Watchers for polling device status */}
        {Object.entries(requests).map(([deviceId, requestId]) => (
          <RequestWatcher
            key={deviceId}
            requestId={requestId}
            deviceId={String(device.id)}
            onStopped={() => {
              setRequests((prev) => {
                const updated = { ...prev };
                delete updated[deviceId];
                return updated;
              });
              setPending((p) => ({ ...p, [deviceId]: false }));
            }}
          />
        ))}

        {/* Request Watcher for sync operation */}
        {syncRequestId && (
          <RequestWatcher
            requestId={syncRequestId}
            deviceId={String(device.id)}
            pollInterval={syncPollInterval}
            onStopped={handleSyncStopped}
          />
        )}
      </div>
      {/* Alarm Settings Modal */}
      <Dialog
        open={alarmSettingsModalOpen}
        onOpenChange={setAlarmSettingsModalOpen}
      >
        <DialogContent
          className='flex max-h-[85vh] flex-col overflow-y-auto border-slate-200 sm:max-w-lg dark:border-slate-800'
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className='border-b border-slate-100 pb-2 dark:border-slate-800'>
            <DialogTitle className='flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-50'>
              <Settings className='h-5 w-5 text-blue-600 dark:text-blue-400' />
              Cài đặt thông số báo cháy
            </DialogTitle>
            <DialogDescription className='text-xs text-slate-500 dark:text-slate-400'>
              Thiết lập các ngưỡng thời gian duy trì báo cháy và cấu hình mức
              logic, thời gian trigger cho từng cổng Input.
            </DialogDescription>
          </DialogHeader>

          <div className='flex-1 space-y-5 overflow-y-auto py-4 pr-1'>
            {/* General Configuration Section */}
            <div className='space-y-3 rounded-lg border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/20'>
              <div className='flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200'>
                <Flame className='h-4 w-4 text-orange-500' />
                Cấu hình chung tủ báo cháy
              </div>
              <div className='space-y-1.5'>
                <div className='flex items-center justify-between gap-4'>
                  <label
                    htmlFor='fireAlarmTimeout'
                    className='text-xs font-medium text-slate-600 dark:text-slate-400'
                  >
                    Thời gian duy trì chế độ báo cháy (giây)
                  </label>
                  <div className='relative w-32 shrink-0'>
                    <Input
                      id='fireAlarmTimeout'
                      type='number'
                      min={1}
                      value={fireAlarmTimeout}
                      onChange={(e) =>
                        setFireAlarmTimeout(Number(e.target.value))
                      }
                      className='h-8 pr-8 text-right text-xs focus:ring-1 focus:ring-blue-500'
                    />
                    <span className='pointer-events-none absolute top-2 right-2 text-[10px] font-medium text-slate-400'>
                      giây
                    </span>
                  </div>
                </div>
                <p className='text-[10px] leading-normal text-slate-500 dark:text-slate-400'>
                  Thời gian hệ thống duy trì kích hoạt trạng thái báo cháy. Sau
                  khoảng thời gian này, thiết bị sẽ tự động thoát khỏi chế độ
                  báo cháy nếu không phát hiện sự cố tiếp diễn.
                </p>
              </div>
            </div>

            {/* Input Ports Configuration Section */}
            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200'>
                <Clock className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                Cấu hình các cổng Input ({Object.keys(inputsConfig).length}{' '}
                cổng)
              </div>

              <div className='space-y-3'>
                {Object.entries(inputsConfig).map(([key, config]) => {
                  const inputLabels: Record<string, string> = {
                    alarm_input_1: 'Cổng báo động 1 (Alarm Input 1)',
                    alarm_input_2: 'Cổng báo động 2 (Alarm Input 2)',
                    detect_input_1: 'Cổng báo đứt dây 1 (Detect Input 1)',
                    detect_input_2: 'Cổng báo đứt dây 2 (Detect Input 2)'
                  };
                  const label = inputLabels[key] || key;

                  return (
                    <div
                      key={key}
                      className={cn(
                        'rounded-lg border p-3.5 transition-all duration-200',
                        config.enable
                          ? 'bg-card border-slate-200 dark:border-slate-800'
                          : 'border-slate-100 bg-slate-50/30 opacity-70 dark:border-slate-900 dark:bg-slate-900/5'
                      )}
                    >
                      {/* Port Header: Label + Enable Toggle */}
                      <div className='mb-3 flex items-center justify-between border-b border-dashed border-slate-100 pb-2 dark:border-slate-800/60'>
                        <span className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
                          {label}
                        </span>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] text-slate-500 dark:text-slate-400'>
                            {config.enable ? 'Đang kích hoạt' : 'Vô hiệu hóa'}
                          </span>
                          <Switch
                            checked={config.enable}
                            onCheckedChange={(checked) => {
                              setInputsConfig((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], enable: checked }
                              }));
                            }}
                            className='dark:data-[state=unchecked]:!bg-gray-3 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500'
                            thumbClassName='dark:data-[state=checked]:!bg-black dark:data-[state=unchecked]:!bg-black'
                          />
                        </div>
                      </div>

                      {/* Port Config Fields (Visible/Active when enabled) */}
                      {config.enable && (
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                          {/* Logic Level Select */}
                          <div className='space-y-1.5'>
                            <label className='text-[10px] font-semibold text-slate-600 dark:text-slate-400'>
                              Mức logic hoạt động
                            </label>
                            <Select
                              value={String(config.logic_level)}
                              onValueChange={(val) => {
                                setInputsConfig((prev) => ({
                                  ...prev,
                                  [key]: {
                                    ...prev[key],
                                    logic_level: Number(val)
                                  }
                                }));
                              }}
                            >
                              <SelectTrigger className='h-8 text-xs focus:ring-1 focus:ring-blue-500'>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='0' className='text-xs'>
                                  Active Low (Mức thấp)
                                </SelectItem>
                                <SelectItem value='1' className='text-xs'>
                                  Active High (Mức cao)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Trigger Time Input */}
                          <div className='space-y-1.5'>
                            <label className='text-[10px] font-semibold text-slate-600 dark:text-slate-400'>
                              Thời gian trễ Trigger (ms)
                            </label>
                            <div className='relative'>
                              <Input
                                type='number'
                                min={0}
                                value={config.trigger_time}
                                onChange={(e) => {
                                  setInputsConfig((prev) => ({
                                    ...prev,
                                    [key]: {
                                      ...prev[key],
                                      trigger_time: Number(e.target.value)
                                    }
                                  }));
                                }}
                                className='h-8 pr-8 text-right text-xs focus:ring-1 focus:ring-blue-500'
                                placeholder='Ví dụ: 1000'
                              />
                              <span className='pointer-events-none absolute top-2 right-2 text-[10px] font-medium text-slate-400'>
                                ms
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-2.5 border-t border-slate-100 pt-3 dark:border-slate-800'>
            <Button
              variant='outline'
              onClick={() => setAlarmSettingsModalOpen(false)}
              className='h-8 px-3.5 py-1.5 text-xs'
              disabled={isSavingConfig}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveConfig}
              className='flex h-8 items-center gap-1.5 bg-[#0859AA] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#064488]'
              disabled={isSavingConfig}
            >
              {isSavingConfig ? (
                <>
                  <RefreshCw className='h-3 w-3 animate-spin' />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
