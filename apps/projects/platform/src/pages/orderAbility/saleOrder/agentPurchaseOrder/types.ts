/*
 * @Author: GHua
 * @Date: 2022-03-30 16:22:06
 * @LastEditTime: 2022-04-08 17:17:06
 * @LastEditors: GHua
 * @Description:
 */
export interface MemberItemType {
  /**
   * 数据id，用于前端页面多条数据勾选时的判别条件，不做为其他接口的参数
   */
  id: number
  /**
   * 会员Id
   */
  memberId: number
  /**
   * 会员名称
   */
  name: string
  /**
   * 会员角色Id
   */
  roleId: number
  /**
   * 会员角色名称
   */
  roleName: string
  /**
   * 会员类型名称
   */
  memberTypeName: string
  /**
   * 会员等级
   */
  level: number
  /**
   * 会员等级名称
   */
  levelTag: string
}

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
   * 商城类型:1.企业商城2.积分商城3.渠道商城4.渠道自有商城5.渠道积分商城6.采购门户7.物流服务门户8.加工服务门户9.行情资讯门户
   */
  type: number
  /**
   * 商城环境:1.web2.H53.小程序4.APP
   */
  environment: number
  /**
   * 商城属性:1.B端商城2.C端商城3.B端自营商城4.C端自营商城
   */
  property: number
  /**
   * 是否为自营商城：0.否；1.是；
   */
  isSelf: boolean
  /**
   * 是否由会员来运营行情资讯门户：0.否；1.是；
   */
  memberOperate: number
  /**
   * 是否开放商城MRO搜索权限：0.否；1.是；
   */
  openMro: number
  /**
   * 商城LOGO
   */
  logoUrl: string
  /**
   * 商城描述
   */
  describe: string
  /**
   * 状态1.有效0.无效
   */
  state: number
  /**
   * 商城子域名
   */
  url: string
  /**
   * 是否默认：0:否1.是
   */
  isDefault: number
  /**
   * 创建时间
   */
  createTime: number
}

export interface OptionType extends MemberItemType {
  value: string
  label: any
}

export interface AgentPurchaseOrderInfoType {
  shopId: number
  shopName: string
  type: number
  isChannel: boolean
  environment: number
  property: number
  isSelf: boolean
  memberOperate: number
  logoUrl: string
  memberId: number
  memberName: string
  memberLevel: number
  roleId: number
  orderId?: number
  storeId?: number
}
