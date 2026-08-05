/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-30 15:27:05
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 10:59:51
 * @Description: sku 规格组
 */
import React from 'react'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'
import './index.scss'
import { GroupItemValueType } from '../..'

export type SpecGroupValueType = number | null

export interface SelectAttrValType {
  attrId: number
  attrValId: number
}

export type GroupItemType = {
  /**
   * 名称
   */
  name: string
  /**
   * 数据id
   */
  id: number
  /**
   * 规格图片
   */
  img?: string
}

export interface SpecGroupProps {
  /**
   * specId
   */
  specId: number
  /**
   * skuKey，对应关联sku中的key
   */
  skuKey: string
  /**
   * 组名
   */
  title: string
  /**
   * 项
   */
  items: GroupItemType[]
  /**
   * 当前选中的项
   */
  value: SpecGroupValueType
  /**
   * 当前选中的sku组合
   */
  innerValue: GroupItemValueType
  /**
   * 当前禁用的项
   */
  disableds: number[]
  /**
   * 点击选择触发事件
   */
  onChange?: (value: SpecGroupValueType | null) => void
  commoditySkuList: any[]
}

const SpecGroup: React.FC<SpecGroupProps> = (props: SpecGroupProps) => {
  const { title, specId, items, value, disableds = [], onChange, commoditySkuList, innerValue } = props

  const handlePressItem = (record: GroupItemType) => {
    if (disableds.includes(record.id)) {
      return
    }
    onChange?.(value !== record.id ? record.id : null)
  }

  const sortItem = (sortArr: any[]) => {
    if (Array.isArray(sortArr) && sortArr.length > 0) {
      return sortArr.sort((a, b) => (b.attrId > a.attrId ? -1 : 1))
    }
    return sortArr
  }

  const judgeSkuNotExist = (skuArr: SelectAttrValType[]): boolean => {
    if (commoditySkuList && commoditySkuList.length > 0) {
      if (skuArr.length < commoditySkuList[0].commoditySkuAttributeList.length) {
        return false
      }

      const allSkuArr: Array<SelectAttrValType[]> = []
      commoditySkuList.forEach((item) => {
        const itemSkuArr: SelectAttrValType[] = []

        item.commoditySkuAttributeList &&
          item.commoditySkuAttributeList.length > 0 &&
          item.commoditySkuAttributeList.forEach((attrAndValItem) => {
            itemSkuArr.push({
              attrId: attrAndValItem.customerAttribute?.id!,
              attrValId: attrAndValItem.customerAttributeValue?.id!,
            })
          })
        allSkuArr.push(itemSkuArr)
      })

      return !allSkuArr.some((item) => isEqual(sortItem(item), sortItem(skuArr)))
    }
    return true
  }

  /**
   * 查询该属性是否在sku中
   * @param attrId 属性名id
   * @param attrValId 属性值id
   * @returns
   */
  const judgeAttrNotExist = (attrId: number, attrValId: number): boolean => {
    const selectAttrVal = Object.keys(innerValue).map((key) => {
      return {
        attrId: Number(key.split('_')[1]),
        attrValId: innerValue[key]!,
      }
    })
    if (!selectAttrVal.length) return false
    // 如果当前属性不在选择的sku中,则判断和已选择的属性的组合的sku是否存在
    if (selectAttrVal.some((item) => item.attrId === attrId && item.attrValId !== attrValId)) {
      const currentSelectAttrVal = selectAttrVal.map((item) => {
        if (item.attrId === attrId) {
          return {
            attrId,
            attrValId,
          }
        }
        return {
          ...item,
        }
      })
      return judgeSkuNotExist(currentSelectAttrVal)
    } else if (selectAttrVal.every((item) => item.attrId !== attrId)) {
      const currentSelectAttrVal = [...selectAttrVal, { attrId, attrValId }]
      return judgeSkuNotExist(currentSelectAttrVal)
    }

    return false
  }

  return (
    <View className="specGourp">
      <View className="specGourp-title">{title}</View>
      <View className="specGourp-items">
        {items.map((item) => (
          <View
            className="specGourp-items-wrap"
            key={item.id}
            onClick={() => {
              if (judgeAttrNotExist(specId, item.id)) return
              handlePressItem(item)
            }}
          >
            <View
              className={classNames('specGourp-items-spec', {
                'specGourp-items-spec__active': item.id === value,
                'specGourp-items-spec__disabled': judgeAttrNotExist(specId, item.id),
              })}
            >
              <View
                className={classNames('specGourp-items-spec-name', {
                  'specGourp-items-spec-name__active': item.id === value,
                  'specGourp-items-spec-name__disabled': judgeAttrNotExist(specId, item.id),
                })}
              >
                {item.name}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default SpecGroup
