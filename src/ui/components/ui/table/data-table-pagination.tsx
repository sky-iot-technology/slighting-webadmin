import type { Table } from '@tanstack/react-table';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  totalRows: number;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
  className,
  totalRows,
  ...props
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);
  const totalPages = table.getPageCount();
  const currentPage = pageIndex + 1;

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 4;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const pagesAtEdges = maxVisible - 1;
      const startThreshold = pagesAtEdges;
      const endThreshold = totalPages - pagesAtEdges + 1;

      if (currentPage <= startThreshold) {
        for (let i = 1; i <= pagesAtEdges; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= endThreshold) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - pagesAtEdges + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const pagesAroundCurrent = Math.max(1, maxVisible - 2);

        pages.push(1);
        pages.push('ellipsis');

        let startPage: number;
        let endPage: number;

        if (pagesAroundCurrent === 1) {
          startPage = currentPage;
          endPage = currentPage;
        } else {
          const pagesBefore = Math.floor((pagesAroundCurrent - 1) / 2);
          const pagesAfter = pagesAroundCurrent - 1 - pagesBefore;

          startPage = currentPage - pagesBefore;
          endPage = currentPage + pagesAfter;
        }

        const minPage = 2;
        const maxPage = totalPages - 1;

        if (startPage < minPage) {
          const adjustment = minPage - startPage;
          startPage = minPage;
          endPage = Math.min(maxPage, endPage + adjustment);
        } else if (endPage > maxPage) {
          const adjustment = endPage - maxPage;
          endPage = maxPage;
          startPage = Math.max(minPage, startPage - adjustment);
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        'flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8',
        className
      )}
      {...props}
    >
      <div className='text-muted-foreground flex-1 text-sm whitespace-nowrap'>
        {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </>
        ) : (
          <>{table.getFilteredRowModel().rows.length} row(s) total.</>
        )} */}

        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </>
        )}
      </div>
      <div className='flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
        {totalRows > pageSize && (
          <div className='flex items-center justify-center text-sm font-medium'>
            {start} - {end} trong {totalRows}
          </div>
        )}

        <div className='flex items-center space-x-2'>
          <Button
            aria-label='Go to first page'
            variant='outline'
            size='icon'
            className='hidden size-8 cursor-pointer lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            aria-label='Go to previous page'
            variant='outline'
            size='icon'
            className='size-8 cursor-pointer'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          {/* Page number buttons */}
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <Button
                  key={`ellipsis-${index}`}
                  variant='ghost'
                  size='icon'
                  className='size-8 cursor-default'
                  disabled
                >
                  <span className='text-muted-foreground'>...</span>
                </Button>
              );
            }
            const isActive = page === currentPage;
            return (
              <Button
                key={page}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? 'page' : undefined}
                variant={isActive ? 'default' : 'outline'}
                size='icon'
                className={cn(
                  'size-8',
                  isActive && 'bg-primary text-primary-foreground',
                  'cursor-pointer'
                )}
                onClick={() => table.setPageIndex(page - 1)}
              >
                {page}
              </Button>
            );
          })}
          <Button
            aria-label='Go to next page'
            variant='outline'
            size='icon'
            className='size-8 cursor-pointer'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            aria-label='Go to last page'
            variant='outline'
            size='icon'
            className='hidden size-8 cursor-pointer lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
        <div className='flex items-center space-x-2'>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 [&[data-size]]:h-8'>
              <SelectValue>
                {table.getState().pagination.pageSize} hàng
              </SelectValue>
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
