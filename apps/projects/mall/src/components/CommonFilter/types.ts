export enum FILTER_PARAM_KEY {
  /**
   * 平台后台品类id
   */
  categoryId = 'categoryId',
  /**
   * 平台后台品类id数组 ,Long
   */
  categoryIdList = 'categoryIdList',
  /**
   * 会员品类id
   */
  customerCategoryId = 'customerCategoryId',
  /**
   * 会员品类id数组 ,Long
   */
  customerCategoryIdList = 'customerCategoryIdList',
  /**
   * 属性筛选
   */
  customerAttributeList = 'customerAttributeList',
  /**
   * 品类key
   */
  categoryKey = 'categoryKey',
  /**
   * 品牌id
   */
  brandId = 'brandId',
  /**
   * 品牌id数组 ,Long
   */
  brandIdList = 'brandIdList',
  /**
   * 产品定价：1-现货价格,2-价格需要询价,3-积分兑换商品 ,Integer
   */
  priceTypeList = 'priceTypeList',
  /**
   * 最小价格
   */
  min = 'min',
  /**
   * 最大价格
   */
  max = 'max',
  /**
   * 省份行政编号
   */
  provinceCode = 'provinceCode',
  /**
   * 城市行政编号
   */
  cityCode = 'cityCode',
  /**
   * 排序
   */
  orderType = 'orderType',
  /**
   * 信用积分排序：ASC升序DESC正序
   */
  sortCreditPoint = 'sortCreditPoint',
  /** 是否包邮 */
  carriageType = 'carriageType',
  /** 商品名称 */
  name = 'name',
  /** 店铺名称 */
  memberName = 'memberName',
  /** 发布开始时间 */
  startTime = 'startTime',
  /** 发布结束时间 */
  endTime = 'endTime',
  /** srm 寻源类型 */
  type = 'type',
}

export interface FilterValueType {
  key: any
  title?: any
  type: FILTER_TYPE
  filter?: string
  isLast?: boolean
}

export enum FILTER_SEARCH_TYPE {
  url = 'url',
  silence = 'silence',
}

/**
 * 筛选类型
 */
export enum FILTER_TYPE {
  /**
   * 常用筛选
   */
  commonlyUsed = 'commonlyUsed',
  /**
   * 分类
   */
  category = 'category',
  /**
   * 分类名称
   */
  categoryName = 'categoryName',
  /**
   * 会员品类
   */
  customerCategory = 'customerCategory',
  /**
   * 分类和属性
   */
  categoryAndAttr = 'categoryAndAttr',
  /**
   * 风格
   */
  style = 'style',
  /**
   * 品牌
   */
  brand = 'brand',
  /**
   * 价格
   */
  price = 'price',
  /**
   * 最低价格
   */
  minPrice = 'minPrice',
  /**
   * 最高价格
   */
  maxPrice = 'maxPrice',
  /**
   * 发货地
   */
  useArea = 'useArea',
  /**
   * 发货地省份
   */
  province = 'province',
  /**
   * 发货地市区
   */
  city = 'city',
  /**
   * 商品类型
   */
  commodityType = 'commodityType',
  /**
   * 运费方式:1-卖家承担运费（默认）,2-买家承担运费
   */
  carriageType = 'carriageType',
  /**
   * 活跃店铺
   */
  activeStores = 'activeStores',
  /**
   * 活跃采购商
   */
  activePurchase = 'activePurchase',
  /**
   * 最新加入
   */
  newJoin = 'newJoin',
  /**
   * 最新加入采购商
   */
  newJoinPurchase = 'newJoinPurchase',
  /**
   * 所需积分
   */
  points = 'points',
  /**
   * 最低积分
   */
  minPoints = 'minPoints',
  /**
   * 最高积分
   */
  maxPoints = 'maxPoints',
  /**
   * 商品名称
   */
  name = 'name',
  /**
   * 排序
   */
  sort = 'sort',
  /**
   * 价格排序
   */
  priceSort = 'priceSort',
  /**
   * 价格从高到低
   */
  priceSortHighToLow = 'priceSortHighToLow',
  /**
   * 价格从低到高
   */
  priceSortLowToHigh = 'priceSortLowToHigh',
  /**
   * 销量从高到低
   */
  soldSort = 'soldSort',
  /**
   * 信用排序
   */
  creditSort = 'creditSort',
  /**
   * srm信用排序
   */
  srmCreditSort = 'srmCreditSort',
  /**
   * 信用从高到低
   */
  creditSortHighToLow = 'creditSortHighToLow',
  /**
   * 信用从低到高
   */
  creditSortLowToHigh = 'creditSortLowToHigh',
  /**
   * 店铺信用从高到低
   */
  shopCreditSortHighToLow = 'shopCreditSortHighToLow',
  /**
   * 店铺信用从低到高
   */
  shopCreditSortLowToHigh = 'shopCreditSortLowToHigh',
  /**
   * 时间排序
   */
  dateSort = 'dateSort',
  /**
   * 时间从高到低
   */
  dateSortHighToLow = 'dateSortHighToLow',
  /**
   * 时间从低到高
   */
  dateSortLowToHigh = 'dateSortLowToHigh',
  /**
   * 属性筛选
   */
  attribute = 'attribute',
  /**
   * 店铺地区筛选
   */
  shopArea = 'shopArea',
  /**
   * 关键词搜索
   */
  keyword = 'keyword',
  shopKeyword = 'shopKeyword',
  /**
   * mroFilter
   */
  mroFilter = 'mroFilter',
  nullFilter = 'nullFilter',
  /**
   * 发布时间排序
   */
  publicTimeSort = 'publicTimeSort',
  /**
   * 发布时间降序
   */
  publicTimeSortHighToLow = 'publicTimeSortHighToLow',
  /**
   * 发布时间升序
   */
  publicTimeSortLowToHigh = 'publicTimeSortLowToHigh',
  /**
   * 发布开始时间
   */
  publicStartTime = 'publicStartTime',
  /**
   * 发布结束时间
   */
  publicEndTime = 'publicEndTime',
  /**
   * 寻源类型
   */
  sourceType = 'sourceType',
  /** 只看关于我的 */
  aboutUs = 'aboutUs',
  /**
   * 项目关键词
   */
  projectKeyword = 'projectKeyword',
}

export type FILTER_PARAM = {
  [key in FILTER_PARAM_KEY]?: any
}

export interface AttributeValueItem {
  /**
   * 主键id
   */
  id?: number
  /**
   * 属性值
   */
  value?: string
}

export interface AttributeType {
  /**
   * 主键id
   */
  id: number
  /**
   * 名称
   */
  name: string
  /**
   * 属性值 ,AttributeValueResponse
   */
  attributeValueList: AttributeValueItem[]
}

export interface CommonlyUseItemType {
  id: number
  name: string
  [key: string]: any
}
