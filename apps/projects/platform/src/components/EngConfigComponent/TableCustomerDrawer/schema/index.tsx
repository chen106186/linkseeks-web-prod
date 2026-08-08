import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

export const schema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'flex-end',
        },
      },
      properties: {
        memberName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'processRuleSetting.customerName', defaultMessage: '客户名称' }),
            advanced: false,
          },
        },
      },
    },
  },
}
