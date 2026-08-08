/**
 * @Deprecated 配送至区域选择组件
 */
import React, { useState, useImperativeHandle, useEffect } from 'react'
import { View, Text } from '@apps/mobile-ui'
import { Swiper, SwiperItem } from '@tarojs/components'
import classNames from 'classnames'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import ShippingAreaIndexesItem, { ShippingAreaValueType } from './Item'
import styles from './index.module.scss'

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
  /**
   * 下一项目是否预选
   */
  nextPreselecte: boolean
}

export type ShippingAreaIndexesValueType = ShortcutType[]

interface ShippingAreaIndexesProps {
  /**
   * 区域值
   */
  value?: ShippingAreaIndexesValueType
  /**
   * 区域层级改变触发事件
   */
  onChange?: (value: ShippingAreaIndexesValueType) => void
}

export type ShippingAreaIndexesRefHandle = {
  /**
   * 重置选择
   */
  reset: () => void
}

const MAX = 4 // 到街道

let shortcutKey = 0

function getOnlyShortcutKey() {
  shortcutKey += 1
  return shortcutKey
}

const defaultShorcut = () => ({
  name: undefined,
  code: '',
  key: getOnlyShortcutKey(),
  nextPreselecte: false,
})

export const ShippingAreaIndexes: React.ForwardRefRenderFunction<
  ShippingAreaIndexesRefHandle,
  ShippingAreaIndexesProps
> = (props: ShippingAreaIndexesProps, ref) => {
  const { value, onChange } = props

  const [shortcuts, setShortcuts] = useState<ShippingAreaIndexesValueType>([])
  const [current, setCurrent] = useState(0)

  const {
    userStore: { userInfo },
    locationStore: { currentCity },
  } = useStores()
  const intl = useIntl()

  useEffect(() => {
    if ('value' in props) {
      setShortcuts(value!)
    }
  }, [value])

  const initShortcuts = async () => {
    // const stockHistory = await getStockStorage()
    // const hasStockHistory = stockHistory && stockHistory.type === 'areaIndexes'

    if (!userInfo && currentCity) {
      const newShortcuts: ShippingAreaIndexesValueType = [
        currentCity.provinceCode
          ? {
              name: currentCity.provinceName,
              code: currentCity.provinceCode,
              key: getOnlyShortcutKey(),
              nextPreselecte: false,
            }
          : {
              name: undefined,
              code: '',
              key: getOnlyShortcutKey(),
              nextPreselecte: false,
            },
        currentCity.provinceCode
          ? currentCity.cityCode
            ? {
                name: currentCity.cityName,
                code: currentCity.cityCode,
                key: getOnlyShortcutKey(),
                nextPreselecte: true,
              }
            : null
          : null,
        currentCity.provinceCode && currentCity.cityCode
          ? {
              name: undefined,
              code: '',
              key: getOnlyShortcutKey(),
              nextPreselecte: true,
            }
          : null,
      ].filter(Boolean) as ShippingAreaIndexesValueType
      setShortcuts(newShortcuts)
      return
    }
    setShortcuts([{ ...defaultShorcut() }])
  }

  useEffect(() => {
    initShortcuts()
  }, [])

  const handleShortcutChange = (index: number) => {
    setCurrent(index)
  }

  const handleSwiperChange = (index: number) => {
    setCurrent(index)
  }

  const triggerChange = (next: ShippingAreaIndexesValueType) => {
    onChange?.(next)
  }

  const handleIndexesItemChange = (next: ShippingAreaValueType, index: number, e?: any) => {
    let newShortcuts = [...shortcuts]

    // 这里处理非常规4级层级的区域，如澳门地区
    // 如果下一层级没有数据，则删除最后一项，并触发 change
    if (next === null) {
      newShortcuts.pop()
      triggerChange(newShortcuts)
      setShortcuts(newShortcuts)
      return
    }

    newShortcuts[index].name = next?.name
    newShortcuts[index].code = next?.code
    // 这里根据是否有事件对象相区分是否是，手动点击触发的选择
    newShortcuts[index].nextPreselecte = !e

    // 重新选择区域项操作
    if (index < newShortcuts.length) {
      let i = index + 1
      while (i < newShortcuts.length) {
        newShortcuts[i] = undefined as any
        i += 1
      }
      newShortcuts = newShortcuts.filter(Boolean)
    }

    // 全部选择了才触发 onChange
    if (newShortcuts.length === MAX) {
      triggerChange(newShortcuts)
      return
    }

    if (index === newShortcuts.length - 1 && newShortcuts.length < MAX) {
      newShortcuts[index + 1] = {
        name: undefined,
        code: undefined,
        key: getOnlyShortcutKey(),
        nextPreselecte: newShortcuts[index].nextPreselecte,
      }
    }
    setShortcuts(newShortcuts)
  }

  useEffect(() => {
    if (shortcuts.length && current !== shortcuts.length - 1) {
      handleShortcutChange(shortcuts.length - 1)
    }
  }, [shortcuts])

  const reset = () => {
    handleShortcutChange(0)
    setShortcuts([{ ...defaultShorcut() }])
  }

  useImperativeHandle(ref, () => ({
    reset,
  }))

  return (
    <View className={styles['area-indexes']}>
      <View className={styles['area-indexes-shortcut']}>
        {shortcuts.map((item, index) => (
          <View
            key={index}
            className={styles['area-indexes-shortcut-item']}
            onClick={() => handleShortcutChange(index)}
          >
            <Text
              className={classNames(
                styles['area-indexes-shortcut-item-name'],
                index === current ? styles['area-indexes-shortcut-item-name__active'] : '',
              )}
            >
              {item.name ||
                intl.formatMessage({
                  id: 'commodityMerge.components.stockAddressPopup.areaIndexes.placeholder',
                  defaultMessage: '请选择',
                })}
            </Text>
          </View>
        ))}
      </View>
      <View className={styles['area-indexes-swiper']}>
        <Swiper
          className={styles['area-indexes-swiper-queen']}
          current={current}
          duration={300}
          onChange={(e) => handleSwiperChange(e.detail.current)}
          key={`area-indexes-swiper${current}`}
        >
          {shortcuts.map((item, index) => (
            <SwiperItem key={item.key}>
              <View className={styles['area-indexes-swiper-item']}>
                <ShippingAreaIndexesItem
                  pcode={shortcuts[index - 1]?.code || ''}
                  defaultChecked={item.code}
                  onChange={(next, e) => handleIndexesItemChange(next, index, e)}
                  preselecte={shortcuts[index - 1]?.nextPreselecte}
                />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>
    </View>
  )
}

const ShippingAreaIndexesForWard = React.forwardRef<ShippingAreaIndexesRefHandle, ShippingAreaIndexesProps>(
  ShippingAreaIndexes,
)

export default ShippingAreaIndexesForWard
