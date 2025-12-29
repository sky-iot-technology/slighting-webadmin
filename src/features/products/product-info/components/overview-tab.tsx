'use client';

import { Device, useSyncDevices } from '@/core/domains/devices';
import { Card, CardContent, CardTitle } from '@/ui/components/ui/card';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Button } from '@/ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/ui/components/ui/accordion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSchemaProvider
} from '@/ui/components/ui/form';
import { IconDeviceDesktop } from '@tabler/icons-react';
import { Edit2, RefreshCw, Save, X } from 'lucide-react';
import { DateInput } from '@/ui/components/ui/date-input';
import { format, parse } from 'date-fns';
import { useGetGroups } from '@/core/domains/groups';
import { useGetTags } from '@/core/domains/tags';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useUpdateDevice } from '@/core/domains/devices';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ReminderManagementModal } from './reminder-management-modal';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/ui/components/ui/sheet';
import GoongMapMarker from '@/ui/business/map/goong-marker';
import { RequestWatcher } from '@/features/map/components/RequestWatcher';

interface OverviewTabProps {
  device: Device;
}

const isValidLat = (val: string) => {
  const n = Number(val);
  return !isNaN(n) && n >= -90 && n <= 90;
};

const isValidLon = (val: string) => {
  const n = Number(val);
  return !isNaN(n) && n >= -180 && n <= 180;
};
// Form schema for editable fields
const overviewFormSchema = z.object({
  // Required fields (matching deviceFormSchema)
  name: z.string().min(2, { message: 'Tên thiết bị phải có ít nhất 2 ký tự' }),
  type: z.string().min(1, { message: 'Loại thiết bị không được bỏ trống' }),
  parent_group_id: z
    .string()
    .min(1, { message: 'Chi nhánh không được bỏ trống' }),
  serial: z.string().min(1, { message: 'Serial không được bỏ trống' }),

  // Optional fields
  imei: z.string().optional(),
  lat: z
    .string()
    .optional()
    .refine((v) => v === undefined || v === '' || isValidLat(v), {
      message: 'Vĩ độ phải là số trong khoảng -90 đến 90'
    }),

  lon: z
    .string()
    .optional()
    .refine((v) => v === undefined || v === '' || isValidLon(v), {
      message: 'Kinh độ phải là số trong khoảng -180 đến 180'
    }),
  address: z.string().optional(),
  note: z.string().optional(),
  manufacturer: z.string().optional(),
  installation_date: z.date().or(z.number()).optional(),
  purchase_date: z.date().or(z.number()).optional(),
  expiration_date: z.date().or(z.number()).optional()
});

type OverviewFormValues = z.infer<typeof overviewFormSchema>;

