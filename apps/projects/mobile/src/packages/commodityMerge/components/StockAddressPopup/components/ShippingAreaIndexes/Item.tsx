/**
 * @Deprecated 配送至区域选择项组件
 */
import React, { useState, useEffect, useRef } from 'react'
import { ITouchEvent } from '@tarojs/components'
import { View, Text, Icons, IndexList } from '@apps/mobile-ui'
import { IndexListItem } from '@apps/mobile-ui/packages/types/index-list'
import { COLOR, PRIMARY } from '@/constants/theme'
import Loading from '@/components/Loading'
import { getManageMobileAreaFindByPCode, GetManageMobileAreaFindByPCodeResponse } from '@apps/apis'
import debounce from 'lodash/debounce'
import styles from './index.module.scss'

export type AreaItemType = {
  /**
   * 名称
   */
  name: string
  /**
   * 编码
   */
  code: string
}

export type ShippingAreaValueType = AreaItemType | null

interface ShippingAreaIndexesItemProps {
  /**
   * 父级code
   */
  pcode: string
  /**
   * 当前选择的地址id
   */
  checked?: string
  /**
   * 默认选择的地址id
   */
  defaultChecked?: string
  /**
   * 选择区域触发事件，null表示没有数据了
   */
  onChange?: (value: ShippingAreaValueType, e?: ITouchEvent) => void
  /**
   * 是否预选第一个
   */
  preselecte?: boolean
}

export type ItemsType = {
  /**
   * 名称
   */
  name: string
} & { [key: string]: any }

export type ListItemType = {
  /**
   * key
   */
  key: string | number
  /**
   * 标题
   */
  title?: string | number
  /**
   * 数据集
   */
  items: ItemsType[]
}

export const ShippingAreaIndexesItem: React.FC<ShippingAreaIndexesItemProps> = (props) => {
  const { pcode, checked, defaultChecked, onChange, preselecte } = props

  const [innerChecked, setInnerChecked] = useState<string>(defaultChecked || '')
  const [dataSource, setDataSource] = useState<ListItemType[]>([])
  const [loading, setLoading] = useState(false)
  const controlState = useRef<boolean>(false)

  const _normalizeAreaList = (source: GetManageMobileAreaFindByPCodeResponse) => {
    let ret: IndexListItem[] = []
    source.forEach((item) => {
      let current = ret.find((existing) => existing.key === item.firstName)
      if (!current) {
        current = {
          key: item.firstName,
          title: item.firstName,
          items: [],
        }
        ret.push(current)
      }
      current.items.push({
        name: item.name,
        key: item.firstName,
        code: item.code,
      })
    })
    ret = ret.filter((item) => item.key)
    ret.sort((a, b) => (a.key as string).charCodeAt(0) - (b.key as string).charCodeAt(0))
    return ret
  }

  const triggerChange = (value: ShippingAreaValueType, e?: ITouchEvent) => {
    onChange?.(value, e)
  }

  const getAreaByPcode = (code: string) => getManageMobileAreaFindByPCode({ pcode: code })

  const initAreas = async () => {
    if (pcode === null) {
      setDataSource([])
      return
    }
    setLoading(true)
    if (controlState.current) return
    controlState.current = true
    const res = await getAreaByPcode(pcode)
    if (res.code === 1000) {
      if (res.data && !res.data.length) {
        triggerChange(null)
      }
      const normal = _normalizeAreaList(res.data)

      // 预选第一项逻辑
      if (normal.length && preselecte) {
        if (!('checked' in props)) {
          setInnerChecked((normal[0].items[0] as AreaItemType).code)
        }
        triggerChange(normal[0].items[0] as AreaItemType)
      }

      setDataSource(normal)
    }
    controlState.current = false
    setLoading(false)
  }

  useEffect(() => {
    setTimeout(() => {
      initAreas()
    }, 200)
  }, [pcode])

  useEffect(() => {
    if ('checked' in props) {
      setInnerChecked(checked!)
    }
  }, [checked])

  const handleChooseArea = (value: AreaItemType, e: ITouchEvent) => {
    if (!('checked' in props)) {
      setInnerChecked(value.code)
    }
    triggerChange(value, e)
  }

  if (loading || !dataSource.length) {
    return <Loading loading={loading} />
  }

  return (
    <IndexList
      list={dataSource as any}
      topKey=" "
      isVibrate={false}
      isShowToast={false}
      renderItem={(grand, index) => (
        <View className={styles['area-indexes-swiper-item-group']}>
          <View
            key={`${grand.name}`}
            className={styles['area-indexes-swiper-item-group-item']}
            onClick={(e) => handleChooseArea(grand as AreaItemType, e)}
          >
            <View className={styles['area-indexes-swiper-item-titleWrap']}>
              <Text className={styles['area-indexes-swiper-item-key']}>{index === 0 ? grand.key : ''}</Text>
              <Text className={styles['area-indexes-swiper-item-title']}>{grand.name}</Text>
              {grand.code === innerChecked ? (
                <View className={styles['area-indexes-swiper-item-icon']}>
                  <Icons name="Right" size={14} color={COLOR[PRIMARY]} />
                </View>
              ) : null}
            </View>
          </View>
        </View>
      )}
    />
  )
}

export default ShippingAreaIndexesItem
