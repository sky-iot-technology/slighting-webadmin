'use client';

import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/ui/components/ui/tabs';
import { Table } from '@tanstack/react-table';
import {
  DataTableCustomToolbar,
  DataTableToolbar
} from '@/ui/components/ui/table/data-table-toolbar';
import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { Maintenance, WorkOrder } from '@/core/domains/maintenances/types';
import { MaintenanceTable } from './maintenance-tables';
import {
  fakeMaintenances,
  fakeWorkOrders
} from '@/core/domains/maintenances/fake';
import { maintenanceColumns } from './maintenance-tables/columns';
import MaintenanceDialog from './modal/maintenance-dialog';
import { WorkorderTable } from './workorder-tables';
import { workorderColumns } from './workorder-tables/columns';
import { Alarm, useGetAlarms } from '@/core/domains/alarms';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { useGetUsers } from '@/core/domains/users';
import { useGetDevices } from '@/core/domains/devices';

export default function MaintenancePage() {
  const [selectedData, setSelectedData] = useState<
    { id: string; name: string; status: boolean }[]
  >([]);

  const [activeTab, setActiveTab] = useState<string>('alert');
  const [open, setOpen] = useState(false);
  const [maintenanceTable, setMaintenanceTable] = useState<Table<Alarm> | null>(
    null
  );
  const [workoderTable, setWorkoderTable] = useState<Table<WorkOrder> | null>(
    null
  );

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>Quản lý bảo trì</span>
      </div>
    ),
    []
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const { data, isLoading, error } = useGetAlarms();
  const { data: users, isLoading: usersLoad, error: usersErr } = useGetUsers();
  const {
    data: devices,
    isLoading: devicesLoad,
    error: devicesErr
  } = useGetDevices();

  const loadingAll = isLoading || usersLoad || devicesLoad;
  const errorAll = error || usersErr || devicesErr;

  const maintenanceTableMemo = useMemo(() => {
    const alarms = data?.alarms ?? [];
    const totalItems = data?.total ?? 0;
    return (
      <MaintenanceTable
        data={alarms}
        totalItems={totalItems}
        columns={maintenanceColumns(users?.users || [], devices?.devices || [])}
        onTableReady={setMaintenanceTable}
        onSelectionChange={(data) => setSelectedData(data)}
        isLoading={loadingAll}
        error={errorAll}
      />
    );
  }, [data, loadingAll, error]);

  const workorderTableMemo = useMemo(() => {
    return (
      <WorkorderTable
        data={fakeWorkOrders}
        totalItems={fakeWorkOrders.length}
        columns={workorderColumns()}
        onTableReady={setWorkoderTable}
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
                value='alert'
                className='group data-[state=active]:bg-primary !h-[38px] !w-[106px] cursor-pointer rounded-[8px] font-bold data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-white'
              >
                Cảnh báo
              </TabsTrigger>
              <TabsTrigger
                value='workorder'
                className='group data-[state=active]:bg-primary !h-[38px] !w-[106px] cursor-pointer rounded-[8px] font-bold data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-white'
              >
                Giao việc
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {activeTab === 'alert' && maintenanceTable && (
            <DataTableCustomToolbar
              table={maintenanceTable}
              className='w-auto flex-1'
              actions={
                <Button
                  variant='default'
                  size='sm'
                  className='bg-primary hover:bg-primary/90 flex h-7.5 items-center !rounded-[4px] !px-2 text-white'
                  disabled={
                    selectedData.length !== 1 ||
                    selectedData[0].status === false
                  }
                  onClick={() => setOpen(true)}
                >
                  <IconPlus className='h-4 w-4' />
                  <span className='text-xs'>Tạo công việc</span>
                </Button>
              }
              excel={false}
              onDeleteAll={() => alert('Fake delete triggered')}
            />
          )}
          {activeTab === 'workorder' && workoderTable && (
            <DataTableCustomToolbar
              table={workoderTable}
              className='w-auto flex-1'
              excel={false}
              onDeleteAll={() => alert('Fake delete triggered')}
            />
          )}
        </div>

        {activeTab === 'alert' ? maintenanceTableMemo : workorderTableMemo}
        <MaintenanceDialog
          alertId={selectedData.length === 1 ? selectedData[0].id : ''}
          pageTitle={`Tạo công việc: ${selectedData.length === 1 ? selectedData[0].name : ''}`}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    </div>
  );
}
