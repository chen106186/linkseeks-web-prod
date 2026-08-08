import { NavItemType } from '@/types/global'
import { NAV_TYPE } from '@apps/design-ui'

/**
 * 获取联营默认菜单
 */
export const getJointDefaultMenu = (): NavItemType[] => {
  return [
    {
      link: '/',
      name: 'web.resource.mall.nav-home', // 商城首页
      status: true,
      sort: 1,
      type: NAV_TYPE.mallHome,
      key: 'mallHome',
    },
    {
      link: `/commodity`,
      name: 'web.resource.mall.nav-spotcommodity', // 现货商品
      status: true,
      sort: 2,
      type: NAV_TYPE.commodity,
      key: 'commodity',
    },
    {
      link: `/inquiry`,
      name: 'web.resource.mall.nav-inquiry', // 询价商品
      status: true,
      sort: 3,
      type: NAV_TYPE.inquiry,
      key: 'inquiry',
    },
    {
      link: '/askPurchase',
      name: 'web.resource.mall.nav-askPurchase', // 求购
      status: true,
      sort: 4,
      type: NAV_TYPE.askPurchase,
      key: 'askPurchase',
    },
    {
      link: `/stores`,
      name: 'web.resource.mall.nav-stores', // 优选店铺
      status: true,
      sort: 5,
      type: NAV_TYPE.stores,
      key: 'stores',
    },
    {
      link: `/integral`,
      name: 'web.resource.mall.nav-integral', // 积分商城
      key: 'integral',
      type: NAV_TYPE.integral,
      status: true,
      sort: 6,
    },
    {
      name: 'web.resource.mall.nav-info', // 行情资讯
      status: true,
      sort: 7,
      type: NAV_TYPE.info,
      key: 'info',
    },
    {
      name: 'web.resource.mall.nav-srm', // 企业采购
      status: true,
      sort: 8,
      type: NAV_TYPE.srm,
      key: 'srm',
    },
  ]
}

/**
 * 获取自营默认菜单
 */
export const getOwnDefaultMenu = (): NavItemType[] => {
  return [
    {
      name: 'web.resource.mall.nav-home',
      status: true,
      sort: 1,
      type: NAV_TYPE.mallHome,
      key: 'ownallHome',
    },
    {
      name: 'web.resource.mall.nav-spotcommodity',
      status: true,
      sort: 2,
      type: NAV_TYPE.commodity,
      key: 'commodity',
    },
    {
      name: 'web.resource.mall.nav-inquiry',
      status: true,
      sort: 3,
      type: NAV_TYPE.inquiry,
      key: 'inquiry',
    },
    {
      name: 'web.resource.mall.jifenduihuan',
      key: 'integral',
      type: NAV_TYPE.integral,
      status: true,
      sort: 4,
    },
    {
      name: 'web.resource.mall.nav-about',
      status: true,
      sort: 5,
      type: NAV_TYPE.aboutus,
      key: 'info',
    },
    {
      name: 'web.resource.mall.nav-info',
      status: true,
      sort: 6,
      type: NAV_TYPE.info,
      key: 'info',
    },
    {
      name: 'web.resource.mall.nav-srm',
      status: true,
      sort: 7,
      type: NAV_TYPE.srm,
      key: 'srm',
    },
  ]
}

/**
 * 获取店铺默认菜单
 */
export const getStoreDefaultMenu = (): NavItemType[] => {
  return [
    {
      name: 'web.resource.home.shou-ye',
      status: true,
      sort: 1,
      type: NAV_TYPE.mallHome,
      key: 'ownallHome',
    },
    {
      name: 'web.resource.mall.nav-spotcommodity',
      status: true,
      sort: 2,
      type: NAV_TYPE.commodity,
      key: 'commodity',
    },
    {
      name: 'web.resource.mall.nav-inquiry',
      status: true,
      sort: 3,
      type: NAV_TYPE.inquiry,
      key: 'inquiry',
    },
    {
      name: 'web.resource.mall.jifenduihuan',
      key: 'integral',
      type: NAV_TYPE.integral,
      status: true,
      sort: 4,
    },
    {
      name: 'web.resource.mall.nav-about',
      status: true,
      sort: 5,
      type: NAV_TYPE.aboutus,
      key: 'info',
    },
  ]
}
