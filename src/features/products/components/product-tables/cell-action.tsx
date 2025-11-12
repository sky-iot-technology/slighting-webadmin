'use client';
import { Device } from '@/core/domains/devices';
import { AlertModal } from '@/ui/components/modal/alert-modal';
import { Button } from '@/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/ui/components/ui/dropdown-menu';
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye
} from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: Device;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center justify-center'>
            <Button variant='ghost' className='flex h-8 w-8'>
              <span className='sr-only'>Open menu</span>
              <IconDotsVertical className='h-4 w-4' />
            </Button>
          </div>
        </DropdownMenuTrigger>
        {/* <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/product/info/${data.id}`)}
          >
            <IconEye className='mr-2 h-4 w-4 text-primary' /> Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/product/${data.id}`)}
          >
            <IconEdit className='mr-2 h-4 w-4' /> Sửa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Xoá
          </DropdownMenuItem>
        </DropdownMenuContent> */}
        <DropdownMenuContent
          align='end'
          className='flex w-31.5 flex-col gap-2 p-2'
        >
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/product/info/${data.id}`)}
            className='flex w-full items-center text-xs'
          >
            <div className='mx-1 flex w-4 justify-center'>
              <Image
                src={'/assets/icons/view.svg'}
                alt='view'
                width={12}
                height={12}
              />
            </div>
            <span>Chi tiết</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/product/info/${data.id}`)}
            className='flex w-full items-center text-xs'
          >
            <div className='mx-1 flex w-4 justify-center'>
              <Image
                src={'/assets/icons/edit.svg'}
                alt='edit'
                width={12}
                height={12}
              />
            </div>
            <span>Sửa</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            variant='default'
            onClick={() => setOpen(true)}
            className='flex w-full items-center text-xs'
          >
            <div className='mx-1 flex w-4 justify-center'>
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
    </>
  );
};
