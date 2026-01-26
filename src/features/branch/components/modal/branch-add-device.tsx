import {
  SetDevicesParentGroup,
  useGetDevices,
  useSetParent
} from '@/core/domains/devices';
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
import { Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type BranchAddDeviceProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regionId: string;
};

interface SelectedDevice {
  id: string | number;
  name: string;
  code: string;
  online: boolean;
}

export default function BranchAddDevice({
  open,
  onOpenChange,
  regionId
}: BranchAddDeviceProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data } = useGetDevices({
    page: 1,
    limit: 20,
    group: '',
    name: debouncedSearch
  });
  const { mutate: setParent, isPending } = useSetParent({
    onSuccess: () => {
      onOpenChange(false);
    }
  });
  const [selected, setSelected] = useState<SelectedDevice[]>([]);

  const toggle = (device: SelectedDevice) => {
    setSelected((prev) => {
      const exists = prev.some((d) => d.id === device.id);
      const newSelected = exists
        ? prev.filter((d) => d.id !== device.id)
        : [...prev, device];
      return newSelected;
    });
  };

  const handleAddParent = () => {
    if (selected.length === 0) {
      onOpenChange(false);
    }
    const payload: SetDevicesParentGroup = {
      parent_group_id: regionId,
      device_ids: selected.map((d) => String(d.id))
    };
    setParent(payload);
  };

  useEffect(() => {
    if (open) setSelected([]);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>
        {t('branch.add_multiple_devices')}
      </DialogTitle>
      <DialogDescription className='hidden'>
        {t('branch.add_multiple_devices')}
      </DialogDescription>
      <DialogContent
        className='bg-card flex w-full max-w-[90vw] flex-col gap-4 rounded-lg p-4 sm:max-w-[830px]'
        hideCloseButton
      >
        <h2 className='text-center text-[16px] font-bold sm:text-left'>
          {t('branch.add')}{' '}
          <span className='text-primary'>
            {t('branch.add_multiple_devices').replace(t('branch.add'), '')}
          </span>
        </h2>

        <div className='bg-background dark:bg-gray-2 flex h-[28px] w-full items-center rounded-[6px] px-2 sm:w-[260px]'>
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
            placeholder={t('branch.search_device')}
          />
        </div>

        <div className='flex w-full flex-col gap-4 sm:flex-row'>
          <div className='flex h-[330px] min-w-0 flex-1 flex-col rounded-[8px] border sm:h-[400px]'>
            <div className='flex-shrink-0 border-b px-2.5 py-1.5 text-[14px] font-semibold'>
              {t('branch.select_device')}
            </div>
            <CustomScrollbar className='flex-1 overflow-y-auto'>
              <div className='flex flex-col'>
                {data?.devices?.map((item, index) => {
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
                          code: item.device_info.serial_number,
                          online: isOnline
                        })
                      }
                      className={cn(
                        'dark:hover:bg-input flex h-[50px] w-full cursor-pointer items-center gap-2.5 border-b px-2.5 py-1 transition hover:bg-gray-50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-full border',
                          isChecked
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground'
                        )}
                      >
                        {isChecked && (
                          <Check className='h-2.5 w-2.5 text-white' />
                        )}
                      </div>
                      <div className='flex flex-1 flex-col'>
                        <span className='truncate text-[12px] font-semibold'>
                          {item.name}
                        </span>
                        <span className='text-muted-foreground truncate text-[10px] font-extralight'>
                          {t('branch.code')}: {item.device_info.serial_number}
                        </span>
                      </div>
                      <div
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          isOnline ? 'bg-green-500' : 'bg-red-500'
                        )}
                        title={
                          isOnline ? t('branch.online') : t('branch.offline')
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </CustomScrollbar>
          </div>

          <div className='flex h-[330px] min-w-0 flex-1 flex-col rounded-[8px] border sm:h-[400px]'>
            <div className='flex-shrink-0 border-b px-2.5 py-1.5 text-[14px] font-semibold'>
              {t('branch.selected_device')}
              <span className='text-primary ml-1'>({selected.length})</span>
            </div>
            <CustomScrollbar className='flex-1 overflow-y-auto'>
              <div className='flex flex-col'>
                {selected.map((item, index) => (
                  <div
                    key={index}
                    className='dark:hover:bg-input flex h-[50px] w-full items-center justify-between border-b px-2.5 py-1 transition hover:bg-gray-50'
                  >
                    <div className='flex flex-col'>
                      <span className='text-[12px] font-semibold'>
                        {item.name}
                      </span>
                      <span className='text-muted-foreground text-[10px] font-extralight'>
                        {item.code}
                      </span>
                    </div>
                    <div
                      className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        item.online ? 'bg-green-500' : 'bg-red-500'
                      )}
                    />
                  </div>
                ))}
              </div>
            </CustomScrollbar>
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button
            variant='outline'
            className='h-[30px] w-[64px] rounded-[4px]'
            onClick={() => onOpenChange(false)}
          >
            {t('branch.cancel')}
          </Button>
          <Button
            className='bg-primary h-[30px] w-[84px] rounded-[4px] text-white'
            onClick={handleAddParent}
            disabled={!selected.length}
          >
            {t('branch.add')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
