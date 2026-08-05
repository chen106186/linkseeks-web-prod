import { NAV_TYPE } from '@apps/design-ui'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const DEFAULT_SYSTEM_NAV = [
  NAV_TYPE.mallHome,
  NAV_TYPE.commodity,
  NAV_TYPE.inquiry,
  NAV_TYPE.srm,
  NAV_TYPE.integral,
  NAV_TYPE.info,
  NAV_TYPE.aboutus,
]

export const NAV_TYPE_OPTION = [
  {
    value: NAV_TYPE.customLink,
    label: translate('web.resource.mall.nav-customlink'),
  },
  {
    value: NAV_TYPE.keyword,
    label: translate('web.resource.mall.nav-keyword'),
  },
  {
    value: NAV_TYPE.marketing,
    label: translate('web.resource.mall.nav-marketing'),
  },
  {
    value: NAV_TYPE.cpecialPage,
    label: translate('web.resource.marketing.zhuantiye'),
  },
  {
    value: NAV_TYPE.category,
    label: translate('web.resource.mall.nav-category'),
  },
  {
    value: NAV_TYPE.commodityDetail,
    label: translate('web.resource.mall.nav-commoditydetail'),
  },
  {
    value: NAV_TYPE.mallHome,
    label: translate('web.resource.mall.nav-home'),
  },
  {
    value: NAV_TYPE.commodity,
    label: translate('web.resource.mall.spotCommodity'),
  },
  {
    value: NAV_TYPE.inquiry,
    label: translate('web.resource.mall.nav-inquiry'),
  },
  {
    value: NAV_TYPE.srm,
    label: translate('web.resource.mall.nav-srm'),
  },
  {
    value: NAV_TYPE.integral,
    label: translate('web.resource.mall.jifenduihuan'),
  },
  {
    value: NAV_TYPE.info,
    label: translate('web.resource.mall.nav-info'),
  },
  {
    value: NAV_TYPE.aboutus,
    label: translate('web.resource.mall.nav-about'),
  },
]

export const getTypeName = (type: number, name?: string) => {
  const showNameType = [NAV_TYPE.category, NAV_TYPE.commodityDetail, NAV_TYPE.marketing]
  const findItem = NAV_TYPE_OPTION.find((item) => item.value === type)
  if (findItem) {
    if (showNameType.includes(findItem.value) && name) {
      return `${findItem.label}: ${name}`
    }
    return findItem.label
  }
  return ''
}
