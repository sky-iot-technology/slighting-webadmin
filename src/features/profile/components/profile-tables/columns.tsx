'use client';

import { Card, CardContent } from '@/ui/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

export const UserColumns = (): ColumnDef<any>[] => [
  {
    // id: 'title',
    accessorKey: 'title',
    cell: ({ row }) => {
      const title = row.getValue('title') as string;

      return (
        <Card className='relative overflow-hidden rounded-md border !py-0 shadow-[0_2px_2px_rgba(0,0,0,0.25)]'>
          <CardContent className='flex items-center gap-3 !rounded-[8px] !px-3 !pt-2 !pb-1 text-sm font-medium'>
            <Image
              src='/assets/icons/info.svg'
              alt='Label Icon'
              width={16}
              height={16}
            />
            <div className='flex flex-col text-xs'>
              <p className='font-medium'>{title}</p>
              <p className='font-light'>dsadsadsa</p>
              <p className='font-extralight'>dsadas</p>
            </div>
          </CardContent>
        </Card>
      );
    },
    // meta: {
    //   label: 'name',
    //   placeholder: 'Tìm kiếm',
    //   variant: 'text'
    // },
    enableColumnFilter: true
  }
];
