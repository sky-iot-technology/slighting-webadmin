'use client';

import { AlertModal } from '@/ui/components/modal/alert-modal';
import { Button } from '@/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/ui/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useDeleteDeviceParent } from '@/core/domains/devices';
import { Check } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/ui/components/ui/sheet';
import GoongMapMarker from '@/ui/business/map/goong-marker';
import { useAcknowledgedAlarm } from '@/core/domains/alarms';

interface CellActionProps {
  active: boolean;
  id: string;
  lat: number;
  lng: number;
  disabled?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({
  active,
  id,
  lat,
  lng,
  disabled
}) => {
  const [openMap, setOpenMap] = useState(false);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const router = useRouter();

  const deleteDeviceParent = useDeleteDeviceParent({
    onSuccess: () => {
      setOpen(false);
    }
  });
  const handleConfirmDelete = () => {
    if (!id) return;
    deleteDeviceParent.mutate(id);
  };

  const acknowledge = useAcknowledgedAlarm();
  const handleAcknowledge = () => {
    acknowledge.mutate({ id: String(id) });
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteDeviceParent.isPending}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-full items-center p-0'
            disabled={disabled}
          >
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='flex flex-col gap-2 p-2'>
          {active && (
            <DropdownMenuItem
              onClick={() => setOpenView(true)}
              className='flex w-full items-center text-xs'
            >
              <div className='flex w-4 justify-center'>
                <Image
                  src={'/assets/icons/view2.svg'}
                  alt='view2'
                  width={12}
                  height={12}
                />
              </div>
              <span>Xem giao việc</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className='flex w-full items-center text-xs'
            onSelect={() => setOpenMap(!openMap)}
          >
            <div className='flex w-4 justify-center'>
              <Image
                src={'/assets/icons/mapPin.svg'}
                alt='mapPin'
                width={12}
                height={12}
              />
            </div>
            <span>Xem vị trí xử lý</span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='flex w-full items-center gap-2 text-xs'>
              <div className='flex w-4 justify-center'>
                <Image
                  src='/assets/icons/notePen.svg'
                  alt='notePen'
                  width={12}
                  height={12}
                />
              </div>
              <span>Xử lý</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent className='min-w-[140px] space-y-1.5 p-2'>
                <DropdownMenuItem
                  onClick={handleAcknowledge}
                  className='flex cursor-pointer gap-2 text-xs'
                >
                  <div className='flex w-4 justify-center'>
                    <Image
                      src='/assets/icons/userGear.svg'
                      alt='userGear'
                      width={12}
                      height={12}
                    />
                  </div>
                  <span>Đang xử lý</span>
                </DropdownMenuItem>

                <DropdownMenuItem className='flex cursor-pointer gap-2 text-xs'>
                  <div className='flex w-4 justify-center'>
                    <Check width={12} height={12} className='text-green-600' />
                  </div>
                  <span>Hoàn thành</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem
            variant='default'
            onClick={() => setOpen(true)}
            className='flex w-full items-center text-xs'
          >
            <div className='flex w-4 justify-center'>
              <Image
                src={'/assets/icons/trash.svg'}
                alt='trash'
                width={12}
                height={12}
              />
            </div>
            <span className='text-destructive'>Xóa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={openMap} onOpenChange={setOpenMap}>
        <SheetContent side='right' className='gap-0'>
          <SheetHeader>
            <SheetTitle className='mx-auto'>Xem vị trí xử lý</SheetTitle>
          </SheetHeader>
          <div className='relative h-full w-full overflow-hidden'>
            <GoongMapMarker lat={lat} long={lng} disabled={true} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
