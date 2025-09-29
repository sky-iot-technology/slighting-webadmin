'use client';
import {
  Device,
  SubDevice,
  useQueryStatus,
  useSetBrightnessLight,
  useTurnOnOffLight
} from '@/core/domains/devices';
import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';
import { Card } from '@/ui/components/ui/card';
import { Slider } from '@/ui/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/components/ui/table';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type LightInfo = {
  device: Device;
};

export default function LightControl(props: LightInfo) {
  const [requestId, setRequestId] = useState<string>();
  const [brightnessMap, setBrightnessMap] = useState<Record<string, number>>(
    {}
  );

  const { mutate: toggleLight } = useTurnOnOffLight();
  const { mutate: setBrightness } = useSetBrightnessLight();

  const { data, isFetching, error } = useQueryStatus(
    requestId ?? '',
    (reason) => {
      setIsLoading(false), setRequestId('');
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.status === 'completed' || data.status === 'failed' || error) {
      setIsLoading(false);
      setRequestId('');
    }
    if (!isFetching && !data) {
      setIsLoading(false);
      setRequestId('');
    }
  }, [data, isFetching, error]);

  const lightDevices = (props.device.devices ?? []).filter(
    (device) => device.type === 'lms.devices.types.LIGHT'
  );

  const activeLights = lightDevices.filter(
    (device) => device.last_state?.on
  ).length;

  return (
    <Card className='w-full gap-1 overflow-hidden rounded-md p-0 shadow-none'>
      <Table className='hover:!bg-transparent'>
        <TableHeader className='[&_*]:text-background bg-map-lightControl-header [&_*]:text-xs [&_*]:leading-5 [&_*]:font-semibold [&_th]:h-5'>
          <TableRow className='hover:!bg-map-lightControl-header h-5'>
            <TableHead className='pr-[4px] pl-[12px]'>Trạng Thái</TableHead>
            <TableHead>Điều khiển line</TableHead>
            <TableHead className='text-end'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='[&>*]:border-0'>
          {lightDevices &&
            lightDevices.map((device, idx) => {
              const brightness =
                brightnessMap[device.device_id] ??
                device.last_state?.brightness ??
                0;
              return (
                <TableRow
                  key={device.device_id}
                  className='text-[9px] leading-5 hover:!bg-transparent'
                >
                  <TableCell className='flex items-center justify-center p-1'>
                    {device.last_state?.on ? (
                      <Badge
                        variant={'default'}
                        className='bg-active-badge text-success-badge-text h-[18px] w-[62px] text-[9px]'
                      >
                        Hoạt động
                      </Badge>
                    ) : (
                      <Badge
                        variant={'default'}
                        className='bg-inactive-badge text-muted-foreground h-[18px] w-[34px] text-[9px]'
                      >
                        Tắt
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className='p-1 align-top'>
                    <div className='flex items-start gap-1'>
                      <Image
                        src={
                          device.last_state?.on
                            ? '/assets/icons/lightOn.svg'
                            : '/assets/icons/lightOff.svg'
                        }
                        alt={device.last_state?.on ? 'lightOn' : 'lightOff'}
                        width={16}
                        height={16}
                        className={
                          isLoading
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        }
                        onClick={() => {
                          if (isLoading) return;
                          setIsLoading(true);
                          toggleLight(
                            {
                              device_id: String(props.device.id),
                              channel_route: props.device.ctrl_channel_id,
                              devices: [device.device_id],
                              status: !device.last_state?.on
                            },
                            {
                              onSuccess(data, variables, context) {
                                setRequestId(data.request_id);
                              }
                            }
                          );
                        }}
                      />

                      <span className='self-center leading-none'>
                        Line {idx + 1}
                      </span>
                      <Slider
                        max={100}
                        step={1}
                        value={[brightness]}
                        disabled={!device.last_state?.on}
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
                          setBrightness(
                            {
                              device_id: String(props.device.id),
                              channel_route: props.device.ctrl_channel_id,
                              devices: [device.device_id],
                              brightness: brightness
                            },
                            {
                              onSuccess(data, variables, context) {
                                setRequestId(data.request_id);
                              }
                            }
                          );
                        }}
                      />
                      <span className='self-center leading-none'>
                        {brightness}%
                      </span>
                    </div>
                  </TableCell>

                  {idx === 0 && (
                    <TableCell
                      rowSpan={
                        props.device.devices.filter(
                          (device) => device.type === 'lms.devices.types.LIGHT'
                        ).length
                      }
                      className='pt-1 pr-[3px] align-top'
                    >
                      <div className='flex flex-col items-end gap-1'>
                        <Button
                          size='sm'
                          className='bg-map-control-button-success h-4 w-[58px] rounded-sm text-[9px]'
                        >
                          Bật tất cả
                        </Button>
                        <Button
                          size='sm'
                          className='bg-map-control-button-destructive h-4 w-[58px] rounded-sm text-[9px]'
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
    </Card>
  );
}
