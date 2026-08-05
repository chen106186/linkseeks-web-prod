/**
 * @Deprecated 配送至区域选择组件
 */
import React, { useState, useRef, useEffect } from 'react'
import { View, Text } from '@apps/mobile-ui'
import { Swiper, SwiperItem } from '@tarojs/components'
import classNames from 'classnames'
import ShippingAreaIndexesItem, { AreaItemType } from './Item'
import './index.scss'

export type ShortcutType = {
  /**
   * 名称
   */
  name: string | undefined
  /**
   * 编码
   */
  code: string | undefined
  /**
   * key
   */
  key: number
}

const MAX = 4 // 到街道

let shortcutKey = 0

export const ShippingAreaIndexes: React.FC = () => {
  const [shortcuts, setShortcuts] = useState<ShortcutType[]>([
    {
      name: undefined,
      code: undefined,
      key: shortcutKey,
    },
  ])
  const [current, setCurrent] = useState(0)

  const swiperRef = useRef<any>(null)

  const handleShortcutChange = (index: number) => {
    setCurrent(index)
    swiperRef.current?.scrollBy(index, true)
  }

  const handleSwiperChange = (index: number) => {
    setCurrent(index)
  }

  const triggerChange = (value: ShortcutType[]) => {
    // onChange?.(value);
  }

  const handleIndexesItemChange = (value: AreaItemType, index: number) => {
    console.log('选择区域', value)
    let newShortcuts = [...shortcuts]

    newShortcuts[index].name = value.name
    newShortcuts[index].code = value.code

    // 重新选择区域项操作
    if (index < newShortcuts.length) {
      let i = index + 1
      while (i < newShortcuts.length) {
        newShortcuts[i] = undefined as any
        i += 1
      }
      newShortcuts = newShortcuts.filter(Boolean)
    }
    if (index === newShortcuts.length - 1 && newShortcuts.length < MAX) {
      shortcutKey += 1
      newShortcuts[index + 1] = {
        name: undefined,
        code: undefined,
        key: shortcutKey,
      }
    }

    // 全部选择了才触发 onChange
    if (newShortcuts.length === MAX) {
      triggerChange(newShortcuts)
    }

    setShortcuts(newShortcuts)
  }

  useEffect(() => {
    if (current !== shortcuts.length) {
      setTimeout(() => {
        handleShortcutChange(shortcuts.length - 1)
      }, 20)
    }
  }, [shortcuts])

  return (
    <View className="area-indexes">
      <View className="area-indexes-shortcut">
        {shortcuts.map((item, index) => (
          <View key={index} className="area-indexes-shortcut-item" onClick={() => handleShortcutChange(index)}>
            <Text
              className={classNames('area-indexes-shortcut-item-name', {
                'area-indexes-shortcut-item-name__active': index === current,
              })}
            >
              {item.name || `请选择`}
            </Text>
          </View>
        ))}
      </View>
      <View className="area-indexes-swiper">
        <Swiper onChange={(e) => handleSwiperChange(e.detail.current)} ref={swiperRef}>
          {shortcuts.map((item, index) => (
            <SwiperItem key={item.key}>
              <View className="area-indexes-swiper-item">
                <ShippingAreaIndexesItem
                  pcode={shortcuts[index - 1]?.code}
                  onChange={(value) => handleIndexesItemChange(value, index)}
                />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>
    </View>
  )
}

export default ShippingAreaIndexes
