import React from 'react'
import { View } from '@apps/mobile-ui'
import './index.scss'

interface HighLightTextPropsType {
  /**
   * 值
   */
  value: string
  /**
   * 自定义外部 className
   */
  customClassName?: string
  /**
   * 自定义外部样式
   */
  customStyle?: string | React.CSSProperties
}

const HighLightText: React.FC<HighLightTextPropsType> = (props: HighLightTextPropsType) => {
  const { value, customClassName, customStyle } = props

  return <View dangerouslySetInnerHTML={{ __html: value }} className={customClassName} style={customStyle} />
}

export default HighLightText
