'use client';

import {
  Device,
  DeviceFeatureProps,
  useGetDeviceById
} from '@/core/domains/devices';
import Image from 'next/image';
import { diffTimeHMS } from '../helper';
import { formatDateString } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/ui/components/ui/skeleton';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface DeviceHoverCardProps {
  featureProperties: DeviceFeatureProps;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseMove: () => void;
}

export function DeviceHoverCard({
  featureProperties,
  onMouseEnter,
  onMouseLeave,
  onMouseMove
}: DeviceHoverCardProps) {
  const { t, tTime } = useTranslation();

  const id = featureProperties?.id;

  const { data, isLoading } = useGetDeviceById(id!, {
    enabled: !!id
  });

  const lightDevices = useMemo(
    () =>
      (data?.devices ?? []).filter(
        (device) => device.type === 'lms.devices.types.LIGHT'
      ),
    [data?.devices]
  );

  const switchDevices = useMemo(
    () =>
      (data?.devices ?? []).filter(
        (device) => device.type === 'lms.devices.types.SWITCH'
      ),
    [data?.devices]
  );

  const controllableDevices = useMemo(
    () => [...switchDevices, ...lightDevices],
    [switchDevices, lightDevices]
  );

  const activeLights = useMemo(
    () => controllableDevices.filter((d) => d.last_state?.on).length,
    [controllableDevices]
  );

  if (!data || !id) return null;

  const time = diffTimeHMS(data.updated_at, tTime);

  return (
    <div
      className='animate-in fade-in zoom-in-95 bg-card w-[250px] rounded-xl border border-gray-100 shadow-xl duration-200 dark:border-gray-600'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <div className='relative z-10'>
        {isLoading ? (
          <DeviceHoverCardSkeleton />
        ) : (
          <>
            <div className='flex items-start justify-between rounded-t-xl border-b border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/30'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-white'>
                  <span className='material-icons-round font-icon text-gray-600 dark:text-gray-300'>
                    <Image
                      src={`${data.type === 'lms.devices.types.STL_SMART' ? '/assets/icons/device-light.svg' : '/assets/icons/device.svg'}`}
                      alt='search'
                      width={24}
                      height={24}
                    />
                  </span>
                </div>
                <div>
                  <h4 className='w-36 truncate text-base leading-tight font-bold text-gray-800 dark:text-white'>
                    {featureProperties.name}
                  </h4>
                  <div className='mt-1 flex items-center gap-1.5'>
                    <span className='relative flex h-2 w-2'>
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${featureProperties.online === 'online' ? 'bg-green-400' : 'bg-red-400'}`}
                      ></span>
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${featureProperties.online === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
                      ></span>
                    </span>
                    <span
                      className={`text-xs font-medium ${featureProperties.online === 'online' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                    >
                      {featureProperties.online === 'online'
                        ? 'Online'
                        : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <h5 className='bg-primary rounded px-2 py-0.5 text-xs font-semibold text-white'>
                  {t('map.line_status_hover')}
                </h5>
                <span className='text-[10px] text-gray-500 dark:text-gray-400'>
                  {activeLights} / {controllableDevices.length}{' '}
                  {t('map.line_status')}
                </span>
              </div>

              <div className='rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'>
                <CustomScrollbar
                  className='max-h-[150px] space-y-3 overflow-y-auto p-3'
                  onWheelCapture={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  {controllableDevices &&
                    controllableDevices.map((device, idx) => {
                      const id = device.device_id;

                      const isSwitch =
                        device.type === 'lms.devices.types.SWITCH';
                      const isLight = device.type === 'lms.devices.types.LIGHT';

                      return (
                        <div
                          key={idx}
                          className='flex items-center justify-between'
                        >
                          <div className='flex items-center gap-2'>
                            <Image
                              src={
                                device.last_state?.on
                                  ? '/assets/icons/lightOn.svg'
                                  : '/assets/icons/lightOff.svg'
                              }
                              alt={
                                device.last_state?.on ? 'lightOn' : 'lightOff'
                              }
                              width={16}
                              height={16}
                            />
                            <span className='truncate text-xs font-medium text-gray-600 dark:text-gray-300'>
                              {device.name}
                            </span>
                          </div>
                          {isLight && (
                            <div className='flex items-center gap-2'>
                              <span className='flex items-center gap-1 rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'>
                                <Image
                                  src={
                                    device.last_state?.on
                                      ? '/assets/icons/brightness-half.svg'
                                      : '/assets/icons/brightness-half.svg'
                                  }
                                  alt={
                                    device.last_state?.on
                                      ? 'brightness'
                                      : 'brightness'
                                  }
                                  width={16}
                                  height={16}
                                />{' '}
                                {device.last_state?.brightness}%
                              </span>
                            </div>
                          )}
                          <div className='flex items-center gap-2'>
                            {device.last_state?.on ? (
                              <span className='h-5 rounded bg-green-100 px-1.5 py-1 text-[10px] font-bold text-green-600 dark:bg-green-900/30 dark:text-green-400'>
                                {t('map.on')}
                              </span>
                            ) : (
                              <span className='h-5 rounded bg-red-100 px-1.5 py-1 text-[10px] font-bold text-red-500 dark:bg-red-900/30 dark:text-red-400'>
                                {t('map.off')}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </CustomScrollbar>
              </div>

              <div className='mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs dark:border-gray-700'>
                <div>
                  <p className='text-[10px] text-gray-400'>
                    {t('map.created_at')}
                  </p>
                  <p className='font-semibold text-gray-700 dark:text-gray-300'>
                    {formatDateString(data.created_at)}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-[10px] text-gray-400'>
                    {t('map.online_time')}
                  </p>
                  <p className='font-semibold text-gray-700 dark:text-gray-300'>
                    {time}
                  </p>
                </div>
              </div>
              {/* <LightControl device={device} /> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function DeviceHoverCardSkeleton() {
  return (
    <>
      {/* Header */}
      <div className='flex items-start justify-between rounded-t-xl border-b border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/30'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 rounded-lg' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-3 w-20' />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='space-y-3 p-4'>
        {/* Line status */}
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-3 w-16' />
        </div>

        {/* Devices list */}
        <div className='space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4 rounded' />
                <Skeleton className='h-3 w-24' />
              </div>
              <Skeleton className='h-4 w-10 rounded' />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className='grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 dark:border-gray-700'>
          <div className='space-y-1'>
            <Skeleton className='h-3 w-16' />
            <Skeleton className='h-4 w-20' />
          </div>
          <div className='space-y-1 text-right'>
            <Skeleton className='ml-auto h-3 w-20' />
            <Skeleton className='ml-auto h-4 w-16' />
          </div>
        </div>
      </div>
    </>
  );
}
