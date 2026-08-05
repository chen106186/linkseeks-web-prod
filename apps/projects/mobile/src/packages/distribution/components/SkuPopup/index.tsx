/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-30 15:08:32
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 16:46:36
 * @Description: 商品规格 Popup
 */
import React, { useState, useEffect, useImperativeHandle, useRef } from 'react'
import { showToast, hideToast } from '@apps/mobile-services/utils/taro'
import { View, Text, Button } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import Label from '@/components/Label'
import { useSafeArea } from '@apps/mobile-services'
import { priceFormat } from '@/utils/numberFormat'
import { themeLayout } from '@/constants/theme'
import Popup from '@/components/Popup'
import ImageBox from '@/components/ImageBox'
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
  /**
   * 活动价
   */
  activePrive?: number
  /**
   * 预计到手价
   */
  finalPrive?: number
  /**
   * 会员价
   */
  vipPrice?: number
  /**
   * 阶梯价格，受阶梯价影响
   */
  ladderPrice?: number
  /**
   * 折合价格
   */
  aboutPrice: number
  /**
   * 副单位
   */
  subUnitName: string
  /**
   * 原价
   */
  originalPrice?: number
  /**
   * 活动类型
   * 处理特殊情况的活动，
   * 例如 拼团 需要展示拼团人数
   * 例如 参与了组合购的商品 需要显示 N元场 + X元Y件
   */
  activityType?: number
  /**
   * 拼团人数
   */
  teamNum?: number
  /**
   * 组合购 slogan
   */
  slogan?: string
  /**
   * 秒杀价格，缓存作用
   * 因为如果当前时间不在秒杀时段，sku面板是展示原价的
   */
  seckillPrice?: number
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
  /**
   * sku图片
   */
  img?: string
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
  /**
   * 自定义渲染商品右侧信息
   */
  customRenderProductContent?: (productInfo: ProductInfoType) => React.ReactNode
  /**
   * 库存为0时是否显示售罄按钮，针对询价订单，默认 true
   */
  soldOut?: boolean
  /**
   * 确认按钮是否禁用，默认 false
   */
  confirmDisabled?: boolean
  commoditySkuList?: any[]
}

