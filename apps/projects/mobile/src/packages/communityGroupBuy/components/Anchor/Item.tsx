/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-02 14:02:04
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-02 15:42:06
 * @Description: 锚点子项
 */
import React, { useContext, useEffect, useMemo } from 'react'
import { nextTick, createSelectorQuery } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import { AnchorContext } from './index'
import './index.scss'

interface IProps {
  /**
   * 标题
   */
  title: string
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 自定义外部className
   */
  customClassName?: string

  children: React.ReactNode
}

const AnchorItem: React.FC<IProps> = (props: IProps) => {
  const { title, customStyle, customClassName, children } = props
  const anchorContext = useContext(AnchorContext)

  // 生成一个随机key 作为获取元素的标记
  const classKey = useMemo(() => `anchor-item-${Math.random().toFixed(16).slice(2, 10)}`, [children])

  const calculateHeaderHeight = () => {
    nextTick(() => {
      const query = createSelectorQuery()
      query
        .select(`.${classKey}`)
        .boundingClientRect((res) => {
          // bug：这个 如果有设置marginTop 是不会计算在内的。。。
          if (res && anchorContext.ready) {
            anchorContext.ready({ title, height: Math.ceil(res.height) })
          }
        })
        .exec()
    })
  }

  useEffect(() => {
    if (children) {
      calculateHeaderHeight()
    }
  }, [children])

  useEffect(() => {
    if (anchorContext.call) {
      anchorContext.call({ title })
    }
  }, [])

  return (
    <View className={classNames('anchor-item', classKey, customClassName)} style={customStyle}>
      {children}
    </View>
  )
}

AnchorItem.defaultProps = {
  customStyle: {},
}

export default AnchorItem
