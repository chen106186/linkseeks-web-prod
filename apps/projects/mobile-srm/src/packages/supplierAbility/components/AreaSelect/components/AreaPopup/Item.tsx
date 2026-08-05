/**
 * @Deprecated 区域选择项组件
 */
import React, { useState, useEffect, useRef } from 'react'
import { ITouchEvent } from '@tarojs/components'
import { View, Text, Icons } from '@apps/mobile-ui'
import { COLOR, PRIMARY } from '@/constants/theme'
import { getManageMobileAreaFindByPCode } from '@apps/apis'
import { IRequestSuccess } from '@/types/request'
import Loading from '@/components/Loading'
import './index.scss'

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

export type AreaValueType = AreaItemType | null

export type AreaResponseType = {
  /**
   * 主键id
   */
  id?: number
  /**
   * 地区编码
   */
  code: string
  /**
   * 地区名字
   */
  name: string
  /**
   * 地区名字首字母
   */
  firstName?: string
  /**
   * 地区等级
   */
  level?: number
  /**
   * 地区父编码
   */
  pcode?: string
}[]

export interface AreaPopupItemProps {
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
  onChange?: (value: AreaValueType, e?: ITouchEvent) => void
  /**
   * 区域名称匹配上触发函数，用于展示区域名称
   */
  onMatchName?: (name: string) => void
  /**
   * 自定义获取区域数据请求方法
   */
  customFetchFn?: (params?: { pcode: string }) => Promise<IRequestSuccess<AreaResponseType>>
  /**
   * 自定义样式
   */
  customStyle?: React.CSSProperties
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
  key?: string | number
  /**
   * 标题
   */
  title?: string | number
  /**
   * 数据集
   */
  items: ItemsType[]
}

export const AreaPopupItem: React.FC<AreaPopupItemProps> = (props) => {
  const { pcode, checked, defaultChecked, onChange, onMatchName, customFetchFn, customStyle } = props

  const [innerChecked, setInnerChecked] = useState<string | undefined>(defaultChecked || undefined)
  const [dataSource, setDataSource] = useState<ListItemType[]>([])
  const [loading, setLoading] = useState(false)

  // 是否是手动选择标识
  const inputRef = useRef(false)

  const _normalizeAreaList = (source: AreaResponseType) => {
    let ret: ListItemType[] = []
    source.forEach((item) => {
      // 如果不存在数据不存在 key，预计会把没有没有key的数据塞到一组
      // 因为 undefined === undefined 为 true
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
    // ret = ret.filter((item) => item.key);
    ret.sort((a, b) => `${a.key}`.charCodeAt(0) - `${b.key}`.charCodeAt(0))
    return ret
  }

  const triggerChange = (value: AreaValueType, e?: ITouchEvent) => {
    onChange?.(value, e)
  }

  const getAreaByPcode = (code: string) =>
    customFetchFn ? customFetchFn({ pcode: code }) : getManageMobileAreaFindByPCode({ pcode: code })

  const initAreas = async () => {
    if (pcode === null) {
      setDataSource([])
      return
    }
    setLoading(true)
    const res = await getAreaByPcode(pcode)
    if (res.code === 1000) {
      if (res.data && !res.data.length) {
        triggerChange(null)
      }
      const normal = _normalizeAreaList(res.data)
      setDataSource(normal)
    }
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

  useEffect(() => {
    let match2: ItemsType | null = null
    if (!inputRef.current && (!dataSource || !dataSource.length)) {
      return
    }
    for (let i = 0; i < dataSource.length; i++) {
      const group = dataSource[i]
      if (group) {
        for (let j = 0; j < group.items.length; j++) {
          const item = group.items[j]
          if (item.code === innerChecked) {
            match2 = item
            break
          }
        }
      }
    }
    onMatchName?.(match2?.name || '')
  }, [dataSource, innerChecked])

  const handleChooseArea = (value: AreaItemType, e: ITouchEvent) => {
    inputRef.current = true
    if (!('checked' in props)) {
      setInnerChecked(value.code)
    }
    onMatchName?.(value.name)
    triggerChange(value, e)
  }

  if (loading || !dataSource.length) {
    return <Loading loading={loading} />
  }

  return (
    <View className="area-indexes-groups" style={customStyle}>
      {dataSource?.map((group) => (
        <View className="area-indexes-groups-group" key={`${group.key}`}>
          {group.items.map((grand, index) => (
            <View
              className="area-indexes-groups-group-item"
              onClick={(e) => handleChooseArea(grand as AreaItemType, e)}
              key={index}
            >
              <View className="area-indexes-groups-group-item-titleWrap">
                {grand.key ? (
                  <Text className="area-indexes-groups-group-item-key">{index === 0 ? grand.key : ''}</Text>
                ) : null}
                <Text className="area-indexes-groups-group-item-title">{grand.name}</Text>
                {grand.code === innerChecked ? (
                  <View className="area-indexes-groups-group-item-icon">
                    <Icons name="Right" size={14} color={COLOR[PRIMARY]} />
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

export default AreaPopupItem
