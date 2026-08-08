import { PostCommodityMobileShopMobileAllResponse } from '@apps/apis'

/** 当前商城信息 */
export type ShopInfoType = {
  /**
   * 商城ID
   */
  id: number
  /**
   * 会员ID
   */
  memberId: number
  /**
   * 会员角色ID
   */
  memberRoleId: number
  /**
   * 商城名称
   */
  name: string
  /**
   * 是否为自营商城：0.否；1.是；
   */
  isSelf: boolean
  /**
   * 商城LOGO
   */
  logoUrl: string
  /**
   * 是否由会员来运营行情资讯门户：0.否；1.是；
   */
  isMemberOperate: boolean
  /**
   * 商城属性: 1.B端商城 2.C端商城
   */
  property: number
}

export type userInfoType = {
  account?: string
  memberName?: string
  telCode?: string
  idCardNo?: string
  logo?: string
  email?: string
  memberId?: number
  memberRoleId?: number
  memberRoleName?: string
  userName: string
  orgName?: string
  phone?: string
  token?: string
  tokenExpireMinutes?: number
  urls?: string[]
  userId: number
  memberType?: number
  jobTitle?: string
  roles: {
    roleId: number
    roleName: string
  }[]
  imFlag?: boolean
}
export type AddressItem = {
  fullAddress: string
  id: number
  isDefault: number
  phone: string
  tel: string
  receiverName: string
  postalCode: string
}

export type SuperiorChannelItemType = {
  id: number
  inviteCode: string
  shopId: number
  memberId: number
  memberName: string
  logo: string
  roleId: number
}

export type MallInfoType = PostCommodityMobileShopMobileAllResponse[0]

/**
 * 自营商城信息
 */
export interface SelfMallInfoType {
  id: number
  logoUrl: string
  memberId: number
  memberName: string
  memberRoleId: number
  name: string
  property?: number
  url: string
  /** 用户自营商城id(商城规则详情表id) */
  shopRuleDetailId: number
}

/** 发票信息 */
export interface InvoiceType {
  account: string
  address: string
  bankOfDeposit: string
  createRoleId: number
  createTime: number
  id: number
  invoiceTitle: string
  isDefault: 0 | 1 | number
  kind: number
  memberId: number
  taxNo: string
  tel: string
  type: number
  updateTime: number
}

export interface UserStoreModel {
  /** 当前终端类型所有的商城集合 */
  allMallList: PostCommodityMobileShopMobileAllResponse
  /** 请求接口获取商城集合 */
  fetchAllMallList: () => void
  /** 从storage缓存获取商城集合 */
  fetchStoreAllMallList: () => void
  /** 当前商城信息 */
  shopAndSite: null | ShopInfoType
  /** 设置当前商城信息 */
  setShopAndSite: (data: ShopInfoType) => void
  /** 当前用户信息 */
  userInfo: null | userInfoType
  /** 清空当前用户信息 */
  removeUserInfo: () => void
  /** 设置当前用户信息 */
  setUserInfo: (data: any) => void
  /** 接口获取用户信息并写入storage缓存 */
  refreshUserInfo: () => void
  /** 临时存储地址的item */
  addressItem: any
  /** 设置临时存储地址的item */
  setAddressItem: (data: any) => void
  /** 启动页图片地址 */
  splashImageUrl: string
  /** 设置启动页图片地址 */
  setSplashImage: (imageUrl: string) => void
  /** 引动页图片地址 */
  guaidListUrl: string[]
  /** 设置引动页图片地址 */
  setGuaidImageList: (imageUrl: string[]) => void
  /** 临时存储的发票信息 */
  invoiceInfo: InvoiceType | null
  /** 设置临时存储的发票信息 */
  setInvoiceInfo: (invoice: InvoiceType | null) => void
  mallList: any[]
  currentMall: any
  setMallList: (mallList: any[]) => void
  setCurrentMall: (mall: any) => void
  imReady: boolean
}
