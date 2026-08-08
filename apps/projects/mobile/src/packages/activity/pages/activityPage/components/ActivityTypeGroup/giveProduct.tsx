import React, { useState } from 'react'
import { Price, RowCommodity, SimpleCommodity, ActivityButton } from '@/components/Commodity'
import { useIntl } from '@linkseeks/i18n'
import { View, Tabs, TabsPane, ScrollView, Text, Toast } from '@apps/mobile-ui'
import { ACTIVITY_GIVECOUPON_NUMBER, ACTIVITY_NAME_TO_NUMBER } from '@/constants/const/activity'
import Stepper from '@/components/Stepper'
import Router from '@/utils/router'
import { arrayToMap, omit } from '@/utils'
import useStores from '@/store/useStores'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { postProductCommodityGetCommodityByCommoditySkuIdList } from '@apps/apis'
import './giveProduct.scss'

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

type GiveProductProps = {
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
  goodsSubsidiaryGroupDetailsList?: GiveProductProps[]
}

type DataSourceItem = React.ComponentProps<typeof RowCommodity> & {
  /** giveType 区分是元还是件 ，1.满额赠，单位元， 2.商品赠，单位件  */
  giveType: 1 | 2 | (number & {})
  activityList: ActivityListType[]
  skuId: number
}

export type EventGiveProductParameters = { giveProductItem?: SuitCommodity; main: Omit<DataSourceItem, 'giveProduct'> }
interface Iprops extends DataSourceItem {
  giveProduct?: SuitCommodity[]
  onClick?: (data: EventGiveProductParameters) => void
}

