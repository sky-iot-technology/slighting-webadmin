import { GetDevicesParamsDto, useGetDevices } from '@/core/domains/devices';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { Table } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { TagTable } from './tag-tables';
import { tagColumns } from './tag-tables/columns';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { SelectedTag } from './tag-sidebar';
import { useCan } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

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
  const { t, language } = useTranslation();
  const canViewDevice = useCan('device', 'view');

  const { data, isLoading, error } = useGetDevices(
    {
      ...filters,
      tag: selectedTag?.alias
    },
    { enabled: !!selectedTag && canViewDevice }
  );

  const { catalogues } = useCatalogueStore();
  const { treeData } = useRegionTreeStore();

  const columns = useMemo(() => {
    if (!selectedTag) return [];
    return tagColumns(catalogues, treeData, selectedTag, t);
  }, [catalogues, treeData, selectedTag, t, language]);

  return (
    <>
      {selectedTag && data && (
        <TagTable
          key={language}
          data={data?.devices ?? []}
          totalItems={data?.total ?? 0}
          columns={columns}
          onTableReady={onTableReady}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
});
