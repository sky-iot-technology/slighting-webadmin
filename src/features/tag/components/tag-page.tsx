'use client';

import { SelectedRegion } from '@/ui/components/tree-group';
import { useCallback, useMemo, useRef, useState } from 'react';
import { GetCalendarsParamsDto } from '@/core/domains/calendars';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { SelectedTag, TagSidebar } from './tag-sidebar';
import Image from 'next/image';
import { TagContent } from './tag-content';
import { Device, GetDevicesParamsDto } from '@/core/domains/devices';
import { Table } from '@tanstack/react-table';
import { DataTableCustomToolbar } from '@/ui/components/ui/table/data-table-toolbar';
import { useCan } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

export default function TagPage() {
  const { t } = useTranslation();

  const [treeOpen, setTreeOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTag, setSelectedTag] = useState<SelectedTag>(null);
  const [deviceTable, setDeviceTable] = useState<Table<Device> | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const dir = searchParams.get('dir') ?? 'desc';
  const order = searchParams.get('order') ?? 'updated_at';
  const status = searchParams.get('status') ?? undefined;
  const type = searchParams.get('type') ?? undefined;
  const metadata = searchParams.get('metadata') ?? undefined;

  const currentPage = page ? parseInt(page.toString()) : 1;
  const limit = pageLimit ? parseInt(pageLimit.toString()) : 10;
  const filtersExcludePagination = {
    ...(search && { name: search }),
    ...(status && { status: status as any }),
    ...(type && { type }),
    ...(metadata && { metadata })
  };

  const filters = {
    dir: dir === 'asc' ? 'asc' : ('desc' as const),
    offset: (currentPage - 1) * limit,
    limit,
    order,
    ...filtersExcludePagination
  } as const;

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>{t('navbar.favorite_groups')}</span>
      </div>
    ),
    [t]
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const handleTagChange = useCallback(
    (tag: SelectedTag) => {
      const params = new URLSearchParams(searchParams.toString());

      const isSame = tag && selectedTag && tag.id === selectedTag.id;

      if (!tag || isSame) {
        setSelectedTag(null);
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
        return;
      }

      setSelectedTag(tag);
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, selectedTag]
  );

  const handleToggleSidebar = useCallback(() => {
    setTreeOpen((prev) => !prev);
  }, []);

  const canDelete = useCan('device', 'update');
  return (
    <div className='h-[calc(100dvh-52px)] w-full px-2.5 pt-[13px] pb-3'>
      <div className='h-full w-full rounded-[4px]'>
        <div className='flex h-full w-full'>
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              'overflow-hidden rounded-[1px_1px_4px_4px]',
              'fixed inset-y-0 left-0 z-50 w-64 -translate-x-full md:static md:z-auto md:translate-x-0',
              'md:w-64 md:overflow-visible',
              treeOpen && 'translate-x-0 md:w-64',
              !treeOpen && 'md:w-0'
            )}
          >
            <div className={treeOpen ? 'block h-full' : 'hidden'}>
              <TagSidebar onTagChange={handleTagChange} />
            </div>
          </div>

          {treeOpen && (
            <div
              className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden'
              onClick={() => setTreeOpen(false)}
            />
          )}

          <div className='flex w-full flex-col'>
            <div className='bg-card py-3'>
              <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2'>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={handleToggleSidebar}
                    className='dark:hover:bg-input flex h-5 w-5 cursor-pointer items-center justify-center rounded p-1 hover:bg-gray-100'
                  >
                    <Image
                      src={
                        treeOpen
                          ? '/assets/icons/chevronLeft.svg'
                          : '/assets/icons/chevronRight.svg'
                      }
                      alt='toggle'
                      width={8}
                      height={8}
                      className='dark:brightness-0 dark:invert'
                    />
                  </button>
                  <span className='text-[20px] font-bold'>
                    {t('tag.group_list')}:
                    {selectedTag && (
                      <span className='text-primary-text ml-2'>
                        {selectedTag.name}
                      </span>
                    )}
                  </span>
                </div>

                {selectedTag && deviceTable && (
                  <div className='flex w-full flex-wrap items-start gap-2 sm:w-auto sm:justify-end'>
                    <DataTableCustomToolbar
                      table={deviceTable}
                      className='w-full sm:w-auto'
                      excel={false}
                      filter={true}
                      // onDeleteAll={
                      //   canDelete ? () => console.log('asdasd') : undefined
                      // }
                    />
                  </div>
                )}
              </div>
            </div>

            <div
              className='flex w-full flex-1 flex-col overflow-hidden border-l-1'
              ref={containerRef}
            >
              <TagContent
                filters={filters}
                selectedTag={selectedTag}
                onTableReady={setDeviceTable}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
