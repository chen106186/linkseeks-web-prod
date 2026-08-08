/**
 * @Description 可拖拽的表格头部 Row 组件
 */
import React, { useMemo } from 'react';
import { ReactSortable, ItemInterface, Sortable, Store } from 'react-sortablejs';
import { ColumnType } from 'antd/lib/table/interface';
import { SortableContextProvider } from './context';

export type SortableColumn = ItemInterface & {}

export interface DraggableHeaderRowProps {
  /**
   * Table columns data
   */
  columns: ColumnType<any>[],
  /**
   * 拖拽顺序改变触发事件
   */
  setColumns: (newState: SortableColumn[]) => void,
  /**
   * 索引，暂时无用
   */
  index: number,
}

const DraggableHeaderRow: React.FC<DraggableHeaderRowProps> = (props) => {
  const {
    columns = [],
    setColumns,
    index,
    children,
  } = props;

  const handleSetList = (newState: SortableColumn[], sortable: any) => {
    // fix: item.dataIndex 是为了判断 给Table传入了 rowSelection 的情况，这种情况下columns最前面会多出一项（勾选项）
    const filtered = newState.filter((item) => item.dataIndex);
    setColumns?.(filtered);
  };

  const childNodes = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      // return React.createElement(Cell, {
      //   ...child.props,
      //   ['data-index']: index,
      // });
      return React.cloneElement(child, {
        ['data-index']: index,
        index,
        ...child.props,
        onTest: () => {},
        additional: {
          a: '123',
        },
      });
    }
  });

  // console.log('childNodes', childNodes)

  const handleColumnWidthChange = (value: number, index: number) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1, {
      ...newColumns[index],
      width: value,
    });
    setColumns?.(newColumns as SortableColumn[]);
  };

  const handleMove = (evt: Sortable.MoveEvent, originalEvent: Event, sortable: Sortable, store: Store): (boolean | void | 1 | -1) => {
    if (!evt.related.className.includes('active')) {
      return false;
    }
    return true;
  };
  
  return (
    <ReactSortable
      list={columns as ItemInterface[]}
      setList={handleSetList}
      tag="tr"
      handle=".columns-draggable-handle"
      dataIdAttr="data-id"
      onMove={handleMove}
    >
      <SortableContextProvider
        value={{
          onColumnWidthChange: handleColumnWidthChange,
        }}
      >
        {children}
      </SortableContextProvider>
    </ReactSortable>
);
};

export default DraggableHeaderRow;
