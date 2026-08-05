import { GlobalConfig } from '@/global/config'
import { getDefaultEnterprise, getChannelInfo, getIChannelInfo } from '@/utils'
import {
  getInfoCenterUrl,
  getlogisticsCenterUrl,
  getManufactureCenterUrl,
  getSrmCenterUrl,
  getTopDomain,
} from '@/utils/getDomain'
export const NOT_CHANGE_VALUE = 'hello, world'

/**
 * 请求头
 */
export const REQUEST_HEADER = 'http://'

/**
 * 顶域
 */
const env = process.env.NODE_ENV
export const TOP_DOMAIN = getTopDomain(env, 'lingxidev.com')
export const TOP_DOMAIN_NO_PORT = getTopDomain(env, 'lingxidev.com', true)

/**
 * 行情资讯域名
 */
export const INFO_CENTER_URL = getInfoCenterUrl(TOP_DOMAIN)

/**
 * 企业采购域名
 */
export const SRM_CENTER_URL = getSrmCenterUrl(TOP_DOMAIN)

/**
 * 物流服务域名
 */
export const LOGISTICS_CENTER_URL = getlogisticsCenterUrl(TOP_DOMAIN)

/**
 * 加工服务域名
 */
export const MANUFACTURE_CENTER_URL = getManufactureCenterUrl(TOP_DOMAIN)

export const MALL_TYPE = {
  1: '企业商城',
  2: '积分商城',
  3: '渠道商城',
  4: '渠道自有商城',
  5: '渠道积分商城',
}

export enum SHOP_TYPE {
  /** 企业商城 */
  mall = 1,
  /** 积分商城 */
  scoreMall = 2,
  /** 渠道商城 */
  channel = 3,
  /** 渠道自有商城 */
  ichannel = 4,
  /** 渠道积分商城 */
  channelScoreMall = 5,
}

export enum LAYOUT_TYPE {
  /**
   * 企业商城
   */
  mall = 'mall',
  /**
   * 自营商城
   */
  own = 'own',
  /**
   * 店铺（店铺商城）
   */
  shop = 'shop',
  /**
   * 渠道商城
   */
  channel = 'channel',
  /**
   * 渠道自有商城
   */
  ichannel = 'ichannel',
  /**
   * 企业商城-积分商城
   */
  scoreMall = 'scoreMall',
  /**
   * 店铺-积分兑换
   */
  shopScoreMall = 'shopScoreMall',
  /**
   * 渠道商城-积分兑换
   */
  channelScoreMall = 'channelScoreMall',
  /**
   * 店铺列表
   */
  shopList = 'shopList',
  /**
   * 在线求购
   */
  purchaseOnline = 'purchaseOnline',
}

// 本地环境跳过权限校验

export const isDev = process.env.NODE_ENV === 'development'

// 暂时将权限访问关闭
// export const isDev = false

export const Environment_Status = {
  0: '所有',
  1: 'web',
  2: 'H5',
  3: '小程序',
  4: 'APP',
}

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
   * 活跃店铺
   */
  activeStores = 'activeStores',
  /**
   * 最新加入
   */
  newJoin = 'newJoin',
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
}

// 商城类型

export const SHOP_TYPES = [
  {
    value: 1,
    label: '企业商城',
  },
  {
    value: 7,
    label: '积分商城',
  },
]

export const STATUS_ENUM = [
  {
    label: '全部',
    value: null,
  },
  {
    label: '有效',
    value: 1,
  },
  {
    label: '无效',
    value: 0,
  },
]

// 1是阿里云oss服务器, 2是本地文件服务器
// 2020/10/21 本地文件服务器关闭， 现全部上传到oss - xjm

export const UPLOAD_TYPE = 1

export enum COMMODITY_TYPE {
  /**
   * 现货商品
   */
  prompt = 1,
  /**
   *询价商品
   */
  inquiry = 2,
  /**
   * 积分商品
   */
  integral = 3,
}
