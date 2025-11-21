import { GetDevicesParamsDto, useGetDevices } from '@/core/domains/devices';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { Table } from '@tanstack/react-table';
import { memo } from 'react';
import { TagTable } from './tag-tables';
import { tagColumns } from './tag-tables/columns';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { SelectedTag } from './tag-sidebar';

interface TagContentProps {
  filters: GetDevicesParamsDto;
  selectedTag: SelectedTag | null;
  onTableReady?: (table: Table<any>) => void;
}

export const TagContent = memo(function TagContent({
  filters,
  selectedTag,
  onTableReady
}: TagContentProps) {
  const { data, isLoading, error } = useGetDevices(
    {
      ...filters,
      tag: selectedTag?.alias
    },
    { enabled: !!selectedTag }
  );

  const { catalogues } = useCatalogueStore();
  const { treeData } = useRegionTreeStore();

  if (isLoading) {
    return (
      <div className='space-y-4 p-4'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-96' />
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-16 w-full' />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <h3 className='text-destructive text-lg font-semibold'>
            Error loading calendars
          </h3>
          <p className='text-muted-foreground text-sm'>
            {error?.message || 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {selectedTag && data && (
        <TagTable
          data={data?.devices}
          totalItems={data?.total}
          columns={tagColumns(catalogues, treeData, selectedTag)}
          onTableReady={onTableReady}
        />
      )}
    </>
  );
});
