'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/ui/components/ui/tabs';
import { Table } from '@tanstack/react-table';
import {
  DataTableCustomToolbar,
  DataTableToolbar
} from '@/ui/components/ui/table/data-table-toolbar';
import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { unitColumns } from './unit-tables/columns';
import { UnitTable } from './unit-tables';
import { departments, units } from '@/core/domains/organizations/fake';
import { Department, Unit } from '@/core/domains/organizations/type';
import { DepartmentTable } from './department-tables';
import { departmentColumns } from './department-tables/columns';
import UnitDialog from './modal/unit-dialog';
import DepartmentDialog from './modal/department-dialog';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState<string>('unit');
  const [open, setOpen] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [unitTable, setUnitTable] = useState<Table<Unit> | null>(null);
  const [departmentTable, setDepartmentTable] =
    useState<Table<Department> | null>(null);

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>Quản lý tổ chức</span>
      </div>
    ),
    []
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const unitTableMemo = useMemo(() => {
    return (
      <UnitTable
        data={units}
        totalItems={units.length}
        columns={unitColumns()}
        onTableReady={setUnitTable}
      />
    );
  }, []);

  const departmentTableMemo = useMemo(() => {
    return (
      <DepartmentTable
        data={departments}
        totalItems={departments.length}
        columns={departmentColumns(units)}
        onTableReady={setDepartmentTable}
      />
    );
  }, []);

  return (
    <div className='h-full w-full p-3'>
      <div className={`flex h-full w-full flex-1 flex-col bg-white pt-1`}>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0'>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full flex-shrink-0 !bg-transparent sm:w-auto'
          >
            <TabsList className='flex !bg-transparent text-[12px]'>
              <TabsTrigger
                value='unit'
                className='group data-[state=active]:bg-primary !h-[38px] !w-[106px] cursor-pointer rounded-[4px] font-bold data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-white'
              >
                Đơn vị
              </TabsTrigger>
              <TabsTrigger
                value='department'
                className='group data-[state=active]:bg-primary !h-[38px] !w-[106px] cursor-pointer rounded-[4px] font-bold data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-white'
              >
                Bộ phận
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === 'unit' && unitTable && (
            <DataTableCustomToolbar
              table={unitTable}
              className='w-auto flex-1 py-3'
              actions={
                <Button
                  variant='default'
                  size='sm'
                  className='bg-primary hover:bg-primary/90 flex h-7.5 items-center !rounded-[4px] !px-2 text-white'
                  onClick={() => setOpen(true)}
                >
                  <IconPlus className='h-4 w-4' />
                  <span className='text-xs'>Thêm</span>
                </Button>
              }
              excel={false}
              onDeleteAll={() => alert('Fake delete triggered')}
            />
          )}
          {activeTab === 'department' && departmentTable && (
            <DataTableCustomToolbar
              table={departmentTable}
              className='w-auto flex-1'
              actions={
                <Button
                  variant='default'
                  size='sm'
                  className='bg-primary hover:bg-primary/90 flex h-7.5 items-center !rounded-[4px] !px-2 text-white'
                  onClick={() => setOpenDepartment(true)}
                >
                  <IconPlus className='h-4 w-4' />
                  <span className='text-xs'>Thêm</span>
                </Button>
              }
              excel={false}
              onDeleteAll={() => alert('Fake delete triggered')}
            />
          )}
        </div>

        {activeTab === 'unit' ? unitTableMemo : departmentTableMemo}
        <UnitDialog
          pageTitle='Thêm đơn vị'
          open={open}
          onOpenChange={setOpen}
        />
        <DepartmentDialog
          pageTitle='Thêm bộ phận'
          open={openDepartment}
          onOpenChange={setOpenDepartment}
        />
      </div>
    </div>
  );
}
