export enum TEMPLATE_TYPE_ENUM {
  /** 平台首页模板 */
  platform = 'platform',
  /** 商城模板 */
  mall = 'mall',
  /** 店铺模板 */
  shop = 'shop',
  /** 商品描述模板 */
  goods = 'goods',
  /** 活动模板 */
  activity = 'activity',
}

/**
 * 商城环境
 */
export const EnvironmentStatus = {
  1: {
    name: 'web',
  },
  2: {
    name: 'H5',
  },
  3: {
    name: '小程序',
  },
  4: {
    name: 'APP',
  },
}

/**
 * 商城环境选项
 * 适用环境: 0.全部 1.WEB 2.H5 3.小程序 4.APP
 */
export const ENVIRONMENT_OPTIONS = [
  {
    key: '0',
    label: '全部',
  },
  {
    key: '1',
    label: 'WEB',
  },
  {
    key: '2',
    label: 'H5',
  },
  {
    key: '3',
    label: '小程序',
  },
  {
    key: '4',
    label: 'APP',
  },
]
