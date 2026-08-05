/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-30 18:49:17
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-01 11:49:50
 * @Description: 图书架组件
 */
import React from 'react'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import { BookshelfContextProvider } from './context'
import BookshelfItem from './Item'
import './index.scss'

interface BookshelfProps {
  /**
   * 自定义样式
   */
  customStyle?: React.CSSProperties
  /**
   * label宽度
   */
  labelWidth?: number
  /**
   * 是否有边框
   */
  border?: boolean

  children?: React.ReactNode
}

const Bookshelf = (props: BookshelfProps) => {
  const { customStyle, labelWidth, border, children } = props

  return (
    <View className={classNames('bookshelf', { bookshelf__border: border })} style={customStyle}>
      <BookshelfContextProvider value={{ labelWidth: labelWidth || 'auto' }}>{children}</BookshelfContextProvider>
    </View>
  )
}

Bookshelf.Item = BookshelfItem

Bookshelf.defaultProps = {
  customStyle: {},
  labelWidth: 0,
  border: false,
  children: null,
}

export default Bookshelf
