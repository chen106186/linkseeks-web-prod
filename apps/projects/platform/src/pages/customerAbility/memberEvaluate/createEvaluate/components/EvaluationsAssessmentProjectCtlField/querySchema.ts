import { ISchema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        columns: 1,
      },
      properties: {
        templateName: {
          type: 'string',
          'x-mega-props': {
            wrapperCol: 12,
          },
          'x-component': 'Search',
          'x-component-props': {
            placeholder: translate('web.common.search'),
            align: 'flex-left',
            tip: translate('web.resource.member.shurupingfenmubanmingcheng'),
            advanced: false,
          },
        },
      },
    },
  },
}
