/**
 * @Description 搜索项label高亮关键字
 */
import React, { useMemo } from 'react'
import { View } from '@apps/mobile-ui'
import { COLOR, PRIMARY } from '@/constants/theme'

interface OptionLabelProps {
  /**
   * 关键字
   */
  keyword: string
  /**
   * 内容
   */
  content: string
  /**
   * 自定义className
   */
  customClassName?: string
  /**
   * 高亮字体颜色，默认主题色
   */
  color?: string
}

const OptionLabel: React.FC<OptionLabelProps> = (props) => {
  const { keyword, content, customClassName, color = COLOR[PRIMARY] } = props

  const richText = useMemo(
    () => content?.replace(keyword, `<span style="color: ${color};">${keyword}</span>`) || '',
    [keyword, content, color],
  )

  return <View className={customClassName} dangerouslySetInnerHTML={{ __html: richText }} />
}

export default OptionLabel
