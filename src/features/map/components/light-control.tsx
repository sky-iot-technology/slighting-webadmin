// // 'use client';
// import {
//   Device,
//   useSetBrightnessLight,
//   useTurnOnOffLight
// } from '@/core/domains/devices';
// import { Button } from '@/ui/components/ui/button';
// import { Card } from '@/ui/components/ui/card';
// import { Slider } from '@/ui/components/ui/slider';
// import { Switch } from '@/ui/components/ui/switch';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/ui/components/ui/table';
// import Image from 'next/image';
// import { useCallback, useEffect, useMemo, useState } from 'react';
// import { RequestWatcher } from './RequestWatcher';
// import React from 'react';

// type LightInfo = {
//   device: Device;
// };

// function LightControl(props: LightInfo) {
//   const lightDevices = useMemo(
//     () =>
//       (props.device.devices ?? []).filter(
//         (device) =>
//           device.type === 'lms.devices.types.LIGHT' ||
//           device.type === 'lms.devices.types.SWITCH'
//       ),
//     [props.device.devices]
//   );

//   const activeLights = useMemo(
//     () => lightDevices.filter((device) => device.last_state?.on).length,
//     [lightDevices]
//   );

//   const [requests, setRequests] = useState<Record<string, string[]>>({});
//   const [brightnessMap, setBrightnessMap] = useState<Record<string, number>>(
//     {}
//   );
//   const [switchState, setSwitchState] = useState<Record<string, boolean>>({});
//   const [pending, setPending] = useState<Record<string, boolean>>({});

//   const { mutate: toggleLight } = useTurnOnOffLight();
//   const { mutate: setBrightness } = useSetBrightnessLight();

//   useEffect(() => {
//     const newSwitchState: Record<string, boolean> = {};
//     const newBrightnessMap: Record<string, number> = {};

//     lightDevices.forEach((device) => {
//       const id = device.device_id;

//       if (pending[id]) return;

//       newSwitchState[id] = !!device.last_state?.on;
//       const rawBrightness = device.last_state?.brightness;

//       newBrightnessMap[id] =
//         typeof rawBrightness === 'number'
//           ? rawBrightness
//           : Number(rawBrightness) || 0;
//     });

//     setSwitchState((prev) => ({ ...prev, ...newSwitchState }));
//     setBrightnessMap((prev) => ({ ...prev, ...newBrightnessMap }));
//   }, [lightDevices, pending]);

//   const handleToggleLight = useCallback(
//     (deviceIds: string[], status: boolean) => {
//       setPending((p) => {
//         const updated = { ...p };
//         deviceIds.forEach((id) => (updated[id] = true));
//         return updated;
//       });

//       toggleLight(
//         {
//           device_id: String(props.device.id),
//           channel_route: props.device.ctrl_channel_id,
//           devices: deviceIds,
//           status
//         },
//         {
//           onSuccess: (data) => {
//             const requestId = data.request_id;
//             setRequests((prev) => ({
//               ...prev,
//               [requestId]: deviceIds
//             }));

//             setSwitchState((prev) => {
//               const updated = { ...prev };
//               deviceIds.forEach((id) => (updated[id] = status));
//               return updated;
//             });
//           },

//           onError: () => {
//             //clear pending
//             setPending((p) => {
//               const updated = { ...p };
//               deviceIds.forEach((id) => (updated[id] = false));
//               return updated;
//             });
//             // clear request
//             setRequests((prev) => {
//               const updated = { ...prev };
//               deviceIds.forEach((id) => delete updated[id]);
//               return updated;
//             });
//           }
//         }
//       );
//     },
//     [toggleLight, props.device.id, props.device.ctrl_channel_id]
//   );

//   return (
//     <Card className='w-full gap-1 overflow-hidden rounded-md p-0 shadow-none'>
//       <Table className='hover:!bg-transparent'>
//         <TableHeader className='[&_*]:text-background bg-map-lightControl-header [&_*]:text-xs [&_*]:leading-5 [&_*]:font-semibold [&_th]:h-5'>
//           <TableRow className='hover:!bg-map-lightControl-header h-5'>
//             <TableHead className='pl-3'>Điều khiển line</TableHead>
//             <TableHead className='pr-3 text-end'>Thao tác</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody className='[&>*]:border-0'>
//           {lightDevices &&
//             lightDevices.map((device, idx) => {
//               const brightness =
//                 brightnessMap[device.device_id] ??
//                 device.last_state?.brightness ??
//                 0;
//               const isOnline = props.device.device_info?.online ?? false;

