'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { ITableProps, TSort } from '@/types';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Select, MenuItem } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import styles from '@/styles/components/table.module.css';

export default function Tables<T>(props: ITableProps<T>) {
  const { data, columns, loading, categories, brands, filter, changeFilter } =
    props;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const TYPES = [
    { id: 1, name: 'Active' },
    { id: 0, name: 'Archived' },
  ];

  const SORT = [
    { name: 'Created At', value: 'created_at' },
    { name: 'Name', value: 'name' },
  ] as const;

  return (
    <>
      <div className={styles.controller}>
        <ToggleButtonGroup
          color="primary"
          value={filter.type}
          exclusive
          onChange={(e, value) => changeFilter({ ...filter, type: value })}
          aria-label="Platform"
          className={styles.toggle}
        >
          {TYPES.map((type) => (
            <ToggleButton
              key={type.id}
              value={type.id}
              className={`${styles['toggle-btn']} ${
                filter.type === type.id ? styles.selected : ''
              }`}
            >
              {type.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Button className={styles['add-button']}>
          New Set
          <AddIcon />
        </Button>
      </div>
      <Divider className={styles.divider} />{' '}
      {loading ? (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className={styles.controller}>
            <div className={styles.filters}>
              <div className={styles.filter}>
                <Typography
                  component="p"
                  variant="subtitle1"
                  className={styles.text}
                >
                  Category :
                </Typography>
                <Select
                  value={filter.category}
                  onChange={(e) =>
                    changeFilter({ ...filter, category: e.target.value })
                  }
                  displayEmpty
                  variant="standard"
                  inputProps={{ 'aria-label': 'Without label' }}
                  className={styles['filter-select']}
                >
                  <MenuItem value="all">All</MenuItem>
                  {categories.length
                    ? categories.map((item) => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </div>
              <Divider orientation="vertical" flexItem />
              <div className={styles.filter}>
                <Typography
                  component="p"
                  variant="subtitle1"
                  className={styles.text}
                >
                  Client/brand :
                </Typography>
                <Select
                  value={filter.brand}
                  onChange={(e) =>
                    changeFilter({ ...filter, brand: e.target.value })
                  }
                  displayEmpty
                  variant="standard"
                  inputProps={{ 'aria-label': 'Without label' }}
                  className={styles['filter-select']}
                >
                  <MenuItem value="all">All</MenuItem>
                  {brands.map((item) => (
                    <MenuItem key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            <Select
              value={filter.sort}
              onChange={(e) =>
                changeFilter({ ...filter, sort: e.target.value as TSort })
              }
              displayEmpty
              variant="outlined"
              inputProps={{ 'aria-label': 'Without label' }}
              className={styles.sort}
            >
              {SORT.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  Sort by: {item.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Divider className={styles.divider} />
          <section className={styles['table-container']}>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={styles.th}
                      >
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>

              <TableBody>
                {!table.getRowModel().rows.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className={styles['no-data']}>
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className={styles.td}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </section>
        </>
      )}
    </>
  );
}
