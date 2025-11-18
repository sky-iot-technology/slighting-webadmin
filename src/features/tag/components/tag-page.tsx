'use client';

import { SelectedRegion } from '@/ui/components/tree-group';
import { useCallback, useMemo, useRef, useState } from 'react';
import { GetCalendarsParamsDto } from '@/core/domains/calendars';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { SelectedTag, TagSidebar } from './tag-sidebar';
import Image from 'next/image';

export default function TagPage() {
  const [treeOpen, setTreeOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTag, setSelectedTag] = useState<SelectedTag>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>Quản lý lịch</span>
      </div>
    ),
    []
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const filters = useMemo<GetCalendarsParamsDto>(
    () => ({
      page: page ? parseInt(page.toString()) : 1,
      limit: pageLimit ? parseInt(pageLimit.toString()) : 10,
      start_range: startDate ?? undefined,
      end_range: endDate ?? undefined,
      ...(search && { name: search })
    }),
    [page, pageLimit, startDate, endDate, search]
  );

  // const handleRegionChange = useCallback(
  //   (region: SelectedRegion) => {
  //     const newUrl = new URL(pathname, window.location.origin);
  //     if (selectedRegion?.id === region?.id) {
  //       setSelectedRegion(null);
  //       newUrl.searchParams.delete('page');
  //     } else {
  //       setSelectedRegion(region);
  //       newUrl.searchParams.set('page', '1');
  //     }
  //     router.push(newUrl.toString());
  //   },
  //   [pathname, router, selectedRegion]
  // );

  const handleToggleSidebar = useCallback(() => {
    setTreeOpen((prev) => !prev);
  }, []);

  return (
    <div className='h-[calc(100dvh-52px)] w-full px-2.5 pt-[13px]'>
      <div className='bg-calender-gray h-full w-full rounded-[4px] pb-[7px]'>
        <div className='flex h-full w-full'>
          <div
            className={cn(
              'bg-white transition-all duration-300 ease-in-out',
              'overflow-hidden rounded-[1px_1px_4px_4px]',
              'fixed inset-y-0 left-0 z-50 w-64 -translate-x-full md:static md:z-auto md:translate-x-0',
              'md:w-64 md:overflow-visible',
              treeOpen && 'translate-x-0 md:w-64',
              !treeOpen && 'md:w-0'
            )}
          >
            {treeOpen && (
              <TagSidebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onTagChange={setSelectedTag}
              />
            )}
          </div>

          {treeOpen && (
            <div
              className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden'
              onClick={() => setTreeOpen(false)}
            />
          )}

          <div className='flex w-full flex-col'>
            <div className='bg-white py-[6px]'>
              <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2'>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={handleToggleSidebar}
                    className='cursor-pointer items-center justify-center rounded p-1 hover:bg-gray-100'
                  >
                    <Image
                      src={
                        treeOpen
                          ? '/assets/icons/chevronLeft.svg'
                          : '/assets/icons/chevronRight.svg'
                      }
                      alt='toggle'
                      width={5}
                      height={9}
                    />
                  </button>
                  <span className='text-[20px] font-bold'>
                    Danh sách nhóm:
                    {selectedTag && (
                      <span className='text-primary ml-1'>
                        {selectedTag.name}
                      </span>
                    )}
                  </span>
                </div>

                {/* {(() => {
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
                                  className='bg-primary hover:bg-primary/90 flex h-7.5 w-7.5 items-center rounded-[4px] !px-3 text-white'
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
                  })()} */}
              </div>
            </div>

            <div
              className='bg-gray-1 flex w-full flex-1 flex-col overflow-hidden pt-3 pl-3'
              ref={containerRef}
            >
              ssss
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
