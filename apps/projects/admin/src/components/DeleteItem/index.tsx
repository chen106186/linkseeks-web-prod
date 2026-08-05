import React from 'react'
import { Popconfirm, Button } from 'antd'

export interface DeleteItemProps {
  title?: string
  confirm(record)
}

const DeleteItem: React.FC<DeleteItemProps> = (props) => {
  const { confirm, title = '确认要删除吗?' } = props
  return (
    <Popconfirm title={title} onConfirm={confirm} okText="是" cancelText="否">
      <Button type="link">删除</Button>
    </Popconfirm>
  )
}

DeleteItem.defaultProps = {}

export default DeleteItem
