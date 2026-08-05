/*
 * @Description: 区域选择器
 */
import React, { useState, useEffect, useImperativeHandle, useRef } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { Text, View, Button } from '@apps/mobile-ui'
import { Swiper, SwiperItem } from '@tarojs/components'
import classNames from 'classnames'
import { useSafeArea } from '@apps/mobile-services'
import Popup from '@/components/Popup'
import CascaderItem, { CascaderItemValueType, CascaderItemType, FieldNamesType } from './Item'
import './index.scss'
import { convertDataToEntities, getLevelEntities } from './conductUtil'
import { themeLayout } from '@/constants/theme'

export type ShortcutType = {
  /**
   * 值
   */
  value: React.Key | undefined
  /**
   * key
   */
  // key: number,
}

export type CascaderValueType = React.Key[]

export interface CascaderProps {
  /**
   * 弹窗标题
   */
  title: string
  /**
   * treeNodes 数据
   */
  treeData: CascaderItemType[]
  /**
   * 值
   */
  value?: CascaderValueType
  /**
   * 选项改变触发事件
   */
  onChange?: (value: CascaderValueType) => void
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 关闭事件
   */
  onClose: () => void
  /**
   * 选项名称匹配上触发函数，用于展示选项名称
   */
  onMatchNames?: (names: string[]) => void
  /**
   * 自定义节点 label、value、children 的字段，默认 { label: label, value: value, children: children }
   */
  fieldNames?: FieldNamesType
}

export type CascaderRef = {
  /**
   * 重置选择
   */
  reset: (value: CascaderValueType) => void
}

const defaultShorcut = () => ({
  value: undefined,
})

