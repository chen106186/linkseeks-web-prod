// import { ISchema } from '@apps/formily';
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useIntl } from '@linkseeks/i18n'
// import { getPurchaseOrderReadyAddPageSelectOption } from '@/pages/transaction/effect';

export const tableListSchema: any = () => {
  const intl = useIntl()

  // const res = getPurchaseOrderReadyAddPageSelectOption()
  // if(res) {
  //   const {
  //     orderTypes: OrderType,
  //   } = res

  return {
    type: 'object',
    properties: {
      orderNo: {
        type: 'string',
        'x-component': 'SearchFilter',
        'x-component-props': {
          placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.orderNo' }),
          align: 'flex-end',
        },
      },
      [FORM_FILTER_PATH]: {
        type: 'object',
        'x-component': 'flex-layout',
        'x-component-props': {
          rowStyle: {
            flexWrap: 'nowrap',
            justifyContent: 'flex-end',
          },
          colStyle: {
            marginLeft: 20,
          },
        },
        properties: {
          digest: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.digest' }),
            },
          },
          memberName: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.memberName' }),
            },
          },
          '[startDate,endDate]': {
            type: 'daterange',
            // "x-component": 'DateRangePickerUnix',
            'x-component-props': {
              placeholder: [
                intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.startDate' }),
                intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.endDate' }),
              ],
            },
          },
          submit: {
            'x-component': 'Submit',
            'x-component-props': {
              children: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.submit' }),
            },
          },
        },
      },
    },
  }
  // }
}
