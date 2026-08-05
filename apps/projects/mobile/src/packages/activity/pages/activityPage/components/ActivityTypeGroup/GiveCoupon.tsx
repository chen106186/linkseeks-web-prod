import React, { useState } from 'react'
import { ActivityButton, Price, RowCommodity } from '@/components/Commodity'
import { View, Tabs, TabsPane, ScrollView, Text, Toast } from '@apps/mobile-ui'
import { numFormat } from '@/utils/numberFormat'
import { ACTIVITY_GIVECOUPON_NUMBER, ACTIVITY_NAME_TO_NUMBER } from '@/constants/const/activity'
import Router from '@/utils/router'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { useIntl } from '@linkseeks/i18n'
import Stepper from '@/components/Stepper'
import useStores from '@/store/useStores'
import { postProductCommodityGetCommodityByCommoditySkuIdList } from '@apps/apis'
import './GiveCoupon.scss'

type Valueof<T extends Object> = T[keyof T]

type ActivityTypeNum = Valueof<typeof ACTIVITY_NAME_TO_NUMBER>

type ActivityListType = {
  activityDefined?: {
    activityType: ActivityTypeNum
    allowCoupon: true
    describe: null
  }
  /** 活动名称 */
  activityName?: string
  /** 活动类型 */
  activityType?: ActivityTypeNum
  /** 活动id */
  id?: number
  minType?: number
  startTime: string
  endTime: string
  allowCoupon: 0 | 1 | number
  memberId: number
}

export type CouponType = {
  groupNo: 1
  /** 限制条件， 满n获赠 */
  limitValue: 1
  list: {
    activityGoodsId: number
    /** 优惠券id */
    couponId: number
    /** 优惠券名字 */
    couponName: string
    /** 面值 */
    denomination: number
    effectiveTimeEnd: number
    effectiveTimeStart: number
    /** 过期类型 1 => effectiveTimeStart - effectiveTimeEnd，2 =》自领取后多少天结束   */
    effectiveType: 1 | 2 | (number & {})
    /** 过期类型， */
    effectiveTypeName: string
    /** 领取类型 */
    getWay: number
    /** 领取类型名 */
    getWayName: string
    id: number
    /** 自领取后多少天结束 */
    invalidDay: number
    /** 数量 */
    num: number
    /** 优惠券类型 */
    type: 1 | 2 | (number & {})
    /** 优惠券名字  */
    typeName: string
    /** 优惠券使用条件 */
    useConditionMoney: number
  }[]
}

type DataSourceItem = React.ComponentProps<typeof RowCommodity> & {
  /** giveType 区分是元还是件 ，1.满额赠，单位元， 2.商品赠，单位件  */
  giveType: 1 | 2 | (number & {})
  activityList: ActivityListType[]
}

export type EventGiveCouponParameters = {
  couponItem: CouponType
  main: Omit<DataSourceItem, 'coupon'>
}

interface Iprops extends DataSourceItem {
  onClick?: (data: EventGiveCouponParameters) => void
  coupon?: CouponType[]
}

