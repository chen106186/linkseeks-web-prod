import { GetProductShopStoreGetCommodityDetailResponse } from '@apps/apis'
import {
  PostMarketingMobileActivityGoodsDetailTagResponse,
  PostMarketingWebActivityOrderGroupPurchaseDetailResponse,
} from '@apps/apis'

export type GroupDetailType = PostMarketingWebActivityOrderGroupPurchaseDetailResponse

export type ProductInfoType = GetProductShopStoreGetCommodityDetailResponse

export type MarketingDetailType = PostMarketingMobileActivityGoodsDetailTagResponse

export interface SkuItemType {
  id?: number | undefined
  customerAttribute?:
    | {
        id?: number | undefined
        groupName?: string | undefined
        name?: string | undefined
        isSearch?: boolean | undefined
      }
    | undefined
  customerAttributeValue?:
    | {
        id?: number | undefined
        value?: string | undefined
      }
    | undefined
}

export interface PriceInfoType {
  range: string
  min: number
  max: number
  price: number
}

export type CurrentSkuItemType = {
  /**
   * skuId
   */
  skuId: number
  /**
   * 库存数量
   */
  stockNum: number
  /**
   * 折合价格比率
   */
  priceRate: number
  /**
   * 阶梯
   */
  ladder: PriceInfoType[]
  commodityPic: string
  imgList: ImgItemType[]
  commoditySkuAttributeList: SkuItemType[] | undefined
} & { [key: string]: any }

export interface ImgItemType {
  id: string
  commodityPic: string
}

export type CouponDataType = {
  /**
   * 品牌id集合(品牌优惠券才有) ,Long
   */
  brandIds: number[]
  /**
   * 品类id集合(品类优惠券才有) ,Long
   */
  categoryIds: number[]
  /**
   * 商品Id集合(商品优惠券才有) ,Long
   */
  productIds: number[]
  /**
   * 可领取状态0-未登录1-不符合条件2-可领取3-已领取
   */
  completeReceive: number
  /**
   * 优惠券id
   */
  couponId: number
  /**
   * 所属类型1-平台2-商家
   */
  belongType: number
  /**
   * 优惠券名称
   */
  name: string
  /**
   * 优惠券类型,如果所属类型为平台则有1-0元抵扣券2-平台通用优惠券,如果所属类型为商家则有1-0元抵扣券2-商家通用优惠券3-品类优惠券4-品牌优惠券5-商品优惠券
   */
  type: number
  /**
   * 优惠券类型名称
   */
  typeName: string
  /**
   * 券面额
   */
  denomination: number
  /**
   * 使用条件,满多少金额可用
   */
  useConditionMoney: number
  /**
   * 有效类型1-固定有效时间2-自领取开始时间
   */
  effectiveType: number
  /**
   * 有效类型名称
   */
  effectiveTypeName: string
  /**
   * 固定有效时间,券有效起始时间
   */
  effectiveTimeStart: number
  /**
   * 固定有效时间,券有效结束时间
   */
  effectiveTimeEnd: number
  /**
   * 自领取开始时间,券多少天失效
   */
  invalidDay: number
}

export type PromotionItem = {
  /**
   * 活动id
   */
  activityId: number
  /**
   * 活动类型
   */
  activityType: number
  /**
   * 活动归属
   */
  belongType: number
  /**
   * 优惠标签
   */
  preferentialTag: string
  /**
   * 优惠标签描述
   */
  preferentialTagDesc: string
  /**
   * 是否可跳转商品列表0-否1-是
   */
  jumpToProductPage: number
  /**
   * 活动开始时间，下单那边需要
   */
  startTime: number
  /**
   * 活动结束时间，下单那边需要
   */
  endTime: number
}

export type MarketingCampaignType = {
  /**
   * 优惠券数据
   */
  couponList: CouponDataType[]
  /**
   * 活动标签详情信息
   */
  tagDetailList: PromotionItem[]
}
