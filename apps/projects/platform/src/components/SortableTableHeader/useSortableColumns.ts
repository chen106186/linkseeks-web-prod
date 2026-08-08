/*
 * @Description: 可拖拽排序的columns hook
 */
import { useState } from 'react';
import { ColumnType } from 'antd/lib/table/interface';
import { SortableColumn } from './DraggableHeaderRow';
import { SortableColumnType } from './interface';

// fix: && item.dataIndex 是为了判断 给Table传入了 rowSelection 的情况，这种情况下columns最前面会多出一项（勾选项）
const isRowSelectionCol = (item: ColumnType<any>) => !item.dataIndex;

// 拓展 th 属性
// Antd的Table组件，如果想给 th 添加额外的属性只能通过 onHeaderCell
const normailizeAdditionalHeaderCell = (dataSource: ColumnType<any>[], hasRowSelection: boolean) => {
  const ret: SortableColumn[] = [];
  if (!Array.isArray) {
    return ret;
  }
  dataSource.forEach((item: ColumnType<any>, index) => {
    const commonProps = {
      id: item.dataIndex as string,
      draggable: !item.fixed && !isRowSelectionCol(item),
      resizable: index !== dataSource.length - 1 && !isRowSelectionCol(item),
      columnIndex: !hasRowSelection ? index : index + 1,
    };
    const atom = {
      ...item,
      onHeaderCell: () => {
        return {
          ...(item.onHeaderCell?.(item) || {}),
          ...commonProps,
        };
      },
      ...commonProps,
    };
    ret.push(atom);
  });
  return ret;
};

const useSortableColumns = <R>(defaultColumns: ColumnType<R>[], hasRowSelection: boolean): [SortableColumnType<R>[], (value: ColumnType<R>[]) => void] => {
  const [columns, setColumns] = useState(normailizeAdditionalHeaderCell(defaultColumns, hasRowSelection));

  const handleSetColumns = (value: ColumnType<R>[]) => {
    setColumns(normailizeAdditionalHeaderCell(value.filter((item) => !isRowSelectionCol(item)), hasRowSelection));
  };

  return [columns, handleSetColumns];
}

export default useSortableColumns;