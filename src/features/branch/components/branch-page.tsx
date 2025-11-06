'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { BranchSidebar } from './branch-sidebar';
import { Device, useGetDevices } from '@/core/domains/devices';
import { SelectedRegion } from '@/ui/components/tree-group';
import { useGetGroup } from '@/core/domains/groups';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { Tabs, TabsList, TabsTrigger } from '@/ui/components/ui/tabs';
import { BranchDetailTab } from './branch-tabs/branch-detail-tab';
import { BranchTable } from './branch-tables';
import { branchColumns } from './branch-tables/columns';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { BranchConfigTab } from './branch-tabs/branch-config-tab';
import { Table } from '@tanstack/react-table';
import { DataTableToolbar } from '@/ui/components/ui/table/data-table-toolbar';
import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import BranchAddDevice from './modal/branch-add-device';
import GoongMap from '@/ui/business/map/goong-map';
import { useDeviceFiltersFromParams } from '../hook/device-filter';

export default function BranchPage() {
  const [treeOpen, setTreeOpen] = useState(true);
  const { treeData } = useRegionTreeStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>('detail');
  const { catalogues } = useCatalogueStore();
  const [open, setOpen] = useState(false);
  const [deviceTable, setDeviceTable] = useState<Table<Device> | null>(null);

  const filters = useDeviceFiltersFromParams();

  const handleToggleSidebar = useCallback(() => {
    setTreeOpen((prev) => !prev);
  }, []);

  const handleRegionChange = useCallback(
    (region: SelectedRegion) => {
      setSelectedRegion(region);
    },
    [selectedRegion?.id]
  );

  const [selectedDevice, setSelectedDevice] = useState<{
    device: Device | null;
    ts: number;
  }>({ device: null, ts: 0 });

  const { data, isLoading, isFetching, error } = useGetDevices(
    { group: selectedRegion?.id, ...filters },
    { enabled: !!selectedRegion }
  );

  const { data: group, isFetching: groupFetching } = useGetGroup(
    selectedRegion?.id,
    { enabled: !!selectedRegion }
  );

  const devices = useMemo(() => data?.devices ?? [], [data?.devices]);

  const devicesTableMemo = useMemo(() => {
    if (!selectedRegion) return null;
    return (
      <BranchTable
        data={devices}
        totalItems={Number(data?.total)}
        columns={branchColumns(catalogues, treeData)}
        onTableReady={setDeviceTable}
      />
    );
  }, [selectedRegion?.id, data?.total, devices, catalogues, treeData]);

  return (
    <div className='h-[calc(100dvh-52px)] w-full px-2.5 pt-[13px]'>
      <div className='h-full w-full rounded-[4px] pb-[7px]'>
        <div className='flex h-full w-full'>
          <div
            className={`rounded-[1px_1px_4px_4px] bg-white transition-all duration-300 ${treeOpen ? 'w-64' : 'w-14'}`}
          >
            <BranchSidebar
              selectedRegion={selectedRegion}
              onRegionChange={handleRegionChange}
              isSidebarOpen={treeOpen}
              onToggleSidebar={handleToggleSidebar}
            />
          </div>

          <div
            className='bg-gray-1 flex w-full flex-1 flex-col overflow-hidden pl-1.5'
            ref={containerRef}
          >
            <div className='pt-3'>
              {selectedRegion && (
                <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2'>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className='w-full flex-shrink-0 sm:w-auto'
                  >
                    <TabsList className='flex gap-2.5 !bg-none text-[14px] font-medium'>
                      <TabsTrigger
                        value='detail'
                        className='group data-[state=active]:bg-primary !h-[38px] !w-[106px] cursor-pointer rounded-[4px] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-white'
                      >
                        Chi tiết
                      </TabsTrigger>
                      <TabsTrigger
                        value='devices'
                        className='group data-[state=active]:bg-primary !h-[38px] !w-[106px] cursor-pointer rounded-[4px] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-white'
                      >
                        Thiết bị
                      </TabsTrigger>
                      <TabsTrigger
                        value='config'
                        className='group data-[state=active]:bg-primary !h-[38px] !w-[106px] cursor-pointer rounded-[4px] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-white'
                      >
                        Cấu hình
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {(() => {
                    if (activeTab === 'devices' && deviceTable) {
                      return (
                        <>
                          <div className='flex w-full items-center gap-2 sm:w-auto sm:justify-end'>
                            <DataTableToolbar
                              table={deviceTable}
                              className='w-auto'
                              actions={
                                <Button
                                  variant='default'
                                  size='sm'
                                  className='bg-primary hover:bg-primary/90 flex items-center rounded-[4px] !px-3 text-white'
                                  onClick={() => setOpen(true)}
                                >
                                  <IconPlus className='h-4 w-4' />
                                </Button>
                              }
                              excel={true}
                              onDeleteAll={() => console.log('2122121')}
                            />

                            <BranchAddDevice
                              regionId={selectedRegion.id}
                              open={open}
                              onOpenChange={setOpen}
                            />
                          </div>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>

            {activeTab === 'detail' && selectedRegion ? (
              <BranchDetailTab
                selectedRegionId={selectedRegion?.id}
                treeData={treeData}
                group={group}
                devices={devices}
                isLoading={isLoading}
                isFetching={isFetching}
                selectedDevice={selectedDevice}
              />
            ) : activeTab === 'devices' && selectedRegion ? (
              devicesTableMemo
            ) : activeTab === 'config' && selectedRegion ? (
              <div className='relative mt-3 h-full w-full min-w-0 overflow-hidden rounded-[8px] bg-white px-2.5 py-3'>
                <BranchConfigTab />
              </div>
            ) : (
              <div className='relative mt-3 h-full w-full min-w-0 overflow-hidden rounded-[8px]'>
                <GoongMap
                  selectedRegion={selectedRegion}
                  devices={devices}
                  isLoading={isLoading}
                  isFetching={isFetching}
                  selectedDevice={selectedDevice}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
