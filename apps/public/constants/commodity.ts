import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
/**
 * 商品品类类型
 */
export enum COMMODITY_CATEGORY_TYPE_ENUM {
  /**
   * 实物商品
   */
  SHIWU = 1,

  /**
   * 虚拟商品
   */
  XUNI = 2,

  /**
   * 服务商品
   */
  FUWU = 3,

  /**
   * 积分兑换商品
   */
  JIFENDUIHUAN = 4,
}

export const COMMODITY_CATEGORY_TYPE_MAPS = {
  [COMMODITY_CATEGORY_TYPE_ENUM.SHIWU]: translate('web.resource.commodity.shiwushanpin'),
  [COMMODITY_CATEGORY_TYPE_ENUM.XUNI]: translate('web.resource.commodity.xunishanpin'),
  [COMMODITY_CATEGORY_TYPE_ENUM.FUWU]: translate('web.resource.commodity.fuwushanpin'),
  [COMMODITY_CATEGORY_TYPE_ENUM.JIFENDUIHUAN]: translate('web.resource.commodity.jifenduihuanshanping'),
}
