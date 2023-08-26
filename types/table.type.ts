import { type ColumnDef } from '@tanstack/react-table';
import { IGeneric } from '.';

interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filterable?: {
    id: keyof T;
    title: string;
  }[];
  searchable?: {
    id: keyof T;
    title: string;
  }[];
  loading: boolean;
  brands: IGeneric[];
  categories: IGeneric[];
  filter: ITableFilter;
  changeFilter: (data: ITableFilter) => void;
}

interface ITableFilter {
  category: string;
  brand: string;
  sort: TSort;
  type?: 0 | 1;
}

type TSort = 'created_at' | 'name';

export type { ITableProps, TSort, ITableFilter };
