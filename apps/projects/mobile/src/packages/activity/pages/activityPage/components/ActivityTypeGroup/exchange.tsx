import React, { useMemo, useState } from 'react'
import { Price, RowCommodity, SimpleCommodity, ActivityButton } from '@/components/Commodity'
import Router from '@/utils/router'
import classnames from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import Stepper from '@/components/Stepper'
import { View, ScrollView, Text, Tabs, TabsPane, Toast, Image } from '@apps/mobile-ui'
import { ACTIVITY_FULLSWAP_NUMBER, ACTIVITY_NAME_TO_NUMBER } from '@/constants/const/activity'
import useStores from '@/store/useStores'
import { arrayToMap } from '@/utils'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { postProductCommodityGetCommodityByCommoditySkuIdList } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import './exchange.scss'

type CommodityProps = Omit<
  React.ComponentProps<typeof RowCommodity>,
  'onClickCommodity' | 'onBuy' | 'renderFooter' | 'renderMiddleArea'
>

export type EventCombinationParameters = {
  main: CommodityProps
}
type Valueof<T extends Object> = T[keyof T]

type ActivityTypeNum = Valueof<typeof ACTIVITY_NAME_TO_NUMBER>

type ActivityListType = {
  activityDefined?: {
    activityType: ActivityTypeNum
    allowCoupon: true
    describe: null
    swapType: number
  }
  /** 活动名称 */
  activityName?: string
  /** 活动类型 */
  activityType?: ActivityTypeNum
  /** 活动id */
  startTime?: number
  id?: number
  minType?: number
  endTime?: number
}

type SuitCommodityItemProps = {
  brand?: string
  category?: string
  /** 主键id */
  id?: number
  /** 允许换购数量赠送数量搭配数量 */
  num?: number
  /** 商品价格 */
  price?: number
  /** 商品id */
  productId?: number
  productImgUrl?: string
  productName?: string
  skuId?: number
  /** 换购价格 */
  swapPrice?: number
  unit?: string
}

type SuitCommodity = {
  /** 分组编号优惠阶梯换购阶梯 */
  groupNo?: number
  /** 换购门槛优惠门槛数量或金额 */
  limitValue?: number
  /** 套餐价格 */
  groupPrice?: number
  goodsSubsidiaryGroupDetailsList?: SuitCommodityItemProps[]
}

interface Iprops extends CommodityProps {
  activityList?: ActivityListType[]
  exchange?: SuitCommodity[]
  giveType?: 1 | 2
  onClick?: ((dataProps: EventCombinationParameters) => void) | null
}

