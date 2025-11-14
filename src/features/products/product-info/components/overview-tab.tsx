'use client';

import { Device } from '@/core/domains/devices';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import { Input } from '@/ui/components/ui/input';
import { Label } from '@/ui/components/ui/label';
import { Button } from '@/ui/components/ui/button';
import { Badge } from '@/ui/components/ui/badge';
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
import { IconDeviceDesktop, IconCircleCheck } from '@tabler/icons-react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useGetGroups } from '@/core/domains/groups';
import { useGetTags } from '@/core/domains/tags';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OverviewTabProps {
  device: Device;
}

export function OverviewTab({ device }: OverviewTabProps) {
  const { data: groupsData } = useGetGroups({
    status: 'enabled'
  });

  const { data: tagsData } = useGetTags({
    resource_type: 'device'
  });

  const { catalogues } = useCatalogueStore();

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

  const getDeviceTypeLabel = (type: string) => {
    // Find the catalogue item that matches the device type
    const catalogue = catalogues.find((cat) => cat.type === type);
    // Return the catalogue name if found, otherwise return the type
    return catalogue?.name || type;
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

  // Check if there are reminder_ids for expiration_date
  const expirationAttr = device.device_asset?.asset_attribute?.find(
    (a) => a.identify === 'expiration_date'
  );
  const hasReminders =
    expirationAttr?.reminder_ids && expirationAttr.reminder_ids.length > 0;

  return (
    <div className='space-y-2'>
      {/* Device Header */}
      <Card className='border-none shadow-none'>
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
          <div className='flex-1 space-y-3'>
            <div>
              <h2 className='text-primary text-xl font-bold'>{device.name}</h2>
            </div>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-muted-foreground'>Mã thiết bị:</span>
                <span className='ml-2 font-medium'>
                  {device.device_info?.imei}
                </span>
              </div>
              <div>
                <span className='text-muted-foreground'>Loại thiết bị:</span>
                <span className='ml-2 font-medium'>
                  {getDeviceTypeLabel(device.type)}
                </span>
              </div>
              <div>
                <span className='text-muted-foreground'>Serial:</span>
                <span className='ml-2 font-medium'>{serial}</span>
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
          </div>
        </div>
      </Card>

      {/* Device Information Section */}
      <Card className='border-none shadow-none'>
        <CardTitle className='font-bold'>Thông tin thiết bị</CardTitle>
        <CardContent className='space-y-6 px-0'>
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
                <Input
                  type='number'
                  placeholder='Kinh độ'
                  value={device.device_info?.lon?.toString() || ''}
                  disabled
                  className='flex-1 disabled:opacity-90'
                />
                <Input
                  type='number'
                  placeholder='Vĩ độ'
                  value={device.device_info?.lat?.toString() || ''}
                  disabled
                  className='flex-1 disabled:opacity-90'
                />
                <Button
                  variant='default'
                  className='bg-cyan-600 hover:bg-cyan-700'
                >
                  Vị trí bản đồ
                </Button>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <Label>Chi nhánh</Label>
              <Select defaultValue={device.parent_group_id} disabled>
                <SelectTrigger className='w-full disabled:opacity-90'>
                  <SelectValue placeholder='Chọn nhóm thiết bị' />
                </SelectTrigger>
                <SelectContent>
                  {groupOptions.map((group) => (
                    <SelectItem key={group.value} value={String(group.value)}>
                      {group.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>Địa chỉ</Label>
              <Input
                value={device.device_info?.region || ''}
                disabled
                className='disabled:opacity-90'
                placeholder='Địa chỉ'
              />
            </div>
            <div className='space-y-2'>
              <Label>Ghi chú</Label>
              <Input
                value={note}
                disabled
                placeholder='Nhập ghi chú'
                className='disabled:opacity-90'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Information Section */}
      <Card className='border-none shadow-none'>
        <CardTitle className='font-bold'>Thông tin sản phẩm</CardTitle>
        <CardContent className='px-0'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <Label>Serial</Label>
              <Input
                value={serial}
                disabled
                placeholder='Serial'
                className='disabled:opacity-90'
              />
            </div>
            <div className='space-y-2'>
              <Label>Nhà sản xuất</Label>
              <Input
                value={manufacturer}
                disabled
                className='disabled:opacity-90'
                placeholder='Nhà sản xuất'
              />
            </div>
            <div className='space-y-2'>
              <Label>Ngày lắp đặt</Label>
              <div className='relative'>
                <Input
                  value={installationDate}
                  disabled
                  placeholder='Chọn ngày lắp đặt'
                  className='pr-10 disabled:opacity-90'
                />
                <CalendarIcon className='text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2' />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Ngày áp dụng bảo hành</Label>
              <div className='relative'>
                <Input
                  value={purchaseDate}
                  disabled
                  placeholder='Chọn ngày bảo hành'
                  className='pr-10 disabled:opacity-90'
                />
                <CalendarIcon className='text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2' />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Ngày hết hạn bảo hành</Label>
              <div className='relative flex items-center gap-2'>
                <Input
                  value={expirationDate}
                  disabled
                  placeholder='Chọn ngày hết hạn bảo hành'
                  className='pr-10 disabled:opacity-90'
                />
                <CalendarIcon className='text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2' />
                {hasReminders && (
                  <Button
                    variant='link'
                    className='text-green-600 hover:text-green-700'
                  >
                    Xem lời nhắc
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limit Parameters Section */}
      {sensorInfo && (
        <Card className='border-none p-0 shadow-none'>
          <Accordion type='single' collapsible className='p-0'>
            <AccordionItem
              value='limit-params'
              className='border-none p-0 shadow-none'
            >
              <AccordionTrigger>
                <CardTitle className='text-base font-bold'>
                  Thông số thiết bị
                </CardTitle>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className='grid grid-cols-1 gap-4 px-0 md:grid-cols-3'>
                  {Object.entries(sensorInfo.attributes || {}).map(
                    ([key, value]) => {
                      const valueType = sensorInfo.attributes?.[key]?.t;
                      let _value = '';
                      if (valueType === 1 || valueType === 2) {
                        _value = sensorInfo.last_state?.[key]?.toString() || '';
                      } else {
                        _value = Array.isArray(sensorInfo.last_state?.[key])
                          ? sensorInfo.last_state?.[key]?.join(', ')
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
      {/* Action Button */}
      <div className='flex justify-end'>
        <Button variant='outline'>Đóng</Button>
      </div>
    </div>
  );
}
