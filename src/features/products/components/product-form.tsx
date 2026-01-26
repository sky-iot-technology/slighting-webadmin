'use client';

import { AvatarUploader, FileUploader } from '@/ui/components/file-uploader';
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
import { useMemo, useState } from 'react';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/ui/components/ui/sheet';
import GoongMapMarker from '@/ui/business/map/goong-marker';
import { TreeProvider } from '@/ui/business/tree/TreeProvider';
import { useTranslation } from '@/core/domains/language/useTranslation';

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
  const { t } = useTranslation();
  const router = useRouter();

  const [selectedParent, setSelectedParent] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [open, setOpen] = useState(false);

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
    manufacturer: '',
    image: undefined
  };

  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues
  });

  function onSubmit(values: DeviceFormValues) {
    // Convert form values to API payload format
    const apiPayload = convertFormToApiPayload(values);
    // console.log(apiPayload);
    // Call API to create device
    createDeviceMutation.mutate(apiPayload);
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-primary text-left text-xl'>
          {t('products.new.add_product')}
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
                            {/* <FileUploader
                              value={field.value}
                              onValueChange={field.onChange}
                              maxFiles={1}
                              maxSize={5 * 1024 * 1024}
                              // disabled={loading}
                              // progresses={progresses}
                              // pass the onUpload function here for direct upload
                              // onUpload={uploadFiles}
                              // disabled={isUploading}
                            /> */}
                            <AvatarUploader
                              value={field.value}
                              onValueChange={field.onChange}
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
                          <FormLabel>
                            {t('products.form.label.id' as any)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'products.form.placeholder.id' as any
                              )}
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
                          <FormLabel>
                            {t('products.form.label.name' as any)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='h-9 rounded-sm'
                              placeholder={t(
                                'products.form.placeholder.name' as any
                              )}
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
                          <FormLabel>
                            {t('products.form.label.type' as any)}
                          </FormLabel>

                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue
                                  placeholder={t(
                                    'products.form.placeholder.type' as any
                                  )}
                                />
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
                          <FormLabel>
                            {t('products.form.label.favorite_group' as any)}
                          </FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={tagOptions}
                              defaultValue={field.value ?? []}
                              onValueChange={(val) => field.onChange(val)}
                              placeholder={t(
                                'products.form.placeholder.favorite_group' as any
                              )}
                              disabled={isLoadingTags}
                              resetOnDefaultValueChange={true}
                              className='dark:!bg-input/30 !min-h-9 w-full rounded-sm text-sm'
                              popoverClassName='w-[var(--radix-popover-trigger-width)] !overscroll-contain'
                              itemClassName='text-base'
                              autoSize={true}
                              // singleLine={false}
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
                      name='lon'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('products.form.label.coordinates' as any)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder={t(
                                'products.form.placeholder.lon' as any
                              )}
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
                      name='lat'
                      render={({ field }) => (
                        <FormItem>
                          <div className='md:h-3.5'></div>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder={t(
                                'products.form.placeholder.lat' as any
                              )}
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
                                    -90,
                                    Math.min(90, num)
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
                            {t('products.form.button.map_location' as any)}
                          </Button>
                        </SheetTrigger>
                        <SheetContent side='right' className='gap-0'>
                          <SheetHeader>
                            <SheetTitle className='mx-auto'>
                              {t('products.form.sheet.title' as any)}
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
                          <FormLabel>
                            {t('products.form.label.branch' as any)}
                          </FormLabel>
                          {/* <Select
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
                          </Select> */}
                          <TreeProvider
                            onRegionChange={(region) => {
                              field.onChange(region?.id ?? '');
                              setSelectedParent(
                                region
                                  ? { id: region.id, name: region.name }
                                  : null
                              );
                              setOpen(false);
                            }}
                            selectedRegion={
                              selectedParent
                                ? {
                                    id: selectedParent.id,
                                    name: selectedParent.name
                                  }
                                : undefined
                            }
                            open={open}
                            onOpenChange={setOpen}
                            className='!h-9 !w-full !text-sm'
                            buttonClassName='!rounded-sm !bg-white dark:!bg-input/30'
                            treeClassName='!w-full !rounded-sm '
                            insideClassName='!text-sm dark:bg-action'
                            showSelectAll={true}
                          />
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
                          <FormLabel>
                            {t('products.form.label.address' as any)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'products.form.placeholder.address' as any
                              )}
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
                          <FormLabel>
                            {t('products.form.label.note' as any)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'products.form.placeholder.note' as any
                              )}
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
                    <CardTitle className='text-md text-left'>
                      {t('products.form.label.product_info' as any)}
                    </CardTitle>
                  </div>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='serial'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('products.form.label.serial' as any)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'products.form.placeholder.serial' as any
                              )}
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
                          <FormLabel>
                            {t('products.form.label.installation_date' as any)}
                          </FormLabel>
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
                              placeholder={t(
                                'products.form.placeholder.date' as any
                              )}
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
                          <FormLabel>
                            {t('products.form.label.warranty_date' as any)}
                          </FormLabel>
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
                              placeholder={t(
                                'products.form.placeholder.date' as any
                              )}
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
                          <FormLabel>
                            {t('products.form.label.manufacturer' as any)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'products.form.placeholder.manufacturer' as any
                              )}
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
                          <FormLabel>
                            {t(
                              'products.form.label.warranty_expiration' as any
                            )}
                          </FormLabel>
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
                              placeholder={t(
                                'products.form.placeholder.date' as any
                              )}
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
                  {t('products.form.button.cancel' as any)}
                </Button>
                <Button type='submit' disabled={createDeviceMutation.isPending}>
                  {createDeviceMutation.isPending
                    ? t('products.form.button.saving' as any)
                    : t('products.form.button.save' as any)}
                </Button>
              </div>
            </form>
          </Form>
        </FormSchemaProvider>
      </CardContent>
    </Card>
  );
}
