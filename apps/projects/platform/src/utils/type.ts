import { getCommodityWebShopWebAll, getCommodityWebShopWebAllShop } from '@apps/apis'

export function isString(str: any): str is string {
  return typeof str === 'string'
}

// 分数转小数
export const toPoint = (percent: string) => {
  let str: any = percent.replace('%', '')
  str = str / 100
  return str
}

// 小数转分数
export const toPercent = (point: number) => {
  // let str = Number(point * 100).toFixed(1);
  let str: any = Number(point * 100)
  str += '%'
  return str
}

interface getShopListsParmasProps {
  /** 站点ID */
  siteId?: number
  /** 商城环境
   * 1.web 2.H5 3.小程序 4.APP
   */
  environment?: number
  /** 商城类型
   * 1.企业商城 2.积分商城 3.渠道商城 4.渠道自有商城 5.渠道积分商城 6.采购门户 7.物流服务门户 8.加工服务门户 9.行情资讯门户
   */
  type?: number
  /** 是否按当前会员类型筛选
   * 1 为是
   */
  isMemberType?: boolean
  /**
   * 会员ID
   */
  memberId?: number
  /**
   * 角色ID
   */
  roleId?: number
}

/**
 * 通过站点ID、商城类型、商城环境、是否当前登录会员—获取商城列表数据
 * @param params 接口参数
 */
export const fectchShopListsSource = async (params?: getShopListsParmasProps) => {
  if (getCommodityWebShopWebAll) {
    const { data } = await getCommodityWebShopWebAll({ ...params }, { ctlType: 'none' })
    return data
  }
}

/**
 * 同上 仅限交规规则模块适用
 * @param params 接口参数
 */
export const fectchShopListsSourceTradeRule = async (params?: getShopListsParmasProps) => {
  if (getCommodityWebShopWebAllShop) {
    const { data } = await getCommodityWebShopWebAllShop({ ...params }, { ctlType: 'none' })
    return data
  }
}
