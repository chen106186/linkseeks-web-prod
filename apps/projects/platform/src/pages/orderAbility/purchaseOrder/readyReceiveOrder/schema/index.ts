import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getPurchaseOrderAuditPageSelectOption } from '@/pages/transaction/effect'
import { useIntl } from '@linkseeks/i18n'

/**
 * 除了订单必填字段, 默认
 */
export const tableListSchema: any = () => {
  const intl = useIntl()
  const res = getPurchaseOrderAuditPageSelectOption()
  if (res) {
    const { orderTypes: OrderType } = res

    return {
      type: 'object',
      properties: {
        orderNo: {
          type: 'string',
          'x-component': 'SearchFilter',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'purchaseOrder.qingshurudingdanOrderNo',
              defaultMessage: '请输入订单编号',
            }),
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
            digest: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'purchaseOrder.qingshurudingdanDigest',
                  defaultMessage: '请输入订单摘要',
                }),
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'purchaseOrder.qingshurudingdanMemberName',
                  defaultMessage: '请输入供应会员名称',
                }),
              },
            },
            orderType: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'purchaseOrder.qingxuanzedingdanOrderType',
                  defaultMessage: '请选择订单类型',
                }),
              },
              enum: OrderType.map((item) => ({
                label: item['text'],
                value: item['id'],
              })),
            },
            '[startDate,endDate]': {
              type: 'daterange',
              // "x-component": 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'purchaseOrder.kaishishijian', defaultMessage: '开始时间' }),
                  intl.formatMessage({ id: 'purchaseOrder.jieshushijian', defaultMessage: '结束时间' }),
                ],
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-component-props': {
                children: intl.formatMessage({ id: 'purchaseOrder.chaxun', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    }
  }
}
