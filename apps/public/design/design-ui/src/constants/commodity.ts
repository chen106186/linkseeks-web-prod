export interface RecommentCommodityItemType {
  sort: number
  /** 唯一id，spuId或者skuId */
  id: number
  /** SKUID */
  skuId?: number
  /**
   * 商品ID
   */
  commodityId: number
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品图片
   */
  mainPic: string
  /**
   * 商品价格
   */
  price: string
  /**
   * 活动价格
   */
  activityPrice?: string
  /**
   * 单位
   */
  unitName: string
  /**
   * 销量
   */
  sold?: number
  /**
   * 商品标签
   */
  tags?: string[]
  /**
   * 标签列表
   */
  tagList?: string[]
  /**
   * 店铺id
   */
  storeId?: number
  memberId: number
  priceType: number
  /**
   * 最小价格
   */
  min?: number
  /**
   * 最大价格
   */
  max?: number
  /**
   * 活动类型列表
   */
  activityTypeList?: number[]

  stockCount: number
  minOrder: number

  /**
   * 是否团购
   */
  groupPurchase: boolean
}
