import { useMemo } from 'react';
export function useColumns(rawColumns, value) {
  return useMemo(() => {
    const columns = typeof rawColumns === 'function' ? rawColumns(value) : rawColumns;
    return columns.map(column => column.map(item => typeof item === 'string' ? {
      label: item,
      value: item
    } : item));
  }, [rawColumns, value]);
}