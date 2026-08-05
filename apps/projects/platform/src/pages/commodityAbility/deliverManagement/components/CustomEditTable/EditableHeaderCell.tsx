import React, { useMemo } from 'react'
import styles from './index.less'

type Colums = {
  rules?: any[]
  [key: string]: any
}

interface EditableHeaderCellProps {
  /**
   * 插槽内容
   */
  children: string[]
  /**
   * 类名
   */
  className: string
  /**
   * 跨列
   */
  colSpan: React.ReactNode
  /**
   * 数据格式
   */
  columns: Colums[]
}

export const EditableHeaderCell: React.FC<
  React.ThHTMLAttributes<HTMLTableHeaderCellElement> & EditableHeaderCellProps
> = (props) => {
  const {
    columns,
    children: [, children],
  } = props
  const required = useMemo(() => {
    for (let i = 0; i < columns.length; i++) {
      if (children === columns[i].title && columns[i].rules) {
        if (Array.isArray(columns[i].rules) && columns[i].rules.some((rulesItem) => rulesItem.required)) {
          return <span className={styles.required}>*</span>
        }
      }
    }
    return null
  }, [columns, children])

  return (
    <th {...props}>
      {children}
      {required}
    </th>
  )
}
