import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

export const orderWarehousingRelationSchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            align: 'left',
          },
          properties: {
            code: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'components.qingshuruwuliaobianhao' }),
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            name: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.message26' }),
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.message27' }),
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-component-props': {
                children: intl.formatMessage({ id: 'purchaseRequisition.chaxun', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
}
