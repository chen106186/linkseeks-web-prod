/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-02 13:54:36
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-02 15:19:28
 * @Description: 锚地，默认占满父级高度
 */
import React, { useState, useRef } from 'react'
import { BaseEventOrigFunction, ScrollView } from '@tarojs/components'
import { ScrollViewProps } from '@tarojs/components/types/ScrollView'
import { View, Text } from '@apps/mobile-ui'
import { IS_WEB } from '@/constants'
import classNames from 'classnames'
import AnchorItem from './Item'
import './index.scss'

const TABS_HEIGHT = 40
// opacity 变化到 1 的最大滚动距离
const MAX_UNRESERVED_HEIGHT = 320

export interface Item {
  /**
   * 标题
   */
  title: string
}

export interface ReadyItem extends Item {
  /**
   * 高度
   */
  height: number
}

interface IProps {
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 自定义外部className
   */
  customClassName?: string

  children?: React.ReactNode
}

interface AnchorData {
  /**
   * 子项内容
   */
  items: Item[]
  /**
   * 子元素通知父级
   */
  call: ((item: Item) => void) | undefined
  /**
   * 子元素通知父级高度计算好了
   */
  ready: ((item: ReadyItem) => void) | undefined
}

export const AnchorContext = React.createContext<AnchorData>({
  items: [],
  call: undefined,
  ready: undefined,
})

const Anchor = (props: IProps) => {
  const { customStyle, customClassName, children } = props
  const [items, setItems] = useState<Item[]>([])
  const [current, setCurrent] = useState(0)
  const [opacityValue, setOpacityValue] = useState(0)
  const [scrollViewTop, setScrollViewTop] = useState(0)

  const listHeight = useRef<number[]>([])
  const itemsRef = useRef<Item[]>([])
  const readyItemsRef = useRef<ReadyItem[]>([])

  const onCall = (child: Item) => {
    if (itemsRef.current.find((item) => item.title === child.title)) {
      return
    }
    itemsRef.current.push(child)
    setItems(itemsRef.current)
  }

  const onReady = (child: ReadyItem) => {
    const index = readyItemsRef.current.findIndex((item) => item.title === child.title)
    if (index === -1) {
      readyItemsRef.current.push(child)
    } else {
      readyItemsRef.current.splice(index, 1, child)
    }
    if (readyItemsRef.current.length === itemsRef.current.length) {
      const list: number[] = []
      let height = 0
      list.push(height)
      for (let i = 0; i < itemsRef.current.length; i += 1) {
        const anchorItem = itemsRef.current[i]
        const item = readyItemsRef.current.find((readyItem) => readyItem.title === anchorItem.title)
        if (item) {
          height += item.height
          list.push(height)
        }
      }
      listHeight.current = list
    }
  }

  const handleScroll: BaseEventOrigFunction<ScrollViewProps.onScrollDetail> = (evt) => {
    const {
      detail: { scrollTop },
    } = evt
    const offsetY = scrollTop
    // h5 需要动态注入才能滑动正常,小程序不需要
    if (IS_WEB) {
      setScrollViewTop(offsetY)
    }

    setOpacityValue(offsetY <= MAX_UNRESERVED_HEIGHT ? offsetY / MAX_UNRESERVED_HEIGHT : 1)
    // 当滚动到最顶部，offset < 0
    if (offsetY <= 230) {
      setCurrent(0)
      setOpacityValue(0)
      return
    }
    // 在中间部分滚动
    for (let i = 0; i < listHeight.current.length - 1; i += 1) {
      const height1 = listHeight.current[i] - TABS_HEIGHT
      const height2 = listHeight.current[i + 1] - TABS_HEIGHT
      if (offsetY >= height1 && offsetY < height2) {
        setCurrent(i)
        return
      }
    }
    // 滚动到最底部，offsetY 大于最后一个元素的上限
    setCurrent(listHeight.current.length - 2)
  }

  const handleScrollTo = (index: number) => {
    const max = Math.max(0, listHeight.current[index] - TABS_HEIGHT)
    const scrollTop = max + 15
    setScrollViewTop(scrollViewTop === scrollTop ? scrollViewTop + 15 : scrollTop)
  }

  return (
    <AnchorContext.Provider
      value={{
        items,
        call: onCall,
        ready: onReady,
      }}
    >
      <View className={classNames('anchor', customClassName)} style={customStyle}>
        <ScrollView
          className="anchor-scroll"
          onScroll={handleScroll}
          scrollTop={scrollViewTop}
          scrollWithAnimation
          scrollY
        >
          {children}
        </ScrollView>
        <View
          className="anchor-tabs"
          style={{
            opacity: opacityValue,
          }}
        >
          {items.map((item, index) => (
            <View key={index} className="anchor-tabs-item" onClick={() => handleScrollTo(index)}>
              <Text
                className={classNames('anchor-tabs-item-txt', { 'anchor-tabs-item-txt__active': current === index })}
              >
                {item.title}
              </Text>
              <View
                className={classNames('anchor-tabs-item-line', { 'anchor-tabs-item-line__active': current === index })}
              />
            </View>
          ))}
        </View>
      </View>
    </AnchorContext.Provider>
  )
}

Anchor.defaultProps = {
  customStyle: {},
}

Anchor.Item = AnchorItem

export default Anchor
