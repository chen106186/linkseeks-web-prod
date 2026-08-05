export enum NAV_TYPE {
  /** 商城首页 */
  mallHome = 1,
  /** 现货商品 */
  commodity,
  /** 询价商品 */
  inquiry,
  /** 企业采购 */
  srm,
  /** 积分兑换 */
  integral,
  /** 行情资讯 */
  info,
  /** 关于我们 */
  aboutus,
  /** 自定义链接 */
  customLink,
  /** 关键字搜索 */
  keyword,
  /** 营销活动页 */
  marketing,
  /** 商品品类页 */
  category,
  /** 商品详情页 */
  commodityDetail,
  /** 求购 */
  askPurchase,
  /** 优选店铺 */
  stores,
  /** 专题页 */
  cpecialPage,
}

export const DEFAULT_SYSTEM_NAV = [
  NAV_TYPE.mallHome,
  NAV_TYPE.commodity,
  NAV_TYPE.inquiry,
  NAV_TYPE.srm,
  NAV_TYPE.integral,
  NAV_TYPE.info,
  NAV_TYPE.aboutus,
]

/** 平台首页 */
export enum PLATFORM_DESIGN_COMPONENT {
  /** 导航组件 */
  MallMainNav = 'MallMainNav',
  /** 轮播广告图 */
  PlatformAdvert = 'PlatformAdvert',
  /** 快捷导航 */
  PlatformQuickNav = 'PlatformQuickNav',
  /** 商品推荐 */
  PlatformGoods = 'PlatformGoods',
  /** 品牌推荐 */
  PlatformBrand = 'PlatformBrand',
  /** 商家推荐 */
  PlatformMerchant = 'PlatformMerchant',
  /** 行情资讯 */
  PlatformInformation = 'PlatformInformation',
  /** 名企采购 */
  PlatformPurchase = 'PlatformPurchase',
  /** 名企采购广告 */
  'PlatformPurchase.Banner' = 'PlatformPurchase.Banner',
  /** 物流服务 */
  PlatformLogistics = 'PlatformLogistics',
  /** 加工服务 */
  PlatformProcess = 'PlatformProcess',
  /** 平台服务 */
  PlatformService = 'PlatformService',
}

/** web装修组件枚举 */
export enum WEB_DESIGN_COMPONENT {
  /** 最外层父组件 */
  WrapLayout = 'WrapLayout',
  /** 自营导航组件 */
  OwnMainNav = 'OwnMainNav',
  /** 店铺导航组件 */
  MainNav = 'MainNav',
  /** 联营商城导航组件 */
  MallMainNav = 'MallMainNav',
  /** 自营内置广组件 */
  OwnBanner = 'OwnBanner',
  /** 联营内置广组件 */
  Advert = 'Advert',
  /** 轮播图组件 */
  CarouselBanner = 'CarouselBanner',
  /** 横向广告组件 */
  HorizontalBanner = 'HorizontalBanner',
  /** 空白辅助 */
  Empty = 'Empty',
  /** 富文本 */
  RichText = 'RichText',
  /** 图片热区 */
  HotspotImage = 'HotspotImage',
  /** 商品楼层 */
  CommodityFloor = 'CommodityFloor',
  /** 商品楼层-带店铺推荐 */
  CommodityStoreFloor = 'CommodityStoreFloor',
  /** 行情资讯 */
  Information = 'Information',
  /** 发现更多 */
  FindMore = 'FindMore',
  /** 公司信息 */
  CompanyInfo = 'CompanyInfo',
  /** 公司相册 */
  Album = 'Album',
  /** 荣誉资质 */
  HonroPic = 'HonroPic',
  /** 优惠券推荐 */
  Coupon = 'Coupon',
  /** 商品推荐（横向） */
  HorizontalCommodity = 'HorizontalCommodity',
  /** 商品推荐（纵向） */
  VerticalCommodity = 'VerticalCommodity',
  /** 商城底部 */
  Footer = 'Footer',
}

/** 移动端装修组件枚举 */
export enum MOBILE_DESIGN_COMPONENT {
  /** 头部导航 */
  HeaderNav = 'HeaderNav',
  ChannelHeaderNav = 'ChannelHeaderNav',
  /** 轮播广告组件 */
  Banner = 'Banner',
  /** 分类导航 */
  MobileNavCard = 'MobileNavCard',
  /** 橱窗广告 */
  ShowCaseBanner = 'ShowCaseBanner',
  /** 行情资讯 */
  InformationCard = 'InformationCard',
  /** 店铺推荐组件 */
  RecommendShop = 'RecommendShop',
  /** 推荐组件 */
  SuggestProduct = 'SuggestProduct',
  /** 底部导航 */
  BottomNavigation = 'BottomNavigation',
  /** 品牌推荐 */
  MobileBrand = 'MobileBrand',
  /** 优惠券弹窗 */
  CouponsModal = 'CouponsModal',
  /** 营销活动 */
  MarketingCard = 'MarketingCard',
  /** 店铺头部 */
  MobileShopHeader = 'MobileShopHeader',
  /** 店铺推荐商品 */
  MobileShopCommodity = 'MobileShopCommodity',
}

export * from './advert'
export * from './commodity'
export * from './marketing'
