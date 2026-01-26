'use client';

import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { useMemo } from 'react';
import { OtaTable } from './ota-tables';
import { OtaItem, useGetListOta } from '@/core/domains/ota';
import { OtaColumns } from './ota-tables/columns';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { ColumnDef } from '@tanstack/react-table';
import { useOtaFiltersFromParams } from '../hook/ota-filter';
import { useCan } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

export default function OtaPage() {
  const { t } = useTranslation();

  const filter = useOtaFiltersFromParams();
  const { data, isLoading, error } = useGetListOta({ ...filter });

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>
          {t('navbar.firmware_management')}
        </span>
      </div>
    ),
    [t]
  );
  useCustomBreadcrumbContent(breadcrumbContent);

  const { catalogues } = useCatalogueStore();
  const typeOptions = useMemo(() => {
    return catalogues.map((catalogue) => ({
      label: catalogue.name,
      value: catalogue.type
    }));
  }, [catalogues]);

  const columns = useMemo<ColumnDef<OtaItem>[]>(() => {
    return OtaColumns(t).map((col) => {
      if (col.id !== 'category_type') return col;

      return {
        ...col,
        meta: {
          ...col.meta,
          label: t('ota.table.category'),
          options: typeOptions
        },
        cell: ({ cell }) => {
          const type = cell.getValue<OtaItem['category_type']>();
          const option = typeOptions.find((o) => o.value === type);
          return <div>{option?.label ?? type}</div>;
        }
      };
    });
  }, [typeOptions, t]);

  const isFilterReady = typeOptions.length > 0;

  return (
    <div className='dark:bg-background-all h-full w-full p-3'>
      <div className='bg-card flex h-full w-full flex-1'>
        <OtaTable
          data={(data?.data as OtaItem[]) || []}
          totalItems={data?.total || 0}
          columns={columns as ColumnDef<OtaItem, any>[]}
          isLoading={isLoading}
          error={error}
          isFilterReady={isFilterReady}
        />
      </div>
    </div>
  );
}
