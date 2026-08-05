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

export interface Web {
  shopInfo: ShopInfo[]
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

export interface Global {
  siteInfo: SiteInfo
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
  web: Web
  global: Global
  publicSelect: PublicSelect
}
