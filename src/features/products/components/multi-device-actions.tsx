import { useState, useRef } from 'react';
import { Button } from '@/ui/components/ui/button';
import {
  useMultiTurnOnOffLight,
  useMultiSetBrightnessLight
} from '@/core/domains/devices/hooks';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useTranslation } from '@/core/domains/language/useTranslation';
import type {
  Device,
  MultiDeviceExecuteResponse
} from '@/core/domains/devices/types';
import { Table as TanstackTable } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/ui/components/ui/dropdown-menu';
import { Settings2, Power, Lightbulb, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/ui/components/ui/dialog';
import { Slider } from '@/ui/components/ui/slider';
import { useCan } from '@/core/domains/permissions';

interface Props {
  table: TanstackTable<Device>;
}

export function MultiDeviceActions({ table }: Props) {
  const { t, tTime } = useTranslation();
  const canControl = useCan('device', 'control');
  const selectedRows = table.getSelectedRowModel().flatRows;
  const selectedDevices = selectedRows.map((row) => row.original);

  // Store a ref map of device_id to name to show in the result table
  const deviceNameMap = useRef<Record<string, string>>({});
  if (selectedDevices.length > 0) {
    selectedDevices.forEach((d) => {
      deviceNameMap.current[d.id as string] = d.name;
    });
  }

  const { mutate: turnOnOff, isPending: isTurningOnOff } =
    useMultiTurnOnOffLight();
  const { mutate: setBrightness, isPending: isSettingBrightness } =
    useMultiSetBrightnessLight();

  const [controlType, setControlType] = useState<
    'on_off' | 'brightness' | null
  >(null);
  const [brightnessValue, setBrightnessValue] = useState<number[]>([100]);

  // Execution result state
  const [resultData, setResultData] =
    useState<MultiDeviceExecuteResponse | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const allCabinets =
    selectedDevices.length > 0 &&
    selectedDevices.every((d) => d.type === 'lms.devices.types.STL_CABINET');

  const allLights =
    selectedDevices.length > 0 &&
    selectedDevices.every(
      (d) =>
        d.type === 'lms.devices.types.STL_SMART' ||
        d.type === 'lms.devices.types.LIGHT'
    );

  const isDisabled =
    selectedDevices.length === 0 || (!allCabinets && !allLights);

  const catalogues = useCatalogueStore((state) => state.catalogues);

  const getSubDevicesByTypes = (
    types: string[],
    traitFilter: string
  ): string[] => {
    const subDevices = new Set<string>();

    types.forEach((type) => {
      const catalogue = catalogues.find((c) => c.type === type);
      if (catalogue?.attributes) {
        Object.values(catalogue.attributes).forEach((attr: any) => {
          if (
            attr &&
            typeof attr === 'object' &&
            attr.device_id &&
            attr.traits?.includes(traitFilter)
          ) {
            subDevices.add(attr.device_id);
          }
        });
      }
    });

    return Array.from(subDevices);
  };

  const onSuccessExecution = (data: MultiDeviceExecuteResponse) => {
    setControlType(null);
    setResultData(data);
    setIsResultOpen(true);
    table.toggleAllRowsSelected(false);
  };

  const handleTurnOnOff = (status: boolean) => {
    const types = Array.from(new Set(selectedDevices.map((d) => d.type)));
    let subDevices = getSubDevicesByTypes(types, 'lms.devices.traits.OnOff');

    if (subDevices.length === 0) {
      subDevices = ['*'];
    }

    turnOnOff(
      {
        device_ids: selectedDevices.map((d) => d.id as string),
        devices: subDevices,
        status
      },
      {
        onSuccess: onSuccessExecution
      }
    );
  };

  const handleSetBrightness = () => {
    const types = Array.from(new Set(selectedDevices.map((d) => d.type)));
    let subDevices = getSubDevicesByTypes(
      types,
      'lms.devices.traits.Brightness'
    );

    if (subDevices.length === 0) {
      subDevices = ['*'];
    }

    setBrightness(
      {
        device_ids: selectedDevices.map((d) => d.id as string),
        devices: subDevices,
        brightness: brightnessValue[0]
      },
      {
        onSuccess: onSuccessExecution
      }
    );
  };

  const renderResultTable = () => {
    if (!resultData) return null;

    const errors = resultData.command_errors || [];
    const total = errors.length;
    const successCount = errors.filter((e) => e.status === 'SUCCESS').length;
    const failCount = total - successCount;

    return (
      <div className='space-y-4'>
        <div className='mb-4 flex gap-4'>
          <div className='bg-muted flex-1 rounded-md p-3 text-center'>
            <div className='text-muted-foreground text-sm'>
              {t('products.multi_actions.result.total')}
            </div>
            <div className='text-xl font-bold'>{total}</div>
          </div>
          <div className='flex-1 rounded-md bg-green-50 p-3 text-center dark:bg-green-900/20'>
            <div className='text-sm text-green-600 dark:text-green-400'>
              {t('products.multi_actions.result.success')}
            </div>
            <div className='text-xl font-bold text-green-700 dark:text-green-300'>
              {successCount}
            </div>
          </div>
          <div className='flex-1 rounded-md bg-red-50 p-3 text-center dark:bg-red-900/20'>
            <div className='text-sm text-red-600 dark:text-red-400'>
              {t('products.multi_actions.result.failed')}
            </div>
            <div className='text-xl font-bold text-red-700 dark:text-red-300'>
              {failCount}
            </div>
          </div>
        </div>

        <div className='max-h-[300px] overflow-y-auto rounded-md border'>
          <table className='w-full text-left text-sm'>
            <thead className='text-muted-foreground bg-muted sticky top-0 text-xs uppercase'>
              <tr>
                <th className='px-4 py-2'>
                  {t('products.multi_actions.result.device')}
                </th>
                <th className='px-4 py-2'>
                  {t('products.multi_actions.result.status')}
                </th>
                <th className='px-4 py-2'>
                  {t('products.multi_actions.result.error_detail')}
                </th>
              </tr>
            </thead>
            <tbody>
              {errors.map((err, i) => {
                const deviceName =
                  deviceNameMap.current[err.device_id] || err.device_id;
                return (
                  <tr
                    key={i}
                    className='hover:bg-muted/50 border-b last:border-0'
                  >
                    <td className='px-4 py-2 font-medium'>{deviceName}</td>
                    <td className='px-4 py-2'>
                      {err.status === 'SUCCESS' ? (
                        <span className='font-medium text-green-600'>
                          {t('products.multi_actions.result.success_status')}
                        </span>
                      ) : (
                        <span className='font-medium text-red-600'>
                          {t('products.multi_actions.result.error_status')}
                        </span>
                      )}
                    </td>
                    <td className='px-4 py-2 text-red-500'>
                      {err.error_code || '-'}
                    </td>
                  </tr>
                );
              })}
              {errors.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className='text-muted-foreground px-4 py-4 text-center'
                  >
                    {t('products.multi_actions.result.no_record')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            disabled={isDisabled || !canControl}
            className='rounded-[6px]'
          >
            <Settings2 className='mr-0.5 h-4 w-4' />
            {selectedDevices.length > 0 ? (
              <span>{selectedDevices.length}</span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        {!isDisabled && (
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => setControlType('on_off')}
              className='cursor-pointer'
            >
              <Power className='mr-2 h-4 w-4' />
              {t('products.multi_actions.turn_on_off')}
            </DropdownMenuItem>
            {allLights && (
              <DropdownMenuItem
                onClick={() => setControlType('brightness')}
                className='cursor-pointer'
              >
                <Lightbulb className='mr-2 h-4 w-4' />
                {t('products.multi_actions.set_brightness')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <Dialog
        open={controlType === 'on_off'}
        onOpenChange={(open) => !open && setControlType(null)}
      >
        <DialogContent className='sm:max-w-[400px]'>
          <DialogHeader>
            <DialogTitle>{t('products.multi_actions.turn_on_off')}</DialogTitle>
            <DialogDescription>
              {tTime('products.multi_actions.confirm_toggle', {
                count: selectedDevices.length
              })}
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-4 py-4'>
            <Button
              className='w-full bg-green-600 text-white hover:bg-green-700'
              onClick={() => handleTurnOnOff(true)}
              disabled={isTurningOnOff}
            >
              <Check className='mr-2 h-4 w-4' />{' '}
              {allLights
                ? t('products.multi_actions.turn_on_light')
                : t('products.multi_actions.turn_on_cabinet')}
            </Button>
            <Button
              variant='destructive'
              className='w-full'
              onClick={() => handleTurnOnOff(false)}
              disabled={isTurningOnOff}
            >
              <X className='mr-2 h-4 w-4' />{' '}
              {allLights
                ? t('products.multi_actions.turn_off_light')
                : t('products.multi_actions.turn_off_cabinet')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={controlType === 'brightness'}
        onOpenChange={(open) => !open && setControlType(null)}
      >
        <DialogContent className='sm:max-w-[400px]'>
          <DialogHeader>
            <DialogTitle>
              {t('products.multi_actions.set_brightness')}
            </DialogTitle>
            <DialogDescription>
              {tTime('products.multi_actions.confirm_brightness', {
                count: selectedDevices.length
              })}
            </DialogDescription>
          </DialogHeader>
          <div className='my-2 flex flex-col gap-6 border-t border-b py-6'>
            <div className='flex items-center space-x-4'>
              <span className='w-12 rounded-md border py-1 text-center text-sm font-medium'>
                {brightnessValue[0]}%
              </span>
              <Slider
                value={brightnessValue}
                onValueChange={setBrightnessValue}
                max={100}
                step={1}
                className='flex-1 cursor-pointer'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSetBrightness}
              disabled={isSettingBrightness}
              className='w-full'
            >
              {t('products.multi_actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {t('products.multi_actions.result.title')}
            </DialogTitle>
          </DialogHeader>
          <div className='py-2'>{renderResultTable()}</div>
          <DialogFooter>
            <Button onClick={() => setIsResultOpen(false)} className='w-full'>
              {t('products.multi_actions.result.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
