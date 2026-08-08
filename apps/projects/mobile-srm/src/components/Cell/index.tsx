/* eslint-disable no-nested-ternary */
/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-03 10:28:43
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-08 14:07:42
 * @Description: Cell 组件
 */
import React, { CSSProperties } from 'react'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import { CellContextProvider } from './context'
import ListItem from './Item'
import './index.scss'

interface CellProps {
  /**
   * 是否展示边框
   */
  border?: boolean
  /**
   * 是否对调 title 与 value 的字体样式
   */
  transposition?: boolean
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties
  /**
   * 自定义外部className
   */
  customClassName?: string

  children?: React.ReactNode
}

const Cell = (props: CellProps) => {
  const { border, transposition, customStyle, customClassName, children } = props

  return (
    <View className={classNames('cell-list', { 'cell-list__border': border }, customClassName)} style={customStyle}>
      <CellContextProvider value={{ transposition }}>{children}</CellContextProvider>
    </View>
  )
}

Cell.defaultProps = {
  border: true,
  transposition: false,
  customStyle: {},
  children: null,
}

Cell.displayName = 'Cell'

Cell.Item = ListItem

export default Cell
