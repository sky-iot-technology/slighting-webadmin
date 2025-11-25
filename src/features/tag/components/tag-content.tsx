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

  return (
    <>
      {selectedTag && data && (
        <TagTable
          data={data?.devices}
          totalItems={data?.total}
          columns={tagColumns(catalogues, treeData, selectedTag)}
          onTableReady={onTableReady}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
});
