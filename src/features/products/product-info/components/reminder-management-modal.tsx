'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { Button } from '@/ui/components/ui/button';
import { Label } from '@/ui/components/ui/label';
import { Input } from '@/ui/components/ui/input';
import { MultiSelect } from '@/ui/components/ui/multi-select';
import { Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import {
  useGetReminders,
  useCreateReminder,
  useUpdateReminder,
  useDeleteReminder
} from '@/core/domains/reminders';
import { Device } from '@/core/domains/devices';

interface ReminderManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device;
  onSave: (reminderMap: Record<string, string[]>) => void;
}

interface DateField {
  identify: string;
  label: string;
  value: Date | undefined;
}

export function ReminderManagementModal({
  isOpen,
  onClose,
  device,
  onSave
}: ReminderManagementModalProps) {
  const { data: remindersData, isLoading: isLoadingReminders } =
    useGetReminders();
  const createReminderMutation = useCreateReminder();
  const updateReminderMutation = useUpdateReminder();
  const deleteReminderMutation = useDeleteReminder();

  const [editingReminder, setEditingReminder] = useState<{
    id?: string;
    name: string;
    description: string;
    before: number;
    after: number;
  } | null>(null);

  const [reminderMap, setReminderMap] = useState<Record<string, string[]>>(
    () => {
      const map: Record<string, string[]> = {};
      const attrs = device.device_asset?.asset_attribute || [];
      attrs.forEach((attr) => {
        if (attr.type === 2 && attr.reminder_ids) {
          // type 2 is date
          map[attr.identify] = [...(attr.reminder_ids || [])];
        }
      });
      return map;
    }
  );

  // Get date fields from device
  const dateFields: DateField[] = useMemo(() => {
    const attrs = device.device_asset?.asset_attribute || [];
    const fields: DateField[] = [];

    const fieldMap: Record<string, string> = {
      installation_date: 'Ngày lắp đặt',
      purchase_date: 'Ngày áp dụng bảo hành',
      expiration_date: 'Ngày hết hạn bảo hành'
    };

    ['installation_date', 'purchase_date', 'expiration_date'].forEach(
      (identify) => {
        const attr = attrs.find((a) => a.identify === identify);
        if (attr && attr.type === 2 && attr.content) {
          const timestamp =
            typeof attr.content === 'number'
              ? attr.content
              : parseInt(String(attr.content));
          fields.push({
            identify,
            label: fieldMap[identify] || identify,
            value: timestamp ? new Date(timestamp * 1000) : undefined
          });
        } else {
          // Include even if no date set
          fields.push({
            identify,
            label: fieldMap[identify] || identify,
            value: undefined
          });
        }
      }
    );

    return fields;
  }, [device]);

  // Convert reminders to MultiSelect options format
  const reminderOptions = useMemo(() => {
    const reminders = remindersData?.reminder || [];
    return reminders.map((reminder) => ({
      label: reminder.name,
      value: String(reminder.id),
      disabled: false
    }));
  }, [remindersData?.reminder]);

  const reminders = remindersData?.reminder || [];

  const handleReminderChange = (
    dateFieldIdentify: string,
    selectedValues: string[]
  ) => {
    setReminderMap((prev) => ({
      ...prev,
      [dateFieldIdentify]: selectedValues
    }));
  };

  const handleSaveReminder = () => {
    if (!editingReminder) return;

    const data = {
      name: editingReminder.name,
      description: editingReminder.description,
      before: editingReminder.before,
      after: editingReminder.after
    };

    if (editingReminder.id) {
      updateReminderMutation.mutate(
        { id: editingReminder.id, data },
        {
          onSuccess: () => {
            setEditingReminder(null);
          }
        }
      );
    } else {
      createReminderMutation.mutate(data, {
        onSuccess: () => {
          setEditingReminder(null);
        }
      });
    }
  };

  const handleDeleteReminder = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa lời nhắc này?')) {
      deleteReminderMutation.mutate(id);
    }
  };

  const handleSave = () => {
    onSave(reminderMap);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-h-[90vh] w-[80vw] !max-w-full overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Quản lý lời nhắc</DialogTitle>
        </DialogHeader>

        <div className='mt-4 grid grid-cols-2 gap-4 space-y-6'>
          {/* Date Fields with Reminders Section */}
          <div className='space-y-4'>
            {dateFields.map((field) => (
              <div
                key={field.identify}
                className='space-y-3 rounded-lg border p-4'
              >
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <Label className='font-medium'>{field.label}</Label>
                    {field.value && (
                      <div className='text-muted-foreground text-sm'>
                        {format(field.value, 'dd/MM/yyyy')}
                      </div>
                    )}
                    {!field.value && (
                      <div className='text-muted-foreground text-sm'>
                        Chưa có ngày
                      </div>
                    )}
                  </div>
                </div>

                {reminders.length > 0 ? (
                  <div className='space-y-2'>
                    <MultiSelect
                      options={reminderOptions}
                      defaultValue={reminderMap[field.identify] || []}
                      onValueChange={(values) =>
                        handleReminderChange(field.identify, values)
                      }
                      placeholder='Chọn lời nhắc...'
                      className='w-full'
                      maxCount={3}
                      searchable={true}
                    />
                    {/* Show selected reminders details */}
                    {reminderMap[field.identify] &&
                      reminderMap[field.identify].length > 0 && (
                        <div className='mt-2 space-y-1'>
                          {reminderMap[field.identify].map((reminderId) => {
                            const reminder = reminders.find(
                              (r) => String(r.id) === reminderId
                            );
                            if (!reminder) return null;
                            return (
                              <div
                                key={reminderId}
                                className='text-muted-foreground pl-2 text-xs'
                              >
                                <span className='font-medium'>
                                  {reminder.name}
                                </span>
                                {' - '}
                                {reminder.before > 0 &&
                                  `${reminder.before} ngày trước`}
                                {reminder.before > 0 &&
                                  reminder.after > 0 &&
                                  ' • '}
                                {reminder.after > 0 &&
                                  `${reminder.after} ngày sau`}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className='text-muted-foreground text-sm'>
                    Chưa có lời nhắc nào. Vui lòng tạo lời nhắc trước.
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reminders Management Section */}
          <div className='space-y-4 rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Danh sách lời nhắc</h3>
              <Button
                type='button'
                size='sm'
                onClick={() =>
                  setEditingReminder({
                    name: '',
                    description: '',
                    before: 0,
                    after: 0
                  })
                }
              >
                <Plus className='mr-2 h-4 w-4' />
                Thêm lời nhắc
              </Button>
            </div>

            {editingReminder && (
              <div className='bg-muted/50 space-y-3 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>
                    {editingReminder.id ? 'Chỉnh sửa' : 'Thêm mới'} lời nhắc
                  </h4>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => setEditingReminder(null)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
                <div className='grid grid-cols-3 gap-3'>
                  <div className='space-y-2'>
                    <Label>Tên lời nhắc</Label>
                    <Input
                      value={editingReminder.name}
                      onChange={(e) =>
                        setEditingReminder({
                          ...editingReminder,
                          name: e.target.value
                        })
                      }
                      placeholder='Nhập tên lời nhắc'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Số ngày trước</Label>
                    <Input
                      type='number'
                      value={editingReminder.before}
                      onChange={(e) =>
                        setEditingReminder({
                          ...editingReminder,
                          before: parseInt(e.target.value) || 0
                        })
                      }
                      placeholder='Số ngày trước khi nhắc'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Số ngày sau</Label>
                    <Input
                      type='number'
                      value={editingReminder.after}
                      onChange={(e) =>
                        setEditingReminder({
                          ...editingReminder,
                          after: parseInt(e.target.value) || 0
                        })
                      }
                      placeholder='Số ngày sau khi nhắc'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Mô tả</Label>
                  <Input
                    value={editingReminder.description}
                    onChange={(e) =>
                      setEditingReminder({
                        ...editingReminder,
                        description: e.target.value
                      })
                    }
                    placeholder='Nhập mô tả'
                  />
                </div>
                <div className='flex justify-end gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setEditingReminder(null)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type='button'
                    onClick={handleSaveReminder}
                    disabled={
                      !editingReminder.name ||
                      createReminderMutation.isPending ||
                      updateReminderMutation.isPending
                    }
                  >
                    <Save className='mr-2 h-4 w-4' />
                    Lưu
                  </Button>
                </div>
              </div>
            )}

            {isLoadingReminders ? (
              <div className='text-muted-foreground py-4 text-center'>
                Đang tải...
              </div>
            ) : reminders.length === 0 ? (
              <div className='text-muted-foreground py-4 text-center'>
                Chưa có lời nhắc nào
              </div>
            ) : (
              <div className='space-y-2'>
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3'
                  >
                    <div className='flex-1'>
                      <div className='font-medium'>{reminder.name}</div>
                      {reminder.description && (
                        <div className='text-muted-foreground text-sm'>
                          {reminder.description}
                        </div>
                      )}
                      <div className='text-muted-foreground text-xs'>
                        {reminder.before > 0 && `${reminder.before} ngày trước`}
                        {reminder.before > 0 && reminder.after > 0 && ' • '}
                        {reminder.after > 0 && `${reminder.after} ngày sau`}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          setEditingReminder({
                            id: String(reminder.id),
                            name: reminder.name,
                            description: reminder.description || '',
                            before: reminder.before || 0,
                            after: reminder.after || 0
                          })
                        }
                      >
                        <Edit2 className='h-4 w-4' />
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          handleDeleteReminder(String(reminder.id))
                        }
                        disabled={deleteReminderMutation.isPending}
                      >
                        <Trash2 className='text-destructive h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='mt-6 flex justify-end gap-2 border-t pt-4'>
          <Button type='button' variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button type='button' onClick={handleSave}>
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
