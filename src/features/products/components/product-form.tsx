'use client';

import { FileUploader } from '@/ui/components/file-uploader';
import { Button } from '@/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSchemaProvider
} from '@/ui/components/ui/form';
import { Input } from '@/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DateInput } from '@/ui/components/ui/date-input';
import {
  deviceFormSchema,
  type DeviceFormValues,
  convertFormToApiPayload
} from './schemas';
import { useCreateDevice } from '@/core/domains/devices/hooks';
import { useGetTags } from '@/core/domains/tags';
import { useGetGroups } from '@/core/domains/groups';
import { useRouter } from 'next/navigation';
import { MultiSelect } from '@/ui/components/ui/multi-select';
import { useMemo } from 'react';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/ui/components/ui/sheet';
import GoongMapMarker from '@/ui/business/map/goong-marker';

interface Device {
  id?: string;
  name?: string;
  type?: string;
  parent_group_id?: string;
  tags?: string[];
  device_info?: {
    lat?: number;
    lon?: number;
    online?: boolean;
  };
  device_asset?: {
    asset_attribute?: any[];
  };
}

const isValidLat = (val: string) => {
  const n = Number(val);
  return !isNaN(n) && n >= -90 && n <= 90;
};

const isValidLon = (val: string) => {
  const n = Number(val);
  return !isNaN(n) && n >= -180 && n <= 180;
};

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Device | null;
  pageTitle: string;
}) {
  const router = useRouter();

  // Fetch tags from API
  const { data: tagsData, isLoading: isLoadingTags } = useGetTags({
    resource_type: 'device'
  });

  // Fetch groups from API
  const { data: groupsData, isLoading: isLoadingGroups } = useGetGroups({
    status: 'enabled'
  });

  const { catalogues } = useCatalogueStore();

  // Transform tags data into MultiSelect options format
  const tagOptions = useMemo(() => {
    if (!tagsData?.tag) return [];
    return tagsData.tag.map((tag) => ({
      value: tag.alias || String(tag.id),
      label: tag.name || tag.alias || String(tag.id)
    }));
  }, [tagsData]);

  // Transform groups data into Select options format
  const groupOptions = useMemo(() => {
    if (!groupsData?.groups) return [];
    return groupsData.groups.map((group) => ({
      value: String(group.id),
      label: group.name
    }));
  }, [groupsData]);

  const createDeviceMutation = useCreateDevice({
    onSuccess: () => {
      form.reset();
      router.replace('/dashboard/product');
    }
  });

  const defaultValues: Partial<DeviceFormValues> = {
    id: initialData?.id || '',
    name: initialData?.name || '',
    type: initialData?.type || '',
    parent_group_id: initialData?.parent_group_id || '',
    tags: initialData?.tags || [],
    lat: initialData?.device_info?.lat?.toString() || '0',
    lon: initialData?.device_info?.lon?.toString() || '0',
    address: '',
    note: '',
    serial: '',
    manufacturer: ''
  };

  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues
  });

  function onSubmit(values: DeviceFormValues) {
    // Convert form values to API payload format
    const apiPayload = convertFormToApiPayload(values);

    // Call API to create device
    createDeviceMutation.mutate(apiPayload);
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-primary text-left text-xl'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormSchemaProvider schema={deviceFormSchema}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                <div>
                  <FormField
                    control={form.control}
                    name='image'
                    render={({ field }) => (
                      <div className='space-y-6'>
                        <FormItem className='w-full'>
                          <FormControl>
                            <FileUploader
                              value={field.value}
                              onValueChange={field.onChange}
                              maxFiles={4}
                              maxSize={4 * 1024 * 1024}
                              // disabled={loading}
                              // progresses={progresses}
                              // pass the onUpload function here for direct upload
                              // onUpload={uploadFiles}
                              // disabled={isUploading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                </div>
                <div className='col-span-3 grid grid-cols-1 md:col-start-2 md:grid-cols-3 md:gap-4'>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='id'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã thiết bị</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Mã thiết bị'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên thiết bị</FormLabel>
                          <FormControl>
                            <Input
                              className='h-9 rounded-sm'
                              placeholder='Tên thiết bị'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='type'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại thiết bị</FormLabel>

                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Loại thiết bị' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {catalogues.map((c, index) => (
                                <SelectItem key={index} value={c.type}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='tags'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nhóm yêu thích</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={tagOptions}
                              defaultValue={field.value ?? []}
                              onValueChange={(val) => field.onChange(val)}
                              placeholder={'Chọn nhóm thiết bị'}
                              disabled={isLoadingTags}
                              resetOnDefaultValueChange={true}
                              className='w-full text-base'
                              popoverClassName='w-[var(--radix-popover-trigger-width)] !overscroll-contain'
                              itemClassName='text-base'
                              autoSize={false}
                              singleLine={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid w-full grid-cols-1 gap-3 md:col-span-2 md:col-start-2 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='lat'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kinh độ & Vĩ độ</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Vĩ độ'
                              {...field}
                              value={field.value || ''}
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
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='lon'
                      render={({ field }) => (
                        <FormItem>
                          <div className='md:h-3.5'></div>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Kinh độ'
                              {...field}
                              value={field.value || ''}
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
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <div className='md:h-3.5'></div>
                      {/* <Button variant={'default'} className='bg-cyan-1'>
                        Vị trí bản đồ
                      </Button> */}
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            type='button'
                            className='bg-cyan-1 rounded-sm hover:!bg-cyan-600'
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
                      <div className='md:h-4'></div>
                    </FormItem>
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='parent_group_id'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chi nhánh</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                            disabled={isLoadingGroups}
                          >
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue
                                  placeholder={
                                    isLoadingGroups
                                      ? 'Đang tải...'
                                      : 'Chọn chi nhánh'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {groupOptions.length > 0
                                ? groupOptions.map((group) => (
                                    <SelectItem
                                      key={group.value}
                                      value={group.value}
                                    >
                                      {group.label}
                                    </SelectItem>
                                  ))
                                : null}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Địa chỉ'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='note'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Ghi chú'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full md:col-span-3'>
                    <CardTitle className='text-md text-left text-black'>
                      {'Thông tin sản phẩm'}
                    </CardTitle>
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='serial'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serial</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Nhập số serial thiết bị'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='manufacturer'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nhà sản xuất</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Nhà sản xuất'
                              {...field}
                              className='h-9 rounded-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='expiration_date'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày hết hạn bảo hành</FormLabel>
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className='flex flex-row justify-end gap-3'>
                <Button
                  variant={'outline'}
                  type='button'
                  onClick={() => router.push('/dashboard/product')}
                >
                  Huỷ
                </Button>
                <Button type='submit' disabled={createDeviceMutation.isPending}>
                  {createDeviceMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </div>
            </form>
          </Form>
        </FormSchemaProvider>
      </CardContent>
    </Card>
  );
}
