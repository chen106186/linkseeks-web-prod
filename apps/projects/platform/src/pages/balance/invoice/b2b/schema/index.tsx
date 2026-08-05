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
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'exportBtn',
            },
            orderNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.orderNo' }),
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
            orderAbstract: {
              type: 'string',
              default: undefined,
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.orderAbstract' }),
                allowClear: true,
              },
            },
            '[orderStartTime, orderEndTime]': {
              type: 'object',
              'x-component': 'RangePicker',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.orderStartTime' }),
                  intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.orderEndTime' }),
                ],
                allowClear: true,
              },
            },
            '[payStartTime, payEndTime]': {
              type: 'object',
              'x-component': 'RangePicker',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.payStartTime' }),
                  intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.payEndTime' }),
                ],
                allowClear: true,
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
            payStatus: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.payStatus' }),
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
    },
  },
}
