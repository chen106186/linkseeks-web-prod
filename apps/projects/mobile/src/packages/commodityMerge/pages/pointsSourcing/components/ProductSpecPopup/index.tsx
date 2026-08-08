/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-02 17:52:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 13:40:00
 * @Description: 积分商品Sku面板
 */
import React, { useState, useEffect, useImperativeHandle } from 'react'
import { showToast, hideToast } from '@apps/mobile-services/utils/taro'
import { View, Text, Button } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import ImageBox from '@/components/ImageBox'
import Popup from '@/components/Popup'
import Stepper from '@/components/Stepper'
import SpecGroup, { SpecGroupProps, SpecGroupValueType } from './components/SpecGroup'
import './index.scss'

let toastIns: any = null

export const SKU_KEY_PREFIX = 's_'

export type ProductInfoType = {
  /**
   * 数据id
   */
  id: number
  /**
   * 商品名称
   */
  name: string
  /**
   * 最低价
   */
  min: number
  /**
   * 最高价
   */
  max: number
  /**
   * 计量单位
   */
  unitName: string
  /**
   * 商品主图
   */
  mainPic: string
  /**
   * 最小起订量
   */
  minOrder: number
}

export type GroupItemValueType = { [key: string]: number | null }
export type GroupItemDisabledsType = { [key: string]: number[] }

export type GroupsItemType = Omit<SpecGroupProps, 'value' | 'onChange' | 'disableds'>
export type InnerSpecGroupItemType = Omit<SpecGroupProps, 'onChange'>

export type SkuListItemType = {
  /**
   * skuId
   */
  skuId: number
  /**
   * 价格
   */
  price: number
  /**
   * 库存数量
   */
  stockNum: number | undefined
  /**
   * 当前选择的数量
   */
  quantity: number
  /**
   * sku对应属性的文本
   */
  specNames: string[]
} & { [key: string]: any }

export interface SkuPopupRefHandle {
  onConfirm: () => void
}

export interface SkuPopupProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 点击关闭事件
   */
  onClose: () => void
  /**
   * 商品信息
   */
  productInfo: ProductInfoType
  /**
   * 规格组信息
   */
  groups: GroupsItemType[]
  /**
   * sku列表
   */
  skuList: SkuListItemType[]
  /**
   * 当前选中的sku
   */
  value?: SkuListItemType
  /**
   * sku改变触发事件
   */
  onChange?: (value: SkuListItemType) => void
  /**
   * 数量改变触发事件
   */
  onStepperChange?: (value: number) => void
  /**
   * 点击确认按钮触发事件
   */
  onConfirm?: (value: SkuListItemType) => void
  /**
   * 确认加载中
   */
  confirmLoading?: boolean
  /**
   * 自定义渲染确定按钮
   */
  customRenderActions?: React.ReactNode
}

