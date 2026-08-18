/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-11 18:00:58
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 16:18:55
 * @Description:
 */
import React from 'react'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import './index.scss'

export type TagsItemType = string

export interface TagsProps {
  /**
   * 标签列表
   */
  dataSource: TagsItemType[]
  /**
   * 自定义样式
   */
  customClassName?: string
  /**
   * 显示数量
   */
  returnNum?: number
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 大小，可选 large
   */
  size?: 'large'
}

export interface TagsItemProps {
  /**
   * 标签
   */
  data: TagsItemType
  /**
   * 大小，可选 large
   */
  size?: 'large'
}

export const TagsItem: React.FC<TagsItemProps> = (props: TagsItemProps) => {
  const { data, size } = props
  return (
    <View
      style={{
        color: data === '社区团购' ? '#C45124' : undefined,
        borderColor: data === '社区团购' ? '#C45124' : undefined,
      }}
      className={classNames('produtct-tags-item', size && `produtct-tags-item__${size}`)}
    >
      {data}
    </View>
  )
}

const Tags: React.FC<TagsProps> = (props: TagsProps) => {
  const { dataSource, customClassName, returnNum, customStyle, size } = props

  return (
    <View className={classNames('produtct-tags', customClassName)} style={customStyle}>
      {dataSource.map((item, index) => {
        if (!item || (returnNum && index >= returnNum)) {
          return null
        }
        return <TagsItem key={`${item}_${index}`} data={item} size={size} />
      })}
    </View>
  )
}

export default Tags
