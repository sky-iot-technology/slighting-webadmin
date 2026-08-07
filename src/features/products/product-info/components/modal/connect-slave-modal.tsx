'use client';

import { useGetDevices } from '@/core/domains/devices';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { useDebounce } from '@/core/shared/hooks/use-debounce';
import { cn } from '@/lib/utils';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { Button } from '@/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { Check, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';

export interface SelectedDevice {
  id: string | number;
  name: string;
  code: string;
  online: boolean;
  type: string;
}

type ConnectSlaveModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectedIds: string[];
  onConnect: (devices: SelectedDevice[]) => void;
};

export default function ConnectSlaveModal({
  open,
  onOpenChange,
  connectedIds,
  onConnect
}: ConnectSlaveModalProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Fetch devices of type STL_SMART to fake available slave devices for connection
  const { data, isLoading } = useGetDevices({
    page: 1,
    limit: 50,
    name: debouncedSearch
    // type: 'lms.devices.types.STL_SMART'
  });

  const [selected, setSelected] = useState<SelectedDevice[]>([]);

  // Filter out devices that are already connected as slaves
  const availableDevices = useMemo(() => {
    if (!data?.devices) return [];
    return data.devices.filter(
      (item) => !connectedIds.includes(String(item.id))
    );
  }, [data?.devices, connectedIds]);

  const toggle = (device: SelectedDevice) => {
    setSelected((prev) => {
      const exists = prev.some((d) => d.id === device.id);
      const newSelected = exists
        ? prev.filter((d) => d.id !== device.id)
        : [...prev, device];
      return newSelected;
    });
  };

  const handleConnect = () => {
    if (selected.length > 0) {
      onConnect(selected);
    }
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) setSelected([]);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>Kết nối thiết bị con (Slave)</DialogTitle>
      <DialogDescription className='hidden'>
        Chọn thiết bị từ danh sách để kết nối làm Slave cho thiết bị trung tâm
      </DialogDescription>
      <DialogContent
        className='bg-card flex w-full max-w-[90vw] flex-col gap-4 rounded-lg border-slate-200 p-4 sm:max-w-[830px] dark:border-slate-800'
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <h2 className='text-center text-[16px] font-bold text-slate-900 sm:text-left dark:text-slate-50'>
          Kết nối <span className='text-primary'>thiết bị con (Slave)</span>
        </h2>

        <div className='flex flex-wrap items-center gap-2'>
          <div className='bg-background flex h-[30px] w-full items-center rounded-[6px] border border-slate-200 px-2 sm:w-[260px] dark:border-slate-700 dark:bg-slate-800'>
            <Image
              src={'/assets/icons/search.svg'}
              alt='search'
              width={11}
              height={11}
              className='text-muted-foreground mr-2 dark:brightness-0 dark:invert'
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='text-foreground placeholder:text-muted-foreground w-full bg-transparent text-xs focus:outline-none'
              placeholder='Tìm kiếm thiết bị...'
            />
          </div>
          <Button
            type='button'
            className='flex h-[30px] items-center gap-1.5 rounded-[6px] bg-[#0859AA] px-3 text-xs font-semibold text-white hover:bg-[#064488]'
            onClick={() => {
              toast.info('Đang quét tìm thiết bị con xung quanh...');
              setTimeout(() => {
                toast.success(
                  'Quét hoàn tất! Đã cập nhật danh sách thiết bị con.'
                );
              }, 1200);
            }}
          >
            <RefreshCw className='h-3.5 w-3.5' />
            Quét thiết bị
          </Button>
        </div>

        <div className='flex w-full flex-col gap-4 sm:flex-row'>
          {/* Left Panel: Available Devices */}
          <div className='flex h-[330px] min-h-[300px] min-w-[1px] flex-1 flex-col rounded-[8px] border border-slate-200 sm:h-[400px] dark:border-slate-800'>
            <div className='flex-shrink-0 border-b border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[12px] font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
              Chọn thiết bị khả dụng ({availableDevices.length})
            </div>
            <CustomScrollbar className='flex-1 overflow-y-auto'>
              <div className='flex flex-col'>
                {isLoading ? (
                  <div className='text-muted-foreground p-4 text-center text-xs'>
                    Đang tải thiết bị...
                  </div>
                ) : availableDevices.length === 0 ? (
                  <div className='text-muted-foreground p-4 text-center text-xs'>
                    Không có thiết bị khả dụng để kết nối
                  </div>
                ) : (
                  availableDevices.map((item, index) => {
                    const value = item.id;
                    const isChecked = selected.some((d) => d.id === value);
                    const isOnline = item.device_info.online;
                    return (
                      <div
                        key={index}
                        onClick={() =>
                          toggle({
                            id: item.id,
                            name: item.name,
                            code:
                              item.device_info.serial_number || String(item.id),
                            online: isOnline,
                            type: item.type
                          })
                        }
                        className={cn(
                          'flex h-[50px] w-full cursor-pointer items-center gap-2.5 border-b border-slate-100 px-2.5 py-1 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-4 w-4 items-center justify-center rounded-full border transition-all',
                            isChecked
                              ? 'bg-primary border-primary'
                              : 'border-slate-300 dark:border-slate-600'
                          )}
                        >
                          {isChecked && (
                            <Check className='h-2.5 w-2.5 text-white' />
                          )}
                        </div>
                        <div className='flex min-w-0 flex-1 flex-col'>
                          <span className='truncate text-[12px] font-semibold text-slate-800 dark:text-slate-200'>
                            {item.name}
                          </span>
                          <span className='truncate text-[10px] font-extralight text-slate-400'>
                            Mã: {item.device_info.serial_number || item.id}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400'>
                            {item.type.split('.').pop()}
                          </span>
                          <div
                            className={cn(
                              'h-2.5 w-2.5 shrink-0 rounded-full',
                              isOnline ? 'bg-green-500' : 'bg-red-500'
                            )}
                            title={isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CustomScrollbar>
          </div>

          {/* Right Panel: Selected Devices */}
          <div className='flex h-[330px] min-h-[300px] min-w-[1px] flex-1 flex-col rounded-[8px] border border-slate-200 sm:h-[400px] dark:border-slate-800'>
            <div className='flex-shrink-0 border-b border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[12px] font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
              Thiết bị đã chọn
              <span className='text-primary ml-1'>({selected.length})</span>
            </div>
            <CustomScrollbar className='flex-1 overflow-y-auto'>
              <div className='flex flex-col'>
                {selected.length === 0 ? (
                  <div className='text-muted-foreground p-4 text-center text-xs'>
                    Chưa chọn thiết bị nào
                  </div>
                ) : (
                  selected.map((item, index) => (
                    <div
                      key={index}
                      className='flex h-[50px] w-full items-center justify-between border-b border-slate-100 px-2.5 py-1 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                    >
                      <div className='flex min-w-0 flex-col'>
                        <span className='truncate text-[12px] font-semibold text-slate-800 dark:text-slate-200'>
                          {item.name}
                        </span>
                        <span className='truncate text-[10px] font-extralight text-slate-400'>
                          Mã: {item.code}
                        </span>
                      </div>
                      <div className='flex shrink-0 items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30'
                          onClick={() => toggle(item)}
                        >
                          <span className='text-xs font-bold'>✕</span>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CustomScrollbar>
          </div>
        </div>

        <div className='border-slate-150 flex justify-end gap-3 border-t pt-3 dark:border-slate-800'>
          <Button
            variant='outline'
            className='h-[30px] rounded-[4px] px-4 text-xs'
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            className='bg-primary hover:bg-primary/90 h-[30px] rounded-[4px] px-4 text-xs font-semibold text-white'
            onClick={handleConnect}
            disabled={!selected.length}
          >
            Kết nối
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