//               return (
//                 <TableRow
//                   key={device.device_id}
//                   className='text-[9px] leading-5 hover:!bg-transparent'
//                 >
//                   <TableCell className='flex items-center space-x-4 p-1 pt-2'>
//                     <Switch
//                       className={`data-[state=unchecked]:bg-map-range-slider-inactive data-[state=checked]:bg-map-range-slider-active ml-6`}
//                       checked={switchState[device.device_id]}
//                       disabled={!isOnline || pending[device.device_id]}
//                       onCheckedChange={(val) =>
//                         handleToggleLight([device.device_id], val)
//                       }
//                     />
//                     <div className='flex w-full gap-1'>
//                       <Image
//                         src={
//                           device.last_state?.on
//                             ? '/assets/icons/lightOn.svg'
//                             : '/assets/icons/lightOff.svg'
//                         }
//                         alt={device.last_state?.on ? 'lightOn' : 'lightOff'}
//                         width={16}
//                         height={16}
//                       />

//                       <div className='grid w-[180px] grid-cols-[1fr_75px_32px] items-center gap-1'>
//                         <span className='truncate leading-none'>
//                           {device.name}
//                         </span>
//                         <Slider
//                           max={100}
//                           step={1}
//                           value={[brightness]}
//                           disabled={!isOnline || !switchState[device.device_id]}
//                           className={`[&_[data-slot=slider-thumb]]:border-primary ml-2 w-[75px] self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-2 [&_[data-slot=slider-thumb]]:!w-2 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px] ${
//                             device.last_state?.on
//                               ? `[&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active`
//                               : `[&_[data-slot=slider-track]]:bg-inactive-badge [&_[data-slot=slider-range]]:bg-map-range-slider-inactive`
//                           } `}
//                           onValueChange={([val]) => {
//                             setBrightnessMap((prev) => ({
//                               ...prev,
//                               [device.device_id]: val
//                             }));
//                           }}
//                           onValueCommit={() => {
//                             if (!isOnline) return;

//                             const prevBrightness =
//                               brightnessMap[device.device_id];

//                             setPending((p) => ({
//                               ...p,
//                               [device.device_id]: true
//                             }));

//                             setBrightness(
//                               {
//                                 device_id: String(props.device.id),
//                                 channel_route: props.device.ctrl_channel_id,
//                                 devices: [device.device_id],
//                                 brightness
//                               },
//                               {
//                                 onSuccess(data) {
//                                   const requestId = data.request_id;

//                                   setRequests((prev) => ({
//                                     ...prev,
//                                     [requestId]: [device.device_id]
//                                   }));
//                                 },
//                                 onError() {
//                                   setBrightnessMap((prev) => ({
//                                     ...prev,
//                                     [device.device_id]: prevBrightness
//                                   }));

//                                   setPending((p) => ({
//                                     ...p,
//                                     [device.device_id]: false
//                                   }));
//                                 }
//                               }
//                             );
//                           }}
//                         />
//                         <span className='text-right leading-none'>
//                           {brightness}%
//                         </span>
//                       </div>
//                     </div>
//                   </TableCell>

//                   {idx === 0 && (
//                     <TableCell
//                       rowSpan={
//                         props.device.devices.filter(
//                           (device) => device.type === 'lms.devices.types.LIGHT'
//                         ).length
//                       }
//                       className='pt-2 pr-[3px] align-top'
//                     >
//                       <div className='flex flex-col items-end gap-2'>
//                         <Button
//                           size='sm'
//                           className='bg-map-control-button-success h-4 w-[58px] rounded-[4px] text-[9px]'
//                           onClick={() =>
//                             handleToggleLight(
//                               lightDevices.map((d) => d.device_id),
//                               true
//                             )
//                           }
//                           disabled={!isOnline}
//                         >
//                           Bật tất cả
//                         </Button>
//                         <Button
//                           size='sm'
//                           className='bg-map-control-button-destructive h-4 w-[58px] rounded-[4px] text-[9px]'
//                           onClick={() =>
//                             handleToggleLight(
//                               lightDevices.map((d) => d.device_id),
//                               false
//                             )
//                           }
//                           disabled={!isOnline}
//                         >
//                           Tắt tất cả
//                         </Button>
//                       </div>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               );
//             })}
//         </TableBody>
//       </Table>
//       <p className='mb-2 ml-2 text-[10px]'>
//         {activeLights} / {lightDevices.length} line đang bật
//       </p>

