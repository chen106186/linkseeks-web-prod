import React from 'react'

import { ConfigProvider } from 'antd'

export interface AntdConfigProps {}

export const AntdProvider = (props: AntdConfigProps) => {
  return <ConfigProvider {...props} />
}
