/**
 * @Description 可拖拽的表格头部 Row 组件
 */
import React, { useContext } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import SortableContext from './context';
import ResizableHandleBar from './ResizableHandleBar';
import './index.less';

interface DraggableHeaderCellProps {
  columnIndex: number,
  className: string,
  /**
   * 是否可拖拽
   */
  draggable: boolean,
  /**
   * 是否可改变大小
   */
  resizable: boolean,
  /**
   * id
   */
  id: number,
  children?: React.ReactNode,
}

const DraggableHeaderCell: React.FC<DraggableHeaderCellProps> = (props) => {
  const { className, children, columnIndex, draggable, resizable, id, ...restProps } = props;

  const context = React.useContext(SortableContext);

  const handleCellWidthChange = (value: number) => {
    context?.onColumnWidthChange(value, columnIndex);
  };

  return (
    <th
      className={classNames(
        className,
        'sortable-header-cell',
        {
          'sortable-header-cell__active': draggable,
        },
      )}
      data-id={id}
      {...restProps}
    >
      {draggable ? (
        <span className={classNames('draggable-header-handle', 'columns-draggable-handle')}>
          <HolderOutlined
            style={{
              color: 'rgba(0, 0, 0, 0.45)',
              fontSize: 16,
              position: 'relative',
              top: -2,
            }}
          />
        </span>
      ) : null}
      {children}
      {resizable ? (
        <ResizableHandleBar onSlide={handleCellWidthChange} />
      ) : null}
    </th>
  );
};

export default DraggableHeaderCell;
