import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {},
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'customerAbility.management.import.query.name.placeholder' }),
            tip: intl.formatMessage({ id: 'customerAbility.management.import.query.name.placeholder-tip' }),
            advanced: false,
            align: 'flex-left',
          },
        },
      },
    },
  },
}
