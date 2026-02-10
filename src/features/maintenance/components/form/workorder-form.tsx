'use client';
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
  FormMessage,
  FormSchemaProvider
} from '@/ui/components/ui/form';
import { Button } from '@/ui/components/ui/button';
import { useMemo, useState } from 'react';
import { Input } from '@/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { CalendarRangePicker } from '@/features/calendar/components/calendar-range-picker';
import { FileUpload } from '@/ui/components/input-file';
import Image from 'next/image';
import { ImageUpload } from '@/ui/components/image-upload';
import { useRouter } from 'next/navigation';
import {
  Attachment,
  MaintenanceProgressFormValues,
  maintenanceProgressSchema,
  useUpdateWorkOrder,
  WorkOrder,
  WorkOrderAction,
  WorkOrderActionLabel,
  WorkOrderStatus,
  WorkOrderStatusLabel,
  WorkOrderUpdateForm
} from '@/core/domains/workorders';
import { useGetUsers, useSearchUsers } from '@/core/domains/users';
import { useAuthStore } from '@/core/domains/auth';
import {
  CARD_FIELDS,
  normalizeStartEndDate,
  pickAllowedFields
} from '../../helper';
import { useTranslation } from '@/core/domains/language/useTranslation';

type MaintenanceFormProps = {
  pageTitle: string;
  initialData: WorkOrder;
  isView?: boolean;
  onBack?: () => void;
};