const Cascader: React.ForwardRefRenderFunction<CascaderRef, CascaderProps> = (props, ref) => {
  const { title, treeData, value, onChange, visible, onClose, onMatchNames, fieldNames } = props

  const [shortcuts, setShortcuts] = useState<ShortcutType[]>([])
  const [current, setCurrent] = useState(0)
  const [names, setNames] = useState<string[]>([])
  const [treeDataLadder, setTreeDataLadder] = useState<CascaderItemType[][]>([])

  const namesCache = useRef<string[]>([])

  const keyEntities = useRef<any>({})

  // 是否是手动选择标识
  const inputRef = useRef(false)

  const { safeBottomHeight } = useSafeArea()

  const labelKeyName = fieldNames?.label || 'label'
  const valueKeyName = fieldNames?.value || 'value'
  const childrenKeyName = fieldNames?.children || 'children'

  useEffect(() => {
    if ('value' in props && !inputRef.current) {
      const proviedeValue =
        value && value.length ? value.map((item) => ({ value: item as React.Key })) : [{ ...defaultShorcut() }]
      setShortcuts(proviedeValue)
    }
  }, [value])

  useEffect(() => {
    const provideTreeDataLadder = Array.isArray(treeData) ? treeData : []
    keyEntities.current = convertDataToEntities(provideTreeDataLadder, { value: 'id' }).keyEntities
    const { levelMap } = getLevelEntities(keyEntities.current)
    let newTreeDataLadder: CascaderItemType[][] = []

    // 第一数据，是必须的
    newTreeDataLadder.push(levelMap[0])

    // 处理value回填，默认初始层级数据
    if (shortcuts.length) {
      for (let i = 0; i < shortcuts.length - 1; i++) {
        const item = shortcuts[i]
        const entity = keyEntities.current[item.value!]
        if (entity) {
          newTreeDataLadder[i + 1] = entity[childrenKeyName] || undefined
        }
      }
    }
    newTreeDataLadder = newTreeDataLadder.filter(Boolean)
    setTreeDataLadder(newTreeDataLadder)
  }, [treeData, shortcuts])

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

  const triggerChange = (next: ShortcutType[]) => {
    onChange?.(next.map((item) => item.value!).filter(Boolean))
  }

  const handleIndexesItemChange = (next: CascaderItemValueType, index: number, e?: any) => {
    let newShortcuts = [...shortcuts]
    let newTreeDataLadder = [...treeDataLadder]

    const lastIndex = index + 1

    newShortcuts[index].value = next?.[valueKeyName]

    // 重新选择项操作
    let reselect = false
    if (index < newShortcuts.length) {
      let i = lastIndex
      reselect = true
      while (i < newShortcuts.length) {
        newShortcuts[i] = undefined as any
        newTreeDataLadder[i] = undefined as any
        namesCache.current[i] = undefined as any
        i += 1
      }
      newShortcuts = newShortcuts.filter(Boolean)
      newTreeDataLadder = newTreeDataLadder.filter(Boolean)
      namesCache.current = namesCache.current.filter(Boolean)
    }

    const entity = keyEntities.current[next?.[valueKeyName]]

    if (index === newShortcuts.length - 1 && entity[childrenKeyName] && entity[childrenKeyName].length) {
      newShortcuts[lastIndex] = {
        value: undefined,
      }
      newTreeDataLadder[lastIndex] = entity[childrenKeyName]
    }

    setShortcuts(newShortcuts)
    setTreeDataLadder(newTreeDataLadder)

    if (reselect) {
      setNames([...namesCache.current])
      // 外部只需要展示已经选择过的值对应的文本
      // 点击确认按钮才触发
      // onMatchNames?.([...namesCache.current]);
    }
    inputRef.current = true
  }

  const handleIndexesItemMatchName = (name: string, index: number) => {
    namesCache.current[index] = name
    // 因为namesCache是通过 ref 定义的，所以需要返回一个新的数组出去
    // 否则会触发不了 render
    setNames([...namesCache.current])

    if (!inputRef.current) {
      // 外部只需要展示已经选择过的值对应的文本
      onMatchNames?.([...namesCache.current].filter(Boolean))
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

  const handleConfirm = () => {
    triggerChange(shortcuts)
    // 点击确认，并且是手动操作才触发 onMatchNames
    if (inputRef.current) {
      // 外部只需要展示已经选择过的值对应的文本
      onMatchNames?.([...namesCache.current].filter(Boolean))
    }
  }

  const reset = (next: CascaderValueType) => {
    setShortcuts(next.map((item) => ({ value: item })))
  }

  useImperativeHandle(ref, () => ({
    reset,
  }))

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      title={title}
      customStyle={{
        backgroundColor: '#FFFFFF',
      }}
      customTitleStyle={{
        borderBottom: 'none',
      }}
      preload
    >
      <View className="cascader-popup">
        <View className="cascader-shortcut">
          {names.map((item, index) => (
            <View key={index} className="cascader-shortcut-item" onClick={() => handleShortcutChange(index)}>
              <Text
                className={classNames('cascader-shortcut-item-name', {
                  'cascader-shortcut-item-name__active': index === current,
                })}
              >
                {item || '请选择'}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={{
            height: pxTransform(375), // 默认高度
          }}
        >
          <Swiper
            className="cascader-swiper-queen"
            current={current}
            duration={300}
            onChange={(e) => handleSwiperChange(e.detail.current)}
          >
            {shortcuts.map((item, index) => (
              <SwiperItem key={item.value || index}>
                <CascaderItem
                  dataSource={treeDataLadder[index]}
                  defaultChecked={item.value}
                  onChange={(next, e) => handleIndexesItemChange(next, index, e)}
                  onMatchName={(name) => handleIndexesItemMatchName(name, index)}
                  fieldNames={fieldNames}
                  customStyle={{
                    height: pxTransform(375), // 默认高度
                  }}
                />
              </SwiperItem>
            ))}
          </Swiper>
        </View>
        <View
          className="cascader-action"
          style={{
            paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-l']),
          }}
        >
          <Button type="primary" onClick={handleConfirm}>
            确认
          </Button>
        </View>
      </View>
    </Popup>
  )
}

const CascaderForWard = React.forwardRef<CascaderRef, CascaderProps>(Cascader)

export default CascaderForWard
