import { type ColumnDef } from '@tanstack/react-table';
import { IGeneric } from '.';

interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filterable: {
    id: keyof T;
    title: string;
  }[];
  searchable: {
    id: keyof T;
    title: string;
  }[];
  loading: boolean;
  brands: IGeneric[];
  categories: IGeneric[];
}

type TSort = 'created_at' | 'name';

export type { ITableProps, TSort };
