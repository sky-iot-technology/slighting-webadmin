'use client';

import { useSearchParams } from 'next/navigation';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';
import { Product, useGetProducts } from '@/core/domains/products';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';

type ProductListingPage = {};

export default function ProductListingPage({}: ProductListingPage) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const categories = searchParams.get('category');

  const filters = {
    page: page ? parseInt(page.toString()) : undefined,
    limit: pageLimit ? parseInt(pageLimit.toString()) : undefined,
    ...(search && { search }),
    ...(categories && { categories: categories.split(',').filter(Boolean) })
  };

  const { data, isLoading, error } = useGetProducts(filters);

  if (isLoading) {
    return (
      <div className='space-y-4'>
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
            Error loading products
          </h3>
          <p className='text-muted-foreground text-sm'>
            {error.message || 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductTable
      data={data?.products || []}
      totalItems={data?.total_products || 0}
      columns={columns as ColumnDef<Product, any>[]}
    />
  );
}
