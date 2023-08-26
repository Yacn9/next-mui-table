'use client';

import { Table } from '@/components';
import { IGeneric, ISets } from '@/types';
import axios from 'axios';
import { format } from 'date-fns';
import { useQueries } from 'react-query';
import { type ColumnDef } from '@tanstack/react-table';
import styles from '@/styles/app/main.module.css';
import { Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

async function fetchData<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

const endpoints = [
  '/api/set?brand=all&category=all',
  '/api/category',
  '/api/brand',
];

export default function Home() {
  const [sets, categories, brands] = useQueries(
    endpoints.map((endpoint) => ({
      queryKey: ['data', endpoint],
      queryFn: () => fetchData<ISets | IGeneric>(endpoint),
      ssr: true,
      staleTime: Infinity,
    }))
  );
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
      {sets.isError ? (
        <>Something Went Wrong</>
      ) : (
        <>
          <Typography component="h1" variant="h1" className={styles.heading}>
            Sets
          </Typography>
          <Table
            data={sets.data as ISets[]}
            columns={columns}
            filterable={[]}
            searchable={[]}
            loading={sets.isLoading && categories.isLoading && brands.isLoading}
            brands={brands.data?.length ? (brands.data as IGeneric[]) : []}
            categories={
              categories.data?.length ? (categories.data as IGeneric[]) : []
            }
          />
        </>
      )}
    </main>
  );
}
