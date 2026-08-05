import { ISchema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const tableFormSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-mega-props': {},
      'x-component-props': {
        placeholder: translate('web.resource.system.liuchengguizemingcheng'),
        advanced: false,
        allowClear: true,
        align: 'flex-left',
      },
    },
  },
}
