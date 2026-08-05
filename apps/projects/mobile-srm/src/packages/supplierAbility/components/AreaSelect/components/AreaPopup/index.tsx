/*
 * @Description: 区域选择器
 */
import React, { useState, useEffect, useImperativeHandle, useRef } from 'react'
import { Text, View } from '@apps/mobile-ui'
import { Swiper, SwiperItem } from '@tarojs/components'
import classNames from 'classnames'
import Popup from '@/components/Popup'
import AreaPopupItem, { AreaValueType, AreaPopupItemProps } from './Item'
import './index.scss'

export type ShortcutType = {
  /**
   * 编码
   */
  code: string | undefined
  /**
   * key，当外部传入value回填时候不存在key
   */
  key?: number
}

export type AreaPopupValueType = ShortcutType[]

export interface AreaPopupProps {
  /**
   * 区域值
   */
  value?: AreaPopupValueType
  /**
   * 区域层级改变触发事件
   */
  onChange?: (value: AreaPopupValueType) => void
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 关闭事件
   */
  onClose: () => void
  /**
   * 区域名称匹配上触发函数，用于展示区域名称
   */
  onMatchNames?: (names: string[]) => void
  /**
   * 自定义获取区域数据请求接口方法
   */
  customFetchFns?: AreaPopupItemProps['customFetchFn'][]
  /**
   * 最大的省市区街道层级，默认到区 3级
   */
  max?: number
}

export type AreaPopupRef = {
  /**
   * 重置选择
   */
  reset: (value: AreaPopupValueType) => void
}

let shortcutKey = 0

function getOnlyShortcutKey() {
  shortcutKey += 1
  return shortcutKey
}

const defaultShorcut = () => ({
  code: '',
  key: getOnlyShortcutKey(),
})

const AreaPopup: React.ForwardRefRenderFunction<AreaPopupRef, AreaPopupProps> = (props, ref) => {
  const { value, onChange, visible, onClose, onMatchNames, customFetchFns, max = 3 } = props

  const [shortcuts, setShortcuts] = useState<AreaPopupValueType>([])
  const [current, setCurrent] = useState(0)
  const [names, setNames] = useState<string[]>([])

  const namesCache = useRef<string[]>([])

  // 是否是手动选择标识
  const inputRef = useRef(false)

  useEffect(() => {
    if ('value' in props && !inputRef.current) {
      const proviedeValue: AreaPopupValueType =
        value && value.length
          ? value.map((item) => ({
              code: item.code,
              key: getOnlyShortcutKey(),
            }))
          : [{ ...defaultShorcut() }]
      setShortcuts(proviedeValue)
    }
  }, [value])

  const initShoretcuts = () => {
    // 如果外部传入 value 则跳过
    if (!('value' in props)) {
      setShortcuts([{ ...defaultShorcut() }])
    }
  }

  const initNames = () => {
    setNames([''])
  }

  useEffect(() => {
    initShoretcuts()
    initNames()
  }, [])

  const handleShortcutChange = (index: number) => {
    setCurrent(index)
  }

  const handleSwiperChange = (index: number) => {
    setCurrent(index)
  }

  const triggerChange = (next: AreaPopupValueType) => {
    onChange?.(next)
  }

  const handleIndexesItemChange = (next: AreaValueType, index: number, e?: any) => {
    let newShortcuts = [...shortcuts]

    if (next === null) {
      newShortcuts.pop()
      onMatchNames?.([...namesCache.current])
      triggerChange(newShortcuts)
      setShortcuts(newShortcuts)
      return
    }

    const lastIndex = index + 1

    newShortcuts[index].code = next?.code

    // 重新选择项操作
    let reselect = false

    // 重新选择区域项操作
    if (index < newShortcuts.length) {
      let i = lastIndex
      reselect = true
      while (i < newShortcuts.length) {
        newShortcuts[i] = undefined as any
        namesCache.current[i] = undefined as any
        i += 1
      }
      newShortcuts = newShortcuts.filter(Boolean)
    }

    // 全部选择了才触发 onChange
    if (newShortcuts.length === max) {
      // 最后提交给外部
      onMatchNames?.([...namesCache.current])
      triggerChange(newShortcuts)
    }

    if (index === newShortcuts.length - 1 && newShortcuts.length < max) {
      newShortcuts[lastIndex] = {
        code: undefined,
        key: getOnlyShortcutKey(),
      }
    }

    setShortcuts(newShortcuts)

    if (reselect) {
      setNames([...namesCache.current])
    }
    inputRef.current = true
  }

  const handleIndexesItemMatchName = (name: string, index: number) => {
    namesCache.current[index] = name
    // 因为namesCache是通过 ref 定义的，所以需要返回一个新的数组出去
    // 否则会触发不了 render
    setNames([...namesCache.current])

    if (!inputRef.current) {
      onMatchNames?.([...namesCache.current])
    }
  }

  useEffect(() => {
    if (shortcuts.length && current !== shortcuts.length - 1) {
      setTimeout(() => {
        handleShortcutChange(shortcuts.length - 1)
      }, 20)
    }
  }, [shortcuts])

  const handleClose = () => {
    onClose?.()
  }

  const reset = (next: AreaPopupValueType) => {
    // setShortcuts(next);
  }

  useImperativeHandle(ref, () => ({
    reset,
  }))

  const provideFetchFns = Array.isArray(customFetchFns) ? customFetchFns : []

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      title="选择地址"
      customStyle={{
        backgroundColor: '#FFFFFF',
      }}
      customTitleStyle={{
        borderBottom: 'none',
      }}
      preload
    >
      <View className="area-indexes">
        <View className="area-indexes-shortcut">
          {names.map((item, index) => (
            <View key={index} className="area-indexes-shortcut-item" onClick={() => handleShortcutChange(index)}>
              <Text
                className={classNames('area-indexes-shortcut-item-name', {
                  'area-indexes-shortcut-item-name__active': index === current,
                })}
              >
                {item || '请选择'}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Swiper
        className="area-indexes-swiper-queen"
        current={current}
        duration={300}
        onChange={(e) => handleSwiperChange(e.detail.current)}
      >
        {shortcuts.map((item, index) => (
          <SwiperItem key={item.key}>
            <View className="area-indexes-swiper-item">
              <AreaPopupItem
                pcode={shortcuts[index - 1]?.code || ''}
                defaultChecked={item.code}
                onChange={(next, e) => handleIndexesItemChange(next, index, e)}
                onMatchName={(name) => handleIndexesItemMatchName(name, index)}
                customFetchFn={provideFetchFns[index]}
              />
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </Popup>
  )
}

const AreaPopupForWard = React.forwardRef<AreaPopupRef, AreaPopupProps>(AreaPopup)

export default AreaPopupForWard
