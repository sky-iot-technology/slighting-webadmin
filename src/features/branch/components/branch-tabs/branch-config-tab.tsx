import { Button } from '@/ui/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/components/ui/table';
import React from 'react';
import { cn } from '../../../../lib/utils';
import Image from 'next/image';
import CustomScrollbar from '@/ui/components/custom-scrollbar';

const calibrationGroups = [
  {
    name: 'Điện áp',
    children: ['Pha A', 'Pha B', 'Pha C'],
    color: 'bg-orange-1',
    image: '/assets/icons/voltage.svg'
  },
  {
    name: 'Dòng điện',
    children: ['Pha A', 'Pha B', 'Pha C'],
    color: 'bg-blue-1',
    image: '/assets/icons/current.svg'
  },
  {
    name: 'Công suất',
    children: ['Phản kháng', 'Tiêu thụ', 'Biểu kiến'],
    color: 'bg-green-1',
    image: '/assets/icons/power.svg'
  },
  {
    name: 'Pha',
    children: ['Pha A', 'Pha B', 'Pha C'],
    color: 'bg-purple-1',
    image: '/assets/icons/phaseAngle.svg'
  },
  {
    name: 'Hệ số biến dòng',
    children: ['CT1', 'CT2'],
    color: 'bg-yellow-1',
    image: '/assets/icons/transformerRatio.svg'
  }
];

export function BranchConfigTab() {
  return (
    <div className='flex h-full flex-col'>
      <CustomScrollbar className='overflow-auto'>
        <Table className='min-w-[600px] border'>
          <TableHeader>
            <TableRow className='bg-primary hover:bg-primary'>
              <TableHead className='w-[250px] text-white'>Thông số</TableHead>
              <TableHead className='w-[315px] text-white'>Hiệu chỉnh</TableHead>
              <TableHead className='w-[315px] text-white'>Độ lệch</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {calibrationGroups.map((group) => (
              <React.Fragment key={group.name}>
                {/* Header dòng riêng cho nhóm */}
                <TableRow key={group.name} className='h-[30px]'>
                  <TableCell colSpan={3} className={cn(group.color, '!p-0')}>
                    <div
                      className={cn(
                        'flex h-full w-full items-center gap-2 px-2 py-1 text-xs font-bold'
                      )}
                    >
                      <Image
                        src={group.image}
                        alt={group.name}
                        width={12}
                        height={12}
                        className='h-3.5 w-3.5'
                      />
                      {group.name}
                    </div>
                  </TableCell>
                </TableRow>

                {/* Các dòng con */}
                {group.children.map((child) => (
                  <TableRow key={`${group.name}-${child}`} className='h-[30px]'>
                    <TableCell className='border-r text-xs'>{child}</TableCell>
                    <TableCell className='border-r text-xs'>
                      <div>0</div>
                    </TableCell>
                    <TableCell className='text-xs'>
                      <div>0</div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CustomScrollbar>
      <div className='mt-5 flex justify-end gap-3'>
        <Button variant='outline' className='h-[30px] w-[64px] !rounded-[4px]'>
          Reset
        </Button>
        <Button className='bg-primary h-[30px] w-[84px] !rounded-[4px] text-white'>
          Lưu
        </Button>
      </div>
    </div>
  );
}
