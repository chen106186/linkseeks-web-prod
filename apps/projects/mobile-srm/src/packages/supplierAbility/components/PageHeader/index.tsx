/*
 * @Description: 详情页头部
 */
import React from 'react'
import { View } from '@apps/mobile-ui'
import './index.scss'

export interface PageHeaderProps {
  /**
   * 标题
   */
  title?: string
}

const PageHeader: React.FC<PageHeaderProps> = (props: PageHeaderProps) => {
  const { title } = props

  return (
    <View className="page-header">
      <View className="page-header-title">{title}</View>
    </View>
  )
}

export default PageHeader
