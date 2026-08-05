import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
export const searchSchema: ISchema = {
  type: 'object',
  properties: {
    searchWrap: {
      type: 'object',
      'x-component': 'Mega-Layout',
      'x-component-props': {
        grid: true,
      },
      properties: {
        actions: {
          type: 'object',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{Actions}}',
          },
        },
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.sousuo' }),
            advanced: false,
            tip: getIntl().formatMessage({ id: 'stockSellStorage.shurudanjumingcheng' }),
          },
        },
      },
    },
  },
}
