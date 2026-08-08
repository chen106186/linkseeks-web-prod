import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const SUPPLIER_EVALUATIONS_BASIC = 'SUPPLIER_EVALUATIONS_BASIC'

export const SUPPLIER_EVALUATIONS_ASSESSMENT_PROJECT = 'SUPPLIER_EVALUATIONS_ASSESSMENT_PROJECT'

export const SUPPLIER_EVALUATIONS_ASSESSMENT_RESULT = 'SUPPLIER_EVALUATIONS_ASSESSMENT_RESULT'

export const SUPPLIER_EVALUATIONS_ASSESSMENT_HISTORY = 'SUPPLIER_EVALUATIONS_ASSESSMENT_HISTORY'

export const SUPPLIER_EVALUATIONS_ASSESSMENT_SUPPLYLIST = 'SUPPLIER_EVALUATIONS_ASSESSMENT_SUPPLYLIST'

export const anchorsArr = [
  {
    key: SUPPLIER_EVALUATIONS_BASIC,
    label: translate('web.common.jibenxinxi'),
  },
  {
    key: SUPPLIER_EVALUATIONS_ASSESSMENT_PROJECT,
    label: translate('web.resource.member.kaopinjilu'),
  },
  {
    key: SUPPLIER_EVALUATIONS_ASSESSMENT_RESULT,
    label: translate('web.resource.member.kaopinjieguo'),
  },
]
