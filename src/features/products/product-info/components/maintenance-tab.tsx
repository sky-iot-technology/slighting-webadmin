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
import { Alarm, useGetAlarms } from '@/core/domains/alarms';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { useGetUsers, useSearchUsers } from '@/core/domains/users';
import { useGetDevices } from '@/core/domains/devices';
import {
  useGetWorkOrderById,
  useGetWorkOrders,
  WorkOrder,
  WorkOrderAction
} from '@/core/domains/workorders';
import { useRouter } from 'next/navigation';
import { useAlarmFiltersFromParams } from '@/features/maintenance/hook/alarm-filter';
import { useWorkOrderFiltersFromParams } from '@/features/maintenance/hook/work-filter';
import { MaintenanceTable } from '@/features/maintenance/components/maintenance-tables';
import { maintenanceColumns } from '@/features/maintenance/components/maintenance-tables/columns';
import { WorkorderTable } from '@/features/maintenance/components/workorder-tables';
import { workorderColumns } from '@/features/maintenance/components/workorder-tables/columns';
import MaintenanceDialog from '@/features/maintenance/components/modal/maintenance-dialog';
import WorkOrderView from '@/features/maintenance/components/WorkOrderView';
import { PermissionGuard, useCan } from '@/core/domains/permissions';

type MaintenanceTabProps = {
  deviceId: string;
};

