import { ISchema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
const translate = getWebIntl()
export const querySchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component': 'Search',
      'x-component-props': {
        placeholder: translate('web.common.search'),
        align: 'flex-left',
        tip: translate('web.resource.member.tip_kehumingchen'),
        advanced: false,
      },
    },
  },
}
