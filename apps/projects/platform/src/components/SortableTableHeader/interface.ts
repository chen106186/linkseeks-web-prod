import { ColumnType } from 'antd/lib/table/interface';

export interface SortableContextProps<R = any> {
  onColumnWidthChange: (value: number, index: number) => void,
}

export interface SortableColumnType<R = any> extends ColumnType<R> {
  /**
   * 是否可拖拽排序
   */
  draggable?: boolean,
  /**
   * 是否可改变 col 大小
   */
  resizable?: boolean,
}