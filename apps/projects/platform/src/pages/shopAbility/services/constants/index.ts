import { getWebIntl } from '@apps/locales'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
const translate = getWebIntl()
export const SHOP_STATUS_TYPE = {
  0: {
    name: translate('web.resource.shop.weikaidian'),
    background: '#F5F6F7',
    color: '#5C626A',
  },
  1: {
    name: translate('web.resource.shop.jingyingzhong'),
    background: '#EBF9F6',
    color: '#00A98F',
  },
}
