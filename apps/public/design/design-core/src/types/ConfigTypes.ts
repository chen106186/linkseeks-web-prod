import { FetcherType } from '@apps/design-utils'
import { ComponentSchemaType } from './ComponentSchemaTypes'

/**
 * 属性配置类型定义
 */
export enum PROPS_SETTING_TYPES {
  navigation = 'navigation',
  carousel = 'carousel',
  mallNav = 'mallNav', // 商城导航
  goods = 'goods', // 商品推荐
  brand = 'brand', // 品牌推荐
  shop = 'shop', // 店铺推荐
  category = 'category', // 品类推荐
  categoryBanner = 'categoryBanner', // 品类推荐广告
  advert = 'advert', // 顶部广告
  topAdvert = 'topAdvert', // 顶部广告
  bannerAdvert = 'bannerAdvert', // 大图轮播广告
  interactAdvert = 'interactAdvert', // 推荐广告
  mobileHeaderNav = 'mobileHeaderNav', // 移动端顶部导航
  mobileHeaderNavAction = 'mobileHeaderNavAction', //  移动端顶部导航自子项
  mobileBanner = 'mobileBanner', // 移动端活动轮播图
  mobileQuickNav = 'mobileQuickNav', // 移动端导航
  mobileShowCase = 'mobileShowCase', // 移动端橱窗设置
  mobileInformation = 'mobileInformation', // 移动端资讯
  mobileRecommentShops = 'mobileRecommentShops', // 移动端推荐商店
  mobileQuality = 'mobileQuality', // 移动端优质推荐
  mobileBottomNavigation = 'mobileBottomNavigation', // 移动端底部导航
  mobileShopHeaderNav = 'mobileShopHeaderNav', // 移动端店铺头部
  mobileShopCommodity = 'mobileShopCommodity', // 移动端店铺热销商品
  mobileChannelHeaderNav = 'mobileChannelHeaderNav', // 移动端渠道商城头部
  mobileChannelGoodsCard = 'mobileChannelGoodsCard', // 移动端渠道商城商品推荐
  moibileChannelInformation = 'moibileChannelInformation', // 移动端渠道商城行业资讯
  moibileChannelCategory = 'moibileChannelCategory', // 移动端渠道商城品类
  platformNavList = 'platformNavList', // 平台首页导航
  platformAdvert = 'platformAdvert', // 平台广告
  platformPurchaseAdvert = 'platformPurchaseAdvert', // 名企采购广告
  platformMiddleAdvert = 'platformMiddleAdvert', // 平台首页中间横条广告
  platformMBottomAdvert = 'platformMBottomAdvert', // 平台首页底部广告
  platformQuickNav = 'platformQuickNav', // 平台首页快捷导航
  platformGoods = 'platformGoods', // 平台首页推荐商品
  platformBrand = 'platformBrand', // 平台首页品牌馆
  platformMechant = 'platformMechant', // 平台首页实力商家
  platformInformation = 'platformInformation', // 平台首页行情资讯
  platformPurchase = 'platformPurchase', // 平台首页名企采购
  platformLogistics = 'platformLogistics', // 平台首页物流服务
  platformProcess = 'platformProcess', // 平台首页加工服务
  platformService = 'platformService', // 平台服务
  platformAddGoodsItem = 'platformAddGoodsItem', // 平台首页添加推荐商品
  platformCustom = 'platformCustom', // 平台自定义显示板块
  mobileCategoryNavItem = 'mobileCategoryNavItem', // 移动端分类导航子项
  marketingCardHeader = 'marketingCardHeader', //活动卡片标题栏
  marketingCardCoupon = 'marketingCardCoupon', //活动卡片优惠券
  marketingCardGood = 'marketingCardGood', //活动卡片商品
  marketingCardDetailItem = 'marketingCardDetailItem', //活动卡片商品详情及主购商品
  marketingCardGiveContainerItem = 'marketingCardGiveContainerItem', //活动卡片赠送优惠券/商品组件
  couponsModal = 'couponsModal', //c端优惠券弹窗
  bottomNavigation = 'bottomNavigation', //底部导航
  bottomNavigationItems = 'bottomNavigationItems', //底部导航子组件
  bannerItems = 'bannerItems', //广告图子组件
  mobileNavCardNavItem = 'mobileNavCardNavItem', //品类导航子组件
  suggestProductItems = 'suggestProductItems', //推荐商品子容器
  suggestProductCommodity = 'suggestProductCommodity', //推荐商品子容器商品
  mobileQualityCommodityList = 'mobileQualityCommodityList', // 优质推荐-商品
  mobileQualityShopList = 'mobileQualityShopList', // 优质推荐-店铺
  mobileQualityBrandList = 'mobileQualityBrandList', // 优质推荐-品牌
  mobileQualityInformationList = 'mobileQualityInformationList', // 优质推荐-资讯
  mobileElevatorNav = 'mobileElevatorNav', // 移动端电梯导航
  mobileMicroHeader = 'mobileMicroHeader', // 微页面头部
  mobileImageHotspot = 'mobileImageHotspot', // 图片热区
  activityCommodity = 'activityCommodity',
  specialCommodity = 'specialCommodity',
  suggestProductBrand = 'suggestProductBrand',
  suggestProductInformation = 'suggestProductInformation',
  suggestProductStore = 'suggestProductStore',
  addActivityGoodsItem = 'addActivityGoodsItem',
  /** 添加组件 */
  addComponentsButton = 'addComponentsButton',
  /** 轮播图片 */
  carouselBanner = 'carouselBanner',
  /** 横向广告 */
  horizontalBanner = 'horizontalBanner',
  /** 热区图片 */
  hotspotImage = 'hotspotImage',
  /** 富文本 */
  richText = 'richText',
  /** 商品楼层 */
  commodityFloor = 'commodityFloor',
  /** 商品楼层-带店铺楼层 */
  commodityStoreFloor = 'commodityStoreFloor',
  /** 行情资讯 */
  information = 'information',
  /** 辅助空白 */
  empty = 'empty',
  /** 发现更多 */
  findMore = 'findMore',
  /** 优惠券推荐 */
  coupon = 'coupon',
  /** 优惠券推荐 */
  horizontalCommodity = 'horizontalCommodity',
  /** 优惠券推荐 */
  verticalCommodity = 'verticalCommodity',
  /** 商城公共底部 */
  mallFooter = 'mallFooter',
}

