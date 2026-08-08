import { ISchema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
export const querySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'controllerBtns',
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: translate('web.resource.commodity.liuchengguizeName'),
                advanced: false,
              },
            },
          },
        },
      },
    },
  },
}