export function OverviewTab({ device }: OverviewTabProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [syncRequestId, setSyncRequestId] = useState<string | undefined>(
    undefined
  );
  const [syncPollInterval, setSyncPollInterval] = useState<number | undefined>(
    undefined
  );
  const { mutate: syncDevices } = useSyncDevices();
  const { data: groupsData } = useGetGroups({
    status: 'enabled'
  });

  const { data: tagsData } = useGetTags({
    resource_type: 'device'
  });

  const { catalogues } = useCatalogueStore();
  const updateDeviceMutation = useUpdateDevice({
    onSuccess: () => {
      setIsEditMode(false);
    }
  });

  const groupOptions = useMemo(() => {
    if (!groupsData?.groups) return [];
    return groupsData.groups.map((group) => ({
      value: group.id,
      label: group.name
    }));
  }, [groupsData]);

  const sensorInfo = useMemo(() => {
    const sensors = device.devices?.filter(
      (d) => d.type === 'lms.devices.types.SENSOR'
    );
    if (sensors && sensors.length > 0) return sensors[0];
    return undefined;
  }, [device]);

  // Get device tags (may not be in Device type definition)
  const deviceTags = (device as any).tags as string[] | undefined;

  // Get tag names from tag aliases
  const tagNames = useMemo(() => {
    if (!deviceTags || !tagsData?.tag) return [];
    return deviceTags
      .map((tagAlias: string) => {
        const tag = tagsData.tag.find(
          (t) => t.alias === tagAlias || t.id === tagAlias
        );
        return tag?.name || tagAlias;
      })
      .filter(Boolean);
  }, [deviceTags, tagsData]);

  const handleSyncStopped = (reason: string) => {
    if (reason === 'completed') {
      // Device state is already updated via useQueryStatus
      // The component will re-render automatically when device prop updates
    }
    setSyncRequestId(undefined);
    setSyncPollInterval(undefined);
  };

  const handleSyncDevices = () => {
    const children_ids = device.devices?.map((d) => d.device_id) ?? [];

    if (children_ids.length === 0) return;

    syncDevices(
      {
        device_id: String(device.id),
        children_ids,
        channel_route: device.ctrl_channel_id
      },
      {
        onSuccess: (data) => {
          setSyncRequestId(data.request_id);
          setSyncPollInterval(data.poll_interval * 1000);
        }
      }
    );
  };

  // Helper to format Unix timestamp to date
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    return format(new Date(timestamp * 1000), 'dd/MM/yyyy');
  };

  // Get values from device_asset.asset_attribute
  const getAttributeValue = (identify: string) => {
    const attr = device.device_asset?.asset_attribute?.find(
      (a) => a.identify === identify
    );
    if (!attr) return '';

    // If type is 2 (date), it's a Unix timestamp
    if (attr.type === 2) {
      return formatDate(attr.content as number);
    }

    return attr.content?.toString() || '';
  };

  const installationDate = getAttributeValue('installation_date');
  const purchaseDate = getAttributeValue('purchase_date');
  const expirationDate = getAttributeValue('expiration_date');
  const manufacturer =
    getAttributeValue('manufacturer') || device.device_info?.manufacturer || '';
  const note = getAttributeValue('note') || '';
  const serial =
    device.device_info?.serial_number || device.device_info?.imei || 'N/A';

  // Get catalogue options for device type
  const catalogueOptions = useMemo(() => {
    return catalogues.map((cat) => ({
      value: cat.type,
      label: cat.name
    }));
  }, [catalogues]);

  // Helper to convert date string (dd/MM/yyyy) or Unix timestamp to Date object
  const parseDateValue = (value?: string | number): Date | undefined => {
    if (!value) return undefined;
    if (typeof value === 'number') {
      return new Date(value * 1000);
    }
    if (typeof value === 'string') {
      try {
        const parsed = parse(value, 'dd/MM/yyyy', new Date());
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      } catch {
        // If parsing fails, return undefined
      }
    }
    return undefined;
  };

  // Initialize form with device data
  const form = useForm<OverviewFormValues>({
    resolver: zodResolver(overviewFormSchema),
    defaultValues: {
      name: device.name || '',
      imei: device.device_info?.imei || '',
      type: device.type || '',
      parent_group_id: device.parent_group_id || '',
      lat: device.device_info?.lat?.toString() || '0',
      lon: device.device_info?.lon?.toString() || '0',
      address: device.device_info?.region || '',
      note: note,
      serial: serial,
      manufacturer: manufacturer,
      installation_date: installationDate
        ? parseDateValue(installationDate)
        : undefined,
      purchase_date: purchaseDate ? parseDateValue(purchaseDate) : undefined,
      expiration_date: expirationDate
        ? parseDateValue(expirationDate)
        : undefined
    }
  });

  // Helper to convert Date object or number to Unix timestamp
  const dateToTimestamp = (dateValue?: Date | number): number | undefined => {
    if (!dateValue) return undefined;
    if (dateValue instanceof Date) {
      return Math.floor(dateValue.getTime() / 1000);
    }
    if (typeof dateValue === 'number') {
      // If it's already a timestamp in seconds, return it
      // If it's in milliseconds, convert to seconds
      return dateValue > 10000000000 ? Math.floor(dateValue / 1000) : dateValue;
    }
    return undefined;
  };

  // Helper to build asset_attribute array
  const buildAssetAttributes = (
    values: OverviewFormValues,
    reminderMap?: Record<string, string[]>
  ) => {
    const asset_attribute: any[] = [];
    let index = 0;

    // Preserve existing attributes that we're not editing
    const existingAttrs = device.device_asset?.asset_attribute || [];
    const editableIdentifiers = [
      'installation_date',
      'purchase_date',
      'expiration_date',
      'manufacturer',
      'note'
    ];

    // Keep non-editable attributes
    existingAttrs.forEach((attr) => {
      if (!editableIdentifiers.includes(attr.identify)) {
        asset_attribute.push(attr);
        index = Math.max(index, attr.index);
      }
    });
    index++;

    // Add/update editable attributes
    if (values.installation_date) {
      const timestamp = dateToTimestamp(values.installation_date);
      if (timestamp !== undefined) {
        const existingInstallation = existingAttrs.find(
          (a) => a.identify === 'installation_date'
        );
        asset_attribute.push({
          index: index++,
          is_disabled: true,
          identify: 'installation_date',
          attr: 'Installation date',
          type: 2,
          content: timestamp,
          reminder_ids:
            reminderMap?.['installation_date'] ||
            existingInstallation?.reminder_ids ||
            []
        });
      }
    }

    if (values.purchase_date) {
      const timestamp = dateToTimestamp(values.purchase_date);
      if (timestamp !== undefined) {
        const existingPurchase = existingAttrs.find(
          (a) => a.identify === 'purchase_date'
        );
        asset_attribute.push({
          index: index++,
          is_disabled: true,
          identify: 'purchase_date',
          attr: 'Purchase date',
          type: 2,
          content: timestamp,
          reminder_ids:
            reminderMap?.['purchase_date'] ||
            existingPurchase?.reminder_ids ||
            []
        });
      }
    }

    if (values.expiration_date) {
      const timestamp = dateToTimestamp(values.expiration_date);
      if (timestamp !== undefined) {
        const existingExpiration = existingAttrs.find(
          (a) => a.identify === 'expiration_date'
        );
        asset_attribute.push({
          index: index++,
          is_disabled: true,
          identify: 'expiration_date',
          attr: 'Expiration date',
          type: 2,
          content: timestamp,
          reminder_ids:
            reminderMap?.['expiration_date'] ||
            existingExpiration?.reminder_ids ||
            []
        });
      }
    }

    if (values.manufacturer) {
      asset_attribute.push({
        index: index++,
        is_disabled: true,
        identify: 'manufacturer',
        attr: 'Manufacturer',
        type: 1,
        content: values.manufacturer,
        reminder_ids: []
      });
    }

    if (values.note) {
      asset_attribute.push({
        index: index++,
        is_disabled: true,
        identify: 'note',
        attr: 'Note',
        type: 1,
        content: values.note,
        reminder_ids: []
      });
    }

    return asset_attribute;
  };

  const onSubmit = (values: OverviewFormValues) => {
    const asset_attribute = buildAssetAttributes(values);

    const latValue =
      values.lat !== undefined && values.lat !== ''
        ? Number(values.lat)
        : (device.device_info?.lat ?? 0);

    const lonValue =
      values.lon !== undefined && values.lon !== ''
        ? Number(values.lon)
        : (device.device_info?.lon ?? 0);

    const updateData: Partial<Device> = {
      name: values.name,
      type: values.type,
      parent_group_id: values.parent_group_id,
      device_info: {
        ...device.device_info,
        imei: values.imei || device.device_info?.imei || '',
        lat: latValue,
        lon: lonValue,
        region: values.address || device.device_info?.region || '',
        serial_number: values.serial || device.device_info?.serial_number || '',
        manufacturer:
          values.manufacturer || device.device_info?.manufacturer || ''
      }
    };

    // Only include device_asset if we have asset_attribute
    if (asset_attribute.length > 0) {
      updateData.device_asset = device.device_asset
        ? {
            ...device.device_asset,
            asset_attribute
          }
        : {
            id: String(device.id || ''),
            name: device.name || '',
            asset_attribute
          };
    }

    updateDeviceMutation.mutate({
      deviceId: device.id,
      data: updateData
    });
  };

  const handleCancel = () => {
    form.reset({
      name: device.name || '',
      imei: device.device_info?.imei || '',
      type: device.type || '',
      parent_group_id: device.parent_group_id || '',
      lat: device.device_info?.lat?.toString() || '0',
      lon: device.device_info?.lon?.toString() || '0',
      address: device.device_info?.region || '',
      note: note,
      serial: serial,
      manufacturer: manufacturer,
      installation_date: installationDate
        ? parseDateValue(installationDate)
        : undefined,
      purchase_date: purchaseDate ? parseDateValue(purchaseDate) : undefined,
      expiration_date: expirationDate
        ? parseDateValue(expirationDate)
        : undefined
    });
    setIsEditMode(false);
  };

  const handleSaveReminders = (reminderMap: Record<string, string[]>) => {
    const currentValues = form.getValues();
    const asset_attribute = buildAssetAttributes(currentValues, reminderMap);

    const latValue = currentValues.lat
      ? parseFloat(currentValues.lat) || (device.device_info?.lat ?? 0)
      : (device.device_info?.lat ?? 0);
    const lonValue = currentValues.lon
      ? parseFloat(currentValues.lon) || (device.device_info?.lon ?? 0)
      : (device.device_info?.lon ?? 0);

    const updateData: Partial<Device> = {
      name: currentValues.name,
      type: currentValues.type,
      parent_group_id: currentValues.parent_group_id,
      device_info: {
        ...device.device_info,
        imei: currentValues.imei || device.device_info?.imei || '',
        lat: latValue,
        lon: lonValue,
        region: currentValues.address || device.device_info?.region || '',
        serial_number:
          currentValues.serial || device.device_info?.serial_number || '',
        manufacturer:
          currentValues.manufacturer || device.device_info?.manufacturer || ''
      }
    };

    // Only include device_asset if we have asset_attribute
    if (asset_attribute.length > 0) {
      updateData.device_asset = device.device_asset
        ? {
            ...device.device_asset,
            asset_attribute
          }
        : {
            id: String(device.id || ''),
            name: device.name || '',
            asset_attribute
          };
    }

    updateDeviceMutation.mutate({
      deviceId: device.id,
      data: updateData
    });
  };

  return (
    <FormSchemaProvider schema={overviewFormSchema}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Device Header */}
          <Card className='border-none py-1 shadow-none'>
            <div className='flex gap-6'>
              {/* Device Image Placeholder */}
              <div className='bg-muted flex h-40 w-64 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg'>
                {device.device_asset?.asset_attribute?.find(
                  (a) =>
                    a.identify === 'image' ||
                    a.attr?.toLowerCase().includes('image')
                )?.content ? (
                  <Image
                    src={String(
                      device.device_asset.asset_attribute.find(
                        (a) =>
                          a.identify === 'image' ||
                          a.attr?.toLowerCase().includes('image')
                      )?.content
                    )}
                    alt={device.name || 'Device'}
                    width={128}
                    height={128}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <IconDeviceDesktop className='text-muted-foreground h-16 w-16' />
                )}
              </div>

              {/* Device Information */}
              <div className='flex-1'>
                {!isEditMode ? (
                  // View Mode
                  <>
                    <div>
                      <h2 className='text-primary mb-2 text-xl font-bold'>
                        {device.name}
                      </h2>
                    </div>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='text-muted-foreground'>
                          Mã thiết bị:
                        </span>
                        <span className='ml-2 font-medium'>
                          {device.device_info?.imei}
                        </span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>
                          Loại thiết bị:
                        </span>
                        <span className='ml-2 font-medium'>
                          {catalogueOptions.find(
                            (opt) => opt.value === device.type
                          )?.label || device.type}
                        </span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Serial:</span>
                        <span className='ml-2 font-medium'>{serial}</span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>
                          Nhà sản xuất:
                        </span>
                        <span className='ml-2 font-medium'>{manufacturer}</span>
                      </div>
                      <div>
                        <span className='text-muted-foreground mr-2'>
                          Trạng thái thiết bị:
                        </span>
                        {device.device_info?.online ? (
                          <span className='text-green-600'>Online</span>
                        ) : (
                          <span className='text-red-600'>Offline</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  // Edit Mode
                  <>
                    <div>
                      <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-muted-foreground text-sm'>
                              Tên thiết bị
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Tên thiết bị'
                                {...field}
                                className='font-medium'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-2 text-sm'>
                      <FormField
                        control={form.control}
                        name='imei'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-muted-foreground text-sm'>
                              Mã thiết bị:
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Mã thiết bị'
                                {...field}
                                className='font-medium'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-muted-foreground text-sm'>
                              Loại thiết bị:
                            </FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className='w-full font-medium'>
                                  <SelectValue placeholder='Chọn loại thiết bị' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {catalogueOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='serial'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-muted-foreground text-sm'>
                              Serial:
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Serial'
                                {...field}
                                className='font-medium'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='manufacturer'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-muted-foreground text-sm'>
                              Nhà sản xuất:
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Nhà sản xuất'
                                {...field}
                                className='font-medium'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Device Information Section */}
          <Card className='mt-4 border-none py-1 shadow-none'>
            <CardTitle className='font-bold'>Thông tin thiết bị</CardTitle>
            <CardContent className='space-y-2 px-0'>
              {/* Row 1 */}
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='w-full space-y-2'>
                  <Label>Nhóm yêu thích</Label>
                  <Input
                    value={tagNames.join(', ') || 'N/A'}
                    disabled
                    placeholder='Nhóm yêu thích'
                    className='disabled:opacity-90'
                  />
                </div>
                <div className='space-y-2 md:col-span-2'>
                  <Label>Kinh độ & Vĩ độ</Label>
                  <div className='flex gap-2'>
                    <FormField
                      control={form.control}
                      name='lon'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Kinh độ'
                              disabled={!isEditMode}
                              {...field}
                              className={cn(
                                'flex-1',
                                !isEditMode && 'disabled:opacity-90'
                              )}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9.-]/g,
                                  ''
                                );
                                field.onChange(value);
                              }}
                              onBlur={() => {
                                const num = Number(field.value);
                                if (!isNaN(num)) {
                                  const limited = Math.max(
                                    -180,
                                    Math.min(180, num)
                                  );
                                  field.onChange(limited.toFixed(6));
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='lat'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Vĩ độ'
                              disabled={!isEditMode}
                              {...field}
                              className={cn(
                                'flex-1',
                                !isEditMode && 'disabled:opacity-90'
                              )}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9.-]/g,
                                  ''
                                );
                                field.onChange(value);
                              }}
                              onBlur={() => {
                                const num = Number(field.value);
                                if (!isNaN(num)) {
                                  const limited = Math.max(
                                    -180,
                                    Math.min(180, num)
                                  );
                                  field.onChange(limited.toFixed(6));
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          type='button'
                          className='bg-blue-2 rounded-sm hover:!bg-cyan-600 hover:!brightness-95'
                          disabled={!isEditMode}
                        >
                          Vị trí bản đồ
                        </Button>
                      </SheetTrigger>
                      <SheetContent side='right' className='gap-0'>
                        <SheetHeader>
                          <SheetTitle className='mx-auto'>
                            Chọn vị trí bản đồ
                          </SheetTitle>
                        </SheetHeader>
                        <div className='relative h-full w-full overflow-hidden'>
                          <GoongMapMarker
                            lat={
                              isValidLat(form.watch('lat') ?? '')
                                ? Number(form.watch('lat'))
                                : undefined
                            }
                            long={
                              isValidLon(form.watch('lon') ?? '')
                                ? Number(form.watch('lon'))
                                : undefined
                            }
                            onSelectLocation={({ lat, long }) => {
                              form.setValue(
                                'lat',
                                String(Number(lat.toFixed(6)))
                              );
                              form.setValue(
                                'lon',
                                String(Number(long.toFixed(6)))
                              );
                            }}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='parent_group_id'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chi nhánh</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isEditMode}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                'w-full',
                                !isEditMode && 'disabled:opacity-90'
                              )}
                            >
                              <SelectValue placeholder='Chọn nhóm thiết bị' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {groupOptions.map((group) => (
                              <SelectItem
                                key={group.value}
                                value={String(group.value)}
                              >
                                {group.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input
                            disabled={!isEditMode}
                            placeholder='Địa chỉ'
                            {...field}
                            className={cn(!isEditMode && 'disabled:opacity-90')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='note'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú</FormLabel>
                        <FormControl>
                          <Input
                            disabled={!isEditMode}
                            placeholder='Nhập ghi chú'
                            {...field}
                            className={cn(!isEditMode && 'disabled:opacity-90')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Information Section */}
          <Card className='border-none py-1 shadow-none'>
            <CardTitle className='font-bold'>Thông tin sản phẩm</CardTitle>
            <CardContent className='space-y-2 px-0'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='installation_date'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày lắp đặt</FormLabel>
                        <FormControl>
                          <DateInput
                            value={
                              field.value instanceof Date
                                ? field.value
                                : field.value
                                  ? new Date((field.value as number) * 1000)
                                  : undefined
                            }
                            onChange={field.onChange}
                            placeholder='Chọn ngày lắp đặt'
                            disabled={!isEditMode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='purchase_date'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày áp dụng bảo hành</FormLabel>
                        <FormControl>
                          <DateInput
                            value={
                              field.value instanceof Date
                                ? field.value
                                : field.value
                                  ? new Date((field.value as number) * 1000)
                                  : undefined
                            }
                            onChange={field.onChange}
                            placeholder='Chọn ngày bảo hành'
                            disabled={!isEditMode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='expiration_date'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày hết hạn bảo hành</FormLabel>
                        <div className='flex w-full items-center gap-2'>
                          <FormControl>
                            <DateInput
                              value={
                                field.value instanceof Date
                                  ? field.value
                                  : field.value
                                    ? new Date((field.value as number) * 1000)
                                    : undefined
                              }
                              onChange={field.onChange}
                              placeholder='Chọn ngày hết hạn bảo hành'
                              disabled={!isEditMode}
                            />
                          </FormControl>
                          {!isEditMode && (
                            <Button
                              type='button'
                              variant='link'
                              className='text-green-600 hover:text-green-700'
                              onClick={() => setIsReminderModalOpen(true)}
                            >
                              Xem lời nhắc
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Action Buttons */}
          <div className='flex justify-end gap-2'>
            {!isEditMode ? (
              <Button
                type='button'
                variant='default'
                onClick={() => setIsEditMode(true)}
                className='bg-primary hover:bg-primary/90'
              >
                <Edit2 className='mr-2 h-4 w-4' />
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancel}
                  disabled={updateDeviceMutation.isPending}
                >
                  <X className='mr-2 h-4 w-4' />
                  Hủy
                </Button>
                <Button
                  type='submit'
                  variant='default'
                  disabled={updateDeviceMutation.isPending}
                  className='bg-primary hover:bg-primary/90'
                >
                  <Save className='mr-2 h-4 w-4' />
                  {updateDeviceMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </>
            )}
          </div>
          {/* Limit Parameters Section */}
          {sensorInfo && (
            <Card className='border-none p-0 shadow-none'>
              <Accordion
                type='single'
                collapsible
                className='p-0'
                defaultValue='0'
              >
                <AccordionItem
                  value='0'
                  className='border-none p-0 shadow-none'
                >
                  <AccordionTrigger>
                    <CardTitle className='text-base font-bold'>
                      Thông số thiết bị
                    </CardTitle>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className='mb-2 flex w-full justify-end'>
                      <Button
                        className='bg-[#0859AA] hover:bg-[#064488]'
                        type='button'
                        onClick={handleSyncDevices}
                      >
                        <RefreshCw className='mr-2 h-4 w-4' />
                        Đồng bộ
                      </Button>
                    </div>

                    <CardContent className='grid grid-cols-1 gap-4 px-0 md:grid-cols-3'>
                      {Object.entries(sensorInfo.attributes || {}).map(
                        ([key, value]) => {
                          const valueType = sensorInfo.attributes?.[key]?.t;
                          let _value = '';
                          if (valueType === 1 || valueType === 2) {
                            _value =
                              sensorInfo.last_state?.[key]?.toString() || '';
                          } else {
                            _value = Array.isArray(sensorInfo.last_state?.[key])
                              ? sensorInfo.last_state?.[key]?.join(' _ ')
                              : '';
                          }
                          return (
                            <div key={key} className='space-y-2'>
                              <Label>{`${value.n} (${value.u})`}</Label>
                              <Input
                                value={_value}
                                disabled
                                className='disabled:opacity-90'
                              />
                            </div>
                          );
                        }
                      )}
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          )}
        </form>
      </Form>
      <ReminderManagementModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        device={device}
        onSave={handleSaveReminders}
      />
      {syncRequestId && (
        <RequestWatcher
          requestId={syncRequestId}
          deviceId={String(device.id)}
          pollInterval={syncPollInterval}
          onStopped={handleSyncStopped}
        />
      )}
    </FormSchemaProvider>
  );
}
