/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-19 18:05:31
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-23 18:48:57
 * @Description: 场景组件，多用于展示用
 */
import React, { useState, useRef, useEffect } from 'react'
import { nextTick, createSelectorQuery, pxTransform } from '@apps/mobile-services/utils/taro'
import { ScrollView } from '@tarojs/components'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import SceneItem from './Item'
import './index.scss'

export type KeyType = number | string

interface SceneProps {
  /**
   * 当前位置索引值
   */
  current?: KeyType
  /**
   * 间距，默认 8
   */
  gutter?: number
  /**
   * 自定义外部容器样式
   */
  customClassName?: string

  children?: React.ReactNode
}

export interface Item {
  /**
   * item 唯一标识
   */
  itemKey: KeyType
}

export interface ReadyItem extends Item {
  /**
   * item 宽度
   */
  width: number
}

interface SceneData {
  /**
   * 子项内容
   */
  items: Item[]
  /**
   * 子元素通知父级
   */
  call: ((item: Item) => void) | undefined
  /**
   * 子元素通知父级宽度计算好了
   */
  ready: ((item: ReadyItem) => void) | undefined
  /**
   * 间距
   */
  gutter?: number
  /**
   * 滚动到当前元素
   */
  slideTo: ((itemIndex: KeyType) => void) | undefined
  /**
   * 当前活跃状态的索引
   */
  active: KeyType
}

export const SceneContext = React.createContext<SceneData>({
  items: [],
  call: undefined,
  ready: undefined,
  slideTo: undefined,
  active: 0,
})

const Scene = (props: SceneProps) => {
  const { current, gutter, customClassName, children } = props

  const [items, setItems] = useState<Item[]>([])
  const [innerCurrent, setInnerCurrent] = useState<KeyType>(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const _containerWidth = useRef<number>(0)
  const _listWidth = useRef<number[]>([])
  const _itemsRef = useRef<Item[]>([])
  const _readyItemsRef = useRef<ReadyItem[]>([])

  const calculateContainerWidth = () => {
    nextTick(() => {
      const query = createSelectorQuery()
      query
        .select('.scene-container')
        .boundingClientRect((res) => {
          if (res) {
            _containerWidth.current = res.width
            // 尝试更新
            if (current !== undefined) {
              updateView(current)
            }
          }
        })
        .exec()
    })
  }

  useEffect(() => {
    calculateContainerWidth()
  }, [])

  const onSlideTo = (index: number) => {
    const itemWidth = _listWidth.current[index]
    const wrapWidth = _containerWidth.current
    const halfWrapWidth = wrapWidth / 2

    const offsetLeft = _listWidth.current.slice(0, index).reduce((prev, curr) => prev + curr, 0)
    const scrollLeftValue = Math.max(0, offsetLeft - halfWrapWidth + itemWidth / 2)
    setScrollLeft(scrollLeftValue)
    setInnerCurrent(index)
  }

  const necessarilyMeasurementsCompleted = (position: number) => _listWidth.current[position] && _containerWidth.current

  /**
   * 滚动到某个元素
   * @param itemKey 需要滚动到的元素索引
   */
  const updateView = (itemKey: KeyType) => {
    const index = _readyItemsRef.current.findIndex((item) => item.itemKey === itemKey)
    if (!necessarilyMeasurementsCompleted(index)) {
      return
    }
    onSlideTo(index)
  }

  useEffect(() => {
    if (current !== undefined && current !== innerCurrent) {
      setInnerCurrent(current)
      updateView(current)
    }
  }, [current])

  const onCall = (child: Item) => {
    if (_itemsRef.current.find((item) => item.itemKey === child.itemKey)) {
      return
    }
    _itemsRef.current.push(child)
    setItems(_itemsRef.current)
  }

  const onReady = (child: ReadyItem) => {
    const index = _readyItemsRef.current.findIndex((item) => item.itemKey === child.itemKey)
    if (index === -1) {
      _readyItemsRef.current.push(child)
      _listWidth.current.push(child.width)
    } else {
      _readyItemsRef.current.splice(index, 1, child)
      _listWidth.current.splice(index, 1, child.width)
    }
    if (_readyItemsRef.current.length === _itemsRef.current.length) {
      // 尝试更新
      if (current !== undefined) {
        updateView(current)
      }
    }
  }

  return (
    <SceneContext.Provider
      value={{
        items,
        call: onCall,
        ready: onReady,
        gutter,
        slideTo: updateView,
        active: innerCurrent,
      }}
    >
      <View
        className="scene-container"
        style={{
          margin: gutter ? pxTransform(Math.ceil(-(gutter / 2))) : 0, // 这里给scrollView给 -margin，而不是给 scene，因为给 scene的话会莫名出现多出来的间隙
        }}
      >
        <ScrollView scrollLeft={scrollLeft} scrollX scrollWithAnimation>
          <View className={classNames('scene', customClassName)}>{children}</View>
        </ScrollView>
      </View>
    </SceneContext.Provider>
  )
}

Scene.defaultProps = {
  gutter: 8,
  customClassName: '',
}

Scene.Item = SceneItem

export default Scene
