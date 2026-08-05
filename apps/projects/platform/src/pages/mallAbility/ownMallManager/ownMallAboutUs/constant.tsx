import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const PAGE_TYPE = {
  1: intl.formatMessage({ id: 'own.constant.page.type_1' }),
  2: intl.formatMessage({ id: 'own.constant.page.type_2' }),
  3: intl.formatMessage({ id: 'own.constant.page.type_3' }),
}

export const PAGE_TYPE_OPTIONS = [
  { label: intl.formatMessage({ id: 'own.constant.page.type_1' }), value: 1 },
  { label: intl.formatMessage({ id: 'own.constant.page.type_1' }), value: 2 },
  { label: intl.formatMessage({ id: 'own.constant.page.type_1' }), value: 3 },
]
