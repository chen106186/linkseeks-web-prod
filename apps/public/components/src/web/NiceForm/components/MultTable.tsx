import React from 'react'
import { Table } from '@linkseeks/ui'

interface IMultTableProps {
  columns: any[]
  prefix?: React.ReactNode
  rowKey?: string
  value?: any[]
}

const MultTable = (props: IMultTableProps) => {
  const { columns, prefix, rowKey } = props
  const value = props.value || []
  return (
    <div style={{ width: '100%' }}>
      {prefix}
      <Table rowKey={rowKey || 'id'} columns={columns} dataSource={value} />
    </div>
  )
}

MultTable.defaultProps = {}

MultTable.isFieldComponent = true

export default MultTable
