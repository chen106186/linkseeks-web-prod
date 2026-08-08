import { getIntl } from '@linkseeks/i18n'

import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema, createFormActions } from '@apps/formily'
import moment from 'moment'
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
        ctl: {
          type: 'object',
          'x-component': 'controllerBtns',
        },
        reconciliationNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
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
          justifyContent: 'flex-end',
        },
        colStyle: {
          marginRight: 0,
          marginLeft: 16,
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
        invoiceNumber: {
          type: 'string',
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.invoiceNumber' }),
            allowClear: true,
          },
        },
        invoiceTitlte: {
          type: 'string',
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.invoiceTitlte' }),
            allowClear: true,
          },
        },
        '[startTime, startTime]': {
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
        examineStatus: {
          type: 'string',
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.status' }),
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

/** 退回原因 */
export const refuseSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        reconciliationId: {
          type: 'string',
          visible: false,
        },
        invoiceId: {
          type: 'string',
          visible: false,
        },
        returnTime: {
          type: 'string',
          readOnly: true,
          title: '退回时间',
          default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        },
        returnSource: {
          type: 'textarea',
          title: '退回原因',
          'x-component-props': {
            with: '100%',
            rows: 4,
            allowClear: true,
            placeholder: '请输入退回原因',
            style: {
              resize: 'none',
            },
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'balance.invoice.returnSource.required',
                defaultMessage: '请输入退回原因',
              }),
            },
            {
              limitByte: true,
              maxByte: 100,
              message: '最大100个字符，50个文字',
            },
          ],
        },
      },
    },
  },
}
