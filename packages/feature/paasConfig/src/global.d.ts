export interface BusinessType {
  businessTypeId: number
  businessTypeName: string
}

export interface UseType {
  memberTypeId: number
  memberTypeName: string
  businessTypes: BusinessType[]
}

export interface UserRegister {
  useType: UseType[]
}

export interface ShopInfo {
  id: number
  name: string
  type: number
  environment: number
  property: number
  self: number
  memberOperate: number
  openMro?: any
  logoUrl: string
  describe: string
  state: number
  url: string
  isDefault: number
  createTime: number
}

export interface OrderMode {
  id: number
  platformType: number
  platformWayName: string
  isPitchOn: number
  platformTypeName: string
}

export interface OrderType {
  id: number
  platformType: number
  platformWayName: string
  isPitchOn: number
  platformTypeName: string
}

export interface Web {
  shopInfo: ShopInfo[]
  orderMode: OrderMode[]
  orderType: OrderType[]
}

export interface SiteInfo {
  id: number
  name: string
  logo: string
  siteUrl: string
  symbol: string
  language: string
  enableMultiTenancy: number
}

export interface ParamConfigList {
  code: string
  value: string
  description?: any
}

export interface ImConfig {
  id: number
  platformName: string
  type: number
  paramConfigList: ParamConfigList[]
}

export interface Global {
  siteInfo: SiteInfo
  imConfig: ImConfig
}

export interface SiteList {
  name: string
  key: string
  icon: string
}

export interface PublicSelect {
  siteList: SiteList[]
}

export interface RootObject {
  userRegister: UserRegister
  web: Web
  global: Global
  publicSelect: PublicSelect
}
