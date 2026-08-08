import {
  GetCommodityWebMemberPurchaseWebMemberPurchaseMainResponse,
  GetCommodityWebStoreWebMemberShopMainResponse,
} from '@apps/apis'

/**
 * 商城类型
1 :ENTERPRISE
2 :PURCHASE
3 :LOGISTICS
4 :PROCESS
5 :INFORMATION
6 :MAIN_PORTAL
7 :SCORE
 */
export enum MALL_TYPE {
  ENTERPRISE = 1,
  PURCHASE,
  LOGISTICS,
  PROCESS,
  INFORMATION,
  MAIN_PORTAL,
  SCORE,
}

export interface MallInfoType {
  adornId: number
  id: number
  name: string
  logoUrl: string
  url: string
  describe: string
  memberId?: number
  memberName?: string
  memberRoleId?: number
  /**
   * 商城类型
   * 1 :ENTERPRISE
   * 2 :PURCHASE
   * 3 :LOGISTICS
   * 4 :PROCESS
   * 5 :INFORMATION
   * 6 :MAIN_PORTAL
   * 7 :SCORE
   */
  type: number
  /** 商城环境:1.web2.H53.小程序4.APP */
  environment: number
  /** 是否开放商城MRO搜索权限：0.否；1.是； */
  isOpenMro?: boolean
  /** 是否会员自营 */
  isMemberOperate?: boolean
  /** 是否默认 */
  isDefault?: boolean
  /** 启用状态 */
  state?: number
  /** 商城属性 */
  property?: number
  /** 是否自营商城 */
  isSelf?: boolean
}

export enum LAYOUT_TYPE {
  /**
   * 联营商城
   */
  joint = 'joint',
  /**
   * 自营商城
   */
  own = 'own',
  /**
   * 店铺（店铺商城）
   */
  shop = 'shop',
  /**
   * 联营积分兑换
   */
  jointScore = 'jointScore',
  /**
   * 积分兑换
   */
  ownScore = 'ownScore',
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
   * 活动页面
   */
  activity = 'activity',
  /**
   * 采购门户
   */
  srm = 'srm',
  /**
   * 采购公示
   */
  srmPublicity = 'srmPublicity',
  /**
   * 名企采购
   */
  srmEnterprise = 'srmEnterprise',
  /**
   * 采购门户主页
   */
  shopIndex = 'shopIndex',
  /**
   * 物流门户
   */
  logistics = 'logistics',
  /**
   * 加工门户
   */
  process = 'process',
  /**
   * 主门户
   */
  mainPortal = 'mainPortal',
}

export interface UserInfoType {
  /**
   * 会员Id
   */
  memberId: number
  /**
   * 会员角色Id
   */
  memberRoleId: number
  /**
   * 会员名称（公司名称）
   */
  memberName: string
  /**
   * 会员角色列表，用于切换角色
   */
  roles: {
    /**
     * 会员角色Id
     */
    roleId: number
    /**
     * 会员角色名称
     */
    roleName: string
    /**
     * 会员角色类型，1-服务提供者，2-服务消费者
     */
    roleType: number
  }[]
  /**
   * 会员角色名称
   */
  roleName: string
  /**
   * 用户当前的会员类型：1-企业会员，2-企业个人会员
   */
  memberType: number
  /**
   * 用户当前的会员角色类型：1-服务提供者，2-服务消费者
   */
  memberRoleType: number
  /**
   * 角色标签: 1.客户 2.供应商 3.上游供应商 4.物流商
   */
  roleTag: number
  /**
   * 会员等级
   */
  level: number
  /**
   * 等级名称
   */
  levelTag: string
  /**
   * 平台积分
   */
  score: number
  /**
   * 平台会员信用积分
   */
  creditPoint: number
  /**
   * 会员Logo Url
   */
  logo: string
  /**
   * 审核状态枚举： 0-待提交审核，1-待审核，2-审核不通过， 3-审核通过
   */
  validateStatus: number
  /**
   * 审核状态描述
   */
  validateStatusDesc: string
  /**
   * 审核信息
   */
  validateMsg: string
  /**
   * 用户id
   */
  userId: number
  /**
   * 用户账号
   */
  account: string
  /**
   * 用户姓名
   */
  userName: string
  /**
   * 用户手机号码
   */
  phone: string
  /**
   * 部门id
   */
  orgId: number
  /**
   * 部门名称
   */
  orgName: string
  /**
   * 需要更新密码的时间间隔(小于等于0则不生效)
   */
  updatePwdIntervalDays: number
  /**
   * 用户AccessToken
   */
  accessToken: string
  /**
   * 用户RefreshToken
   */
  refreshToken: string
}

export interface CityItemType {
  cityCode: string
  cityName: string
}

export interface SelectAreaItemType {
  provinceCode: string
  provinceName: string
  cityList?: CityItemType[]
  cityCode: string
  cityName: string
  districtCode?: string
  districtName?: string
}

export interface NavItemType {
  name: string
  link?: string
  status: boolean
  type: number
  key?: string
  sort: number
}

export interface MallUrl {
  defaultEnterprise: MallInfoType | undefined
  defaultEnterpriseUrl: string
  infoPortal: MallInfoType | undefined
  infoUrl: string
  srmPortal: MallInfoType | undefined
  srmUrl: string
  mainPortal: MallInfoType | undefined
  mainPortalUrl: string
  logisticsPortal: MallInfoType | undefined
  logisticslUrl: string
  processPortal: MallInfoType | undefined
  processlUrl: string
}

export interface LoaderDataType {
  params: Record<string, any>
  url: string
  search: string
  href: string
  pathname: string
  layoutType: LAYOUT_TYPE
  mallInfo: MallInfoType
  mallList: MallInfoType[]
  mallUrl: MallUrl
  navList: NavItemType[]
  designConfig: Record<string, any> | undefined
  footerDesignConfig: Record<string, any> | undefined
  shopInfo:
    | (GetCommodityWebStoreWebMemberShopMainResponse & GetCommodityWebMemberPurchaseWebMemberPurchaseMainResponse)
    | undefined
  userInfo: UserInfoType | undefined
}

export interface ApplyStateType {
  /**
   * 是否显示按钮
   */
  show: boolean
  /**
   * 是否禁用按钮
   */
  disabled: boolean
  /**
   * 状态枚举：0-正常（继续申请流程），1-入库审核中，2-已入库审核通过，3-淘汰，4-黑名单, 5-不符合条件不能申请，6-不显示按钮
   */
  status: number
  /**
   * “申请成为会员”按钮的文字
   */
  value: string
  /**
   * 跳转查看会员详情页面所需要的参数，不能跳转的时候此值为0
   */
  validateId: number
}
