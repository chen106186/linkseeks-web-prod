import React from 'react'
import { Checkbox } from 'antd'
import { useSortable, CSS } from '@linkseeks/tools'
import styles from './index.less'

export interface CardProps {
  id: any
  text: string
  index: number
  isShow: any
  handleChangeShow: (index: number, isShow: boolean) => void
}

export const Card: React.FC<CardProps> = ({ id, text, index, isShow, handleChangeShow }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style: any = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    position: 'relative',
    zIndex: isDragging ? 999 : 1,
    marginRight: 16,
  }

  const handleChange = (index, e) => {
    handleChangeShow(index, e.target.checked)
  }

  return (
    <div ref={setNodeRef} className={styles.item} style={style} {...attributes} {...listeners}>
      <span>{text}</span>
      <Checkbox checked={isShow == '1'} onChange={(e) => handleChange(index, e)} />
    </div>
  )
}