const SkuPopup = React.forwardRef<SkuPopupRefHandle, SkuPopupProps>((props: SkuPopupProps, ref) => {
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
    confirmLoading = false,
    customRenderActions,
    customRenderProductContent,
    soldOut = true,
    confirmDisabled = false,
    commoditySkuList = [],
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
  // 用于标记是否是手动选择了属性值
  const changeRef = useRef<boolean>(false)

  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()

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
    changeRef.current = true
    const newInnerValue = { ...innerValue }

    if (next) {
      newInnerValue[skuKey] = next
    } else {
      delete newInnerValue[skuKey]
    }

    setInnerValue(newInnerValue)
    const sku = _findSkuValue(newInnerValue)

    if (sku) {
      setCurrentSku(sku)
      toggleChange(sku)
    }
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
              id: 'commodityMerge.components.skuPopup.sku.required',
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
    <Popup key="skuPopup" visible={visible} onClose={handleClosePopup} closeable>
      <View
        className="sku"
        style={{ height: `calc(100vh - 150px)` }}
        // onTouchStart={(e) => { e.stopPropagation() }}
        // catchMove
      >
        <View className="sku-product-card">
          <View className="sku-product-card-left">
            <ImageBox
              width="100%"
              height="100%"
              source={currentSku.img || productInfo.mainPic}
              className="sku-product-card-img"
            />
          </View>
          <View className="sku-product-card-right">
            {!customRenderProductContent ? (
              <>
                <View className="sku-product-card-extra">
                  <Text className="sku-product-card-price">
                    {`${intl.formatMessage({ id: 'currency', defaultMessage: '¥' })} ${
                      priceFormat(productInfo?.activePrive) ||
                      priceFormat(productInfo?.vipPrice) ||
                      priceFormat(productInfo?.ladderPrice) ||
                      '0.00'
                    }`}
                  </Text>
                  <Text className="sku-product-card-unit">{productInfo.unitName ? `${productInfo.unitName}` : ''}</Text>
                  {(productInfo.teamNum && (
                    <Label
                      name={intl.formatMessage({
                        id: 'commodityMerge.components.skuPopup.team',
                        num: productInfo.teamNum,
                      })}
                    />
                  )) ||
                    null}
                </View>
                {productInfo.slogan ? (
                  <Text className="sku-product-card-final">{productInfo?.slogan}</Text>
                ) : (
                  <>
                    {productInfo?.finalPrive ? (
                      <Text className="sku-product-card-final">
                        {`${intl.formatMessage({
                          id: 'commodityMerge.components.skuPopup.finalPrive',
                          defaultMessage: '预估到手价',
                        })} ${intl.formatMessage({ id: 'currency', defaultMessage: '¥' })} ${priceFormat(
                          productInfo?.finalPrive,
                        )}`}
                      </Text>
                    ) : null}
                  </>
                )}
                <View className="sku-product-card-merge">
                  {productInfo?.activePrive || productInfo?.vipPrice ? (
                    <Text className="sku-product-card-checked">
                      {`${intl.formatMessage({
                        id: 'commodityMerge.components.skuPopup.originalPrice',
                        defaultMessage: '原价',
                      })}：`}
                      {`${intl.formatMessage({ id: 'currency', defaultMessage: '¥' })} ${priceFormat(
                        productInfo?.originalPrice,
                      )}`}
                    </Text>
                  ) : null}
                  {productInfo?.aboutPrice ? (
                    <Text className="sku-product-card-price__about">
                      {`${intl.formatMessage({
                        id: 'commodityMerge.components.skuPopup.aboutPrice',
                        defaultMessage: '折合约',
                      })}${intl.formatMessage({ id: 'currency', defaultMessage: '¥' })} ${priceFormat(
                        productInfo?.aboutPrice,
                      )}`}
                    </Text>
                  ) : null}
                  {productInfo?.aboutPrice && productInfo?.subUnitName ? (
                    <Text className="sku-product-card-price__about">{`/${productInfo?.subUnitName}`}</Text>
                  ) : null}
                </View>
              </>
            ) : (
              customRenderProductContent(productInfo)
            )}
          </View>
        </View>
        <View className="sku-scrollWrap">
          <View className="sku-product-specs">
            {groups.map((item) => (
              <SpecGroup
                {...item}
                key={item.specId}
                commoditySkuList={commoditySkuList}
                innerValue={innerValue}
                onChange={(next) => handleSpecGroupChange(next, item.skuKey)}
                value={innerValue[item.skuKey]}
                disableds={innerDisableds[item.skuKey]}
              />
            ))}
          </View>
          <View className="sku-stock">
            <View className="sku-stock-left">
              <Text className="sku-stock-title">
                {intl.formatMessage({ id: 'commodityMerge.components.skuPopup.quantity', defaultMessage: '购买数量' })}
              </Text>
              {currentSku && currentSku.skuId ? (
                <>
                  <Text className="sku-stock-line">｜</Text>
                  <Text className="sku-stock-quota">{`${intl.formatMessage({
                    id: 'commodityMerge.components.skuPopup.stock',
                    defaultMessage: '库存',
                  })}${currentSku.stockNum || 0}`}</Text>
                </>
              ) : null}
            </View>
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
        <View
          className="sku-action"
          style={{ paddingBottom: safeBottomHeight ? `${safeBottomHeight - themeLayout['padding-xs']}PX` : 0 }}
        >
          {visibleAction && (
            <>
              {(currentSku?.stockNum || !soldOut) && (
                <>
                  {!customRenderActions ? (
                    <View className="sku-action-inner">
                      <Button
                        type="primary"
                        onClick={handleConfirm}
                        loading={confirmLoading}
                        disabled={confirmDisabled}
                        full
                      >
                        {intl.formatMessage({
                          id: 'commodityMerge.components.skuPopup.confirm',
                          defaultMessage: '确认',
                        })}
                      </Button>
                    </View>
                  ) : (
                    customRenderActions
                  )}
                </>
              )}
              {!currentSku?.stockNum && soldOut && (
                <View className="sku-action-inner">
                  <Button type="primary" disabled full>
                    {intl.formatMessage({
                      id: 'commodityMerge.components.skuPopup.soldOut',
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

export default React.memo(SkuPopup)
