/**
 * @Deprecated 配送至区域选择组件
 */
import React, { useState, useImperativeHandle, useEffect } from 'react'
import { View, Text } from '@apps/mobile-ui'
import { Swiper, SwiperItem } from '@tarojs/components'
import classNames from 'classnames'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import { getStockStorage, setStockStorage } from '../../utils'
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

export type ShippingAreaIndexesHotCityType = {
  /**
   * 名称
   */
  title: string
  /**
   * shortcuts
   */
  shortcuts: ShippingAreaIndexesValueType
}

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

const MAX = 2 // 到市

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
    const stockHistory = await getStockStorage()
    const hasStockHistory = stockHistory && stockHistory.type === 'areaIndexes'

    if (!userInfo && currentCity && !hasStockHistory) {
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
    setStockStorage('areaIndexes', {
      data: next,
    })
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

  const [hotCityList, setHotCityList] = useState<ShippingAreaIndexesHotCityType[]>([
    {
      title: '北京',
      shortcuts: [{ name: '北京', code: '110000', key: 1, nextPreselecte: false }],
    },
    {
      title: '上海',
      shortcuts: [{ name: '上海', code: '310000', key: 1, nextPreselecte: false }],
    },
    {
      title: '广州',
      shortcuts: [
        { name: '广东省', code: '440000', key: 1, nextPreselecte: false },
        { name: '广州市', code: '440100', key: 2, nextPreselecte: false },
      ],
    },
    {
      title: '深圳',
      shortcuts: [
        { name: '广东省', code: '440000', key: 1, nextPreselecte: false },
        { name: '深圳市', code: '440300', key: 2, nextPreselecte: false },
      ],
    },
    {
      title: '杭州',
      shortcuts: [
        { name: '浙江省', code: '330000', key: 1, nextPreselecte: false },
        { name: '杭州市', code: '330100', key: 2, nextPreselecte: false },
      ],
    },
    {
      title: '南京',
      shortcuts: [
        { name: '江苏省', code: '320000', key: 1, nextPreselecte: false },
        { name: '南京市', code: '320100', key: 2, nextPreselecte: false },
      ],
    },
    {
      title: '苏州',
      shortcuts: [
        { name: '江苏省', code: '320000', key: 1, nextPreselecte: false },
        { name: '苏州市', code: '320500', key: 2, nextPreselecte: false },
      ],
    },
    {
      title: '天津',
      shortcuts: [{ name: '天津', code: '120000', key: 1, nextPreselecte: false }],
    },
    {
      title: '武汉',
      shortcuts: [
        { name: '湖北省', code: '420000', key: 1, nextPreselecte: false },
        { name: '武汉市', code: '420100', key: 2, nextPreselecte: false },
      ],
    },
    {
      title: '长沙',
      shortcuts: [
        { name: '湖南省', code: '430000', key: 1, nextPreselecte: false },
        { name: '长沙市', code: '430100', key: 2, nextPreselecte: false },
      ],
    },
    {
      title: '重庆',
      shortcuts: [{ name: '重庆', code: '500000', key: 1, nextPreselecte: false }],
    },
    {
      title: '成都',
      shortcuts: [
        { name: '四川省', code: '510000', key: 1, nextPreselecte: false },
        { name: '成都市', code: '510100', key: 2, nextPreselecte: false },
      ],
    },
  ])

  return (
    <View className={styles['area-indexes']}>
      {current === 0 && (
        <View className={styles['area-indexes-hot']}>
          <View className={styles['area-indexes-hot-title']}>
            {intl.formatMessage({ id: 'communityGroupBuy.AreaPopup.remenchengshi', defaultMessage: '热门城市' })}
          </View>
          <View className={styles['area-indexes-hot-list']}>
            {hotCityList?.map((item, index) => (
              <View
                className={styles['area-indexes-hot-list-item']}
                key={index.toString()}
                onClick={() => {
                  triggerChange(item.shortcuts)
                }}
              >
                {item.title}
              </View>
            ))}
          </View>
        </View>
      )}
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
                  onClickTop={() => {
                    setCurrent(0)
                  }}
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