//       {Object.entries(requests).map(([requestId, deviceIds]) => (
//         <RequestWatcher
//           key={requestId}
//           requestId={requestId}
//           onStopped={() => {
//             setRequests((prev) => {
//               const updated = { ...prev };
//               delete updated[requestId];
//               return updated;
//             });

//             setPending((p) => {
//               const updated = { ...p };
//               deviceIds.forEach((id) => (updated[id] = false));
//               return updated;
//             });
//           }}
//         />
//       ))}
//     </Card>
//   );
// }

// export default React.memo(LightControl, (prevProps, nextProps) => {
//   return prevProps.device === nextProps.device;
// });

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
import { cn } from '@/lib/utils';
import { useCan } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

type LightInfo = {
  device: Device;
};

function LightControl(props: LightInfo) {
  const { t } = useTranslation();

  const canControl = useCan('device', 'control');
  const lightDevices = useMemo(
    () =>
      (props.device.devices ?? []).filter(
        (device) => device.type === 'lms.devices.types.LIGHT'
      ),
    [props.device.devices]
  );

  const switchDevices = useMemo(
    () =>
      (props.device.devices ?? []).filter(
        (device) => device.type === 'lms.devices.types.SWITCH'
      ),
    [props.device.devices]
  );

  const controllableDevices = useMemo(
    () => [...switchDevices, ...lightDevices],
    [switchDevices, lightDevices]
  );

  const activeLights = useMemo(
    () => controllableDevices.filter((device) => device.last_state?.on).length,
    [controllableDevices]
  );

  const [requests, setRequests] = useState<Record<string, string[]>>({});
  const [brightnessMap, setBrightnessMap] = useState<Record<string, number>>(
    {}
  );
  const [switchState, setSwitchState] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [onOffPending, setOnOffPending] = useState(false);

  const { mutate: toggleLight } = useTurnOnOffLight();
  const { mutate: setBrightness } = useSetBrightnessLight();

  useEffect(() => {
    const newSwitchState: Record<string, boolean> = {};
    const newBrightnessMap: Record<string, number> = {};

    [...switchDevices, ...lightDevices].forEach((device) => {
      const id = device.device_id;

      if (pending[id]) return;

      newSwitchState[id] = !!device.last_state?.on;

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
            const requestId = data.request_id;
            setRequests((prev) => ({
              ...prev,
              [requestId]: deviceIds
            }));

            setSwitchState((prev) => {
              const updated = { ...prev };
              deviceIds.forEach((id) => (updated[id] = status));
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
            <TableHead className='pl-3'>{t('map.line_control')}</TableHead>
            <TableHead className='pr-3 text-end'>{t('map.action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='[&>*]:border-0'>
          {controllableDevices &&
            controllableDevices.map((device, idx) => {
              const id = device.device_id;
              const isOnline = props.device.device_info?.online ?? false;
              const isOn = switchState[id] ?? false;
              const isPending = pending[id] ?? false;

              const isSwitch = device.type === 'lms.devices.types.SWITCH';
              const isLight = device.type === 'lms.devices.types.LIGHT';

              const brightness = brightnessMap[id] ?? 0;

              return (
                <TableRow
                  key={device.device_id}
                  className='text-[9px] leading-5 hover:!bg-transparent'
                >
                  <TableCell className='flex items-center gap-4 p-1 pt-2'>
                    {/* Switch */}
                    <Switch
                      className='data-[state=unchecked]:bg-map-range-slider-inactive data-[state=checked]:bg-map-range-slider-active ml-6'
                      checked={isOn}
                      disabled={!canControl || !isOnline || pending[id]}
                      onCheckedChange={(val) => handleToggleLight([id], val)}
                    />

                    {/* Icon + content */}
                    <div className='flex w-full gap-1'>
                      {/* Icon */}
                      <Image
                        src={
                          isOn
                            ? '/assets/icons/lightOn.svg'
                            : '/assets/icons/lightOff.svg'
                        }
                        alt={isOn ? 'lightOn' : 'lightOff'}
                        width={16}
                        height={16}
                      />

                      {/* Name + control */}
                      <div
                        className={cn(
                          'grid items-center gap-1',
                          isLight
                            ? 'w-[180px] grid-cols-[1fr_75px_32px]'
                            : 'w-[150px] grid-cols-[1fr]'
                        )}
                      >
                        {/* Name */}
                        <span className='truncate leading-none font-medium'>
                          {device.name}
                        </span>

                        {/* LIGHT only */}
                        {isLight && (
                          <>
                            <Slider
                              max={100}
                              step={1}
                              value={[brightness]}
                              disabled={
                                !canControl || !isOnline || !isOn || isPending
                              }
                              className={`[&_[data-slot=slider-thumb]]:border-primary ml-2 w-[75px] self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-2 [&_[data-slot=slider-thumb]]:!w-2 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px] ${
                                device.last_state?.on
                                  ? `[&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active`
                                  : `[&_[data-slot=slider-track]]:bg-inactive-badge [&_[data-slot=slider-range]]:bg-map-range-slider-inactive`
                              } `}
                              onValueChange={([val]) => {
                                setBrightnessMap((prev) => ({
                                  ...prev,
                                  [id]: val
                                }));
                              }}
                              onValueCommit={() => {
                                if (!isOnline) return;

                                const prevBrightness = brightnessMap[id];
                                setPending((p) => ({ ...p, [id]: true }));

                                setBrightness(
                                  {
                                    device_id: String(props.device.id),
                                    channel_route: props.device.ctrl_channel_id,
                                    devices: [id],
                                    brightness
                                  },
                                  {
                                    onSuccess(data) {
                                      setRequests((prev) => ({
                                        ...prev,
                                        [data.request_id]: [id]
                                      }));
                                    },
                                    onError() {
                                      setBrightnessMap((prev) => ({
                                        ...prev,
                                        [id]: prevBrightness
                                      }));
                                      setPending((p) => ({
                                        ...p,
                                        [id]: false
                                      }));
                                    }
                                  }
                                );
                              }}
                            />

                            <span className='text-right leading-none'>
                              {brightness}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Bulk action */}
                  {idx === 0 && (
                    <TableCell
                      rowSpan={controllableDevices.length}
                      className='pt-2 pr-[3px] align-top'
                    >
                      <div className='flex flex-col items-end gap-2'>
                        <Button
                          size='sm'
                          className='bg-map-control-button-success h-4 w-[58px] rounded-[4px] text-[9px]'
                          onClick={() => {
                            setOnOffPending(true);
                            handleToggleLight(
                              controllableDevices.map((d) => d.device_id),
                              true
                            );
                          }}
                          disabled={!canControl || !isOnline || onOffPending}
                        >
                          {t('map.turn_on_all')}
                        </Button>

                        <Button
                          size='sm'
                          className='bg-map-control-button-destructive h-4 w-[58px] rounded-[4px] text-[9px]'
                          onClick={() => {
                            setOnOffPending(true);
                            handleToggleLight(
                              controllableDevices.map((d) => d.device_id),
                              false
                            );
                          }}
                          disabled={!canControl || !isOnline || onOffPending}
                        >
                          {t('map.turn_off_all')}
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
        {activeLights} / {controllableDevices.length} {t('map.line_status')}
      </p>

      {Object.entries(requests).map(([requestId, deviceIds]) => (
        <RequestWatcher
          key={requestId}
          requestId={requestId}
          onStopped={() => {
            setRequests((prev) => {
              const updated = { ...prev };
              delete updated[requestId];
              return updated;
            });

            setPending((p) => {
              const updated = { ...p };
              deviceIds.forEach((id) => (updated[id] = false));
              return updated;
            });

            setOnOffPending(false);
          }}
        />
      ))}
    </Card>
  );
}

export default React.memo(LightControl, (prevProps, nextProps) => {
  return prevProps.device === nextProps.device;
});
