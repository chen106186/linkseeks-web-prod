/*
 * @Description: 省市列表
 */
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Icons, Button } from '@apps/mobile-ui'
import { themeLayout } from '@/constants/theme'
import { getMemberMobileDepositClassifyProvince, getMemberMobileDepositClassifyCity } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import AreaSelect, { AreaSelectValueType } from '../AreaSelect'
import { AreaPopupProps } from '../AreaSelect/components/AreaPopup'
import './index.scss'

let areaKey = 0

function getOnlyAreaKey() {
  areaKey += 1
  return areaKey
}

export type AreaSelectListValueType = {
  provinceCode: string
  cityCode: string
  key?: number
}[]

interface AreaSelectListProps {
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 自定义样式
   */
  customStyle?: React.CSSProperties
  /**
   * value
   */
  value?: AreaSelectListValueType
  /**
   * onChange
   */
  onChange?: (value: AreaSelectListValueType) => void
}

const AreaSelectList: React.FC<AreaSelectListProps> = (props: AreaSelectListProps) => {
  const { disabled, customStyle, value, onChange } = props

  const [internalValue, setInternalValue] = useState<AreaSelectListValueType>([])

  // 是否是手动选择标识
  const inputRef = useRef(false)

  useEffect(() => {
    if ('value' in props && !inputRef.current) {
      const provideValue = (value || []).map((item) => ({
        ...item,
        key: getOnlyAreaKey(),
      }))
      setInternalValue(provideValue)
    }
  }, [value])

  const triggerChange = (next: AreaSelectListValueType) => {
    onChange?.(next)
  }

  const handleRemove = (index: number) => {
    inputRef.current = true
    const mergedValue = [...internalValue]
    mergedValue.splice(index, 1)
    setInternalValue(mergedValue)
    triggerChange(mergedValue)
  }

  const handleAdd = () => {
    inputRef.current = true
    const mergedValue = [...internalValue]
    ;(mergedValue as any).push({
      key: getOnlyAreaKey(),
    })
    setInternalValue(mergedValue)
    triggerChange(mergedValue)
  }

  const handleAreaItemChange = (value: AreaSelectValueType, index: number) => {
    inputRef.current = true
    const mergedValue = [...internalValue]
    mergedValue.splice(index, 1, {
      ...mergedValue[index],
      ...(value as AreaSelectListValueType[0]),
    })
    setInternalValue(mergedValue)
    triggerChange(mergedValue)
  }

  const customFetchFns: AreaPopupProps['customFetchFns'] = useMemo(
    () => [
      () => getMemberMobileDepositClassifyProvince(),
      (params) => getMemberMobileDepositClassifyCity({ provinceCode: params?.pcode! }),
    ],
    [],
  )

  return (
    <View className="area-select-list" style={customStyle}>
      <MellowCard
        title="适用区域"
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
        headStyle={{
          paddingRight: 0,
          paddingLeft: 0,
          marginRight: pxTransform(themeLayout['margin-s']),
          marginLeft: pxTransform(themeLayout['margin-s']),
        }}
      >
        <View className="area-select-list-list">
          {internalValue.map((item, index) => (
            <View className="area-select-list-list-item" key={item?.key || index}>
              <View className="area-select-list-list-item-control">
                <AreaSelect
                  placeholder="请选择"
                  customFetchFns={customFetchFns}
                  max={2}
                  value={item}
                  onChange={(next) => handleAreaItemChange(next, index)}
                />
              </View>
              <View className="area-select-list-list-item-delete">
                <Icons name="Trash" color="#c8cacd" size={16} onClick={() => handleRemove(index)} />
              </View>
            </View>
          ))}
        </View>
        {!disabled ? (
          <View className="area-select-list-add">
            <Button onClick={handleAdd}>
              <Icons size={16} name="Plus" className="area-select-list-add-icon" />
              添加地市
            </Button>
          </View>
        ) : null}
      </MellowCard>
    </View>
  )
}

export default AreaSelectList