const GiveCoupon: React.FC<Iprops> = (props: Iprops) => {
  const { productName, productImg, discount, originalPrice, productId, tags, coupon, giveType, buttonType, onClick } =
    props
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const giveTypeLocale = giveType === 1 ? 'activity.group.giveCouponYuan' : 'activity.group.giveCouponPiece'
  const tabList = coupon?.map((_item, _index) => ({
    title: intl.formatMessage({ id: giveTypeLocale, defaultMessage: '满n元获赠', limitValue: _item.limitValue }),
  }))
  const [buyNum, setBuyNum] = useState<number>(1)
  const [current, setCurrent] = useState<number>(0)
  const {
    purchaseOrderStore: { setShopMessageStore },
  } = useStores()

  const handleBuyCommodity = () => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, { commodityId: productId })
  }

  const handleChangeStepper = (value: number) => {
    setBuyNum(value)
  }

  const handleChangeTab = (value) => {
    setCurrent(value)
  }

  const getSubmitData = async (data: EventGiveCouponParameters) => {
    // const skuIdList = data.map((_item) => _item.skuId);
    const {
      main: { skuId },
      main,
    } = data
    const activityTarget = main.activityList!.find((_activity) => _activity.activityType === ACTIVITY_GIVECOUPON_NUMBER)
    const skuDataResponse = await postProductCommodityGetCommodityByCommoditySkuIdList({ idList: [skuId] } as any)
    if (skuDataResponse.code !== 1000) {
      return null
    }
    console.log('skuDataResponse', skuDataResponse)
    const result: any = {}
    skuDataResponse.data.forEach((_item) => {
      const shopId = `shopId_${_item?.memberId}`
      if (typeof result[shopId] === 'undefined') {
        result[shopId] = []
      }
      const tempData = {
        activityDetails: [],
        commodityId: _item.commodityId,
        commodityLogo: _item.mainPic,
        commoditySku: [],
        count: buyNum,
        brandId: _item.brandId,
        brandName: _item.brandName,
        customerCategoryId: _item.customerCategoryId,
        customerCategoryName: _item.customerCategoryName,
        estimatePrice: main.originalPrice,
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
        newPrice: main.originalPrice,
        parameter: 1,
        productId: _item.commodityId,
        productName: _item.name,
        productImageUrl: _item.mainPic,
        priceType: _item.priceType,
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
          activityType: ACTIVITY_GIVECOUPON_NUMBER,
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
      result[shopId].push(tempData)
    })
    return result
  }

  const handleClick = async (data: EventGiveCouponParameters) => {
    // onClick?.(data)
    const submitData = await getSubmitData?.(data)
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

  return (
    <View className="give-coupon">
      <RowCommodity
        customClassName="give-product-main-commodity"
        productName={productName}
        productId={productId}
        productImg={productImg}
        discount={discount}
        originalPrice={originalPrice}
        tags={tags}
        showBtn={false}
        productTag={
          <Text className="product-tag">
            {intl.formatMessage({ id: 'activity.group.mainProduct', defaultMessage: '主要商品' })}
          </Text>
        }
        // onBuy={handleBuyCommodity}
        onClickCommodity={handleBuyCommodity}
        renderFooter={
          <View className="give-coupon-main-commodity-footer" onClick={(e) => e.stopPropagation()}>
            <Price discount={discount} originalPrice={originalPrice} />
            <Stepper value={buyNum} min={1} onChange={handleChangeStepper} />
          </View>
        }
      />
      <View className="give-coupon-tabs">
        <Tabs tabList={tabList} current={current} scroll onClick={handleChangeTab}>
          {coupon?.map((_item, _index) => {
            const { list, groupNo } = _item
            return (
              <TabsPane key={groupNo} index={_index} current={current}>
                <ScrollView enhanced scrollX showScrollbar={false}>
                  <View className="give-coupon-tabs-tabpane-coupons">
                    {list?.map((_row) => {
                      const { useConditionMoney, couponId, denomination, typeName } = _row
                      return (
                        <View className="give-coupon-tabs-coupon-item" key={`${couponId}`}>
                          <Text className="coupon-amount">{`${intl.formatMessage({
                            id: 'currency',
                            defaultMessage: '￥',
                          })}${numFormat(denomination)}`}</Text>
                          <Text className="coupon-condition">
                            {intl.formatMessage({
                              id: 'activity.group.condition',
                              defaultMessage: '满n可使用',
                              condition: useConditionMoney,
                            })}
                          </Text>
                          <Text className="coupon-type">{typeName}</Text>
                        </View>
                      )
                    })}
                  </View>
                </ScrollView>
                <View className="give-product-footer">
                  <Price
                    discount={discount! * buyNum}
                    originalPrice={originalPrice ? originalPrice * buyNum : discount * buyNum}
                  />
                  <ActivityButton type={buttonType} onClick={() => handleClick({ couponItem: _item, main: props })}>
                    {intl.formatMessage({ id: 'activity.group.nowBuy', defaultMessage: '立即购买' })}
                  </ActivityButton>
                </View>
              </TabsPane>
            )
          })}
        </Tabs>
      </View>
    </View>
  )
}

export default GiveCoupon
