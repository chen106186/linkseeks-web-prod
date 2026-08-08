// 全局注册虚拟布局组件
import React from 'react'
import { Space } from '@linkseeks/ui'

// 操作按钮集合
const controllerGroup: React.FC<any> = (props) => {
  const { children } = props
  return <Space>{children}</Space>
}

export default controllerGroup
