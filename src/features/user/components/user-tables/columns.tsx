'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@/core/domains/users/types';
import StatusCell from './statusCell';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';

export const userColumns = (): ColumnDef<User>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
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
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên' />
    ),
    cell: ({ row }) => {
      const user = row.original as User;
      return <div>{`${user.first_name} ${user.last_name}`}</div>;
    },
    meta: {
      label: 'name',
      placeholder: 'Tìm kiếm',
      variant: 'text'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'unit',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Đơn vị' />
    ),
    cell: ({ row }) => {
      return <div>-</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Bộ phận' />
    ),
    cell: ({ row }) => {
      return <div>-</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Vai trò' />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('role')}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'group',
    accessorKey: 'group',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Chi nhánh' />
    ),
    cell: ({ row }) => {
      return <div>-</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  // {
  //   id: 'status',
  //   accessorKey: 'status',
  //   header: 'Trạng thái',
  //   cell: ({ row }) => {
  //     const user = row.original;
  //     const isEnabled = user.status === 'enabled';
  //     const useUpdateStatus = useUpdateUserStatus();
  //     return (
  //       <Switch
  //         className={`data-[state=unchecked]:bg-map-range-slider-inactive data-[state=checked]:bg-map-range-slider-active ml-3`}
  //         checked={isEnabled}
  //         disabled={useUpdateStatus.isPending}
  //         onCheckedChange={(val) =>
  //           useUpdateStatus.mutate({ id: user.id, enabled: val })
  //         }
  //       />
  //     );
  //   }
  // },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => <StatusCell user={row.original} />,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thao tác' />
    ),
    size: 57,
    cell: ({ row }) => {
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          <CellAction id={String(row.original.id)} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
