'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  FormMessage
} from '@/ui/components/ui/form';
import { Button } from '@/ui/components/ui/button';
import { useMemo, useState } from 'react';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import {
  CreateGroupDTO,
  Group,
  useCreateGroup,
  useUpdateGroup
} from '@/core/domains/groups';
import { branchFormSchema } from '@/core/domains/groups/schemas';
import { Input } from '@/ui/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/ui/components/ui/sheet';
import { TreeProvider } from '@/ui/business/tree/TreeProvider';
import GoongMapMarker from '@/ui/business/map/goong-marker';

type BranchFormProps = {
  initialData: Partial<Group> | null;
  pageTitle: string;
  onClose?: () => void;
  formData?: z.infer<typeof branchFormSchema> | null;
  isEditMode?: boolean;
};

export default function BranchForm({
  initialData,
  formData,
  onClose,
  pageTitle,
  isEditMode
}: BranchFormProps) {
  const [selectedParent, setSelectedParent] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const defaultValues = useMemo(() => {
    return (
      formData ??
      ((initialData
        ? {
            name: initialData.name ?? '',
            description: initialData.description ?? '',
            parent_id: initialData.parent_id ?? '',
            metadata: {
              lat: initialData.metadata?.lat ?? undefined,
              long: initialData.metadata?.long ?? undefined
            }
          }
        : {
            name: '',
            description: '',
            parent_id: '',
            metadata: { lat: undefined, long: undefined }
          }) as z.infer<typeof branchFormSchema>)
    );
  }, [formData, initialData]);

  const form = useForm<z.infer<typeof branchFormSchema>>({
    resolver: zodResolver(branchFormSchema),
    defaultValues
  });

  const createMutation = useCreateGroup({
    onSuccess: () => {
      if (onClose) onClose();
    }
  });

  const updateMutation = useUpdateGroup({
    onSuccess: () => {
      if (onClose) onClose();
    }
  });

  const onSubmit = (values: z.infer<typeof branchFormSchema>) => {
    const payload: CreateGroupDTO = {
      parent_id: values.parent_id,
      name: values.name,
      description: values.description,
      metadata:
        values.metadata?.lat && values.metadata?.long
          ? { lat: values.metadata.lat, long: values.metadata.long }
          : undefined
    };

    if (isEditMode && initialData?.id) {
      const { parent_id, ...rest } = payload;
      updateMutation.mutate({ id: String(initialData.id), data: rest });
      return;
    }

    createMutation.mutate(payload);
  };

  return (
    <CustomScrollbar className='max-h-[660px] overflow-y-auto p-5.5'>
      <Card className='bg-background mx-auto w-full gap-1.5 border-0 py-0 shadow-none'>
        <CardHeader className='px-0'>
          <CardTitle className='text-primary text-left text-[16px] font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className='px-0'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=''>
              {!isEditMode && !initialData?.id && (
                <FormField
                  control={form.control}
                  name='parent_id'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        Chi nhánh cha
                      </FormLabel>
                      <FormControl>
                        <TreeProvider
                          onRegionChange={(region) => {
                            field.onChange(region?.id ?? '');
                            setSelectedParent(
                              region
                                ? { id: region.id, name: region.name }
                                : null
                            );
                          }}
                          selectedRegion={
                            selectedParent
                              ? {
                                  id: selectedParent.id,
                                  name: selectedParent.name
                                }
                              : undefined
                          }
                          className='!h-[31px] !w-full !text-xs'
                          buttonClassName='!rounded-[4px]'
                          treeClassName='!w-full !rounded-[4px]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel className='text-xs font-bold'>
                      Tên chi nhánh
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder='Nhập tên chi nhánh'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold'>Mô tả</FormLabel>
                    <FormControl>
                      <Input
                        className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                        placeholder='Nhập mô tả'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='metadata'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold'>
                      Vĩ độ & Kinh độ
                    </FormLabel>
                    <div className='flex gap-1'>
                      <FormField
                        control={form.control}
                        name='metadata.long'
                        render={({ field }) => (
                          <Input
                            placeholder='Kinh độ'
                            className='!h-[31px] !rounded-[4px] !text-xs placeholder:text-xs'
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              let value = e.target.value.replace(/[^\d-]/g, '');
                              const isNegative = value.startsWith('-');
                              if (isNegative) value = value.slice(1);

                              if (value.length > 2) {
                                value = `${value.slice(0, 2)}.${value.slice(2)}`;
                              }

                              field.onChange(isNegative ? `-${value}` : value);
                            }}
                            onBlur={() => {
                              const num = parseFloat(String(field.value ?? ''));
                              if (!isNaN(num)) {
                                const limited = Math.max(
                                  -180,
                                  Math.min(180, num)
                                );
                                field.onChange(limited.toFixed(6));
                              }
                            }}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='metadata.lat'
                        render={({ field }) => (
                          <Input
                            placeholder='Vĩ độ'
                            className='!h-[31px] !rounded-[4px] !text-xs placeholder:text-xs'
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              let value = e.target.value.replace(/[^\d-]/g, '');
                              const isNegative = value.startsWith('-');
                              if (isNegative) value = value.slice(1);

                              if (value.length > 2) {
                                value = `${value.slice(0, 2)}.${value.slice(2)}`;
                              }

                              field.onChange(isNegative ? `-${value}` : value);
                            }}
                            onBlur={() => {
                              const num = parseFloat(String(field.value ?? ''));
                              if (!isNaN(num)) {
                                const limited = Math.max(
                                  -90,
                                  Math.min(90, num)
                                );
                                field.onChange(limited.toFixed(6));
                              }
                            }}
                          />
                        )}
                      />
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            type='button'
                            className='bg-blue-2 h-[31px] w-[111px] rounded-[4px] text-xs'
                          >
                            Chọn vị trí bản đồ
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
                              lat={Number(form.watch('metadata.lat'))}
                              long={Number(form.watch('metadata.long'))}
                              onSelectLocation={({ lat, long }) => {
                                form.setValue(
                                  'metadata.lat',
                                  Number(lat.toFixed(6))
                                );
                                form.setValue(
                                  'metadata.long',
                                  Number(long.toFixed(6))
                                );
                              }}
                            />
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex h-[30px] items-center justify-end gap-1'>
                <Button
                  onClick={onClose}
                  variant={'outline'}
                  type='button'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  Hủy
                </Button>
                <Button
                  type='submit'
                  className='h-full w-[70px] rounded-[4px] text-xs'
                >
                  Lưu
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