export default function WorkorderForm({
  pageTitle,
  initialData,
  isView,
  onBack
}: MaintenanceFormProps) {
  const { t } = useTranslation();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<Attachment[]>(
    initialData.admin_attachments ?? []
  );

  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<Attachment[]>(
    initialData.attachments ?? []
  );

  const { user } = useAuthStore();

  const isAssignedBy =
    !!user?.id &&
    (user.id === initialData.assigned_by ||
      user.id === initialData.acknowledged_by);

  const isAssignee = user?.id !== null && user?.id === initialData.assignee_id;

  const isCompleted =
    initialData.work_order_status === WorkOrderStatus.COMPLETED;

  const isOpen = initialData.action === WorkOrderAction.OPEN;

  const permissions = {
    assignedBy: isAssignedBy && !isView && isOpen,
    assignee: (isAssignedBy || isAssignee) && !isView && !isCompleted && isOpen
  };

  const defaultValues: Partial<MaintenanceProgressFormValues> = {
    id: initialData?.id || '',
    work_order_name: initialData?.work_order_name || '',
    assignee_id: initialData?.assignee_id || '',
    department: initialData?.department || '',
    description: initialData?.description || '',

    work_order_status: initialData?.work_order_status || '',
    assignee_content: initialData?.assignee_content || '',
    start_date: initialData.start_date,

    end_date: initialData.end_date,
    action: initialData?.action || '',
    remarks: initialData?.remarks || '',
    attachments: {
      new: [],
      keep: initialData.attachments ?? [],
      delete: []
    },
    admin_attachments: {
      new: [],
      keep: initialData.admin_attachments ?? [],
      delete: []
    }
  };

  const router = useRouter();
  const form = useForm<MaintenanceProgressFormValues>({
    resolver: zodResolver(maintenanceProgressSchema),
    defaultValues
  });

  const { watch, setValue } = form;
  const unit = watch('department');

  const { data: usersData, isLoading: usersLoading } = useSearchUsers(
    { tag: unit },
    { enabled: !!unit }
  );

  const usersOptions = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.map((user) => ({
      value: String(user.id),
      label: `${user.first_name} ${user.last_name}`
    }));
  }, [usersData, usersLoading, unit]);

  const actionsOptions = useMemo(() => {
    return Object.values(WorkOrderAction).map((action) => ({
      value: action,
      label: t(WorkOrderActionLabel[action] as any)
    }));
  }, [t]);

  const statusOptions = useMemo(() => {
    return Object.values(WorkOrderStatus)
      .filter((status) => status !== WorkOrderStatus.CLOSED)
      .map((status) => ({
        value: status,
        label: t(WorkOrderStatusLabel[status] as any)
      }));
  }, [t]);

  const updateWorkOrder = useUpdateWorkOrder();
  const onSubmit = (values: MaintenanceProgressFormValues) => {
    let payload: WorkOrderUpdateForm = {};
    if (values.start_date && values.end_date) {
      const { startDate, endDate } = normalizeStartEndDate(
        values.start_date,
        values.end_date
      );
      values.start_date = startDate;
      values.end_date = endDate;
    }
    if (isAssignedBy) {
      payload = {
        ...payload,
        ...values,
        admin_attachments: {
          new: newFiles,
          keep: existingFiles,
          delete:
            initialData.admin_attachments?.filter(
              (attach) =>
                !existingFiles.some(
                  (file) => file.file_name === attach.file_name
                )
            ) ?? []
        },
        attachments: {
          new: newImages,
          keep: existingImages,
          delete:
            initialData.attachments?.filter(
              (attach) =>
                !existingImages.some(
                  (file) => file.file_name === attach.file_name
                )
            ) ?? []
        },
        work_order_status: values.work_order_status as WorkOrderStatus,
        action: values.action as WorkOrderAction
      };
    }
    if (isAssignee && !isAssignedBy) {
      const {
        attachments: _ignore1,
        admin_attachments: _ignore2,
        action: _ignore3,
        ...safeValues
      } = pickAllowedFields(values, CARD_FIELDS.card2);

      payload = {
        ...safeValues,
        attachments: {
          new: newImages,
          keep: existingImages,
          delete:
            initialData.attachments?.filter(
              (attach) =>
                !existingImages.some(
                  (file) => file.file_name === attach.file_name
                )
            ) ?? []
        },
        work_order_status: values.work_order_status as WorkOrderStatus
      };
    }
    updateWorkOrder.mutateAsync({ workOrderId: initialData.id, data: payload });
  };

  return (
    <div className='mx-auto w-full gap-1.5 border-0 bg-transparent px-0 py-1 shadow-none md:px-2'>
      <span className='text-[16px] font-bold'>{pageTitle}</span>
      <FormSchemaProvider schema={maintenanceProgressSchema}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='mt-2'>
            <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8'>
              <Card className='dark:bg-card-primary flex-1 gap-1.5 px-2 py-2 shadow-none md:px-[20px]'>
                <CardHeader className='px-0'>
                  <CardTitle className='mt-1 text-left text-[16px] font-bold'>
                    {t('maintenance.device_info')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-0'>
                  <FormField
                    control={form.control}
                    name='work_order_name'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.work_order_name')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                            placeholder={t('maintenance.enter_work_order_name')}
                            {...field}
                            disabled={!permissions.assignedBy}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='department'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.unit_handling')}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!permissions.assignedBy}
                          >
                            <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                              <SelectValue
                                placeholder={t(
                                  'maintenance.select_unit_handling'
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                              <SelectItem value='team:support'>
                                {t('maintenance.team_support')}
                              </SelectItem>
                              <SelectItem value='team:technical'>
                                {t('maintenance.team_technical')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='assignee_id'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.handler')}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!permissions.assignedBy}
                          >
                            <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                              <SelectValue
                                placeholder={t('maintenance.select_executor')}
                              />
                            </SelectTrigger>
                            <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                              {usersOptions.length > 0
                                ? usersOptions.map((user) => (
                                    <SelectItem
                                      key={user.value}
                                      value={user.value}
                                    >
                                      {user.label}
                                    </SelectItem>
                                  ))
                                : null}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.description')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={!permissions.assignedBy}
                            className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                            placeholder={
                              permissions.assignedBy
                                ? t('maintenance.enter_description')
                                : undefined
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='admin_attachments'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='!gap-1 text-xs font-bold'>
                          <Image
                            src={'/assets/icons/file.svg'}
                            alt='file'
                            width={20}
                            height={20}
                            className='dark:brightness-0 dark:invert'
                          />
                          {t('maintenance.attachments')}
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                            value={newFiles}
                            onChange={(files) => {
                              setNewFiles(files);
                              form.setValue('admin_attachments.new', files);
                            }}
                            multiple
                            accept='.jpg,.png,.pdf,.doc,.docx,.xlsx,.xls'
                            maxHeight={105}
                            existingFiles={existingFiles?.map((file) => ({
                              file_name: file.file_name,
                              file_url: file.file_url
                            }))}
                            onRemoveExisting={(file) => {
                              setExistingFiles((prev) => {
                                const updated = prev.filter(
                                  (f) => f.file_url !== file.file_url
                                );
                                form.setValue(
                                  'admin_attachments.keep',
                                  updated
                                );
                                return updated;
                              });
                            }}
                            maxFiles={5}
                            disabled={!permissions.assignedBy}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className='dark:bg-card-primary flex-1 gap-1.5 px-2 py-2 shadow-none md:px-[20px]'>
                <CardHeader className='px-0'>
                  <CardTitle className='mt-1 text-left text-[16px] font-bold'>
                    {t('maintenance.update_progress')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-0'>
                  <FormField
                    control={form.control}
                    name='work_order_status'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.progress_status')}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={
                              !permissions.assignee && !permissions.assignedBy
                            }
                          >
                            <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                              <SelectValue
                                placeholder={t('maintenance.select_executor')}
                              />
                            </SelectTrigger>
                            <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                              {statusOptions.length > 0
                                ? statusOptions.map((status) => (
                                    <SelectItem
                                      key={status.value}
                                      value={status.value}
                                    >
                                      {status.label}
                                    </SelectItem>
                                  ))
                                : null}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='assignee_content'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.note')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={
                              !permissions.assignee && !permissions.assignedBy
                            }
                            className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                            placeholder={
                              permissions.assignedBy
                                ? t('maintenance.enter_note')
                                : undefined
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='flex flex-col gap-1.5 sm:flex-row'>
                    <div className='flex-1'>
                      <FormField
                        control={form.control}
                        name='start_date'
                        render={({ field }) => (
                          <FormItem className='col-span-2'>
                            <FormLabel className='text-xs font-bold'>
                              {t('maintenance.start_date')}
                            </FormLabel>
                            <FormControl>
                              <CalendarRangePicker
                                mode='single'
                                className='!w-full !rounded-[4px] text-xs'
                                textClassname='!text-left'
                                disablePastDate
                                value={
                                  field.value
                                    ? { from: new Date(field.value) }
                                    : undefined
                                }
                                onChange={(val) => {
                                  if (!val?.from) return field.onChange(null);

                                  const d = val.from;
                                  const yyyy = d.getFullYear();
                                  const mm = String(d.getMonth() + 1).padStart(
                                    2,
                                    '0'
                                  );
                                  const dd = String(d.getDate()).padStart(
                                    2,
                                    '0'
                                  );

                                  field.onChange(`${yyyy}-${mm}-${dd}`);
                                }}
                                disabled={!permissions.assignedBy}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='flex-1'>
                      <FormField
                        control={form.control}
                        name='end_date'
                        render={({ field }) => (
                          <FormItem className='col-span-2'>
                            <FormLabel className='text-xs font-bold'>
                              {t('maintenance.end_date')}
                            </FormLabel>
                            <FormControl>
                              <CalendarRangePicker
                                mode='single'
                                className='!w-full !rounded-[4px] text-xs'
                                textClassname='!text-left'
                                disablePastDate
                                value={
                                  field.value
                                    ? { from: new Date(field.value) }
                                    : undefined
                                }
                                onChange={(val) => {
                                  if (!val?.from) return field.onChange(null);

                                  const d = val.from;
                                  const yyyy = d.getFullYear();
                                  const mm = String(d.getMonth() + 1).padStart(
                                    2,
                                    '0'
                                  );
                                  const dd = String(d.getDate()).padStart(
                                    2,
                                    '0'
                                  );

                                  field.onChange(`${yyyy}-${mm}-${dd}`);
                                }}
                                disabled={!permissions.assignedBy}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name='attachments'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.images')}
                        </FormLabel>
                        <FormControl>
                          <ImageUpload
                            maxHeight={164}
                            disabled={
                              !permissions.assignee && !permissions.assignedBy
                            }
                            existingImages={existingImages}
                            onRemoveExisting={(img) => {
                              setExistingImages((prev) => {
                                const updated = prev.filter(
                                  (i) => i.file_url !== img.file_url
                                );
                                form.setValue('attachments.keep', updated);
                                return updated;
                              });
                            }}
                            value={newImages}
                            onChange={(files) => {
                              setNewImages(files);
                              form.setValue('attachments.new', files);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className='dark:bg-card-primary flex-1 gap-1.5 px-2 py-2 shadow-none md:px-[20px]'>
                <CardHeader className='px-0'>
                  <CardTitle className='mt-1 text-left text-[16px] font-bold'>
                    {t('maintenance.confirm_progress')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-0'>
                  <FormField
                    control={form.control}
                    name='action'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.process_status')}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!permissions.assignedBy}
                          >
                            <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                              <SelectValue
                                placeholder={t('maintenance.select_executor')}
                              />
                            </SelectTrigger>
                            <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                              {actionsOptions.length > 0
                                ? actionsOptions.map((action) => (
                                    <SelectItem
                                      key={action.value}
                                      value={action.value}
                                    >
                                      {action.label}
                                    </SelectItem>
                                  ))
                                : null}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='remarks'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='text-xs font-bold'>
                          {t('maintenance.note')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={!permissions.assignedBy}
                            className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                            placeholder={
                              permissions.assignedBy
                                ? t('maintenance.enter_note')
                                : undefined
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className='mt-2 mr-2.5 mb-3.5 flex h-[30px] items-center justify-end gap-4'>
              {isView ? (
                <Button
                  onClick={() =>
                    onBack ? onBack() : router.push(`/dashboard/maintenance`)
                  }
                  variant={'outline'}
                  type='button'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  {t('maintenance.close')}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() =>
                      onBack ? onBack() : router.push(`/dashboard/maintenance`)
                    }
                    variant={'outline'}
                    type='button'
                    className='h-full w-16 rounded-[4px] text-xs'
                  >
                    {t('maintenance.cancel')}
                  </Button>

                  <Button
                    variant={'default'}
                    type='submit'
                    className='h-full w-[136px] rounded-[4px] text-xs'
                    disabled={updateWorkOrder.isPending}
                  >
                    {updateWorkOrder.isPending
                      ? t('maintenance.updating')
                      : t('maintenance.update')}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </FormSchemaProvider>
    </div>
  );
}
