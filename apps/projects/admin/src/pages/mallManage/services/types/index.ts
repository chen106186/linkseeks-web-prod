export interface MallItemType {
  /**
   * 商城ID
   */
  id: number
  /**
   * 商城名称
   */
  name: string
  /**
   * 商城类型: 1.企业商城 2.积分商城 3.渠道商城 4.渠道自有商城 5.渠道积分商城 6.采购门户 7.物流服务门户 8.加工服务门户 9.行情资讯门户
   */
  type: number
  /**
   * 商城环境：1-web 2-H5 3-小程序 4-APP
   */
  environment: number
  /**
   * 是否默认：false:否 true.是
   */
  isDefault: boolean
  /**
   * 商城描述
   */
  describe: string
  /**
   * 商城子域名
   */
  url: string
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 国家(地区)id
   */
  countryId: number
  /**
   * 语言id
   */
  languageId: number
  /**
   * 币种id
   */
  currencyId: number
  /**
   * 国家(地区)
   */
  country: string
  /**
   * 语言
   */
  language: string
  /**
   * 币种
   */
  currency: string
  /**
   * 商城logo
   */
  logoUrl: string
  /**
   * 商城属性: 1.B端商城 2.C端商城 3.B端自营商城 4.C端自营商城
   */
  property: number
  /**
   * 状态 1.有效 0.无效
   */
  state: number
  enabled: boolean
  /**
   * 装修ID
   */
  adornId: number
  isOpenMro: boolean
}

export interface SelfMallItemType {
  /**
   * 自营商城模型id
   */
  id: number
  /**
   * 商城名称
   */
  name: string
  /**
   * 商城环境:1.web 2.H5 3.小程序 4.APP
   */
  environment: number
  /**
   * 商城属性: 1.B端商城 2.C端商城
   */
  property: number
  /**
   * 商城LOGO
   */
  logoUrl: string
  /**
   * 商城描述
   */
  describe: string
  /**
   * 币种
   */
  currencyId: number
  /**
   * 国家
   */
  countryId: number
  /**
   * 语言
   */
  languageId: number
  /**
   * 币种
   */
  currencyName: string
  /**
   * 国家
   */
  countryName: string
  /**
   * 语言
   */
  languageName: string
}

export interface MallFormType {
  id: number
  shopId: number
  describe: string
  logoUrl: string
  name: string
  isOpenMro: boolean
  isDefault: boolean
}

export interface PortalItemType {
  /**
   * 装修ID
   */
  adornId: number | null
  /**
   * 商城ID
   */
  id: number
  /**
   * 商城名称
   */
  name: string
  /**
   * 商城类型: 1.企业商城 2.积分商城 3.渠道商城 4.渠道自有商城 5.渠道积分商城 6.采购门户 7.物流服务门户 8.加工服务门户 9.行情资讯门户
   */
  type: number
  /**
   * 商城环境：1-web 2-H5 3-小程序 4-APP
   */
  environment: number
  /**
   * 是否默认：false:否 true.是
   */
  isDefault: boolean
  /**
   * 商城描述
   */
  describe: string
  /**
   * 商城子域名
   */
  url: string
  /**
   * 创建时间
   */
  createTime: number
}
