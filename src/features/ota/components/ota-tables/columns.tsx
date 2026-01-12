'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';
import { OtaData, OtaItem } from '@/core/domains/ota';
import { formatDateTimeString } from '@/features/maintenance/helper';

export const OtaColumns = (t: any): ColumnDef<OtaItem>[] => [
  {
    id: 'select',
    header: ({ table }) => {
      return (
        <div className='flex items-center justify-center'>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Select all'
          />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    maxSize: 50
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<OtaItem, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('ota.table.name' as any)}
      />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
    meta: {
      label: 'name',
      placeholder: t('ota.placeholder.search' as any),
      variant: 'text'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'category_type',
    accessorKey: 'category_type',
    header: ({ column }: { column: Column<OtaItem, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('ota.table.category' as any)}
      />
    ),
    meta: {
      label: 'Loại thiết bị',
      variant: 'select',
      options: []
    },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: true
  },
  {
    id: 'version',
    accessorKey: 'version',
    header: ({ column }: { column: Column<OtaItem, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('ota.table.version' as any)}
      />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('version')}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }: { column: Column<OtaItem, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('ota.table.description' as any)}
      />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('description')}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<OtaItem, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('ota.table.created_at' as any)}
      />
    ),
    cell: ({ row }) => {
      const time = formatDateTimeString(row.getValue('created_at') as string);
      return <div>{time}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<OtaItem, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('ota.table.action' as any)}
      />
    ),
    size: 57,
    cell: ({ row }) => {
      const data: OtaData = {
        id: row.original.id,
        name: row.original.name,
        info: {
          url: row.original.url,
          version: row.original.version,
          size: row.original.file_size,
          checksum: row.original.checksum,
          checksum_algorithm: row.original.checksum_algorithm
        }
      };
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          <CellAction data={data} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
