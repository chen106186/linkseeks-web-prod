import React from 'react'
import { useSortable, CSS } from '@linkseeks/tools'

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

const TableRow: React.FC<RowProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  })

  const style: any = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: 'move',
    position: 'relative',
    zIndex: isDragging ? 999 : 1,
  }

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />
}

export default TableRow
