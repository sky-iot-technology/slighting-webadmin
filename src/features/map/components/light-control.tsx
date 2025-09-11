'use client';
import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';
import { Card } from '@/ui/components/ui/card';
import { Slider } from '@/ui/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/components/ui/table';
import Image from 'next/image';
import { useState } from 'react';

type Line = {
  id: string;
  name: string;
  value: number;
  status: 'active' | 'inactive';
};
type RowGroup = {
  lines: Line[];
};

const group: RowGroup = {
  lines: [
    { id: 'l1', name: 'Line 1', value: 65, status: 'active' },
    { id: 'l2', name: 'Line 2', value: 30, status: 'inactive' },
    { id: 'l3', name: 'Line 3', value: 80, status: 'active' }
  ]
};

export default function LightControl() {
  const [sliderValue, setSliderValue] = useState([50]);
  return (
    <Card className='w-full gap-1 overflow-hidden rounded-md p-0 shadow-none'>
      <Table className='hover:!bg-transparent'>
        <TableHeader className='[&_*]:text-background bg-map-lightControl-header [&_*]:text-xs [&_*]:leading-5 [&_*]:font-semibold [&_th]:h-5'>
          <TableRow className='hover:!bg-map-lightControl-header h-5'>
            <TableHead className='pr-[4px] pl-[12px]'>Trạng Thái</TableHead>
            <TableHead>Điều khiển line</TableHead>
            <TableHead className='text-end'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='[&>*]:border-0'>
          {group.lines.map((line, idx) => (
            <TableRow
              key={line.id}
              className='text-[9px] leading-5 hover:!bg-transparent'
            >
              <TableCell className='flex items-center justify-center p-1'>
                {line.status === 'active' ? (
                  <Badge
                    variant={'default'}
                    className='bg-active-badge text-success-badge-text h-[18px] w-[62px] text-[9px]'
                  >
                    Hoạt động
                  </Badge>
                ) : (
                  <Badge
                    variant={'default'}
                    className='bg-inactive-badge text-muted-foreground h-[18px] w-[34px] text-[9px]'
                  >
                    Tắt
                  </Badge>
                )}
              </TableCell>

              <TableCell className='p-1 align-top'>
                <div className='flex items-start gap-1'>
                  <Image
                    src={
                      line.status === 'active'
                        ? '/assets/icons/lightOn.svg'
                        : '/assets/icons/lightOff.svg'
                    }
                    alt={line.status === 'active' ? 'lightOn' : 'lightOff'}
                    width={16}
                    height={16}
                  />

                  <span className='self-center leading-none'>{line.name}</span>
                  <Slider
                    // value={[line.value]}
                    max={100}
                    step={1}
                    disabled={line.status === 'inactive'}
                    className={`[&_[data-slot=slider-thumb]]:border-primary ml-2 w-[75px] self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-2 [&_[data-slot=slider-thumb]]:!w-2 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px] ${
                      line.status === 'active'
                        ? `[&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active`
                        : `[&_[data-slot=slider-track]]:bg-inactive-badge [&_[data-slot=slider-range]]:bg-map-range-slider-inactive`
                    } `}
                  />
                  <span className='self-center leading-none'>
                    {line.value}%
                  </span>
                </div>
              </TableCell>

              {idx === 0 && (
                <TableCell
                  rowSpan={group.lines.length}
                  className='pt-1 pr-[3px] align-top'
                >
                  <div className='flex flex-col items-end gap-1'>
                    <Button
                      size='sm'
                      className='bg-map-control-button-success h-4 w-[58px] rounded-sm text-[9px]'
                    >
                      Bật tất cả
                    </Button>
                    <Button
                      size='sm'
                      className='bg-map-control-button-destructive h-4 w-[58px] rounded-sm text-[9px]'
                    >
                      Tắt tất cả
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className='mb-2 ml-2 text-[10px]'>1/1 line đang bật</p>
    </Card>
  );
}
