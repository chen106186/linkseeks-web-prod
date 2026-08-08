import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
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
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'material.supplier.name', defaultMessage: '供应商名称' }),
            advanced: false,
          },
        },
      },
    },
  },
}
