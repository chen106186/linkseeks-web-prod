import React from 'react'
import { Space, Cascader } from '@linkseeks/ui'

/**
 * 筛选项 搜索和远程数据结合的 Cascader
 * 属性Data数据暂存至schema的props下的dataOption
 */
interface CustomCategorySearchProps {
  align?: string
  dataoption?: any[]
}

const CustomCategorySearch = (props: CustomCategorySearchProps) => {
  const justifyAlign = props.align || 'flex-end'
  const option = props.dataoption

  const displayRender = (label: any) => {
    return label[label.length - 1]
  }

  return (
    <Space size={20} style={{ justifyContent: justifyAlign, width: '100%' }}>
      <Cascader options={option} displayRender={displayRender} {...props} />
    </Space>
  )
}

CustomCategorySearch.defaultProps = {}

CustomCategorySearch.isFieldComponent = true

export default CustomCategorySearch
