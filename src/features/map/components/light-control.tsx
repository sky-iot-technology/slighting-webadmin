'use client';
import {
  Device,
  useSetBrightnessLight,
  useTurnOnOffLight
} from '@/core/domains/devices';
import { Button } from '@/ui/components/ui/button';
import { Card } from '@/ui/components/ui/card';
import { Slider } from '@/ui/components/ui/slider';
import { Switch } from '@/ui/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/components/ui/table';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RequestWatcher } from './RequestWatcher';
import React from 'react';

type LightInfo = {
  device: Device;
};

function LightControl(props: LightInfo) {
  const lightDevices = useMemo(
    () =>
      (props.device.devices ?? []).filter(
        (device) =>
          device.type === 'lms.devices.types.LIGHT' ||
          device.type === 'lms.devices.types.SWITCH'
      ),
    [props.device.devices]
  );

  const activeLights = useMemo(
    () => lightDevices.filter((device) => device.last_state?.on).length,
    [lightDevices]
  );

  const [requests, setRequests] = useState<Record<string, string>>({});
  const [brightnessMap, setBrightnessMap] = useState<Record<string, number>>(
    {}
  );
  const [switchState, setSwitchState] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const { mutate: toggleLight } = useTurnOnOffLight();
  const { mutate: setBrightness } = useSetBrightnessLight();

  useEffect(() => {
    const newSwitchState = Object.fromEntries(
      lightDevices.map((device) => [device.device_id, !!device.last_state?.on])
    );
    const newBrightnessMap = Object.fromEntries(
      lightDevices.map((d) => [d.device_id, d.last_state?.brightness ?? 0])
    ) as Record<string, number>;

    setSwitchState((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(newSwitchState)) {
        return newSwitchState;
      }
      return prev;
    });

    setBrightnessMap((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(newBrightnessMap)) {
        return newBrightnessMap;
      }
      return prev;
    });
  }, [lightDevices]);

  const handleToggleLight = useCallback(
    (deviceIds: string[], status: boolean) => {
      setPending((p) => {
        const updated = { ...p };
        deviceIds.forEach((id) => (updated[id] = true));
        return updated;
      });

      toggleLight(
        {
          device_id: String(props.device.id),
          channel_route: props.device.ctrl_channel_id,
          devices: deviceIds,
          status
        },
        {
          onSuccess: (data) => {
            setRequests((prev) => {
              const updated = { ...prev };
              deviceIds.forEach((id) => (updated[id] = data.request_id));
              return updated;
            });

            setSwitchState((prev) => {
              const updated = { ...prev };
              deviceIds.forEach((id) => (updated[id] = status));
              return updated;
            });

            setPending((p) => {
              const updated = { ...p };
              deviceIds.forEach((id) => (updated[id] = false));
              return updated;
            });
          },
          onError: () => {
            //clear pending
            setPending((p) => {
              const updated = { ...p };
              deviceIds.forEach((id) => (updated[id] = false));
              return updated;
            });
            // clear request
            setRequests((prev) => {
              const updated = { ...prev };
              deviceIds.forEach((id) => delete updated[id]);
              return updated;
            });
          }
        }
      );
    },
    [toggleLight, props.device.id, props.device.ctrl_channel_id]
  );

  return (
    <Card className='w-full gap-1 overflow-hidden rounded-md p-0 shadow-none'>
      <Table className='hover:!bg-transparent'>
        <TableHeader className='[&_*]:text-background bg-map-lightControl-header [&_*]:text-xs [&_*]:leading-5 [&_*]:font-semibold [&_th]:h-5'>
          <TableRow className='hover:!bg-map-lightControl-header h-5'>
            <TableHead className='pl-3'>Điều khiển line</TableHead>
            <TableHead className='pr-3 text-end'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='[&>*]:border-0'>
          {lightDevices &&
            lightDevices.map((device, idx) => {
              const brightness =
                brightnessMap[device.device_id] ??
                device.last_state?.brightness ??
                0;
              const isOnline = props.device.device_info?.online ?? false;

              return (
                <TableRow
                  key={device.device_id}
                  className='text-[9px] leading-5 hover:!bg-transparent'
                >
                  <TableCell className='flex items-center space-x-4 p-1 pt-2'>
                    <Switch
                      className={`data-[state=unchecked]:bg-map-range-slider-inactive data-[state=checked]:bg-map-range-slider-active ml-6`}
                      checked={switchState[device.device_id] ?? false}
                      disabled={!isOnline || pending[device.device_id]}
                      onCheckedChange={(val) =>
                        handleToggleLight([device.device_id], val)
                      }
                    />
                    <div className='flex w-full gap-1'>
                      <Image
                        src={
                          device.last_state?.on
                            ? '/assets/icons/lightOn.svg'
                            : '/assets/icons/lightOff.svg'
                        }
                        alt={device.last_state?.on ? 'lightOn' : 'lightOff'}
                        width={16}
                        height={16}
                      />

                      <div className='grid w-[180px] grid-cols-[1fr_75px_32px] items-center gap-1'>
                        <span className='truncate leading-none'>
                          {device.name}
                        </span>
                        <Slider
                          max={100}
                          step={1}
                          value={[brightness]}
                          disabled={!isOnline || !switchState[device.device_id]}
                          className={`[&_[data-slot=slider-thumb]]:border-primary ml-2 w-[75px] self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-2 [&_[data-slot=slider-thumb]]:!w-2 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px] ${
                            device.last_state?.on
                              ? `[&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active`
                              : `[&_[data-slot=slider-track]]:bg-inactive-badge [&_[data-slot=slider-range]]:bg-map-range-slider-inactive`
                          } `}
                          onValueChange={([val]) => {
                            setBrightnessMap((prev) => ({
                              ...prev,
                              [device.device_id]: val
                            }));
                          }}
                          onValueCommit={() => {
                            if (!isOnline) return;
                            setBrightness(
                              {
                                device_id: String(props.device.id),
                                channel_route: props.device.ctrl_channel_id,
                                devices: [device.device_id],
                                brightness: brightness
                              },
                              {
                                onSuccess(data, variables, context) {
                                  setRequests((prev) => ({
                                    ...prev,
                                    [device.device_id]: data.request_id
                                  }));
                                },
                                onError() {
                                  // rollback
                                  setBrightnessMap((prev) => ({
                                    ...prev,
                                    [device.device_id]: brightness
                                  }));
                                }
                              }
                            );
                          }}
                        />
                        <span className='text-right leading-none'>
                          {brightness}%
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {idx === 0 && (
                    <TableCell
                      rowSpan={
                        props.device.devices.filter(
                          (device) => device.type === 'lms.devices.types.LIGHT'
                        ).length
                      }
                      className='pt-2 pr-[3px] align-top'
                    >
                      <div className='flex flex-col items-end gap-2'>
                        <Button
                          size='sm'
                          className='bg-map-control-button-success h-4 w-[58px] rounded-[4px] text-[9px]'
                          onClick={() =>
                            handleToggleLight(
                              lightDevices.map((d) => d.device_id),
                              true
                            )
                          }
                          disabled={!isOnline}
                        >
                          Bật tất cả
                        </Button>
                        <Button
                          size='sm'
                          className='bg-map-control-button-destructive h-4 w-[58px] rounded-[4px] text-[9px]'
                          onClick={() =>
                            handleToggleLight(
                              lightDevices.map((d) => d.device_id),
                              false
                            )
                          }
                          disabled={!isOnline}
                        >
                          Tắt tất cả
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <p className='mb-2 ml-2 text-[10px]'>
        {activeLights} / {lightDevices.length} line đang bật
      </p>

      {Object.entries(requests).map(([deviceId, requestId]) => (
        <RequestWatcher
          key={deviceId}
          requestId={requestId}
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
    </Card>
  );
}

export default React.memo(LightControl, (prevProps, nextProps) => {
  return prevProps.device === nextProps.device;
});
