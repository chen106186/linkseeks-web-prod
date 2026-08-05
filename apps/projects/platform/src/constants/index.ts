import { getIntl } from '@linkseeks/i18n'
import { getTopDomainByHost, getDefaultEnterprise, getDefaultEnterpriseMallInfo } from '@/utils'
import {
  getInfoCenterUrl,
  getlogisticsCenterUrl,
  getManufactureCenterUrl,
  getMemberCenterUrl,
  getSrmCenterUrl,
  getTopDomain,
} from '@/utils/getDomain'
import { REQUEST_HEADER, TOP_DOMAIN, TOP_DOMAIN_NO_PORT } from '@apps/constants'

import { getWebIntl } from '@apps/locales'
import { getEnv } from '@apps/utils'
export const NOT_CHANGE_VALUE = 'hello, world'
export { SOCKET_URL, getEnv } from '@apps/utils'
const intl = getIntl()
const translate = getWebIntl()

/**
 * 获取平台首页子域名
 */
const getPlatformSubDomain = (defaultSubDomian: string) => {
  let siteUrl: string = getEnv('SITE_URL') || ''
  if (siteUrl.startsWith('http') || siteUrl.startsWith('https')) {
    siteUrl = siteUrl.replace(/https?:\/\//g, '')
  }
  return siteUrl.split('.')[0] || defaultSubDomian
}

/**
 * 平台首页域名
 */

export const PLATFORM_DOMAIN = `${REQUEST_HEADER}${getPlatformSubDomain('lx-www')}.${TOP_DOMAIN}`

/**
 * 企业商城域名
 */
const enterpriseInfo = getDefaultEnterprise()
export const ENTERPRISE_CENTER_URL = `${REQUEST_HEADER}${enterpriseInfo ? enterpriseInfo.url : 'b2b'}.${TOP_DOMAIN}`

export const getEnterpriseCenterUrl = async () => {
  const defaultMallInfo = await getDefaultEnterpriseMallInfo()
  return `${REQUEST_HEADER}${defaultMallInfo ? defaultMallInfo.url : 'b2b'}.${TOP_DOMAIN}`
}

export const jumpDefaultMall = async (path: string) => {
  const mallUrl = await getEnterpriseCenterUrl()
  if (mallUrl) {
    window.open(`${mallUrl}${path}`)
  }
}

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

/**
 * 表单设计器域名
 */
export const DESIGNABLE_URL = 'http://designable.lingxidev.com:4005' // process.env.DESIGNABLE_URL

export const MALL_TYPE = {
  1: translate('web.resource.marketing.qiyeshangcheng'),
  2: translate('web.resource.marketing.jifenshangcheng'),
  // 3: 'translate("web.resource.marketing.qudaoshangcheng")',
  // 4: '渠道自有商城',
  // 5: '渠道积分商城',
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
   * 企业商城-积分商城
   */
  scoreMall = 'scoreMall',
  /**
   * 店铺-积分兑换
   */
  shopScoreMall = 'shopScoreMall',
  /**
   * 店铺列表
   */
  shopList = 'shopList',
  /**
   * 活动凑单
   */
  activityMakeUpList = 'activityMakeUpList',
  /**
   * 优惠券凑单
   */
  makeUpList = 'makeUpList',
}

// 本地环境跳过权限校验

export const isDev = true // process.env.NODE_ENV === 'development'

// 暂时将权限访问关闭
// export const isDev = false

export const Environment_Status = {
  0: {
    name: translate('web.common.all'), // intl.formatMessage({ id: 'shop.template.environment.status_0' }),
  },
  1: {
    name: 'PC',
  },
  2: {
    name: 'H5',
  },
  3: {
    name: translate('web.common.xiaochengxu'), // intl.formatMessage({ id: 'shop.template.environment.status_3' }),
  },
  4: {
    name: 'APP',
  },
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
    label: translate('web.resource.marketing.qiyeshangcheng'),
  },
  {
    value: 7,
    label: translate('web.resource.marketing.jifenshangcheng'),
  },
  // {
  //   value: 3,
  //   label: '渠道商城',
  // },
  // {
  //   value: 4,
  //   label: '渠道自有商城',
  // },
  // {
  //   value: 5,
  //   label: '渠道积分商城',
  // },
]

export const STATUS_ENUM = [
  {
    label: translate('web.common.all'),
    value: null,
  },
  {
    label: translate('web.common.youxiao'),
    value: 1,
  },
  {
    label: translate('web.common.wuxiao'),
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
  /**
   * 赠品
   */
  gift = 4,
}

export const LANG_ICON_MAP = {
  'zh-CN': 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/china.png',
  'zh-TW': 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/china.png',
  'en-US': 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/us.png',
  'ko-KR': 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/koren.png',
}

export const SelectLangList = {
  siteList: [
    {
      name: '简体中文-ZH',
      key: 'zh-CN',
      icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/china.png',
    },
    {
      name: 'English-EN',
      key: 'en-US',
      icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/us.png',
    },
    // {
    //   name: '日本語-JP',
    //   key: 'jp',
    //   icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/japen.png'
    // },
    {
      name: '한국어-KO',
      key: 'ko-KR',
      icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/koren.png',
    },
  ],
}

// 页面访问类型
export enum PAGE_TYPE {
  ADD = 'add',
  EDIT = 'edit',
  VIEW = 'view',
}
