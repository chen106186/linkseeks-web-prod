import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
/**
 * 除了订单必填字段, 默认
 */
const intl = getIntl()
export const tableListSchema: ISchema = {
  type: 'object',
  properties: {
    contractNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' }),
        align: 'start',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginRight: 20,
        },
      },
      properties: {
        contractAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' }),
          },
        },
        '[startTime,endTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'contract.kaishishijian' }),
              intl.formatMessage({ id: 'contract.jieshushijian' }),
            ],
          },
        },
        outerStatus: {
          type: 'string',
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingxuanzewaibuzhuangtai' }),
          },
          // title: intl.formatMessage({ id: 'contract.qingxuanzewaibuzhuangtai' }),
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: intl.formatMessage({ id: 'contract.chaxun' }),
          },
        },
      },
    },
  },
}
