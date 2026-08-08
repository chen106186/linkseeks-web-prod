import React from 'react'
import ClassNames from 'classnames'
import { Table as AntdTable, TableProps as AntdTableProps } from 'antd'

export interface TableProps extends AntdTableProps<any> {}

const Table = (props: TableProps) => {
  const { className, ...reset } = props

  return <AntdTable className={ClassNames('ui-table', className)} {...reset} />
}

export default Table
