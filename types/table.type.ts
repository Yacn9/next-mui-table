import { type ColumnDef } from '@tanstack/react-table';

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
}

export type { ITableProps };
