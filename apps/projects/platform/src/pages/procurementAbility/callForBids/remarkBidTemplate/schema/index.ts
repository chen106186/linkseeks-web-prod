import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/**
 * 除了订单必填字段, 默认
 */
export const tableListSchema: ISchema = {
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
            placeholder: intl.formatMessage({ id: 'table.purchase.name' }),
            advanced: false,
          },
        },
      },
    },
  },
}
