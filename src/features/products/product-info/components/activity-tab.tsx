'use client';

import {
  Device,
  SubDevice,
  useSyncDevices,
  useTurnOnOffLight,
  useSetBrightnessLight
} from '@/core/domains/devices';
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
import { Wrench, RefreshCw, Settings, Activity } from 'lucide-react';
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

interface ActivityTabProps {
  device: Device;
}

export function ActivityTab({ device }: ActivityTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [requests, setRequests] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<Record<string, boolean>>({});
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

  // Initialize switch states from device data (for both SWITCH and LIGHT devices)
  // useEffect(() => {
  //   const devicesWithOnOff = [...switchDevices, ...lightDevices];
  //   const newSwitchState = Object.fromEntries(
  //     devicesWithOnOff.map((d) => [
  //       d.device_id,
  //       !!(d.last_state?.on as boolean | undefined)
  //     ])
  //   );
  //   setSwitchState((prev) => {
  //     if (JSON.stringify(prev) !== JSON.stringify(newSwitchState)) {
  //       return newSwitchState;
  //     }
  //     return prev;
  //   });
  // }, [switchDevices, lightDevices]);

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
        OPERATION_LABELS[journal.operation] || journal.operation;

      // Get execution commands (only for operations that have execution)
      const executions = journal.attributes?.execution || [];
      const executionLabels =
        executions.length > 0
          ? executions
              .map((exec) => {
                const commandLabel =
                  COMMAND_LABELS[exec.command] || exec.command;
                const params = exec.params || {};

                // Format params based on command
                let paramText = '';
                if (exec.command === 'lms.devices.commands.OnOff') {
                  paramText =
                    params.on !== undefined ? (params.on ? 'Bật' : 'Tắt') : '';
                } else if (
                  exec.command === 'lms.devices.commands.BrightnessAbsolute'
                ) {
                  paramText =
                    params.brightness !== undefined
                      ? `${params.brightness}%`
                      : '';
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
  }, [journalsData, subDevices]);

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
    [toggleDevice, device.id, device.ctrl_channel_id]
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
    setSyncRequestId(undefined);
    setSyncPollInterval(undefined);
  };

  return (
    <>
      <div className='flex items-center justify-end gap-2'>
        <div className='w-50'>
          <Select
            value={selectedDeviceId ?? '__all__'}
            onValueChange={(value) => {
              setSelectedDeviceId(
                value === '' || value === '__all__' ? undefined : value
              );
            }}
          >
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='__all__'>Tất cả thiết bị</SelectItem>
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
        <Button
          className='bg-[#0859AA] hover:bg-[#064488]'
          onClick={handleSyncDevices}
        >
          <RefreshCw className='mr-2 h-4 w-4' />
          Đồng bộ
        </Button>
      </div>
      <div className='mt-4 flex items-stretch'>
        {/* Left Section - Device List and Actions (2/3 width) */}

        <div className='flex-[2]'>
          <div className='bg-card rounded-tr-lg border-t'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-bold'>Thiết bị</TableHead>
                  <TableHead className='font-bold'>
                    Trạng thái thiết bị
                  </TableHead>
                  <TableHead className='font-bold'>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDevices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className='text-muted-foreground text-center'
                    >
                      Không có thiết bị nào
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
                    const isPending = pending[subDevice.device_id] ?? false;
                    const brightness =
                      brightnessMap[subDevice.device_id] ??
                      (subDevice.last_state?.brightness as
                        | number
                        | undefined) ??
                      0;

                    return (
                      <TableRow
                        key={subDevice.device_id}
                        className={cn(
                          'transition-colors',
                          index === 0 && 'bg-muted/50'
                        )}
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
                              {currentState ? 'Bật' : 'Tắt'}
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
                                {currentState ? 'Bật' : 'Tắt'}
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
                                disabled={!isOnline || isPending}
                                onCheckedChange={(checked) =>
                                  handleToggleDevice(
                                    subDevice.device_id,
                                    checked
                                  )
                                }
                                className='data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500'
                              />
                            ) : isLight ? (
                              <div className='flex max-w-xs flex-1 items-center gap-3'>
                                <Switch
                                  checked={currentState}
                                  disabled={!isOnline || isPending}
                                  onCheckedChange={(checked) =>
                                    handleToggleDevice(
                                      subDevice.device_id,
                                      checked
                                    )
                                  }
                                  className='data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500'
                                />
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
                                  disabled={!isOnline || isPending}
                                  className='[&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active cursor-pointer self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-3 [&_[data-slot=slider-thumb]]:!w-3 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px]'
                                />
                                <span className='min-w-[3rem] text-right text-sm font-medium'>
                                  {brightness}%
                                </span>
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
          <div className='flex items-center justify-between pt-6'>
            <div className='text-muted-foreground text-sm'>
              {startIndex} - {endIndex} trong {totalDevices}
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
          </div>
        </div>

        {/* Right Section - Activity History (1/3 width) */}
        <div className='flex-1 space-y-4 rounded-bl-lg border-b border-l'>
          <div className='bg-card h-auto p-3'>
            <h3 className='mb-4 text-lg font-bold'>Lịch sử hoạt động</h3>
            <div className='max-h-[500px] overflow-y-auto'>
              {isLoadingJournals ? (
                <div className='space-y-3'>
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className='h-20 w-full' />
                  ))}
                </div>
              ) : activityHistory.length === 0 ? (
                <div className='text-muted-foreground py-8 text-center text-sm'>
                  Không có lịch sử hoạt động
                </div>
              ) : (
                <div className='space-y-2'>
                  {activityHistory.map((activity) => {
                    const IconComponent = getOperationIcon(activity.operation);
                    return (
                      <div
                        key={activity.id}
                        className='rounded-md bg-blue-50 px-3 py-2 dark:bg-blue-950/20'
                      >
                        <div className='flex items-center gap-2'>
                          <IconComponent className='h-3.5 w-3.5 shrink-0 text-orange-500' />
                          <div className='min-w-0 flex-1 space-y-0.5'>
                            <div className='flex items-center gap-2 text-sm'>
                              <span className='truncate font-medium'>
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
                                  <span className='truncate'>
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
    </>
  );
}