const GiveProduct: React.FC<Iprops> = (props: Iprops) => {
  const {
    productName,
    productImg,
    discount,
    originalPrice,
    productId,
    tags,
    giveProduct,
    buttonType,
    giveType,
    onClick,
  } = props
  const giveTypeLocale = giveType === 1 ? 'activity.group.giveProductYuan' : 'activity.group.giveProductPiece'
  const inti = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const tabList = giveProduct?.map((_item, _index) => ({
    title: inti.formatMessage({ id: giveTypeLocale, defaultMessage: '满n元获赠', limitValue: _item.limitValue }),
  }))
  const [buyNum, setBuyNum] = useState<number>(1)
  const [current, setCurrent] = useState<number>(0)
  const {
    purchaseOrderStore: { setShopMessageStore },
  } = useStores()

  const handleClick = (data: EventGiveProductParameters) => {
    onClick?.(data)
  }

  const handleChangeStepper = (value: number) => {
    setBuyNum(value)
  }

  const handleGiftClick = (productInfo: GiveProductProps) => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, { commodityId: productInfo.productId, skuId: productInfo.skuId })
  }
  const handleChangeTab = (value) => {
    setCurrent(value)
  }

  /** 获取赠品 */
  const getGiftList = () => {
    const giftSkuId = giveProduct?.reduce((prev, currentData) => {
      const { goodsSubsidiaryGroupDetailsList } = currentData
      const ids = (goodsSubsidiaryGroupDetailsList?.map((_item) => _item.skuId) || []) as number[]
      const result = [...prev, ...ids]
      return result
    }, [] as number[]) as number[]
    return Array.from(new Set(giftSkuId))
  }

  const getSubmitData = async (data: EventGiveProductParameters) => {
    const giftSkuIdData = getGiftList()
    const {
      main: { skuId },
      main,
    } = data
    const activityTarget = main.activityList!.find((_activity) => _activity.activityType === ACTIVITY_GIVECOUPON_NUMBER)
    const skuDataResponse = await postProductCommodityGetCommodityByCommoditySkuIdList({
      idList: [skuId, ...giftSkuIdData],
    } as any)
    if (skuDataResponse.code !== 1000) {
      return null
    }
    const skuIdToProductMap = arrayToMap(skuDataResponse.data, 'id')
    /** 主商品信息 */
    const _item = skuIdToProductMap[skuId]

    const result = {
      [`shopId_${activityTarget?.memberId}`]: [
        {
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
          // 购物车那边来的， 直接到确认订单不需要
          giftList: [],
          // 购物车那边来的， 直接到确认订单不需要
          giveList: [],
          /** 购物车id， 可以不用传哇 */
          id: 0,
          isCrossBorder: _item.isCrossBorder ?? false,
          isMain: null,
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
          parentSkuId: '',
          priceType: _item.priceType,
          // 商品类型， 1-普通商品;2-套餐商品;3-秒杀商品;4-换购商品;
          purchaseCommodityType: 1,
          // 促销金额
          saleTotalAmount: 0,
          setMealId: null,
          skuId: _item.id,
          stockCount: _item.stockCount,
          storeId: (_item as any).storeId,
          storeLogo: (_item as any).storeLogo,
          storeName: (_item as any).storeName,
          taxRate: _item.taxRate,
          topActivityDetail: {
            activityGoods: { productId: _item.commodityId, skuId: _item.id },
            activityId: activityTarget?.id,
            activityType: ACTIVITY_GIVECOUPON_NUMBER,
            belongType: 2,
            combination: null,
            canUseCoupon: activityTarget?.allowCoupon,
            /** 满额赠， 买商品赠 */
            concreteType: giveType === 1 ? 5 : 9,
            endTime: activityTarget?.startTime,
            ladders: giveProduct?.map((_row) => {
              const { limitValue, goodsSubsidiaryGroupDetailsList } = _row
              return {
                limitValue,
                list: goodsSubsidiaryGroupDetailsList?.map((_record) => {
                  const { skuId: giftSkuId, id, num } = _record
                  const currentData = skuIdToProductMap[giftSkuId!] || {}
                  const omitCurrentData = omit(currentData, [
                    'applyTime',
                    'commodityId',
                    'name',
                    'mainPic',
                    'stockCount',
                    'status',
                  ])
                  return {
                    ...omitCurrentData,
                    productId: currentData.commodityId,
                    productImgUrl: currentData.mainPic,
                    productName: currentData.name,
                    skuId: giftSkuId,
                    num,
                    id,
                  }
                }),
              }
            }),
            preferentialTag: activityTarget?.activityName,
            preferentialTagDescs: giveProduct?.map((_row) => {
              const { limitValue, goodsSubsidiaryGroupDetailsList } = _row
              return {
                desc: '',
                list: goodsSubsidiaryGroupDetailsList?.map((_record) => ({
                  desc: _record.productName,
                  num: _record.num,
                })),
                limit: limitValue,
              }
            }),
            startTime: activityTarget?.endTime,
          },
          unitName: _item.unitName,
          upperMemberId: _item.upperMemberId,
          upperMemberName: _item.upperMemberName,
          upperMemberRoleId: _item.upperMemberRoleId,
          upperMemberRoleName: _item.upperMemberRoleName,
          commodityAreaList: (_item as any).commodityAreaList,
          isAllArea: (_item as any).isAllArea,
        },
      ],
    }
    return result
  }

  const handleBuy = async (data: EventGiveProductParameters) => {
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
    <View className="give-product">
      <RowCommodity
        onClickCommodity={() => handleClick({ main: props })}
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
            {inti.formatMessage({ id: 'activity.group.mainProduct', defaultMessage: '主要商品' })}
          </Text>
        }
        renderFooter={
          <View className="give-product-main-commodity-footer" onClick={(e) => e.stopPropagation()}>
            <Price discount={discount} originalPrice={originalPrice} />
            <Stepper value={buyNum} min={1} onChange={handleChangeStepper} />
          </View>
        }
      />
      <View className="give-product-tabs">
        <Tabs tabList={tabList} scroll onClick={handleChangeTab} current={current}>
          {giveProduct?.map((_item, _index) => {
            const { goodsSubsidiaryGroupDetailsList, groupPrice } = _item
            return (
              <TabsPane key={_item.groupNo} index={_index} current={current}>
                <ScrollView enhanced scrollX showScrollbar={false}>
                  <View className="give-product-tabs-tabpane-products">
                    {goodsSubsidiaryGroupDetailsList?.map((_row) => {
                      const simpleLabel = [
                        inti.formatMessage({
                          id: 'activity.group.originPrice',
                          defaultMessage: '原价n元',
                          price: _row.price,
                        }),
                      ]
                      return (
                        <View
                          className="give-product-tabs-commodity-item"
                          key={_row.id}
                          onClick={() => handleGiftClick(_row)}
                        >
                          <SimpleCommodity
                            productId={_row.productId!}
                            productImage={_row.productImgUrl!}
                            productName=""
                            tags={simpleLabel}
                            productNum={_row.num}
                          />
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
                  <ActivityButton type={buttonType} onClick={() => handleBuy({ giveProductItem: _item, main: props })}>
                    {inti.formatMessage({ id: 'activity.group.nowBuy', defaultMessage: '立即购买' })}
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

export default GiveProduct
