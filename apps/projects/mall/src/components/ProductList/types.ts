export interface CouponCommodityItemType {
  /**
   * 商品id
   */
  productId: number
  /**
   * 商品主图
   */
  mainPic: string
  /**
   * 商品名称
   */
  productName: string
  /**
   * 商品价格
   */
  price: number

  originalPrice: number
  /**
   * 计量单位id
   */
  unitName: string
  /**
   * 产品定价：1-现货价格,2-价格需要询价,3-积分兑换商品
   */
  priceType: number
  /**
   * skuId
   */
  skuId: number
  /**
   * 商品标语
   */
  slogan: string
  /**
   * 商品卖点 ,String
   */
  sellingPoint: string[]
  /**
   * 会员id
   */
  memberId: number
  /**
   * 会员角色id
   */
  memberRoleId: number
  /**
   * 会员名称
   */
  memberName: string
  /**
   * 店铺id
   */
  storeId: number
  /**
   * 店铺名称
   */
  storeName: string
  /**
   * 已售数量
   */
  sold: number
  /**
   * 商品活动标签 ,String
   */
  tagList: string[]
  /**
   * 最小值
   */
  min: number
  /**
   * 最大值
   */
  max: number
  /**
   * 商品优惠价格
   */
  preferentialPrice?: number
  /**
   * 活动类型列表
   */
  activityTypeList?: number[]
}

export interface CommodityItemType {
  /**
   * 主键id
   */
  id: number
  /**
   * 会员品类 ,CustomerCategoryResponse
   */
  customerCategory: {
    /**
     * 主键id
     */
    id?: number
    /**
     * 会员品类名称
     */
    name?: string
    /**
     * 完整Id
     */
    fullId?: string
    /**
     * 排序
     */
    sort?: number
    /**
     * 平台后台品类 ,CategoryResponse
     */
    category?: {
      /**
       * 主键id
       */
      id?: number
      /**
       * 名称
       */
      name?: string
      /**
       * 排序
       */
      sort?: number
      /**
       * 完整Id
       */
      fullId?: string
    }
  }
  /**
   * 品牌 ,BrandResponse
   */
  brand: {
    /**
     * id
     */
    id?: number
    /**
     * 品牌名称
     */
    name?: string
    /**
     * 品牌logo
     */
    logoUrl?: string
  }
  /**
   * 商品主图
   */
  mainPic: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品标语
   */
  slogan: string
  /**
   * 商品卖点 :
   */
  sellingPoint: string[]
  /**
   * 计量单位id
   */
  unitName: string
  /**
   * 最小起订
   */
  minOrder: number
  /**
   * 产品定价：1-现货价格,2-价格需要询价,3-积分兑换商品
   */
  priceType: number
  /**
   * 最小值
   */
  min: number
  /**
   * 最大值
   */
  max: number
  /**
   * 已售
   */
  sold: number
  /**
   * 店铺信用积分
   */
  creditScore: number
  /**
   * 库存数量
   */
  stockCount: number
  /**
   * 会员id
   */
  memberId: number
  /**
   * 会员角色id
   */
  memberRoleId: number
  /**
   * 会员名称
   */
  memberName: string
  /**
   * 店铺id
   */
  storeId: number
  /**
   * 店铺名称
   */
  storeName: string
  /**
   * 店铺logo
   */
  storeLogo: string
  /**
   * 会员商品上架时间
   */
  publishTime: number
  /**
   * 商品优惠价格
   */
  preferentialPrice: number
  /**
   * 活动标签集合 ,String
   */
  tagList: string[]
  /**
   * 商品属性 ,CommodityAttribute
   */
  commodityAttributeList: {
    /**
     * 主键id
     */
    id?: number
    /**
     * 会员属性 ,SimpleCustomerAttribute
     */
    customerAttribute?: {
      /**
       * 主键id
       */
      id?: number
      /**
       * 属性组名
       */
      groupName?: string
      /**
       * 属性名称
       */
      name?: string
      /**
       * 是否搜索属性
       */
      isSearch?: boolean
      /**
       * 后台属性实体 ,SimpleAttribute
       */
      attribute?: {
        /**
         * 主键id
         */
        id?: number
        /**
         * 属性组名
         */
        groupName: string
        /**
         * 属性名称
         */
        name: string
        /**
         * 是否搜索属性
         */
        isSearch?: boolean
      }
    }
    /**
     * 会员属性值 ,SimpleCustomerAttributeValue
     */
    customerAttributeValueList?: {
      /**
       * 主键id
       */
      id?: number
      /**
       * 属性值
       */
      value?: string
      /**
       * 后台属性实体 ,SimpleAttributeValue
       */
      attributeValue?: {
        /**
         * 主键id
         */
        id?: number
        /**
         * 属性值
         */
        value?: string
      }
    }[]
  }[]
  /** 是否拼团活动 */
  groupPurchase?: boolean
}
