import { Space } from '@linkseeks/ui'
import React from 'react'

const Toolbar = ({ children }) => {
  return (
    <div className="cp-reditable-toolbar">
      <Space size={16} wrap>
        {children}
      </Space>
    </div>
  )
}

export default Toolbar