export default function MaintenanceTab({ deviceId }: MaintenanceTabProps) {
  const canViewAlarms = useCan('maintenance.alarm', 'view');
  const canViewWorkOrders = useCan('maintenance.workorder', 'view');
  const canDeleteAlarms = useCan('maintenance.alarm', 'delete');
  const canDeleteWorkOrders = useCan('maintenance.workorder', 'delete');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<string>(
    canViewAlarms ? 'alert' : 'workorder'
  );
  const [open, setOpen] = useState(false);
  const [maintenanceTable, setMaintenanceTable] = useState<Table<Alarm> | null>(
    null
  );
  const [workoderTable, setWorkoderTable] = useState<Table<WorkOrder> | null>(
    null
  );

  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(
    null
  );
  const [isEdit, setEdit] = useState(false);
  const router = useRouter();

  const filters = useAlarmFiltersFromParams();
  const { data, isLoading, error } = useGetAlarms(
    {
      ...filters,
      client_id: deviceId
    },
    {
      enabled: !!deviceId && canViewAlarms
    }
  );

  const {
    data: users,
    isLoading: usersLoad,
    error: usersErr
  } = useSearchUsers(
    { tag: 'team:' },
    { enabled: canViewAlarms || canViewWorkOrders }
  );
  const {
    data: devices,
    isLoading: devicesLoad,
    error: devicesErr
  } = useGetDevices({}, { enabled: useCan('device', 'view') && canViewAlarms });

  const loadingAll = isLoading || usersLoad || devicesLoad;
  const errorAll = error || usersErr || devicesErr;

  const filtersWork = useWorkOrderFiltersFromParams();
  const {
    data: workorderData,
    isLoading: workorderLoading,
    error: workorderError
  } = useGetWorkOrders(
    {
      ...filtersWork,
      client_id: deviceId
    },
    {
      enabled: !!deviceId && canViewWorkOrders
    }
  );

  const maintenanceTableMemo = useMemo(() => {
    const alarms = data?.alarms ?? [];
    const totalItems = data?.total ?? 0;
    return (
      <PermissionGuard module='maintenance.alarm' action='view'>
        <MaintenanceTable
          data={alarms}
          totalItems={totalItems}
          columns={maintenanceColumns(
            users?.users || [],
            devices?.devices || [],
            {
              onViewAction: (workOrderId: string) => {
                setEdit(false);
                setSelectedWorkOrderId(workOrderId);
              }
            }
          )}
          onTableReady={setMaintenanceTable}
          onSelectionChange={(data) => setSelectedIds(data)}
          isLoading={loadingAll}
          error={errorAll}
        />
      </PermissionGuard>
    );
  }, [data, loadingAll, error]);

  const workorderTableMemo = useMemo(() => {
    const workorders = workorderData?.woker_orders ?? [];
    const totalItems = workorderData?.total ?? 0;
    const handleViewWorkOrder = (id: string) => {
      setEdit(false);
      setSelectedWorkOrderId(id);
    };
    const handleEditWorkOrder = (id: string) => {
      setEdit(true);
      setSelectedWorkOrderId(id);
    };
    return (
      <PermissionGuard module='maintenance.workorder' action='view'>
        <WorkorderTable
          data={workorders}
          totalItems={totalItems}
          columns={workorderColumns(users?.users || [], {
            onViewAction: handleViewWorkOrder,
            onEditAction: handleEditWorkOrder
          })}
          onTableReady={setWorkoderTable}
          isLoading={workorderLoading}
          error={workorderError}
        />
      </PermissionGuard>
    );
  }, [workorderData, workorderLoading, workorderError]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const { pathname } = window.location;
    const newUrl = new URL(pathname, window.location.origin);
    router.replace(newUrl.toString());
  };

  const selectedAlarm = useMemo(() => {
    if (selectedIds.length !== 1) return null;

    return data?.alarms.find((alarm) => alarm.id === selectedIds[0]) ?? null;
  }, [selectedIds, data?.alarms]);

  const { data: selectedWorkOrderData, isLoading: loadingSelectedWorkOrder } =
    useGetWorkOrders(
      {
        offset: 0,
        limit: 1,
        alarm_id: selectedAlarm?.id
      },
      {
        enabled: !!selectedAlarm?.id
      }
    );

  const selectedWorkOrder = useMemo(() => {
    return selectedWorkOrderData?.woker_orders?.[0] ?? null;
  }, [selectedWorkOrderData]);

  const canCreateWorkOrder = useMemo(() => {
    if (!selectedAlarm) return false;

    if (selectedAlarm.status !== 'active') return false;

    if (!selectedWorkOrder) return true;

    return (
      selectedWorkOrder.action === WorkOrderAction.FORWARD ||
      selectedWorkOrder.action === WorkOrderAction.CANCEL
    );
  }, [selectedAlarm, selectedWorkOrder, loadingSelectedWorkOrder]);

  const { data: workorderdata, isLoading: workorderIdLoading } =
    useGetWorkOrderById(selectedWorkOrderId ?? '', {
      enabled: !!selectedWorkOrderId
    });

  return (
    <>
      {selectedWorkOrderId && !isEdit ? (
        <WorkOrderView
          data={workorderdata}
          isLoading={workorderIdLoading}
          isView={!isEdit}
          pageTitle='Chi tiết công việc'
          onBack={() => setSelectedWorkOrderId(null)}
        />
      ) : selectedWorkOrderId && isEdit ? (
        <WorkOrderView
          data={workorderdata}
          isLoading={workorderIdLoading}
          isView={!isEdit}
          pageTitle='Cập nhật công việc'
          onBack={() => setSelectedWorkOrderId(null)}
        />
      ) : (
        <div className='h-full min-h-[500px] w-full flex-1'>
          <div className={`min-h-[500px] w-full flex-col bg-white`}>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0'>
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className='w-full flex-shrink-0 !bg-transparent sm:w-auto'
              >
                <TabsList className='flex !bg-transparent text-[12px]'>
                  <PermissionGuard module='maintenance.alarm' action='view'>
                    <TabsTrigger
                      value='alert'
                      className='group data-[state=active]:bg-primary !h-[38px] !w-[106px] cursor-pointer rounded-[8px] font-bold data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-white'
                    >
                      Cảnh báo
                    </TabsTrigger>
                  </PermissionGuard>

                  <PermissionGuard module='maintenance.workorder' action='view'>
                    <TabsTrigger
                      value='workorder'
                      className='group data-[state=active]:bg-primary !h-[38px] !w-[106px] cursor-pointer rounded-[8px] font-bold data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-white'
                    >
                      Giao việc
                    </TabsTrigger>
                  </PermissionGuard>
                </TabsList>
              </Tabs>
              <PermissionGuard module='maintenance.alarm' action='view'>
                {activeTab === 'alert' && maintenanceTable && (
                  <DataTableCustomToolbar
                    table={maintenanceTable}
                    className='w-auto flex-1 py-3'
                    actions={
                      <PermissionGuard
                        module='maintenance.workorder'
                        action='create'
                      >
                        <Button
                          variant='default'
                          size='sm'
                          className='bg-primary hover:bg-primary/90 flex h-7.5 items-center !rounded-[4px] !px-2 text-white'
                          disabled={!canCreateWorkOrder}
                          onClick={() => setOpen(true)}
                        >
                          <IconPlus className='h-4 w-4' />
                          <span className='text-xs'>Tạo công việc</span>
                        </Button>
                      </PermissionGuard>
                    }
                    excel={false}
                    onDeleteAll={
                      canDeleteAlarms
                        ? () => alert('Fake delete triggered')
                        : undefined
                    }
                  />
                )}
              </PermissionGuard>

              <PermissionGuard module='maintenance.workorder' action='view'>
                {activeTab === 'workorder' && workoderTable && (
                  <DataTableCustomToolbar
                    table={workoderTable}
                    className='w-auto flex-1 py-3'
                    excel={false}
                    onDeleteAll={
                      canDeleteWorkOrders
                        ? () => alert('Fake delete triggered')
                        : undefined
                    }
                  />
                )}
              </PermissionGuard>
            </div>

            <div className='flex min-h-[500px] w-full flex-col'>
              {activeTab === 'alert'
                ? maintenanceTableMemo
                : workorderTableMemo}
            </div>
            <MaintenanceDialog
              alarmId={selectedAlarm?.id ?? ''}
              pageTitle={
                selectedAlarm
                  ? `Tạo công việc: ${selectedAlarm.measurement}`
                  : 'Tạo công việc'
              }
              open={open}
              onOpenChange={setOpen}
            />
          </div>
        </div>
      )}
    </>
  );
}
