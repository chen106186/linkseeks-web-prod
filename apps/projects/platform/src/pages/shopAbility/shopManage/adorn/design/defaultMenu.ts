import { NAV_TYPE } from '@apps/design-ui'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const menuData = [
  {
    name: intl.formatMessage({ id: 'editor.channel.menu.home' }),
    status: true,
    sort: 1,
    type: NAV_TYPE.mallHome,
    key: 'shopHome',
  },
  {
    name: intl.formatMessage({ id: 'editor.own.menu.commodity' }),
    status: true,
    sort: 2,
    type: NAV_TYPE.commodity,
    key: 'shopCommodity',
  },
  {
    name: intl.formatMessage({ id: 'editor.own.menu.inquery' }),
    status: true,
    sort: 3,
    type: NAV_TYPE.inquiry,
    key: 'shopPointsMall',
  },
  {
    name: intl.formatMessage({ id: 'editor.own.menu.integral' }),
    status: true,
    sort: 4,
    type: NAV_TYPE.integral,
    key: 'shopInfomation',
  },
  {
    name: intl.formatMessage({ id: 'editor.own.menu.about' }),
    status: true,
    sort: 5,
    type: NAV_TYPE.aboutus,
    key: 'shopAbout',
  },
]
