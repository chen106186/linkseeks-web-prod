import { Tooltip, UploadFile } from 'antd'
import React, { useCallback } from 'react'
import { useRef } from 'react'
import update from 'immutability-helper'
import { DndProvider, useDrag, useDrop } from 'react-dnd'

interface DragableUploadListItemProps {
  originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>
  file: UploadFile
  fileList: UploadFile[]
  moveRow: (dragIndex: any, hoverIndex: any) => void
}

const type = 'DragableUploadList'

export const DragableUploadListItem = ({ originNode, moveRow, file, fileList }: DragableUploadListItemProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const index: any = fileList.indexOf(file)
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      }
    },
    drop: (item: any) => {
      moveRow(item.index, index)
    },
  })
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drop(drag(ref))
  const errorNode = <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>
  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move' }}
    >
      {file.status === 'error' ? errorNode : originNode}
    </div>
  )
}

export const useDragable = ({ fileList, setFileList }) => {
  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = fileList[dragIndex]
      setFileList(
        update(fileList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      )
    },
    [fileList],
  )

  return {
    moveRow,
  }
}
