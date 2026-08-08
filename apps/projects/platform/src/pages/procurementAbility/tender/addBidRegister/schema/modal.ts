import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
const intl = getIntl()

// 选择商品和会员高级筛选
export const formSearch: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruhuiyuan' }),
        align: 'flex-left',
        advanced: false,
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.chaxun' }),
          },
        },
      },
    },
  },
}
