import { getWebIntl } from '@apps/locales'
import { NAV_TYPE } from '@apps/design-ui'

const translate = getWebIntl()

export const getMenuData = () => {
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
      name: '寻源',
      key: 'askPurchase',
      type: NAV_TYPE.askPurchase,
      status: true,
      sort: 4,
    },
    {
      name: '优选店铺',
      key: 'stores',
      type: NAV_TYPE.stores,
      status: true,
      sort: 5,
    },
    {
      name: translate('web.resource.mall.jifenduihuan'),
      key: 'points',
      type: NAV_TYPE.integral,
      status: true,
      sort: 6,
    },
    {
      name: translate('web.resource.mall.nav-info'),
      key: 'infomation',
      type: NAV_TYPE.info,
      status: true,
      sort: 7,
    },
    {
      name: translate('web.resource.mall.nav-srm'),
      status: true,
      sort: 8,
      type: NAV_TYPE.srm,
      key: 'enterpriseProcurement',
    },
  ]
  return menu
}
