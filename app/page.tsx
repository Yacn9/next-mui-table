'use client';

import { Table } from '@/components';
import { IGeneric, ISets, ITableFilter, TSort } from '@/types';
import axios from 'axios';
import { format } from 'date-fns';
import { useQueries, useQuery } from 'react-query';
import { type ColumnDef } from '@tanstack/react-table';
import styles from '@/styles/app/main.module.css';
import { Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';

async function fetchData<T>(
  endpoint: string,
  params?: ITableFilter
): Promise<T[]> {
  try {
    const response = await axios.get(endpoint, { params: { ...params } });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

const endpoints = ['/api/category', '/api/brand'];

export default function Home() {
  const [filter, setFilter] = useState<ITableFilter>({
    category: 'all',
    brand: 'all',
    sort: 'created_at',
    type: 1,
  });

  const [categories, brands] = useQueries(
    endpoints.map((endpoint) => ({
      queryKey: ['data', endpoint],
      queryFn: () => fetchData<IGeneric>(endpoint),
      ssr: true,
      staleTime: Infinity,
    }))
  );

  const {
    data: sets,
    isLoading,
    isError,
    refetch,
  } = useQuery(['sets', filter], () => fetchData<ISets>('/api/set', filter), {
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<ISets>[] = [
    {
      header: 'Set Name',
      accessorKey: 'name',
      cell: (info) => (
        <Typography
          variant="body1"
          component="span"
          className={styles['name-cell']}
        >
          {info.getValue() as string}
        </Typography>
      ),
    },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Address', accessorKey: 'address' },
    {
      header: 'Next Availability',
      accessorKey: 'created_at',
      cell: (info) =>
        format(new Date(info.getValue() as string), 'EEE, dd/MM - HH:mm'),
    },
    {
      header: ' ',
      accessorKey: 'id',
      cell: () => (
        <Button className={styles.button}>
          <ArrowForwardIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  return (
    <main className={styles.main}>
      {isError ? (
        <>Something Went Wrong</>
      ) : (
        <>
          <Typography component="h1" variant="h1" className={styles.heading}>
            Sets
          </Typography>
          <Table
            data={sets?.length ? sets : []}
            columns={columns}
            loading={isLoading && categories.isLoading && brands.isLoading}
            brands={brands.data?.length ? brands.data : []}
            categories={categories.data?.length ? categories.data : []}
            filter={filter}
            changeFilter={setFilter}
          />
        </>
      )}
    </main>
  );
}
