import React, { useState } from 'react'
import { Input, Space, Button, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const MultTable = (props) => {
  const { columns, prefix, rowKey } = props.props['x-component-props']
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
