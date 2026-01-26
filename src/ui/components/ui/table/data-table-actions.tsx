'use client';

import { Button } from '@/ui/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/ui/components/ui/popover';
import { MoreHorizontal, Upload, Download, Trash2 } from 'lucide-react';
import ExcelJS from 'exceljs';
import { useRef, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import Image from 'next/image';
import { AlertModal } from '../../modal/alert-modal';
import { toast } from 'sonner';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface DataTableActionsPopoverProps<TData> {
  table: Table<TData>;
  excel?: boolean;
  onImportExcel?: (rows: any[]) => void;
  onDeleteAll?: (selectedRows: TData[]) => Promise<void> | void;
}

export function DataTableActionsPopover<TData>({
  table,
  excel,
  onImportExcel,
  onDeleteAll
}: DataTableActionsPopoverProps<TData>) {
  const { t } = useTranslation();

  const hasActions = Boolean(onDeleteAll || excel);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

  /**
   * 📤 Export Excel
   */
  const handleExport = async () => {
    const rows = table.getFilteredRowModel().rows.map((r) => r.original);
    const visibleColumns = table.getVisibleFlatColumns().map((col) => ({
      id: col.id,
      header: col.columnDef.header as string
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Devices');

    // Header row
    worksheet.addRow(visibleColumns.map((c) => c.header));

    // Data rows
    rows.forEach((row) =>
      worksheet.addRow(visibleColumns.map((c) => (row as any)[c.id]))
    );

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E9ECEF' }
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    setOpen(false);
  };

  /**
   * 📥 Import Excel
   */
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];
    const headers: string[] = [];
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = cell.value?.toString() ?? '';
    });

    const rows: Record<string, any>[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const record: Record<string, any> = {};
      row.eachCell((cell, colNumber) => {
        record[headers[colNumber]] = cell.value;
      });
      rows.push(record);
    });

    onImportExcel?.(rows);
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!onDeleteAll) return;
    if (selectedRows.length === 0) {
      toast.warning(t('general.delete_warning'));
      return;
    }
    await onDeleteAll(selectedRows);
    setAlertOpen(false);
    setOpen(false);
  };

  if (!hasActions) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className='rounded-[4px]'>
        <Button
          variant='outline'
          size='sm'
          aria-label='Actions menu'
          className='!bg-gray-2 ml-auto hidden h-7.5 w-7.5 p-0 lg:flex'
        >
          <Image
            src={'/assets/icons/options.svg'}
            alt='filter'
            width={16}
            height={16}
            className='dark:brightness-0 dark:invert'
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align='end'
        className='dark:bg-action inline-flex !w-auto min-w-[10rem] flex-col space-y-1 p-2'
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='.xlsx'
          className='hidden'
          onChange={handleImport}
        />
        {onDeleteAll && (
          <>
            <Button
              variant='ghost'
              size='sm'
              className='text-destructive hover:!text-destructive w-full justify-start text-xs'
              onClick={() => {
                setAlertOpen(true);
              }}
            >
              <Trash2 className='mr-0.5 h-4 w-4' />
              {t('general.delete_selected')}
              {table.getSelectedRowModel().rows.length > 0 && (
                <span className='text-destructive'>
                  ({table.getSelectedRowModel().rows.length})
                </span>
              )}
            </Button>

            <AlertModal
              isOpen={alertOpen}
              onClose={() => setAlertOpen(false)}
              onConfirm={handleDelete}
              loading={false}
            />
          </>
        )}

        {excel && (
          <>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-start text-xs'
              onClick={() => fileInputRef.current?.click()}
            >
              <Image
                src={'/assets/icons/import.svg'}
                alt='filter'
                width={16}
                height={16}
                className='pb-1'
              />
              {t('general.import_excel')}
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-start text-xs'
              onClick={handleExport}
            >
              <Image
                src={'/assets/icons/export.svg'}
                alt='filter'
                width={16}
                height={16}
                className='pb-1'
              />
              {t('general.export_excel')}
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