const Exchange: React.FC<Iprops> = (props: Iprops) => {
  const {
    productName,
    productImg,
    discount,
    originalPrice,
    productId,
    tags,
    exchange,
    buttonType,
    onClick,
    giveType,
    ...rest
  } = props
  const { jmpProductDetail } = useProductDetailJump()
  const [buyNum, setBuyNum] = useState<number>(1)
  const [checked, setChecked] = useState<string[]>([])
  const [priceAndNumberMap, setPriceAndNumberMap] = useState<{ [key: string]: { number: number; swapPrice: number } }>(
    {},
  )
  const tabList = exchange?.map((_item, _index) => ({
    title: `满${_item.limitValue}${giveType === 1 ? '元' : '件'}换购`,
  }))
  const [current, setCurrent] = useState<number>(0)
  const inti = useIntl()
  const {
    purchaseOrderStore: { setShopMessageStore },
  } = useStores()

  const handleCommodityClick = (dataProps: EventCombinationParameters) => {
    onClick?.(dataProps)
  }

  const handleGiftClick = (productInfo: SuitCommodityItemProps) => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, { commodityId: productInfo.productId, skuId: productInfo.skuId })
  }
  const handleChangeTab = (value) => {
    setCurrent(value)
  }

  const handleChangeStepper = (value: number) => {
    setBuyNum(value)
    const [groupIndex] = checked?.[0]?.split('-') || ['']
    console.log(groupIndex)
    if (groupIndex === '') {
      return
    }
    const limitValue = exchange?.[+groupIndex].limitValue
    if (giveType === 1 && originalPrice! * +value < limitValue!) {
      setChecked([])
      return
    }
    if (giveType === 2 && +value < limitValue!) {
      setChecked([])
    }
  }

  const handleSelect = (data: SuitCommodityItemProps & { groupNo: number; limitValue: number }) => {
    if (giveType === 1 && originalPrice! * buyNum < data.limitValue) {
      // Toast.show("")
      return
    }
    if (giveType === 2 && buyNum < data.limitValue) {
      return
    }

    const key = `${data.groupNo}-${data.id}-${data.skuId}`
    if (checked.includes(key)) {
      setChecked(checked.filter((_item) => _item !== key))
      return
    }
    let result = [...checked]
    console.log(current, 'current', data.groupNo, 'data.groupNo')
    // 如果切换tab页就重置
    const [hasCheckedTab] = (result?.[0] || '').split('-')
    if (+hasCheckedTab === +current && !checked.includes(key)) {
      result.push(key)
    } else {
      result = [key]
    }
    priceAndNumberMap[key] = { number: data.num!, swapPrice: data.swapPrice! }
    setChecked(result)
    setPriceAndNumberMap(priceAndNumberMap)
  }

  const totalPrice = useMemo(() => {
    const total = checked.reduce((prev, currentInfo) => {
      let sum = prev
      const currentData = priceAndNumberMap[currentInfo]
      sum += (currentData?.number || 0) * (currentData?.swapPrice || 0)
      return sum
    }, 0)
    return total
  }, [checked])

  const getExchangeGroup = () => {
    if (checked.length === 0) {
      return {}
    }

    const first = checked[0]
    const [groupIndex] = first.split('-')
    const currentGroupData = exchange![+groupIndex].goodsSubsidiaryGroupDetailsList || []
    const toSkuIdMap = arrayToMap(currentGroupData, 'skuId')

    return toSkuIdMap
  }

  const getSubmitData = async () => {
    const exchangeSkuid = checked.map((_item) => +_item.split('-')[2])
    const exchangeDataMap = getExchangeGroup()
    const skuDataResponse = await postProductCommodityGetCommodityByCommoditySkuIdList({
      idList: [rest.skuId, ...exchangeSkuid],
    } as any)
    if (skuDataResponse.code !== 1000) {
      return null
    }
    const result: any = {}
    const activityTarget = rest.activityList!.find((_activity) => _activity.activityType === ACTIVITY_FULLSWAP_NUMBER)
    let memberId: number | null = null
    const generatedData = skuDataResponse.data.map((_item) => {
      if (!memberId) {
        memberId = _item.memberId
      }
      const unitPrice = Object.keys(_item.unitPrice).length > 0 ? Object.values(_item.unitPrice)[0] : _item.min

      const tempData = {
        activityDetails: [],
        commodityId: _item.commodityId,
        commodityLogo: _item.mainPic,
        commoditySku: [],
        count: rest.skuId === _item.id ? buyNum : exchangeDataMap[_item.id].num,
        brandId: _item.brandId,
        brandName: _item.brandName,
        customerCategoryId: _item.customerCategoryId,
        customerCategoryName: _item.customerCategoryName,
        estimatePrice: rest.skuId === _item.id ? unitPrice : exchangeDataMap[_item.id].swapPrice,
        giftList: [],
        /** 购物车id， 可以不用传哇 */
        id: 0,
        isCrossBorder: _item.isCrossBorder ?? false,
        isMemberPrice: _item.isMemberPrice,
        isPublish: true,
        logistics: _item.logistics,
        memberId: _item.memberId,
        memberName: _item.memberName,
        memberRoleId: _item.memberRoleId,
        minOrder: 1,
        name: _item.name,
        newAction: 0,
        newPrice: rest.skuId === _item.id ? unitPrice : exchangeDataMap[_item.id].swapPrice,
        parameter: 1,
        productId: _item.commodityId,
        productName: _item.name,
        productImageUrl: _item.mainPic,
        priceType: _item.priceType,
        isMain: rest.skuId === _item.id,
        // saleTotalAmount: dataToSkuIdMap[_item.id].price,
        skuId: _item.id,
        stockCount: _item.stockCount,
        storeId: (_item as any).storeId,
        storeLogo: (_item as any).storeLogo,
        storeName: (_item as any).storeName,
        taxRate: _item.taxRate,
        attribute: _item.attribute,
        topActivityDetail: {
          activityId: activityTarget?.id,
          belongType: 2,
          activityType: ACTIVITY_FULLSWAP_NUMBER,
          endTime: activityTarget?.startTime,
          preferentialTag: activityTarget?.activityName,
          startTime: activityTarget?.endTime,
        },
        unitName: _item.unitName,
        upperMemberId: _item.upperMemberId,
        upperMemberName: _item.upperMemberName,
        upperMemberRoleId: _item.upperMemberRoleId,
        upperMemberRoleName: _item.upperMemberRoleName,
        commodityAreaList: (_item as any).commodityAreaList,
        isAllArea: (_item as any).isAllArea,
      }
      return tempData
    })
    result[`shopId_${memberId}`] = generatedData
    return result
  }

  const handleBuy = async () => {
    const submitData = await getSubmitData?.()
    console.log(rest)
    if (submitData === null) {
      Toast.show({
        title: '参数异常',
        icon: 'none',
      })
      return
    }
    console.log(submitData)
    setShopMessageStore(submitData)
    Router.navigateTo('order/ConfirmOrder')
  }

  const renderContent = () => {
    // 换购
    return (
      <View className="exchange-tabs">
        <Tabs tabList={tabList} scroll onClick={handleChangeTab} current={current}>
          {exchange?.map((_item, _index) => {
            const { goodsSubsidiaryGroupDetailsList, groupPrice, limitValue, groupNo } = _item

            return (
              <TabsPane key={_item.groupNo} index={_index} current={current}>
                <ScrollView enhanced scrollX showScrollbar={false}>
                  <View className="exchange-tabs-tabpane-products">
                    {goodsSubsidiaryGroupDetailsList?.map((_row) => {
                      const isChecked = checked.includes(`${_index}-${_row.id}-${_row.skuId}`)

                      const simpleLabel = [
                        {
                          name: inti.formatMessage({
                            id: 'activity.group.swap',
                            defaultMessage: '加n元换购',
                            data: _row.swapPrice,
                          }),
                          type: buttonType as 'danger',
                        },
                      ]
                      return (
                        <View
                          className={classnames('exchange-tabs-commodity-item', {
                            'exchange-tabs-commodity-item-active': isChecked,
                          })}
                          key={_row.id}
                          onClick={() => handleSelect({ ..._row, groupNo: _index!, limitValue: limitValue! })}
                        >
                          {(isChecked && (
                            <Image src={getOssUrlPath('/Images/checked.png')} className="exchange-active" />
                          )) ||
                            null}
                          <SimpleCommodity
                            productId={_row.productId!}
                            productImage={_row.productImgUrl!}
                            productName=""
                            tags={simpleLabel}
                            // productNum={_row.num}
                          />
                        </View>
                      )
                    })}
                  </View>
                </ScrollView>
                <View className="give-product-footer">
                  <Price discount={(discount ? discount * buyNum : originalPrice! * buyNum) + totalPrice} />
                  <ActivityButton type={buttonType} onClick={() => handleBuy()}>
                    {inti.formatMessage({ id: 'activity.group.nowBuy', defaultMessage: '立即购买' })}
                  </ActivityButton>
                </View>
              </TabsPane>
            )
          })}
        </Tabs>
      </View>
    )
  }

  return (
    <View className="exchange">
      <RowCommodity
        customClassName="exchange-main-commodity"
        productName={productName}
        productId={productId}
        productImg={productImg}
        discount={discount || originalPrice!}
        originalPrice={originalPrice}
        tags={tags}
        productTag={
          <Text className="product-tag">
            {inti.formatMessage({ id: 'activity.group.mainProduct', defaultMessage: '主要商品' })}
          </Text>
        }
        showBtn={false}
        onClickCommodity={() => handleCommodityClick({ main: props })}
        renderFooter={
          <View className="give-product-main-commodity-footer" onClick={(e) => e.stopPropagation()}>
            <Price discount={discount || originalPrice!} originalPrice={originalPrice} />
            <Stepper value={buyNum} min={1} onChange={handleChangeStepper} />
          </View>
        }
      />
      {exchange && exchange.length !== 0 ? renderContent() : null}
    </View>
  )
}

export default Exchange
