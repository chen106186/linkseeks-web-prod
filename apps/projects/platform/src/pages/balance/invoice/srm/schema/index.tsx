import { getIntl } from '@linkseeks/i18n'

import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema, createFormActions } from '@apps/formily'
const intl = getIntl()
/**
 * 开票管理列表页schema
 */
export const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
      },
      properties: {
        reconciliationNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            align: 'flex-start',
            allowClear: true,
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.orderNo' }),
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
          justifyContent: 'flex-start',
        },
        colStyle: {
          marginRight: 16,
        },
      },
      properties: {
        reconciliationAbstract: {
          type: 'string',
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.orderAbstract' }),
            allowClear: true,
          },
        },
        '[createTimeStart, createTimeEnd]': {
          type: 'object',
          'x-component': 'RangePicker',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.invoiceStartTime' }),
              intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.invoiceEndTime' }),
            ],
            allowClear: true,
            style: {
              width: 320,
            },
          },
        },
        invoiceStatus: {
          type: 'string',
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.invoiceStatus' }),
            allowClear: true,
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.submit' }),
          },
        },
      },
    },
  },
}
