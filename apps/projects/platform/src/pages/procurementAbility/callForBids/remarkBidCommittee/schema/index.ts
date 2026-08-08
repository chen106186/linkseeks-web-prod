import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const tableListSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhuti' }),
        align: 'flex-end',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        inviteTenderCode: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhaobiao' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.chaxun' }),
          },
        },
      },
    },
  },
}
