import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
export const SUPPLIER_MODIFIES_BASIC = 'SUPPLIER_MODIFIES_BASIC'

export const SUPPLIER_MODIFIES_ASSESSMENT_PROJECT = 'SUPPLIER_MODIFIES_ASSESSMENT_PROJECT'

export const SUPPLIER_MODIFIES_ASSESSMENT_RESULT = 'SUPPLIER_MODIFIES_ASSESSMENT_RESULT'

export const SUPPLIER_MODIFIES_ASSESSMENT_HISTORY = 'SUPPLIER_MODIFIES_ASSESSMENT_HISTORY'

export const SUPPLIER_MODIFIES_ASSESSMENT_SUPPLYLIST = 'SUPPLIER_MODIFIES_ASSESSMENT_SUPPLYLIST'

export const anchorsArr = [
  {
    key: SUPPLIER_MODIFIES_BASIC,
    label: translate('web.common.jibenxinxi'),
  },
  {
    key: SUPPLIER_MODIFIES_ASSESSMENT_PROJECT,
    label: translate('web.resource.member.kaopinxiangmu'),
  },
  {
    key: SUPPLIER_MODIFIES_ASSESSMENT_RESULT,
    label: translate('web.resource.member.kaopinjieguo'),
  },
  {
    key: SUPPLIER_MODIFIES_ASSESSMENT_HISTORY,
    label: translate('web.resource.member.kaopinjilu'),
  },
  {
    key: SUPPLIER_MODIFIES_ASSESSMENT_SUPPLYLIST,
    label: translate('web.resource.commodity.huoyuanqingdan'),
  },
]
