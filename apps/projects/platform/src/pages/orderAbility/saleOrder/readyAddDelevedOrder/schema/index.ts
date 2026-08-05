import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useIntl } from '@linkseeks/i18n'

export const tableListSchema: any = () => {
  const intl = useIntl()

  return {
    type: 'object',
    properties: {
      orderNo: {
        type: 'string',
        'x-component': 'SearchFilter',
        'x-component-props': {
          placeholder: intl.formatMessage({ id: 'saleOrder.qingshurudingdan', defaultMessage: '请输入订单编号' }),
          align: 'flex-start',
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
          orderThe: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'saleOrder.qingshurudingdan', defaultMessage: '请输入订单摘要' }),
            },
          },
          memberName: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({
                id: 'saleOrder.qingshurucaigou',
                defaultMessage: '请输入采购会员名称',
              }),
            },
          },
          type: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'saleOrder.qingxuanzedingdan', defaultMessage: '请选择订单类型' }),
            },
            enum: [],
          },
          '[startCreateTime,endCreateTime]': {
            type: 'array',
            'x-component': 'DateRangePickerUnix',
            'x-component-props': {
              placeholder: [
                intl.formatMessage({ id: 'saleOrder.kaishishijian', defaultMessage: '开始时间' }),
                intl.formatMessage({ id: 'saleOrder.jieshushijian', defaultMessage: '结束时间' }),
              ],
            },
          },
          submit: {
            'x-component': 'Submit',
            'x-component-props': {
              children: intl.formatMessage({ id: 'saleOrder.chaxun', defaultMessage: '查询' }),
            },
          },
        },
      },
    },
  }
}
