import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getPurchaseOrderSelectOption } from '@/pages/transaction/effect'
import { useIntl } from '@linkseeks/i18n'

export const tableListSchema: any = () => {
  const intl = useIntl()
  const res = getPurchaseOrderSelectOption()
  if (res) {
    const { orderTypes: OrderType } = res

    return {
      type: 'object',
      properties: {
        orderNo: {
          type: 'string',
          'x-component': 'SearchFilter',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'purchaseOrder.qingshurudingdanOrderNo' }),
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
                placeholder: intl.formatMessage({ id: 'purchaseOrder.qingshurudingdanDigest' }),
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaseOrder.qingshurudingdanMemberName' }),
              },
            },
            orderType: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaseOrder.qingxuanzedingdanOrderType' }),
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
                  intl.formatMessage({ id: 'purchaseOrder.kaishishijian' }),
                  intl.formatMessage({ id: 'purchaseOrder.jieshushijian' }),
                ],
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-component-props': {
                children: intl.formatMessage({ id: 'purchaseOrder.chaxun' }),
              },
            },
          },
        },
      },
    }
  }
}
