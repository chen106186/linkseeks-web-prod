import { NAV_TYPE } from '@apps/design-ui'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export interface NavItemType {
  link: string
  name: string
  status: boolean
  type: number
  sort: number
}

export const getDefaultMenuData = () => {
  const menu = [
    {
      name: translate('web.resource.mall.nav-home'),
      key: 'Home',
      type: NAV_TYPE.mallHome,
      status: true,
      sort: 1,
    },
    {
      name: translate('web.resource.mall.nav-spotcommodity'),
      key: 'commodity',
      type: NAV_TYPE.commodity,
      status: true,
      sort: 2,
    },
    {
      name: translate('web.resource.mall.nav-inquiry'),
      key: 'inquery',
      type: NAV_TYPE.inquiry,
      status: true,
      sort: 3,
    },
    {
      name: translate('web.resource.mall.jifenduihuan'),
      key: 'points',
      type: NAV_TYPE.integral,
      status: true,
      sort: 4,
    },
    {
      name: translate('web.resource.mall.nav-info'),
      key: 'infomation',
      type: NAV_TYPE.info,
      status: true,
      sort: 5,
    },
    {
      name: translate('web.resource.mall.nav-about'),
      key: 'about',
      type: NAV_TYPE.aboutus,
      status: true,
      sort: 6,
    },
    // 企业采购
    {
      name: translate('web.resource.mall.nav-srm'),
      status: true,
      sort: 7,
      type: NAV_TYPE.srm,
      key: 'enterpriseProcurement',
    },
  ]
  return menu
}
