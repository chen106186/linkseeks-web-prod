import { getIntl } from '@linkseeks/i18n'

import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema, createFormActions } from '@apps/formily'
import { orderTime, payTime } from '../../../common'

const intl = getIntl()

/**
 * index.tsx 列表页搜索schema
 * 平台代收账款结算 schema
 */
export const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        settlementNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'balance.platformSettlement.accountReceivable.schema.schema.settlementNo',
            }),
            align: 'flex-left',
            tip: intl.formatMessage({
              id: 'balance.platformSettlement.accountReceivable.schema.schema.settlementNo.tip',
            }),
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
              marginRight: 20,
            },
          },
          properties: {
            '[startTime, endTime]': {
              type: 'object',
              'x-component': 'RangePicker',
              'x-component-props': {
                allowClear: true,
                placeholder: [
                  intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.schema.schema.startTime' }),
                  intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.schema.schema.endTime' }),
                ],
                style: {
                  minWidth: '320px',
                },
              },
            },
            // startTime: {
            //   type: 'string',
            //   'x-component': 'DatePicker',
            //   'x-component-props': {
            //     allowClear: true,
            //     placeholder: '结算日期（开始时间）'
            //   }
            // },
            // endTime: {
            //   type: 'string',
            //   'x-component': 'DatePicker',
            //   'x-component-props': {
            //     allowClear: true,
            //     placeholder: '结算日期（结束时间）'
            //   }
            // },
            status: {
              type: 'string',
              enum: [
                {
                  label: intl.formatMessage({
                    id: 'balance.platformSettlement.accountReceivable.schema.schema.status.1',
                  }),
                  value: 0,
                },
              ],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'balance.platformSettlement.accountReceivable.schema.schema.status',
                }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({
                  id: 'balance.platformSettlement.accountReceivable.schema.schema.submit',
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
 * 平台代收账款结算--详情
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
                  id: 'balance.platformSettlement.accountReceivable.schema.detailSchema.orderNo',
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
                  id: 'balance.platformSettlement.accountReceivable.schema.detailSchema.orderAbstract',
                }),
              },
            },
            orderTime: {
              type: 'string',
              enum: orderTime,
              default: 0,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'balance.platformSettlement.accountReceivable.schema.detailSchema.orderTime',
                }),
                allowClear: true,
              },
            },
            payTime: {
              type: 'string',
              enum: payTime,
              default: 0,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'balance.platformSettlement.accountReceivable.schema.detailSchema.payTime',
                }),
                allowClear: true,
              },
            },

            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({
                  id: 'balance.platformSettlement.accountReceivable.schema.detailSchema.submit',
                }),
              },
            },
          },
        },
      },
    },
  },
}
