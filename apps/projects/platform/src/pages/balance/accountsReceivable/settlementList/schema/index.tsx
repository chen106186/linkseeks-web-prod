/*
 * @Author: Bill
 * @Date: 2020-10-22 09:52:10
 * @Description: 应收账款结算 schema集合
 */

import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema, createFormActions } from '@apps/formily'

const intl = getIntl()

/**
 * 应收账款 index.tsx 列表页schema
 */

export const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': { grid: true },
      properties: {
        ctl: {
          type: 'object',
          'x-component': 'controllerBtns',
        },
        payName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.schema.payName' }),
            // tip: '输入通知单号、通知单摘要进行搜索',
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'flex-start',
        },
        colStyle: {
          marginRight: 16,
        },
      },
      properties: {
        '[startTime, endTime]': {
          type: 'object',
          'x-component': 'RangePicker',
          'x-component-props': {
            allowClear: true,
            placeholder: [
              intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.schema.startTime' }),
              intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.schema.endTime' }),
            ],
            style: {
              minWidth: '320px',
            },
          },
        },
        /** 预计付款时间 */
        '[prePayStartTime, prePayEndTime]': {
          type: 'object',
          'x-component': 'RangePicker',
          'x-component-props': {
            allowClear: true,
            showTime: true,
            placeholder: [
              intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.schema.prePayStartTime' }),
              intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.schema.prePayEndTime' }),
            ],
            style: {
              minWidth: '320px',
            },
          },
        },
        // /** 实际付款时间 */
        '[payStartTime, payEndTime]': {
          type: 'object',
          'x-component': 'RangePicker',
          'x-component-props': {
            allowClear: true,
            showTime: true,
            placeholder: [
              intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.schema.payStartTime' }),
              intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.schema.payEndTime' }),
            ],
            style: {
              minWidth: '320px',
            },
          },
        },
        status: {
          type: 'string',
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.schema.status' }),
            allowClear: true,
          },
        },
        orderType: {
          type: 'string',
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'balance.accountsReceivable.settlementList.schema.schema.orderType',
            }),
            allowClear: true,
          },
        },
        exportFlag: {
          type: 'string',
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.yidaochu' }),
            allowClear: true,
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.schema.submit' }),
          },
        },
      },
    },
  },
}

/**
 * 应收账款管理- 生产通知单结算明细
 */

export const detailSchema: ISchema = {
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
              'x-component': 'Children',
              'x-component-props': {
                children: '{{exportBtn}}',
              },
            },
            orderNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'balance.accountsReceivable.settlementList.schema.detailSchema.orderNo',
                }),
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
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'balance.accountsReceivable.settlementList.schema.detailSchema.orderAbstract',
                }),
              },
            },
            '[startTime, endTime]': {
              type: 'array',
              'x-component': 'RangePicker',
              'x-component-props': {
                showTime: false,
                allowClear: true,
                placeholder: [
                  intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.detailSchema.startTime' }),
                  intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.schema.detailSchema.endTime' }),
                ],
              },
            },
            '[payStartTime, payEndTime]': {
              type: 'array',
              'x-component': 'RangePicker',
              'x-component-props': {
                showTime: false,
                allowClear: true,
                placeholder: [
                  intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.payStartTime' }),
                  intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.payEndTime' }),
                ],
              },
            },

            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({
                  id: 'balance.accountsReceivable.settlementList.schema.detailSchema.submit',
                }),
              },
            },
          },
        },
      },
    },
  },
}

/**
 * 应付账款结算--物流单结算明细
 */
export const logisticsDetailSchema: ISchema = {
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
              'x-component': 'Children',
              'x-component-props': {
                children: '{{exportBtn}}',
              },
            },
            orderNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'balance.accountsReceivable.settlementList.schema.logisticsDetailSchema.orderNo',
                }),
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
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'balance.accountsReceivable.settlementList.schema.logisticsDetailSchema.orderAbstract',
                }),
              },
            },
            '[startTime, endTime]': {
              type: 'array',
              'x-component': 'RangePicker',
              'x-component-props': {
                showTime: false,
                allowClear: true,
                placeholder: [
                  intl.formatMessage({
                    id: 'balance.accountsReceivable.settlementList.schema.logisticsDetailSchema.startTime',
                  }),
                  intl.formatMessage({
                    id: 'balance.accountsReceivable.settlementList.schema.logisticsDetailSchema.endTime',
                  }),
                ],
              },
            },

            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({
                  id: 'balance.accountsReceivable.settlementList.schema.logisticsDetailSchema.submit',
                }),
              },
            },
          },
        },
      },
    },
  },
}
