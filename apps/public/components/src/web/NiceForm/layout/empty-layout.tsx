// 全局注册虚拟布局组件
import React from 'react'

const emptyLayout: React.FC<any> = (props) => {
  const { children } = props
  return <div>{children}</div>
}

export default emptyLayout
