/*
 * @Author: Bill
 * @Date: 2020-10-21 16:24:01
 * @Description: 平台积分结算 schema集合
 */
import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { orderTime, payTime } from '../../../common'

const intl = getIntl()

/**
 * 平台积分管理 列表页
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
            placeholder: intl.formatMessage({ id: 'balance.platformSettlement.integral.schema.schema.settlementNo' }),
            align: 'flex-left',
            // tip: '输入通知单号、通知单摘要进行搜索',
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
                  intl.formatMessage({ id: 'balance.platformSettlement.integral.schema.schema.startTime' }),
                  intl.formatMessage({ id: 'balance.platformSettlement.integral.schema.schema.endTime' }),
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
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'balance.platformSettlement.integral.schema.schema.status' }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'balance.platformSettlement.integral.schema.schema.submit' }),
              },
            },
          },
        },
      },
    },
  },
}

/**
 * 平台积分结算- 平台积分结算明细
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
                  id: 'balance.platformSettlement.integral.schema.detailSchema.orderNo',
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
                  id: 'balance.platformSettlement.integral.schema.detailSchema.orderAbstract',
                }),
              },
            },
            orderTime: {
              type: 'string',
              enum: orderTime,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'balance.platformSettlement.integral.schema.detailSchema.orderTime',
                }),
                allowClear: true,
              },
            },
            payTime: {
              type: 'string',
              enum: payTime,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'balance.platformSettlement.integral.schema.detailSchema.payTime',
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
                children: intl.formatMessage({ id: 'balance.platformSettlement.integral.schema.detailSchema.submit' }),
              },
            },
          },
        },
      },
    },
  },
}
