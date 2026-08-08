import React, { useEffect, useState } from 'react'
import { Dropdown, Space, Menu } from 'antd'
import { CaretDownOutlined, EnvironmentOutlined } from '@ant-design/icons'

import '../styles/Location.less'

const Location: React.FC = () => {
  useEffect(() => {}, [])
  return (
    <Space style={{ cursor: 'pointer' }} size={5}>
      <EnvironmentOutlined />
      <span>广州</span>
      {/* <CaretDownOutlined /> */}
    </Space>
  )
}

export default Location
