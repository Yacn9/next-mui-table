'use client';

import { Table } from '@/components';
import { IGeneric, ISets } from '@/types';
import axios from 'axios';
import { format } from 'date-fns';
import { useQueries } from 'react-query';

async function fetchData<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await axios.get(endpoint);
    console.log(response);
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
    }))
  );
  const columns = [
    { header: 'Set Name', accessorKey: 'name' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Address', accessorKey: 'address' },
    {
      header: 'Next Availability',
      accessorKey: 'created_at',
      useServer: true,
      cell: (info: any) =>
        format(new Date(info.getValue() as string), 'EEE, dd/MM - HH:mm'),
    },
  ];

  return (
    <main>
      {sets.isLoading ? (
        <>loading</>
      ) : (
        <Table
          data={sets.data as ISets[]}
          columns={columns}
          filterable={[]}
          searchable={[]}
        />
      )}
    </main>
  );
}