const ProductSpecPopup = React.forwardRef<SkuPopupRefHandle, SkuPopupProps>((props: SkuPopupProps, ref) => {
  const {
    visible,
    onClose,
    productInfo,
    groups,
    skuList,
    value,
    onChange,
    onStepperChange,
    onConfirm,
    confirmLoading,
    customRenderActions,
  } = props
  const [innerValue, setInnerValue] = useState<GroupItemValueType>({})
  const [innerDisableds, setDisableds] = useState<GroupItemDisabledsType>({})
  const [currentSku, setCurrentSku] = useState<SkuListItemType>({
    skuId: 0,
    price: 0,
    stockNum: 0,
    quantity: 1,
    specNames: [],
  })
  const [visibleAction, setVisibleAction] = useState(true)

  const intl = useIntl()

  const { safeBottomHeight } = useSafeArea()

  /**
   * 更新禁用项
   * @param skuValue 改变后的 skuValue
   * @param skuKey 当前选择的规格组key
   * @param specValue 当前选择的规格值
   */
  const updateDisableds = (skuValue: GroupItemValueType, skuKey?: string, specValue?: SpecGroupValueType) => {
    const prevSkuValue = { ...skuValue }
    const newInnerDisableds: GroupItemDisabledsType = {}
    let filtered = [...skuList]

    const skuValueKeys = Object.keys(prevSkuValue)
    const skuValueLength = Object.values(prevSkuValue).filter(Boolean).length

    // 这里处理，如果当前所选项是最后一项，那么此时不应该再做最后一次过滤，不然到最后过滤出来就只有一条
    if (skuValueLength === groups.length && specValue) {
      prevSkuValue[skuKey!] = null
    }

    skuValueKeys.forEach((key) => {
      const item = prevSkuValue[key]
      if (item) {
        // 如果全部规格值都选择了，那最后过滤到的数据只会有一条
        // 而这个不是想要的，所以当选择到最后一个的时候不做过滤
        filtered = filtered.filter((skuItem) => skuItem[key] === item)
      }
    })
    groups.forEach((groupItem) => {
      // 只处理当前规格外的其他规格的禁用
      newInnerDisableds[groupItem.skuKey] = groupItem.items
        .filter((specItem) => !filtered.find((item) => item[groupItem.skuKey] === specItem.id))
        .map((item) => item.id)
      // 当只有一个规格是处于选中状态的，那么要将这个选中状态的规格的禁用项置空
      if (skuValueLength === 1 && prevSkuValue[groupItem.skuKey]) {
        newInnerDisableds[groupItem.skuKey] = []
      }
    })
    // 如果没有选中任意一个规格值，则清空所有禁用项
    // if (!skuValueLength.length) {
    //   newInnerDisableds = {};
    // }
    setDisableds(newInnerDisableds)
  }

  const _findSkuValue = (skuValue: GroupItemValueType): SkuListItemType | null => {
    const skuValueLength = Object.values(skuValue).filter(Boolean).length
    if (skuValueLength !== groups.length) {
      return null
    }
    const skuValueKeys = Object.keys(skuValue)
    let targetArr = [...skuList]
    skuValueKeys.forEach((key) => {
      const item = skuValue[key]
      targetArr = targetArr.filter((target) => target[key] === item)
    })
    return targetArr[0]
  }

  /**
   * 将 skuValue 转成 innerValue，用于外部的默认选中
   * @param skuValue skuValue
   * @returns innerValue
   */
  const _skuValueToSkuKeyValue = (skuValue: SkuListItemType): GroupItemValueType => {
    const skuKeyObj: GroupItemValueType = {}
    const skuValueKeys = Object.keys(skuValue).filter((item) => item.includes(SKU_KEY_PREFIX))
    skuValueKeys.forEach((item) => {
      skuKeyObj[item] = skuValue[item]
    })
    return skuKeyObj
  }

  useEffect(() => {
    if (groups?.length && skuList?.length && (!value || !value?.skuId)) {
      // updateDisableds(innerValue);
    }
  }, [groups, skuList, value])

  useEffect(() => {
    if ('value' in props) {
      setCurrentSku(value!)
      // 初始化相关数据
      if (value && value.skuId) {
        const newInnerValue = _skuValueToSkuKeyValue(value)
        const skuValueKeys = Object.keys(newInnerValue)
        setInnerValue(newInnerValue)
        // 模拟选中第一个，但是这里不能确保顺序。。。
        // updateDisableds(newInnerValue, skuValueKeys[0], skuValueKeys[0] ? newInnerValue[skuValueKeys[0]] : undefined);
      }
    }
  }, [value])

  const toggleChange = (next: SkuListItemType) => {
    if (!('value' in props)) {
      setCurrentSku(next)
    }
    onChange?.(next)
  }

  const handleSpecGroupChange = (next: SpecGroupValueType, skuKey: string) => {
    const newInnerValue = { ...innerValue }

    newInnerValue[skuKey] = next
    if (!('value' in props)) {
      setInnerValue(newInnerValue)
      // updateDisableds(newInnerValue, skuKey, next);
    }
    const sku = _findSkuValue(newInnerValue)
    sku && toggleChange(sku)
  }

  const handleClosePopup = () => {
    onClose?.()
  }

  // 进步器数值改变
  const handleStepperChange = (next: number) => {
    const newData = { ...currentSku }
    newData.quantity = next
    if (!('value' in props)) {
      setCurrentSku(newData)
    }
    onStepperChange?.(next)
  }

  const handleConfirm = () => {
    const skuValueLength = Object.values(innerValue).filter(Boolean).length
    // 校验是否规格值都有做选择
    if (skuValueLength !== groups.length) {
      for (let i = 0; i < groups.length; i += 1) {
        const item = groups[i]
        if (!innerValue[item.skuKey]) {
          if (toastIns) {
            hideToast(toastIns)
          }
          toastIns = showToast({
            title: `${intl.formatMessage({
              id: 'commodityMerge.pointsSourcing.components.productSpecPopup.sku.required',
              skuName: item.title,
            })}`,
            icon: 'none',
          })
          return
        }
      }
      return
    }
    onConfirm?.(currentSku)
  }

  const handleStepperFocus = () => {
    setVisibleAction(false)
  }

  const handleStepperBlur = (next: number) => {
    setVisibleAction(true)
    handleStepperChange(next)
  }

  useImperativeHandle(ref, () => ({
    onConfirm: handleConfirm,
  }))

  return (
    <Popup visible={visible} onClose={handleClosePopup}>
      <View
        className="points-sku"
        style={{ height: `calc(100vh - 150px)` }}
        // onTouchStart={(e) => { e.stopPropagation() }}
        // catchMove
      >
        <View className="points-sku-card">
          <View className="points-sku-card-left">
            <ImageBox width="100%" height="100%" source={productInfo.mainPic} className="points-sku-card-img" />
          </View>
          <View className="points-sku-card-right">
            <Text className="points-sku-card-name">{productInfo.name}</Text>
            <View className="points-sku-card-extra">
              <Text className="points-sku-card-price">{currentSku.price || ''}</Text>
              <Text className="points-sku-card-unit">
                {intl.formatMessage({
                  id: 'commodityMerge.pointsSourcing.components.productSpecPopup.price',
                  defaultMessage: '积分',
                })}
              </Text>
            </View>
            <Text className="points-sku-card-check">
              {currentSku.specNames.length
                ? `${intl.formatMessage({
                    id: 'commodityMerge.pointsSourcing.components.productSpecPopup.selected',
                    defaultMessage: '已选',
                  })}：${currentSku.specNames.join('；')}`
                : `${intl.formatMessage({
                    id: 'commodityMerge.pointsSourcing.components.productSpecPopup.selected.required',
                    defaultMessage: '请选择',
                  })}`}
            </Text>
          </View>
        </View>
        <View className="points-sku-scrollWrap">
          {groups.map((item) => (
            <SpecGroup
              {...item}
              key={item.specId}
              onChange={(next) => handleSpecGroupChange(next, item.skuKey)}
              value={innerValue[item.skuKey]}
              disableds={innerDisableds[item.skuKey]}
            />
          ))}
          <View className="points-sku-quantity">
            <Text className="points-sku-quantity-label">
              {intl.formatMessage({
                id: 'commodityMerge.pointsSourcing.components.productSpecPopup.quantity',
                defaultMessage: '兑换数量',
              })}
            </Text>
            <View className="points-sku-quantity-content">
              <Stepper
                min={productInfo?.minOrder}
                max={currentSku?.stockNum}
                value={currentSku?.quantity}
                disabled={currentSku?.disabled}
                onBlur={handleStepperBlur}
                onPlus={handleStepperChange}
                onMinus={handleStepperChange}
                onFocus={handleStepperFocus}
              />
            </View>
          </View>
          <View className="points-sku-stock">
            {intl.formatMessage({
              id: 'commodityMerge.pointsSourcing.components.productSpecPopup.stock',
              defaultMessage: '库存',
            })}
            :{currentSku.stockNum}
          </View>
        </View>
        <View
          className="points-sku-action"
          style={{ paddingBottom: safeBottomHeight ? `${safeBottomHeight - themeLayout['padding-xs']}PX` : 0 }}
        >
          {visibleAction && (
            <>
              {currentSku?.stockNum ? (
                <>
                  {!customRenderActions ? (
                    <View className="sku-action-inner">
                      <Button type="primary" onClick={handleConfirm} loading={confirmLoading} full>
                        {intl.formatMessage({
                          id: 'commodityMerge.pointsSourcing.components.productSpecPopup.confirm',
                          defaultMessage: '确认',
                        })}
                      </Button>
                    </View>
                  ) : (
                    customRenderActions
                  )}
                </>
              ) : (
                <View className="sku-action-inner">
                  <Button type="primary" disabled full>
                    {intl.formatMessage({
                      id: 'commodityMerge.pointsSourcing.components.productSpecPopup.soldOut',
                      defaultMessage: '商品已售罄',
                    })}
                  </Button>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Popup>
  )
})

ProductSpecPopup.defaultProps = {
  customRenderActions: null,
}

export default ProductSpecPopup