/**
 * 属性类型定义
 */
export enum PROPS_TYPES {
  object = 'object',
  objectArray = 'objectArray',
  function = 'function',
  number = 'number',
  numberArray = 'numberArray',
  string = 'string',
  stringArray = 'stringArray',
  enum = 'enum',
  json = 'json',
  boolean = 'boolean',
}

export enum NODE_PROPS_TYPES {
  reactNode = 'reactNode',
  functionReactNode = 'functionReactNode',
}

/**
 * 全局配置类型定义
 */
interface ComponentsMapType {
  [componentName: string]: any
}

export type ComponentSchemasMapType = {
  [componentName: string]: ComponentSchemaType
}

export interface ConfigType {
  componentsMap: ComponentsMapType //所有的React原始组件
  //所有的组件配置汇总
  componentSchemasMap: ComponentSchemasMapType
  fetcher?: FetcherType
}

/**
 * 定义组件的分类数据结构，目的是为了更改的在组件预览面板做，组件的展示搜索与约束
 */

interface propType {
  [propName: string]: any
}

export interface ComponentCategoryType {
  // 组件预览面板为grid布局通过设置span值来分配各个组件中展示组件所占位置大小，数值0-24
  span?: number
  // 默认属性配置，组件预览面板会将默认属性分别展示出来，在拖拽组件时会携默认属性到页面中
  props?: propType[]
}

export interface ComponentInfoType {
  // 如果组件没有次级组件（次级组件定义类似Layout.Footer）
  //时就可以认定，分类名称即为组件名称
  span?: number
  props?: propType[]
  components?: {
    [componentName: string]: ComponentCategoryType | null
  }
}

export interface CategoryType {
  //组件分类，如果组件没有次级组件，并且无法为其设置默认属性，时可直接设置其值为null，类别名必须为组件名
  [category: string]: ComponentInfoType | null
}
