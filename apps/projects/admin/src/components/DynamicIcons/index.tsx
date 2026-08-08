import React from 'react'
import * as icons from '@ant-design/icons'
/**
 * 主要用于动态导入阿里的图标iconfont
 * @param props
 */
const DynamicIcon: React.FC<{ type: React.ReactNode }> = (props) => {
  const Icons = icons[props.type as string]
  return props.type && Icons ? <Icons /> : null
}

export default DynamicIcon
