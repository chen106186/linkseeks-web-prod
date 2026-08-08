import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const TableListSchema: any = () => {
  return {
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
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'Children',
                'x-component-props': {
                  children: '{{controllerBtns}}',
                },
              },
              orderNo: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.orderNo' }),
                  align: 'flex-end',
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                flexWrap: 'nowrap',
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
                  placeholder: intl.formatMessage({ id: 'saleOrder.qingshurucaigouMemberName' }),
                },
              },

              outerStatus: {
                type: 'string',
                'x-component-props': {
                  placeholder: `${intl.formatMessage({ id: 'common.text.pleaseSelect' })}${intl.formatMessage({
                    id: 'purchaseOrder.waibuzhuangtai',
                  })}`,
                },
                enum: [
                  {
                    label: 'text',
                    value: 'id',
                  },
                ],
              },
              '[startDate,endDate]': {
                type: 'daterange',
                // "x-component": 'DateRangePickerUnix',
                'x-component-props': {
                  placeholder: [
                    intl.formatMessage({ id: 'purchaseRequisition.kaishishijian' }),
                    intl.formatMessage({ id: 'purchaseRequisition.jieshushijian' }),
                  ],
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-component-props': {
                  children: intl.formatMessage({ id: 'purchaseRequisition.chaxun' }),
                },
              },
            },
          },
        },
      },
    },
  }
}
