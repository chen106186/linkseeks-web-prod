import React from 'react'
import { Popconfirm } from 'antd'

const PopconfirmBtn = (props: any) => {
  const { title = '确定删除么?', okText = '是', cancelText = '否', onConfirm, children, ...rest } = props
  return (
    <Popconfirm title={title} okText={okText} cancelText={cancelText} onConfirm={onConfirm} {...rest}>
      <a>{children}</a>
    </Popconfirm>
  )
}
export default PopconfirmBtn
